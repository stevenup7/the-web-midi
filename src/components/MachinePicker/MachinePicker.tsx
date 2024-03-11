import { ReactElement, useContext, useEffect, useState } from "react";
import MidiMachine from "../../classes/midi/MidiMachine";
import { MidiManagerContext } from "../../Context";
import { Form } from "react-bootstrap";

interface Props {
  onChange: (machine: MidiMachine, channel: number) => void;
  includeChannel?: boolean;
}

function MachinePicker({ onChange, includeChannel }: Props) {
  // get a reference to the midi manager
  const midiManager = useContext(MidiManagerContext);
  // set up all the state stuff
  const [machine, setMachine] = useState<MidiMachine | undefined>(undefined);
  const [channel, setChannel] = useState<number | undefined>(undefined);
  const [channeloOpts, setchannelOpts] = useState<ReactElement[]>([
    <option key="-1">waiting for midi connection...</option>,
  ]);

  // when the midi manager is ready we can load the machines
  const [machinesLoaded, setMachinesLoaded] = useState(() => {
    return false;
  });

  useEffect(() => {
    midiManager.addEventListener("midiSuccess", () => {
      // update the state
      setMachinesLoaded(true);
      // find the first port and set the machine to that machine on that port
      // (this way we have a default machine to use)
      const outPortKeys = Object.keys(midiManager.outPorts);
      if (outPortKeys.length > 0) {
        let fistPortDetails = midiManager.outPorts[outPortKeys[0]];
        // debugger;
        updateMachine(fistPortDetails.name);
      }
      // TOOD: handle no active machines case
    });
  }, [machinesLoaded]);

  // when we pick a machine from the select then we need to read off its
  // available channels and add them to the channel options for the
  // channel selector
  const updateMachine = (machineName: string) => {
    let machineChannels: ReactElement[] = [];
    let foundMachine = midiManager.getMachineByName(machineName);
    //let machineOnPort = midiManager.getMachieOnPort(portid);
    console.log("machineOnPort", foundMachine.name);
    // udate the state variable for the machine
    setMachine(foundMachine);
    // update the state variable for the channel to the first available channel
    let firstChannelNumber = parseInt(
      Object.keys(foundMachine.channelAliases)[0],
      10
    );
    setChannel(firstChannelNumber);
    updateChannel(firstChannelNumber, foundMachine);
    // keep using the local variable becuse this is async
    if (foundMachine !== undefined) {
      for (let alias in foundMachine.channelAliases) {
        machineChannels.push(
          <option value={alias} key={alias}>
            {foundMachine.channelAliases[alias]}
          </option>
        );
      }
    }
    setchannelOpts(machineChannels);
  };

  const updateChannel = (newChannel: number, newMachine?: MidiMachine) => {
    setChannel(newChannel);
    if (newMachine === undefined) {
      newMachine = machine;
    }

    if (newMachine == undefined || newChannel == undefined) {
    } else {
      onChange(newMachine, newChannel);
    }
  };
  return (
    <>
      <Form>
        <Form.Group controlId="midiConnection">
          <Form.Label>
            Synth:
            {machinesLoaded ? "" : " ... loading machines"}
          </Form.Label>
          <Form.Select
            aria-label={"Default select example"}
            // defaultValue={machine.fxChannel}
            onChange={(e: any) => {
              let portId = e.target.value;
              updateMachine(midiManager.outPorts[portId].name);
            }}
          >
            {Object.keys(midiManager.outPorts).map((portid) => {
              return (
                <option key={portid} value={portid}>
                  {midiManager.outPorts[portid].toString()}
                </option>
              );
            })}
            ;
          </Form.Select>
        </Form.Group>
        {includeChannel === true ? (
          <Form.Group controlId="midiChannel">
            <Form.Label>Channel:</Form.Label>
            <Form.Select
              aria-label={"Default select example"}
              // defaultValue={machine.fxChannel}
              onChange={(e: any) => {
                updateChannel(e.target.value);
              }}
            >
              {channeloOpts}
            </Form.Select>
          </Form.Group>
        ) : (
          ""
        )}
      </Form>
    </>
  );
}
export default MachinePicker;
