import { useContext, useState } from "react";
import "./BPMDisplay.css";
import { MidiManagerContext } from "../../Context";

function BPMDisplay() {
  const [beat, setBeat] = useState(0);
  const [bar, setBar] = useState(0);
  const [bpm, setBpm] = useState(120);

  const MidiManager = useContext(MidiManagerContext);

  MidiManager.addEventListener("beat", (beatnumber: number, bpm: number) => {
    setBeat(beatnumber);
    setBpm(bpm);
    setBar(Math.floor(beatnumber / 4) + 1);
  });

  return (
    <>
      <div className="BPM-counter">
        {bpm} BPM | beat: {beat} | bar #{bar}
      </div>
      <div className="BPM-display">
        {[...Array(16)].map((_, index) => {
          let cls = "BPM-display-beat";
          if (index % 4 == 0) {
            cls += " BPM-quarter";
          }
          if (beat % 16 == index) {
            cls += " active-beat";
          }
          return (
            <div key={index} className={cls}>
              {index + 1}
            </div>
          );
        })}
      </div>
    </>
  );
}
export default BPMDisplay;
