import { useContext, useEffect, useState } from "react";
import { MidiManagerContext } from "../../Context";
import { Form } from "react-bootstrap";
import MidiMachine from "../../classes/midi/MidiMachine";

interface Props {
  machine: MidiMachine;
  onChange: (midiPort: string, direction: string) => void;
}

type MidiPortList = { [key: string]: string };

function MidiConnectionPicker({ machine, onChange }: Props) {
  // get a reference to the global midimanager
  const MidiManager = useContext(MidiManagerContext);
  let initialInPorts: MidiPortList = {};
  let initialOutPorts: MidiPortList = {};

  const [inPortList, setInPortList] = useState(initialInPorts);
  const [outPortList, setOutPortList] = useState(initialOutPorts);

  const onMidiConnection = () => {
    let managerInPorts: MidiPortList = {};
    let managerOutPorts: MidiPortList = {};

    console.log("in on midi success in the midi connection picker");
    for (let port in MidiManager.inPorts) {
      managerInPorts[port] = MidiManager.inPorts[port].toString();
    }

    for (let port in MidiManager.outPorts) {
      managerOutPorts[port] = MidiManager.outPorts[port].toString();
    }
    console.log(inPortList, outPortList);

    // TODO: fix this mess - stop the render loop the proper way
    // testing equality to make sure they have changed before we update them
    // without this we end up in a render loop
    // would be nice to figure out why

    if (JSON.stringify(inPortList) != JSON.stringify(managerInPorts)) {
      setInPortList({ ...managerInPorts });
    }
    if (JSON.stringify(outPortList) != JSON.stringify(managerOutPorts)) {
      setOutPortList({ ...managerOutPorts });
    }
  };
  useEffect(() => {
    console.log("in use effect");

    MidiManager.addEventListener("midiSuccess", onMidiConnection);
    // return a cleanup function to remove the event listener
    return () => {
      MidiManager.removeEventListener("midiSuccess", onMidiConnection);
    };
  }, [inPortList, outPortList]);

  const portsAsOptions = (portList: MidiPortList) => {
    let results = [];
    for (let port in portList) {
      results.push(
        <option value={port} key={port}>
          {portList[port].toString()}
        </option>
      );
    }
    return results;
  };

  const portChange = (port: string, direction: string) => {
    onChange(port, direction);
  };

  return (
    <>
      <Form.Group controlId="inPort">
        <Form.Label>In Port {machine.midiInPort}</Form.Label>
        <Form.Select
          aria-label="In Port Selector"
          defaultValue={machine.midiInPort}
          onChange={(e: any) => {
            portChange(e.target.value, "in");
          }}
        >
          <option>Pick an input Port</option>
          {portsAsOptions(inPortList)}
        </Form.Select>
      </Form.Group>
      <Form.Group controlId="outPort">
        <Form.Label>Out Port {machine.midiOutPort}</Form.Label>
        <Form.Select
          aria-label="Out Port Selector"
          defaultValue={machine.midiOutPort}
          onChange={(e: any) => {
            portChange(e.target.value, "out");
          }}
        >
          <option>Pick an output Port</option>
          {portsAsOptions(outPortList)}
        </Form.Select>
      </Form.Group>
    </>
  );
}
export default MidiConnectionPicker;
