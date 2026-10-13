import { seatedRoot } from './hallLayout.js';
const angle = (a,b) => Math.atan2(Math.sin(b-a),Math.cos(b-a));
const SPEED=1.45, ACCEL=4.5, BRAKE=6, TURN=3.8;
export function travelProfile(distance) {
  const peak = Math.min(SPEED, Math.sqrt(2 * distance / (1/ACCEL + 1/BRAKE)));
  const accel = peak/ACCEL, brake=peak/BRAKE;
  const cruise = Math.max(0,(distance - peak*peak/(2*ACCEL) - peak*peak/(2*BRAKE))/Math.max(.001,peak));
  return { distance, peak, accel, cruise, brake, duration: accel+cruise+brake };
}
export function traveled(profile, seconds) {
  const t=Math.max(0,Math.min(profile.duration,seconds)), {peak,accel,cruise}=profile;
  if(t<accel)return .5*ACCEL*t*t;
  if(t<accel+cruise)return .5*peak*accel+peak*(t-accel);
  const rest=profile.duration-t;
  return profile.distance-.5*BRAKE*rest*rest;
}
export function motionForSeat(old,target,points,now,direct=false) {
  const stages=[];
  let at=0,facing=old?.facing ?? Math.PI;
  const add=(stage,duration)=>{ stages.push({...stage,start:at,duration});at+=duration; };
  for(let i=1;i<points.length;i++){
    const from=points[i-1],to=points[i],distance=Math.hypot(to[0]-from[0],to[2]-from[2]);
    if(old&&i===1){add({type:'stand',from,to,facing},1000);continue;}
    const desired=Math.atan2(to[0]-from[0],to[2]-from[2]);
    if(Math.abs(angle(facing,desired))>.01)add({type:'turn',from,to:from,fromFacing:facing,facing:desired},Math.abs(angle(facing,desired))/TURN*1000);
    facing=desired;const profile=travelProfile(distance);
    add({type:'walk',from,to,facing,profile},profile.duration*1000);
  }
  if(Math.abs(angle(facing,target.facing))>.01)add({type:'turn',from:target.approach,to:target.approach,fromFacing:facing,facing:target.facing},Math.abs(angle(facing,target.facing))/TURN*1000);
  add({type:'sit',from:target.approach,to:seatedRoot(target),facing:target.facing},1291.667);
  return {points:[...points,seatedRoot(target)],stages,startedAt:now,endsAt:now+(direct?0:Math.ceil(at)),facing:target.facing};
}
export function poseAt(motion, now) {
  const elapsed=Math.max(0,now-motion.startedAt);
  if(!motion.stages || now>=motion.endsAt)return {position:motion.points.at(-1),facing:motion.facing,velocity:{x:0,z:0},state:'seated'};
  const stage=motion.stages.find(s=>elapsed<s.start+s.duration)||motion.stages.at(-1);
  const t=Math.max(0,Math.min(1,(elapsed-stage.start)/Math.max(1,stage.duration)));
  let progress=t,velocity={x:0,z:0},facing=stage.facing;
  if(stage.type==='walk'){
    progress=traveled(stage.profile,(elapsed-stage.start)/1000)/Math.max(.001,stage.profile.distance);
    const seconds=(elapsed-stage.start)/1000,p=stage.profile;
    const speed=seconds<p.accel?ACCEL*seconds:seconds<p.accel+p.cruise?p.peak:BRAKE*Math.max(0,p.duration-seconds);
    velocity={x:(stage.to[0]-stage.from[0])/p.distance*speed,z:(stage.to[2]-stage.from[2])/p.distance*speed};
  }else if(stage.type==='turn')facing=stage.fromFacing+angle(stage.fromFacing,stage.facing)*(t*t*(3-2*t));
  else progress=t*t*(3-2*t);
  return {position:[stage.from[0]+(stage.to[0]-stage.from[0])*progress,0,stage.from[2]+(stage.to[2]-stage.from[2])*progress],facing,velocity,state:stage.type,progress:t,seated:stage.seated};
}
