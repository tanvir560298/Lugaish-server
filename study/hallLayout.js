export const HALL_CAPACITY = 100;
export const HALL = { width: 24, depth: 30, height: 4.2, front: -15, rear: 15 };
export const ENTRY = [0, 0, 14.2];
export const HALL_SEATS = Array.from({ length: HALL_CAPACITY }, (_, i) => {
  const row = Math.floor(i / 10), column = i % 10;
  const x = column < 5 ? -9.6 + column * 1.8 : 2.4 + (column - 5) * 1.8;
  const z = -11.2 + row * 2.6;
  return { id: `s${i + 1}`, row, column, position: [x, 0, z], facing: Math.PI,
    approach: [x, 0, z - .55], sideApproach: [x + (x < 0 ? .78 : -.78), 0, z - .55], aisleApproach: [x + (x < 0 ? .78 : -.78), 0, z + .7], desk: [x, .74, z - 1.15] };
});
export const seatedRoot = seat => [seat.position[0] + Math.sin(seat.facing) * .33, 0, seat.position[2] + Math.cos(seat.facing) * .33];
export function aisleRoute(previous, target) {
  const old = HALL_SEATS.find(s => s.id === previous);
  const points = old ? [seatedRoot(old), old.approach, old.sideApproach, old.aisleApproach, [0, 0, old.aisleApproach[2]]] : [ENTRY, [0, 0, 13.3]];
  points.push([0, 0, target.aisleApproach[2]], target.aisleApproach, target.sideApproach, target.approach);
  return points.filter((p, i) => !i || Math.hypot(p[0] - points[i - 1][0], p[2] - points[i - 1][2]) > .001);
}
