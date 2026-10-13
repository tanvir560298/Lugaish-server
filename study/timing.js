import { tableForSeat } from './tableLayout.js';
export const GRACE_MS = 20000;
export const RELEASE_MS = 120000;

// Settle at every deadline, not just at the heartbeat frequency. Group time is
// a union of qualifying intervals, never a sum of participant durations.
export function settle(room, now) {
  room.tableTogetherMs ||= {};
  const from = room.updatedAtMs;
  const boundaries = [...new Set([from, now, ...room.members.flatMap(m =>
    [m.focusUntil, m.lastSeen + GRACE_MS, m.arrivesAt].filter(t => t > from && t < now))])].sort((a, b) => a - b);
  for (let i = 1; i < boundaries.length; i++) {
    const a = boundaries[i - 1], b = boundaries[i];
    const active = room.members.filter(m => m.seat && m.arrivesAt <= a && m.phase === 'studying' && m.focusUntil > a && m.lastSeen + GRACE_MS > a);
    if (active.length >= 2) room.togetherMs += b - a;
    const groups=new Map();for(const m of active){const table=tableForSeat(m.seat);if(table)groups.set(table,(groups.get(table)||0)+1);}
    for(const [table,count]of groups)if(count>=2)room.tableTogetherMs[table]=(room.tableTogetherMs[table]||0)+b-a;
  }
  for (const m of room.members) {
    if (m.phase === 'studying') {
      m.focusMs += Math.max(0, Math.min(now, m.focusUntil) - from);
      if (m.focusUntil <= now) m.phase = 'paused';
    }
    if (m.phase === 'break' && m.focusUntil <= now) m.phase = 'paused';
  }
  room.updatedAtMs = now;
  return room;
}

export function publicRoom(room, viewer, now) {
  settle(room, now);
  return {
    id: String(room._id), name: room.name, kind: room.kind || 'private', hostId: room.kind === 'public' ? null : room.hostId, togetherMs: room.togetherMs,
    serverNow: now, revision: room.revision, tableTogetherMs:room.tableTogetherMs,
    members: room.members.map(m => ({
      id: m.id, name: m.name, characterId:m.characterId, seat: m.seat, tableId:tableForSeat(m.seat), arrivesAt: m.arrivesAt, motion: m.motion,
      phase: now - m.lastSeen >= GRACE_MS ? 'reconnecting' : m.phase,
      focusMs: m.focusMs, focusUntil: m.focusUntil,
      greeting: m.greeting && m.greeting.until > now ? m.greeting : null,
      ...(m.id === viewer ? { controller: m.controller, muted: m.muted, call: m.call?.expiresAt > now ? m.call : null,
        sessionId: m.sessionId } : {}),
    })),
  };
}
