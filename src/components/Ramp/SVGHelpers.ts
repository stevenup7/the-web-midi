export type Point = { x: number; y: number };

export class SSVGPoint {
  x: number = 0;
  y: number = 0;
  constructor(x?: number, y?: number) {
    if (x && y) {
      this.x = x;
      this.y = y;
    }
  }
  toString() {
    return `${this.x} ${this.y}`;
  }
  public get s() {
    return `${this.x} ${this.y}`;
  }
}

export class SVGPointList {
  points: SSVGPoint[] = [];
  constructor(points: Point[]) {
    this.points = points.map((p) => new SSVGPoint(p.x, p.y));
  }
}

export default SVGPoint;
