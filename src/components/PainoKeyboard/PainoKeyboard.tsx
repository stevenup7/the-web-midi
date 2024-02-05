import { useContext, useState } from "react";
import { OCTAVE } from "../../classes/midi/MusicConstants";

import "./paino-keyboard.css";
import PainoKey from "./PainoKeyboardKey";
import MachinePicker from "../MachinePicker/MachinePicker";
import MidiMachine from "../../classes/midi/MidiMachine";
import MidiManager from "../../classes/midi/MidiManager";
import { MidiManagerContext } from "../../Context";
import ShowHideSection from "../DisplayHelpers/ShowHideSection";
import { Gear } from "react-bootstrap-icons";
import MidiMessage from "../../classes/midi/MidiMessage";

interface KeyboardProps {
  onDown: (channel: number, note: string, machine: MidiMachine) => void;
  onUp: (channel: number, note: string, machine: MidiMachine) => void;
}

const Keyboard = ({ onDown, onUp }: KeyboardProps) => {
  const [machine, setMachine] = useState<MidiMachine | undefined>(undefined);
  const [channel, setChannel] = useState<number | undefined>(undefined);
  // get a reference to the midi manager
  const midiManager = useContext(MidiManagerContext);

  // set up the keys for the keyboard
  let allKeys: string[] = [];
  for (let oct = 0; oct < 8; oct++) {
    for (let n = 0; n < OCTAVE.length; n++) {
      const currNote = OCTAVE[n];
      allKeys.push(currNote + oct);
    }
  }
  let keyList = allKeys;

  const handleContextMenu = (e: any) => {
    e.preventDefault();
  };
  // const handleChannelSelection = (selectedChannel: number[]) => {
  //   setMidiChannel(selectedChannel[0]);
  // };
  return (
    <>
      <div className="keyboard-config">
        <ShowHideSection title={<Gear />} align="right">
          <MachinePicker
            onChange={(machine: MidiMachine, channel: number) => {
              console.log("setting machine and channel", machine, channel);
              setMachine(machine);
              setChannel(channel);
            }}
          ></MachinePicker>
        </ShowHideSection>
      </div>

      <div
        className="piano-keyboard-wrapper"
        onContextMenu={handleContextMenu}
        onSelect={handleContextMenu}
      >
        {keyList.map((n) => {
          return (
            <PainoKey
              key={n}
              note={n}
              onUp={() => {
                console.log(
                  "sending note up",
                  n,
                  new MidiMessage().noteOff(1, n)
                );

                if (channel == undefined || machine == undefined) return;
                onUp(channel, n, machine);
                midiManager.noteUp(channel, n, machine);
              }}
              onDown={() => {
                if (channel == undefined || machine == undefined) return;
                onDown(channel, n, machine);
                midiManager.noteDown(channel, n, machine);
              }}
            ></PainoKey>
          );
        })}
        <hr />
      </div>
    </>
  );
};

export default Keyboard;
