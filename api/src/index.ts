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
         phone_number: phone,
         agent_id: "example-agent-id", // Assume agent is predefined
         webhook_url: `https://${new URL(c.req.url).host}/api/webhook/elevenlabs/${leadId}`
       })
     });
     
     const callData = (await response.json()) as any;
     
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
  if (body.type === 'call_ended') {
    const db = drizzle(c.env.DB);
    await db.insert(transcripts).values({
      id: crypto.randomUUID(),
      leadId,
      content: body.transcript || 'No transcript',
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
  const allLeads = await db.select().from(leads);
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

// 5. Connect to Websocket for a lead (Real-time tracking)
app.get('/api/calls/:leadId/live', async (c) => {
  const leadId = c.req.param('leadId');
  const id = c.env.CALL_SESSION.idFromName(leadId);
  const stub = c.env.CALL_SESSION.get(id);
  
  // Upgrade request to websocket in the DO
  return stub.fetch(c.req.raw);
});

export default app;
