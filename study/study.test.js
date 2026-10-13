import test from 'node:test';
import assert from 'node:assert/strict';
import { settle, publicRoom, GRACE_MS } from './timing.js';
import { HALL_SEATS, seatedRoot } from './hallLayout.js';
import { SEATS, seatMotion, poseAt, HALL_CAPACITY } from './seating.js';
const person = (id, overrides = {}) => ({ id, name: id, seat: id, arrivesAt: 0, phase: 'studying', focusMs: 0, focusUntil: 3600000, lastSeen: 3600000, ...overrides });
const room = members => ({ _id: 'room', updatedAtMs: 0, togetherMs: 0, members, revision: 0 });
test('20 solo minutes then five together produces 25, five, and five', () => {
  const r = room([person('a')]); settle(r, 1200000);
  r.members.push(person('b')); settle(r, 1500000);
  assert.equal(r.members[0].focusMs, 1500000); assert.equal(r.members[1].focusMs, 300000); assert.equal(r.togetherMs, 300000);
});
test('group overlap counts once with five people and pauses below two', () => {
  const r = room(['a', 'b', 'c', 'd', 'e'].map(id => person(id)));
  settle(r, 10000); assert.equal(r.togetherMs, 10000);
  r.members.slice(1).forEach(m => { m.phase = 'break'; });
  settle(r, 20000); assert.equal(r.togetherMs, 10000); assert.equal(r.members[0].focusMs, 20000);
});
test('deadline, seating arrival, and disconnection grace split overlap exactly', () => {
  const r = room([person('a'), person('b', { arrivesAt: 5000, lastSeen: 0, focusUntil: 60000 })]);
  settle(r, 60000); assert.equal(r.togetherMs, GRACE_MS - 5000); assert.equal(r.members[1].focusMs, 60000);
  assert.equal(r.members[1].phase, 'paused');
});
test('paused and break intervals never add personal focus', () => {
  const r = room([person('a', { phase: 'paused' }), person('b', { phase: 'break' })]);
  settle(r, 5000); assert.equal(r.togetherMs, 0); assert.deepEqual(r.members.map(m => m.focusMs), [0, 0]);
});
test('public presence excludes emails, notebook, history, invitation targets, and controller IDs of others', () => {
  const r = room([person('a', { controller: 'sensitive-only-marker', email: 'sensitive-only-marker@example.test', notes: 'sensitive-only-marker', call: { name: 'sensitive-only-marker', expiresAt: 99999 } })]);
  r.invitations = [{ email: 'recipient@example.test', digest: 'sensitive-only-marker' }];
  const serialized = JSON.stringify(publicRoom(r, 'b', 1000));
  assert.ok(!serialized.includes('sensitive-only-marker')); assert.ok(!serialized.includes('invitations'));
});

test('server movement accelerates from zero, stops before corners and docks continuously',()=>{
  const m=seatMotion(null,'s1',1000);let prev=poseAt(m,1000);
  for(let now=1016;now<=m.endsAt;now+=16){const p=poseAt(m,now);assert.ok(Math.hypot(p.position[0]-prev.position[0],p.position[2]-prev.position[2])<.055);assert.ok(Math.hypot(p.velocity.x,p.velocity.z)<=1.451);prev=p;}
  assert.equal(poseAt(m,m.endsAt).state,'seated');assert.equal(poseAt(m,m.startedAt).velocity.x,0);
});
