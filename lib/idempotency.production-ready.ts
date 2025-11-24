/**
 * PRODUCTION-READY IDEMPOTENCY IMPLEMENTATION
 * 
 * This file provides persistent session tracking to prevent duplicate email sends.
 * 
 * IMPORTANT: Choose ONE implementation based on your hosting platform:
 * - Option 1: Vercel KV (recommended for Vercel deployments)
 * - Option 2: Upstash Redis (works with any hosting platform)
 * - Option 3: In-Memory (DEVELOPMENT ONLY - will be removed)
 */

// ==============================================
// OPTION 1: VERCEL KV (Recommended for Vercel)
// ==============================================
// 
// Setup:
// 1. Install: npm install @vercel/kv
// 2. Add Vercel KV to your project: https://vercel.com/docs/storage/vercel-kv
// 3. Environment variables are auto-configured by Vercel
// 4. Uncomment the code below and comment out the current implementation

/*
import { kv } from '@vercel/kv';

const SESSION_TTL = 24 * 60 * 60; // 24 hours in seconds

export async function hasSessionBeenProcessed(sessionId: string): Promise<boolean> {
  try {
    const exists = await kv.exists(`session:${sessionId}`);
    return exists === 1;
  } catch (error) {
    console.error('Error checking session in KV:', error);
    return false; // Fail open to allow processing
  }
}

export async function markSessionAsProcessed(sessionId: string, emailSent: boolean = true): Promise<void> {
  try {
    await kv.setex(
      `session:${sessionId}`,
      SESSION_TTL,
      JSON.stringify({
        sessionId,
        processedAt: Date.now(),
        emailSent,
      })
    );
  } catch (error) {
    console.error('Error marking session as processed in KV:', error);
  }
}

export async function getSessionStatus(sessionId: string): Promise<{ processed: boolean; emailSent: boolean } | null> {
  try {
    const data = await kv.get(`session:${sessionId}`);
    if (!data) return null;
    
    const record = typeof data === 'string' ? JSON.parse(data) : data;
    return {
      processed: true,
      emailSent: record.emailSent,
    };
  } catch (error) {
    console.error('Error getting session status from KV:', error);
    return null;
  }
}
*/

// ==============================================
// OPTION 2: UPSTASH REDIS (Works with any host)
// ==============================================
//
// Setup:
// 1. Create account: https://upstash.com/
// 2. Create Redis database
// 3. Install: npm install @upstash/redis
// 4. Add environment variables:
//    UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
//    UPSTASH_REDIS_REST_TOKEN=xxxxx
// 5. Uncomment the code below and comment out the current implementation

/*
import { Redis } from '@upstash/redis';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const SESSION_TTL = 24 * 60 * 60; // 24 hours in seconds

export async function hasSessionBeenProcessed(sessionId: string): Promise<boolean> {
  try {
    const exists = await redis.exists(`session:${sessionId}`);
    return exists === 1;
  } catch (error) {
    console.error('Error checking session in Redis:', error);
    return false; // Fail open to allow processing
  }
}

export async function markSessionAsProcessed(sessionId: string, emailSent: boolean = true): Promise<void> {
  try {
    await redis.setex(
      `session:${sessionId}`,
      SESSION_TTL,
      JSON.stringify({
        sessionId,
        processedAt: Date.now(),
        emailSent,
      })
    );
  } catch (error) {
    console.error('Error marking session as processed in Redis:', error);
  }
}

export async function getSessionStatus(sessionId: string): Promise<{ processed: boolean; emailSent: boolean } | null> {
  try {
    const data = await redis.get(`session:${sessionId}`);
    if (!data) return null;
    
    const record = typeof data === 'string' ? JSON.parse(data) : data;
    return {
      processed: true,
      emailSent: record.emailSent,
    };
  } catch (error) {
    console.error('Error getting session status from Redis:', error);
    return null;
  }
}
*/

// ==============================================
// OPTION 3: IN-MEMORY (DEVELOPMENT ONLY)
// ==============================================
// ⚠️ WARNING: This is the CURRENT implementation
// ⚠️ DO NOT USE IN PRODUCTION!
// ⚠️ Replace with Option 1 or 2 before deploying

// Simple in-memory idempotency store
// In production, replace this with a database (Redis, PostgreSQL, etc.)
const processedSessions = new Map<string, {
    sessionId: string;
    processedAt: number;
    emailSent: boolean;
}>();

// Clean up old entries (older than 24 hours)
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

setInterval(() => {
    const now = Date.now();
    for (const [key, value] of processedSessions.entries()) {
        if (now - value.processedAt > CLEANUP_INTERVAL) {
            processedSessions.delete(key);
        }
    }
}, 60 * 60 * 1000); // Run cleanup every hour

export function hasSessionBeenProcessed(sessionId: string): boolean {
    return processedSessions.has(sessionId);
}

export function markSessionAsProcessed(sessionId: string, emailSent: boolean = true): void {
    processedSessions.set(sessionId, {
        sessionId,
        processedAt: Date.now(),
        emailSent,
    });
}

export function getSessionStatus(sessionId: string): { processed: boolean; emailSent: boolean } | null {
    const record = processedSessions.get(sessionId);
    if (!record) return null;
    return {
        processed: true,
        emailSent: record.emailSent,
    };
}
