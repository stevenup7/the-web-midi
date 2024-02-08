// Based heavily on the following post
// https://stackoverflow.com/questions/64933819/calculate-a-curve-that-goes-through-all-the-points/64934180#64934180

const CURVE_AMOUNT = 1 / 8; // change this to change the curvature
import { SSVGPoint, Point } from "./SVGHelpers";
type ControlPoint = { p1: SSVGPoint; p2: SSVGPoint };

function calculateCurve(pointList: SSVGPoint[] | Point[]) {
  if (pointList.length <= 1) {
    throw new Error("Need at lest 2 points to draw a line");
  } else {
    console.log(pointList.hasOwnProperty("s"));
    if (!pointList.hasOwnProperty("s")) {
      pointList = pointList.map((p) => new SSVGPoint(p.x, p.y));
    }
    let pathData = `M ${pointList[0].x} ${pointList[0].y}`;

    if (pointList.length == 2) {
      // if only two points make a straigt line between them
      pathData += ` L ${pointList[1].x} ${pointList[1].y}`;
    } else {
      var ctrlP = controlPoints(pointList); // the control points array
      pathData += ` Q ${ctrlP[0].p1.x} ${ctrlP[0].p1.y} ${pointList[1].x}, ${pointList[1].y}`;
      if (pointList.length > 2) {
        for (var i = 1; i < pointList.length - 2; i++) {
          // the prettier makes this a bit ugly
          pathData += ` C ${ctrlP[i - 1].p2.s()} 
          ${ctrlP[i].p1.s()} ${pointList[i + 1].x} ${pointList[i + 1].y}`;
        }
        let n = pointList.length - 1;
        pathData += ` Q ${ctrlP[n - 2].p2.x} ${ctrlP[n - 2].p2.y} ${
          pointList[n].x
        } ${pointList[n].y}`;
      }
    }
    return pathData;
  }
}
function controlPoints(pointList: Point[]): ControlPoint[] {
  if (pointList.length < 3) throw new Error("Need at least 3 points");

  let controlPointList: ControlPoint[] = [];
  for (var i = 1; i < pointList.length - 1; i++) {
    const dx = (pointList[i - 1].x - pointList[i + 1].x) * CURVE_AMOUNT;
    const dy = (pointList[i - 1].y - pointList[i + 1].y) * CURVE_AMOUNT;
    controlPointList.push({
      p1: new SSVGPoint(pointList[i].x + dx, pointList[i].y + dy),
      p2: new SSVGPoint(pointList[i].x - dx, pointList[i].y - dy),
    });
  }
  return controlPointList;
}
export default calculateCurve;
