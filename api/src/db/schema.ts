import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const businesses = sqliteTable('businesses', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  timezone: text('timezone').notNull(),
  prompt: text('prompt'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const leads = sqliteTable('leads', {
  id: text('id').primaryKey(),
  businessId: text('business_id').notNull().references(() => businesses.id),
  name: text('name').notNull(),
  phone: text('phone').notNull(),
  status: text('status').notNull(), // 'new', 'calling', 'completed', 'failed'
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const callbackJobs = sqliteTable('callback_jobs', {
  id: text('id').primaryKey(),
  leadId: text('lead_id').notNull().references(() => leads.id),
  elevenlabsCallId: text('elevenlabs_call_id'),
  status: text('status').notNull(), // 'pending', 'in_progress', 'completed', 'failed'
  scheduledFor: integer('scheduled_for', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const transcripts = sqliteTable('transcripts', {
  id: text('id').primaryKey(),
  leadId: text('lead_id').notNull().references(() => leads.id),
  content: text('content').notNull(),
  summary: text('summary'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});

export const activityLogs = sqliteTable('activity_logs', {
  id: text('id').primaryKey(),
  leadId: text('lead_id').notNull().references(() => leads.id),
  type: text('type').notNull(), // 'call_started', 'call_ended', 'transcript_updated', 'status_changed'
  details: text('details'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull()
});
