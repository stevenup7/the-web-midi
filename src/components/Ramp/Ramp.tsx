import React, { useEffect, useRef, useState } from "react";
import "./Ramp.css";
import RampCircle from "./RampCircle";
import drawCurve from "./SVGCurve";

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
  // (props: Props) {
  // console.log("Ramp props", props);

  const [width, setWidth] = useState(0);
  const [circleList, setCircleList] = useState<CircleProps[]>([]);

  const elementRef = useRef<any>(null);
  const wrapperRef = useRef(null);
  const lineRef = useRef(null);

  const resizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      console.log("resize event", entry.contentBoxSize[0].inlineSize);

      // entry.target.style.width = entry.contentBoxSize[0].inlineSize + 10 + "px";
    }
  });

  const drawPath = (list?: CircleProps[]) => {
    if (list === undefined) {
      console.log("list is state var");
      list = circleList;
    }
    const cl = list.sort((a: CircleProps, b: CircleProps) => {
      return a.x - b.x;
    });
    let cp = drawCurve(cl);
    // let path = `M  ${cl[0].x} ${cl[0].y} `;

    // for (let i = 1; i < cl.length - 1; i++) {
    //   path += ` L ${cl[i].x} ${cl[i].y} `;
    // }
    // path += ` L ${cl[cl.length - 1].x} ${cl[cl.length - 1].y} `;
    // console.log("path", path, "len ", cl);
    if (lineRef.current === null) return;
    // (lineRef.current as SVGAElement).setAttribute("d", path);
    (lineRef.current as SVGAElement).setAttribute("d", cp);
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
          {circleList.map((circle, index) => {
            return (
              <RampCircle
                key={index}
                xpos={circle.x}
                ypos={circle.y}
                radius={5}
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
