import { Button } from "react-bootstrap";

interface RampCircleProps {
  xpos: number;
  ypos: number;
  radius: number;
  onRightClick: (cx: number, cy: number) => void;
}

const RampCircle = ({ radius, xpos, ypos, onRightClick }: RampCircleProps) => {
  return (
    <circle
      cx={xpos}
      cy={ypos}
      r={radius}
      className="ramp-circle"
      onClick={(e) => {
        console.log("clicked");
        e.stopPropagation();
        e.preventDefault();
      }}
      onContextMenu={(e) => {
        onRightClick(xpos, ypos);
        console.log(e.button);
        e.preventDefault();
        e.stopPropagation();
      }}
    />
  );
};

export default RampCircle;
