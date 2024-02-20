import React, { useEffect, useRef, useState } from "react";
import "./Ramp.css";
import RampCircle from "./RampCircle";
import calculateCurve from "./SVGCurve";

interface Props {
  type: string;
}

type CircleProps = {
  x: number;
  y: number;
};

const MARGIN = 10;
const HEIGHT = 200;

function Ramp() {
  const [width, setWidth] = useState(0);
  const [circleList, setCircleList] = useState<CircleProps[]>([]);

  const elementRef = useRef<any>(null);
  const wrapperRef = useRef(null);
  const lineRef = useRef(null);
  const cLineRef = useRef(null);

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      console.log("resize event", entry.contentBoxSize[0].inlineSize);

      // entry.target.style.width = entry.contentBoxSize[0].inlineSize + 10 + "px";
    }
  });

  const drawPath = (list?: CircleProps[]) => {
    if (list === undefined) {
      list = circleList;
    }
    // sort the list by x coord
    const cl = list.sort((a: CircleProps, b: CircleProps) => {
      return a.x - b.x;
    });
    const [pathString, controlPoints] = calculateCurve(cl);

    if (lineRef.current === null) return;
    (lineRef.current as SVGAElement).setAttribute("d", pathString);
    if (cLineRef.current === null) return;
    if (controlPoints.length > 0) {
      (cLineRef.current as SVGAElement).setAttribute(
        "d",
        `M ${controlPoints[0].p1.s} L ${controlPoints[0].p2.s} `
      );
    }
  };

  const svgClick = (x: number, y: number) => {
    // https://stackoverflow.com/questions/29261304/how-to-get-the-click-coordinates-relative-to-svg-element-holding-the-onclick-lis
    // account for viewPort
    let newList = [...circleList, { x: x, y: y }];
    setCircleList(newList);
    drawPath(newList);
  };

  const setSVGWidth = () => {
    if (elementRef.current === null || wrapperRef.current === null) return;
    let wrapperEl: HTMLDivElement = wrapperRef.current;
    elementRef.current.style.width = wrapperEl.offsetWidth + "px";
    setWidth(wrapperEl.offsetWidth);
  };
  useEffect(() => {
    if (elementRef.current === null || wrapperRef.current === null) return;
    // Created once for document
    resizeObserver.observe(wrapperRef.current);
    let wrapperEl: HTMLDivElement = wrapperRef.current;

    if (circleList.length === 0) {
      setCircleList([
        ...circleList,
        { x: MARGIN, y: HEIGHT - MARGIN * 2 },
        { x: wrapperEl.offsetWidth - MARGIN, y: MARGIN },
      ]);
      drawPath([
        ...circleList,
        { x: MARGIN, y: HEIGHT - MARGIN * 2 },
        { x: wrapperEl.offsetWidth - MARGIN, y: MARGIN },
      ]);
      // setCircleList([
      //   ...circleList,
      //   { x: 0, y: 0 },
      //   { x: 50, y: 100 },
      //   { x: 200, y: 200 },
      // ]);
    }
    setSVGWidth();
  }, [width]);
  return (
    <>
      <div className="ramp" ref={wrapperRef} onResize={setSVGWidth}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height={HEIGHT}
          width="50"
          ref={elementRef}
          onClick={(e: React.MouseEvent) => {
            const r = e.currentTarget.getBoundingClientRect();
            svgClick(e.clientX - r.x, e.clientY - r.y);
          }}
        >
          <path ref={lineRef} d="M 10 80 L 10 100" className="ramp-line" />
          <path
            ref={cLineRef}
            d="M 10 80 L 10 100"
            className="ramp-line-debug"
          />
          {circleList.map((circle, index) => {
            return (
              <RampCircle
                key={index}
                xpos={circle.x}
                ypos={circle.y}
                radius={5}
                onRightClick={(cx, cy) => {
                  console.log("right click");
                  // remove the circle
                  const newCircleList = circleList.filter((c) => {
                    console.log("c", c, "cx", cx, "cy", cy);
                    return c.x !== cx && c.y !== cy;
                  });
                  setCircleList(newCircleList);
                  drawPath(newCircleList);
                }}
              ></RampCircle>
            );
          })}
          ;
        </svg>
      </div>
    </>
  );
}
export default Ramp;
