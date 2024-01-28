import { Button, Col, Container, Form, Row } from "react-bootstrap";
import MidiMachine from "../../classes/midi/MidiMachine";
import MidiChannelsPicker from "../MidiFormControls/MidiChannelsPicker";
import ShowHideSection from "../ShowHideSection";
import { useState } from "react";
import "./MidiMachineForm.css";
import MidiConnectionPicker from "../MidiFormControls/MidiConnectionPicker";

interface Props {
  midiMachine: MidiMachine;
  onSave: (m: MidiMachine) => void;
  onDelete: (m: MidiMachine) => void;
}
function MidiMachineForm({ midiMachine, onSave, onDelete }: Props) {
  const [machine, setMachine] = useState(midiMachine);
  // console.log(machine);
  const updateProps = (props: { [prop: string]: any }) => {
    let json = machine.toJSON();
    let machineValues = JSON.parse(json);
    for (const k in props) {
      console.log(k, props[k]);
      machineValues[k] = props[k];
    }
    console.log(machineValues);
    setMachine(MidiMachine.fromJSON(JSON.stringify(machineValues)));
  };

  const save = () => {
    onSave(machine);
  };

  const deleteMachine = () => {
    onDelete(machine);
  };

  // bind the form to the machine object
  return (
    <Container fluid="md" className="midi-machine-form">
      <Row>
        <Col>
          <Form>
            <Form.Group controlId="machineName">
              <Form.Label>Machine Name {machine.id}</Form.Label>
              <Form.Control
                type="text"
                placeholder="eg. Elektron Digitakt"
                value={machine.name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  updateProps({ name: e.target.value });
                }}
              />
            </Form.Group>

            <Form.Group controlId="effectsChannel">
              <Form.Label>Effects Channel</Form.Label>
              <Form.Select
                aria-label="Default select example"
                defaultValue={machine.fxChannel}
                onChange={(e: any) => {
                  updateProps({ fxChannel: parseInt(e.target.value, 10) });
                }}
              >
                <option>Pick an effects Channel</option>
                {[...Array(16)].map((_, index) => (
                  <option key={index} value={index}>
                    {index + 1}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <MidiConnectionPicker
              machine={machine}
              onChange={(port: string, direction: string) => {
                if (direction === "in") {
                  updateProps({ midiInPort: port });
                } else {
                  updateProps({ midiOutPort: port });
                }
              }}
            ></MidiConnectionPicker>
            <ShowHideSection title="MIDI Channels">
              <MidiChannelsPicker
                onChange={(
                  channels: number[],
                  channelAliases: { [channelNumber: number]: string }
                ) => {
                  console.log("updating channels", channels, channelAliases);
                  updateProps({
                    channelAliases: channelAliases,
                    channels: channels,
                  });
                }}
                defaultValue={machine.channelAliases}
              />
            </ShowHideSection>
            <div className="">
              <br />
              <Button variant="primary" onClick={save}>
                Save
              </Button>{" "}
              &nbsp;
              <Button variant="danger" onClick={deleteMachine}>
                Delete
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
      {/* <pre>{machine.toJSON(4)}</pre> */}
    </Container>
  );
}
export default MidiMachineForm;
