interface RampCircleProps {
  xpos: number;
  ypos: number;

  radius: number;
}

const RampCircle = ({ radius, xpos, ypos }: RampCircleProps) => {
  return (
    <circle
      cx={xpos}
      cy={ypos}
      r={radius}
      className="ramp-circle"
      onClick={() => {
        console.log("clicked");
      }}
    />
  );
};

export default RampCircle;
