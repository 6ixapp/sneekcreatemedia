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
