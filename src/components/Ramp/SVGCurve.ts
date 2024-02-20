// Based heavily on the following post
// https://stackoverflow.com/questions/64933819/calculate-a-curve-that-goes-through-all-the-points/64934180#64934180

const CURVE_AMOUNT = 1 / 5; // change this to change the curvature
import { SSVGPoint, Point } from "./SVGHelpers";
type ControlPoint = { p1: SSVGPoint; p2: SSVGPoint };

function calculateCurve(pointList: Point[]): [string, ControlPoint[]] {
  if (pointList.length <= 1) {
    throw new Error("Need at lest 2 points to draw a line");
  } else {
    let sPointList = pointList.map((p) => new SSVGPoint(p.x, p.y));
    let pathData = `M ${sPointList[0].s}`;

    if (pointList.length == 2) {
      // if only two points make a straigt line between them
      pathData += ` L ${sPointList[1].s}`;
    } else {
      var ctrlP = controlPoints(pointList, true); // the control points array
      pathData += ` Q ${ctrlP[0].p1.s} ${sPointList[1].s}`;
      if (pointList.length > 2) {
        for (var i = 1; i < pointList.length - 2; i++) {
          pathData += ` C ${ctrlP[i - 1].p2.s} 
          ${ctrlP[i].p1.s} ${sPointList[i + 1].s}`;
        }
        let n = pointList.length - 1;
        pathData += ` Q ${ctrlP[n - 2].p2.s} ${sPointList[n].s}`;
      }
      return [pathData, ctrlP];
    }
    return [pathData, []];
  }
}
function controlPoints(
  pointList: Point[],
  scalePropotionally = false
): ControlPoint[] {
  if (pointList.length < 3) throw new Error("Need at least 3 points");

  let controlPointList: ControlPoint[] = [];
  for (var i = 1; i < pointList.length - 1; i++) {
    const dx = pointList[i - 1].x - pointList[i + 1].x;
    const dy = pointList[i - 1].y - pointList[i + 1].y;
    let scaledDX = dx * CURVE_AMOUNT;
    let scaledDY = dy * CURVE_AMOUNT;

    if (scalePropotionally) {
      // d is the distance between the next and previous points
      const d = Math.sqrt(dx * dx + dy * dy);
      const dxPrev = pointList[i - 1].x - pointList[i].x;
      const dyPrev = pointList[i - 1].y - pointList[i].y;
      const dPrev = Math.sqrt(dxPrev * dxPrev + dyPrev * dyPrev);
      let porportion = (dPrev / d) * 2;
      console.log(
        "dx",
        dx,
        "dy",
        dy,
        "d",
        d,
        "dxPrev",
        dxPrev,
        "dyPrev",
        dyPrev,
        "dPrev",
        dPrev,
        "prop",
        porportion,
        scaledDX,
        scaledDY
      );

      controlPointList.push({
        p1: new SSVGPoint(
          pointList[i].x + scaledDX * porportion,
          pointList[i].y + scaledDY * porportion
        ),
        p2: new SSVGPoint(
          pointList[i].x - scaledDX * (2 - porportion),
          pointList[i].y - scaledDY * (2 - porportion)
        ),
      });
    } else {
      controlPointList.push({
        p1: new SSVGPoint(pointList[i].x + scaledDX, pointList[i].y + scaledDY),
        p2: new SSVGPoint(pointList[i].x - scaledDX, pointList[i].y - scaledDY),
      });
    }
  }
  return controlPointList;
}
export default calculateCurve;
