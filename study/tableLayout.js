export const TABLE_CAPACITY = 5;
export const STUDY_HALL = { width: 32, depth: 34, height: 4.2 };
export const STUDY_ENTRY = [0,0,16];
export const STUDY_TABLES = Array.from({length:20},(_,i)=>({id:`table-${i+1}`,number:i+1,x:-10.5+(i%4)*7,z:-11+Math.floor(i/4)*5.5}));
export const STUDY_SEATS = STUDY_TABLES.flatMap((t,tableIndex)=>[
  {x:-.85,z:1.5,facing:Math.PI,side:-1,front:1},
  {x:.85,z:1.5,facing:Math.PI,side:1,front:1},
  {x:-.85,z:-1.5,facing:0,side:-1,front:-1},
  {x:.85,z:-1.5,facing:0,side:1,front:-1},
  {x:2.2,z:0,facing:-Math.PI/2,side:1,front:1},
].map((s,i)=>{
  const position=[t.x+s.x,0,t.z+s.z],approach=[position[0]+Math.sin(s.facing)*.505,0,position[2]+Math.cos(s.facing)*.505];
  const sideApproach=i===4?[approach[0],0,t.z+.75]:[position[0]+s.side*.7,0,approach[2]];
  const aisleApproach=i===4?[t.x+2.9,0,t.z+.75]:[sideApproach[0],0,t.z+s.front*2.3];
  const corner=[t.x+s.side*2.9,0,t.z+s.front*2.3],exit=[corner[0],0,t.z+2.3];
  return {id:`s${tableIndex*5+i+1}`,tableId:t.id,tableNumber:t.number,number:i+1,position,facing:s.facing,approach,sideApproach,aisleApproach,corner,exit};
}));
export const tableForSeat = id => STUDY_SEATS.find(s=>s.id===id)?.tableId || null;
export function studyAisleRoute(previous,target) {
  const old=STUDY_SEATS.find(s=>s.id===previous);
  const root=s=>[s.position[0]+Math.sin(s.facing)*.33,0,s.position[2]+Math.cos(s.facing)*.33];
  const points=old?[root(old),old.approach,old.sideApproach,old.aisleApproach,old.corner,old.exit,[0,0,old.exit[2]]]:[STUDY_ENTRY,[0,0,15]];
  points.push([0,0,target.exit[2]],target.exit,target.corner,target.aisleApproach,target.sideApproach,target.approach);
  return points.filter((p,i)=>!i||Math.hypot(p[0]-points[i-1][0],p[2]-points[i-1][2])>.001);
}
