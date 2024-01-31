import { PauseBtnFill, PlayBtnFill, StopBtnFill } from "react-bootstrap-icons";
import { MidiManagerContext } from "../../Context";
import { useContext, useState } from "react";
import "./PlayControls.css";

function PlayControls() {
  let midiManager = useContext(MidiManagerContext);
  const [isPlaying, setIsPlaying] = useState(false);

  function sendPlay() {
    midiManager.clock.startGenerating();
    setIsPlaying(true);
  }

  function sendStop() {
    setIsPlaying(false);

    midiManager.clock.stop();
  }
  return (
    <>
      <div className="play-controls">
        <PlayBtnFill
          className={"play-control" + (isPlaying ? " hidden" : "")}
          width="2em"
          height="2em"
          onClick={sendPlay}
        />

        <PauseBtnFill
          className={"play-control" + (isPlaying ? "" : " hidden")}
          width="2em"
          height="2em"
          onClick={sendStop}
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
