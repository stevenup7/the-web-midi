// Based heavily on the following post
// https://stackoverflow.com/questions/64933819/calculate-a-curve-that-goes-through-all-the-points/64934180#64934180

const CURVE_AMOUNT = 1 / 8; // change this to change the curvature
type Point = { x: number; y: number };
type ControlPoint = { p1: Point; p2: Point };

function drawCurve(pointList: Point[]) {
  if (pointList.length <= 1) {
    throw new Error("Need at lest 2 points to draw a line");
  } else {
    let pathData = `M ${pointList[0].x} ${pointList[0].y}`;

    if (pointList.length == 2) {
      // if only two points make a straigt line between them
      pathData += ` L ${pointList[1].x} ${pointList[1].y}`;
    } else {
      var ctrlPL = controlPoints(pointList); // the control points array
      pathData += ` Q ${ctrlPL[0].p1.x} ${ctrlPL[0].p1.y} ${pointList[1].x}, ${pointList[1].y}`;
      if (pointList.length > 2) {
        for (var i = 1; i < pointList.length - 2; i++) {
          pathData += ` C ${ctrlPL[i - 1].p2.x}, ${ctrlPL[i - 1].p2.y} ${
            ctrlPL[i].p1.x
          },${ctrlPL[i].p1.y} ${pointList[i + 1].x},${pointList[i + 1].y}`;
        }
        let n = pointList.length - 1;
        pathData += ` Q ${ctrlPL[n - 2].p2.x}, ${ctrlPL[n - 2].p2.y} ${
          pointList[n].x
        },${pointList[n].y}`;
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
    const x1 = pointList[i].x + dx;
    const y1 = pointList[i].y + dy;
    const x2 = pointList[i].x - dx;
    const y2 = pointList[i].y - dy;

    controlPointList.push({
      p1: {
        x: x1,
        y: y1,
      },
      p2: {
        x: x2,
        y: y2,
      },
    });
  }
  return controlPointList;
}
export default drawCurve;
