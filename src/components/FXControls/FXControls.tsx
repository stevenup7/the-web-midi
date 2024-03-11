import { useState } from "react";
import MidiMachine from "../../classes/midi/MidiMachine";
import ShowHideSection from "../DisplayHelpers/ShowHideSection";
import { Gear } from "react-bootstrap-icons";
import MachinePicker from "../MachinePicker/MachinePicker";

import digitakt from "../../../data/digitakt.json";
import digitone from "../../../data/digitone.json";
import { Button, Form } from "react-bootstrap";

import "./FXControls.css";

function FXControls() {
  const [machine, setMachine] = useState<MidiMachine | undefined>(undefined);

  let showParameters = true;
  return (
    <>
      <div className="keyboard-config">
        <ShowHideSection title={<Gear />} align="right">
          <MachinePicker
            onChange={(machine: MidiMachine, channel: number) => {
              // console.log("setting machine and channel", machine, channel);
              setMachine(machine);
            }}
          ></MachinePicker>{" "}
          {showParameters ? (
            <Form.Select aria-label="Default select example">
              {Object.keys(digitakt).map((key) => {
                return (
                  <option
                    key={key}
                    value={digitakt[key as keyof typeof digitakt]["cc_msb"]}
                  >
                    {key}
                  </option>
                );
              })}
            </Form.Select>
          ) : null}
        </ShowHideSection>
        <Form.Control
          type="range"
          min={0}
          max={127}
          placeholder="Disabled readonly input"
          aria-label="Disabled input example"
          readOnly
        />
        ip
      </div>
    </>
  );
}
export default FXControls;
