import { HALL_CAPACITY, seatedRoot } from './hallLayout.js';
import { STUDY_SEATS, STUDY_ENTRY as ENTRY, studyAisleRoute } from './tableLayout.js';
export { HALL_CAPACITY, ENTRY };
export const SEATS = STUDY_SEATS;
import { motionForSeat } from './movementTimeline.js';
export { poseAt, travelProfile, traveled } from './movementTimeline.js';
export function seatMotion(previous, next, now, direct=false, route=null) {
  const old=SEATS.find(s=>s.id===previous),target=SEATS.find(s=>s.id===next);
  if(!target)throw new Error('Choose a valid seat.');
  return motionForSeat(old,target,route || studyAisleRoute(previous,target),now,direct);
}

export function leaveSeatMotion(previous,now,direct=false){
 const old=SEATS.find(s=>s.id===previous);if(!old)return null;
 const points=[seatedRoot(old),...studyAisleRoute(null,old).slice().reverse()];
 const target={position:ENTRY,approach:ENTRY,facing:Math.PI};
 const motion=motionForSeat(old,target,points,now,direct);
 motion.stages=motion.stages.filter(s=>s.type!=='sit');
 motion.points=points;motion.endsAt=now+(direct?0:Math.ceil(motion.stages.at(-1).start+motion.stages.at(-1).duration));return motion;
}
