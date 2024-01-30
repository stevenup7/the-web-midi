import { PlayBtnFill, StopBtnFill } from "react-bootstrap-icons";
import { MidiManagerContext } from "../../Context";
import { useContext } from "react";
import "./PlayControls.css";

function PlayControls() {
  let midiManager = useContext(MidiManagerContext);

  function sendPlay() {
    midiManager.clock.startGenerating();
  }
  function sendStop() {
    midiManager.clock.stop();
  }
  return (
    <>
      <div className="play-controls">
        <PlayBtnFill
          className="play-control"
          width="2em"
          height="2em"
          onClick={sendPlay}
        />
        <StopBtnFill
          className="play-control"
          width="2em"
          height="2em"
          onClick={sendStop}
        />
      </div>
    </>
  );
}
export default PlayControls;
