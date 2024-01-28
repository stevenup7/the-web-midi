import { useContext, useState } from "react";
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

  MidiManager.addEventListener("midiSuccess", () => {
    let managerInPorts: MidiPortList = {};
    console.log("in on midi success");
    for (let port in MidiManager.inPorts) {
      managerInPorts[port] = MidiManager.inPorts[port].toString();
    }
    setInPortList(managerInPorts);

    let managerOutPorts: MidiPortList = {};
    for (let port in MidiManager.outPorts) {
      managerOutPorts[port] = MidiManager.outPorts[port].toString();
    }
    setOutPortList(managerOutPorts);
  });

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
