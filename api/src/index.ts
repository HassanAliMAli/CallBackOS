import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { drizzle } from 'drizzle-orm/d1';
import { eq } from 'drizzle-orm';
import { businesses, leads, callbackJobs, transcripts, activityLogs } from './db/schema';
import { CallSession } from './durable-objects/CallSession';

export { CallSession };

export type Bindings = {
  DB: D1Database;
  STORAGE: R2Bucket;
  CALL_SESSION: DurableObjectNamespace;
  ELEVENLABS_API_KEY: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/*', cors());

// Basic health check
app.get('/', (c) => c.text('CallBackOS API is running'));

// 1. Simulate a call (Creates lead + triggers ElevenLabs)
app.post('/api/simulate', async (c) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();
  const { businessId, name, phone } = body;

  const leadId = crypto.randomUUID();
  
  // Get business details for the prompt
  const business = await db.select().from(businesses).where(eq(businesses.id, businessId)).get();
  
  if (!business) {
    return c.json({ success: false, error: "Business not found" }, 404);
  }

  // Create lead
  await db.insert(leads).values({
    id: leadId,
    businessId,
    name,
    phone,
    status: 'calling',
    createdAt: new Date()
  });

  // Call ElevenLabs API
  try {
     const response = await fetch("https://api.elevenlabs.io/v1/convai/calls", {
       method: "POST",
       headers: {
         "xi-api-key": c.env.ELEVENLABS_API_KEY || "",
         "Content-Type": "application/json"
       },
       body: JSON.stringify({
         to: phone,
         agent_id: "agent_8701kn0wrgbcfnnvx34j0rdqc4xv", // The specified agent ID
         webhook_url: `https://${new URL(c.req.url).host}/api/webhook/elevenlabs/${leadId}`,
         conversation_initiation_client_data: {
           dynamic_variables: {
             lead_name: name,
             business_name: business.name,
             system_prompt_addon: business.prompt || ""
           }
         }
       })
     });
     
     const callData = (await response.json()) as any;
     
     if (!response.ok) {
        console.error("ElevenLabs Error:", callData);
        throw new Error(JSON.stringify(callData));
     }
     
     await db.insert(callbackJobs).values({
        id: crypto.randomUUID(),
        leadId,
        elevenlabsCallId: callData.call_id || "simulated-call-id",
        status: 'in_progress',
        createdAt: new Date()
     });

     return c.json({ success: true, leadId, callData });
  } catch (error: any) {
     return c.json({ success: false, error: error.message || "Call simulation failed" }, 500);
  }
});

// 2. Webhook from ElevenLabs
app.post('/api/webhook/elevenlabs/:leadId', async (c) => {
  const leadId = c.req.param('leadId');
  const body = await c.req.json();

  const id = c.env.CALL_SESSION.idFromName(leadId);
  const stub = c.env.CALL_SESSION.get(id);

  // Forward chunk to DO to broadcast
  await stub.fetch(new Request(`https://do/chunk`, {
    method: "POST",
    body: JSON.stringify(body)
  }));
  
  // If call is ended, save transcript and update lead status
  // ElevenLabs uses 'conversation_ended'
  if (body.type === 'conversation_ended') {
    const db = drizzle(c.env.DB);
    let transcriptText = 'No transcript';
    
    // Parse ElevenLabs transcript array into a single string
    if (body.transcript && Array.isArray(body.transcript)) {
      transcriptText = body.transcript.map((msg: any) => `${msg.role}: ${msg.message}`).join('\n');
    } else if (body.transcript) {
      transcriptText = JSON.stringify(body.transcript);
    }
    
    await db.insert(transcripts).values({
      id: crypto.randomUUID(),
      leadId,
      content: transcriptText,
      createdAt: new Date()
    });

    await db.update(leads)
      .set({ status: 'completed' })
      .where(eq(leads.id, leadId));
    
    // Log activity
    await db.insert(activityLogs).values({
      id: crypto.randomUUID(),
      leadId,
      type: 'call_ended',
      details: 'Call concluded via ElevenLabs webhook',
      createdAt: new Date()
    });
  }

  return c.json({ received: true });
});

// 2.5 Businesses Endpoints
// Create business
app.post('/api/businesses', async (c) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();
  const newBusiness = {
    id: body.id || crypto.randomUUID(),
    name: body.name,
    timezone: body.timezone || 'UTC',
    prompt: body.prompt || '',
    createdAt: new Date()
  };
  await db.insert(businesses).values(newBusiness);
  return c.json({ success: true, business: newBusiness });
});

// List businesses
app.get('/api/businesses', async (c) => {
  const db = drizzle(c.env.DB);
  const allBusinesses = await db.select().from(businesses);
  return c.json(allBusinesses);
});

// Get single business
app.get('/api/businesses/:id', async (c) => {
  const db = drizzle(c.env.DB);
  const id = c.req.param('id');
  const business = await db.select().from(businesses).where(eq(businesses.id, id)).get();
  if (!business) {
    return c.json({ error: "Business not found" }, 404);
  }
  return c.json(business);
});

// Update business
app.put('/api/businesses/:id', async (c) => {
  const db = drizzle(c.env.DB);
  const id = c.req.param('id');
  const body = await c.req.json();
  
  const updates: any = {};
  if (body.name !== undefined) updates.name = body.name;
  if (body.timezone !== undefined) updates.timezone = body.timezone;
  if (body.prompt !== undefined) updates.prompt = body.prompt;
  
  await db.update(businesses).set(updates).where(eq(businesses.id, id));
  
  const updated = await db.select().from(businesses).where(eq(businesses.id, id)).get();
  return c.json({ success: true, business: updated });
});

// Complete onboarding (create business with full config)
app.post('/api/onboarding/complete', async (c) => {
  const db = drizzle(c.env.DB);
  const body = await c.req.json();
  
  const businessId = crypto.randomUUID();
  
  // Build the AI agent prompt from onboarding data
  const prompt = `You are ${body.agentName || 'Aria'}, AI receptionist for ${body.businessName}.

Business Details:
- Industry: ${body.industry || 'General'}
- Location: ${body.city || 'Unknown'}
- Phone: ${body.phone || 'Not provided'}
- Website: ${body.website || 'Not provided'}

Operating Hours:
${JSON.stringify(body.hours, null, 2)}

Agent Configuration:
- Greeting: ${body.greeting || 'Hello! Thank you for calling.'}
- Closing: ${body.closing || 'Thank you for your time!'}
- Max Callback Attempts: ${body.maxAttempts || 3}
- Callback Delay: ${body.callbackDelay || 'immediately'}
- Earliest Call Time: ${body.earliestTime || '9:00 AM'}
- Latest Call Time: ${body.latestTime || '8:00 PM'}
- Weekend Callbacks: ${body.weekendCallbacks ? 'Yes' : 'No'}

Escalation Keywords: ${body.escalationKeywords?.join(', ') || 'urgent, emergency, human, representative'}
Escalation Contact:
- Name: ${body.escalationContact?.name || 'Not provided'}
- Phone: ${body.escalationContact?.phone || 'Not provided'}
- Email: ${body.escalationContact?.email || 'Not provided'}

Knowledge Base FAQs:
${(body.faqs || []).map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join('\n')}

Custom Instructions:
${body.customInstructions || 'Be helpful, professional, and concise.'}
`;

  const newBusiness = {
    id: businessId,
    name: body.businessName,
    timezone: body.timezone || 'UTC',
    prompt: prompt,
    createdAt: new Date()
  };
  
  await db.insert(businesses).values(newBusiness);
  
  return c.json({ success: true, business: newBusiness, businessId });
});

// Analytics overview
app.get('/api/analytics/overview', async (c) => {
  const db = drizzle(c.env.DB);
  const allLeads = await db.select().from(leads);
  
  const totalToday = allLeads.length;
  const callbacksMade = allLeads.filter(l => l.status === "completed" || l.status === "failed").length;
  const answerRate = callbacksMade > 0 ? Math.round((allLeads.filter(l => l.status === "completed").length / callbacksMade) * 100) : 0;
  const needsHuman = allLeads.filter(l => l.status === "escalate").length;

  return c.json({ totalToday, callbacksMade, answerRate, needsHuman });
});

// 3. List leads
app.get('/api/leads', async (c) => {
  const db = drizzle(c.env.DB);
  const allLeads = await db
    .select({
      id: leads.id,
      businessId: leads.businessId,
      name: leads.name,
      phone: leads.phone,
      status: leads.status,
      createdAt: leads.createdAt,
      businessName: businesses.name
    })
    .from(leads)
    .leftJoin(businesses, eq(leads.businessId, businesses.id));
    
  return c.json(allLeads);
});

// 4. Single lead with transcripts and activity logs
app.get('/api/leads/:id', async (c) => {
  const db = drizzle(c.env.DB);
  const leadId = c.req.param('id');

  const lead = await db.select().from(leads).where(eq(leads.id, leadId)).get();

  if (!lead) {
     return c.json({ error: "Lead not found" }, 404);
  }

  const transcriptList = await db.select().from(transcripts).where(eq(transcripts.leadId, leadId));
  const logs = await db.select().from(activityLogs).where(eq(activityLogs.leadId, leadId));

  return c.json({
    lead,
    transcripts: transcriptList,
    activityLogs: logs
  });
});

// 5. Update lead status (escalate/resolve)
app.put('/api/leads/:id', async (c) => {
  const db = drizzle(c.env.DB);
  const leadId = c.req.param('id');
  const body = await c.req.json();
  
  const updates: any = {};
  if (body.status) updates.status = body.status;
  if (body.outcome) updates.outcome = body.outcome;
  
  await db.update(leads).set(updates).where(eq(leads.id, leadId));
  
  // Log activity
  if (body.status === 'escalate') {
    await db.insert(activityLogs).values({
      id: crypto.randomUUID(),
      leadId,
      type: 'escalation_triggered',
      details: 'Lead escalated to human',
      createdAt: new Date()
    });
  }
  
  const updated = await db.select().from(leads).where(eq(leads.id, leadId)).get();
  return c.json({ success: true, lead: updated });
});

// 6. Delete lead
app.delete('/api/leads/:id', async (c) => {
  const db = drizzle(c.env.DB);
  const leadId = c.req.param('id');
  
  await db.delete(leads).where(eq(leads.id, leadId));
  await db.delete(transcripts).where(eq(transcripts.leadId, leadId));
  await db.delete(activityLogs).where(eq(activityLogs.leadId, leadId));
  
  return c.json({ success: true });
});

// 7. Delete business
app.delete('/api/businesses/:id', async (c) => {
  const db = drizzle(c.env.DB);
  const businessId = c.req.param('id');
  
  // Delete all related leads first
  const businessLeads = await db.select({ id: leads.id }).from(leads).where(eq(leads.businessId, businessId));
  for (const lead of businessLeads) {
    await db.delete(transcripts).where(eq(transcripts.leadId, lead.id));
    await db.delete(activityLogs).where(eq(activityLogs.leadId, lead.id));
  }
  await db.delete(leads).where(eq(leads.businessId, businessId));
  
  // Delete business
  await db.delete(businesses).where(eq(businesses.id, businessId));
  
  return c.json({ success: true });
});

// 8. Update business status (pause/resume)
app.put('/api/businesses/:id/status', async (c) => {
  const db = drizzle(c.env.DB);
  const businessId = c.req.param('id');
  const body = await c.req.json();
  
  const updates: any = {};
  if (body.status) updates.status = body.status;
  
  await db.update(businesses).set(updates).where(eq(businesses.id, businessId));
  
  const updated = await db.select().from(businesses).where(eq(businesses.id, businessId)).get();
  return c.json({ success: true, business: updated });
});

// 9. Save business FAQs (stored in prompt)
app.put('/api/businesses/:id/faqs', async (c) => {
  const db = drizzle(c.env.DB);
  const businessId = c.req.param('id');
  const body = await c.req.json();
  
  // Get existing business
  const business = await db.select().from(businesses).where(eq(businesses.id, businessId)).get();
  if (!business) {
    return c.json({ error: "Business not found" }, 404);
  }
  
  // Update prompt with new FAQs
  const faqsText = (body.faqs || []).map((f: any) => `Q: ${f.question}\nA: ${f.answer}`).join('\n');
  const newPrompt = business.prompt + '\n\nUpdated FAQs:\n' + faqsText;
  
  await db.update(businesses).set({ prompt: newPrompt }).where(eq(businesses.id, businessId));
  
  return c.json({ success: true });
});

// 5. Connect to Websocket for a lead (Real-time tracking)
app.get('/api/calls/:leadId/live', async (c) => {
  const leadId = c.req.param('leadId');
  const id = c.env.CALL_SESSION.idFromName(leadId);
  const stub = c.env.CALL_SESSION.get(id);
  
  // Upgrade request to websocket in the DO
  return stub.fetch(c.req.raw);
});

export default app;
