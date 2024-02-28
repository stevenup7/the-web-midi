import { useState } from "react";
import MidiMachine from "../../classes/midi/MidiMachine";
import ShowHideSection from "../DisplayHelpers/ShowHideSection";
import { Gear } from "react-bootstrap-icons";
import MachinePicker from "../MachinePicker/MachinePicker";

import digitakt from "../../../data/digitakt.json";

function FXControls() {
  const [machine, setMachine] = useState<MidiMachine | undefined>(undefined);

  console.log(digitakt);

  return (
    <>
      <div className="keyboard-config">
        <ShowHideSection title={<Gear />} align="right">
          <MachinePicker
            onChange={(machine: MidiMachine, channel: number) => {
              // console.log("setting machine and channel", machine, channel);
              setMachine(machine);
            }}
          ></MachinePicker>
        </ShowHideSection>
      </div>
      FX Controls
    </>
  );
}
export default FXControls;
