import { Button, Col, Container, Row } from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
import MidiMachineForm from "../../components/MidiMachinceForm";
import MidiMachine from "../../classes/midi/MidiMachine";
import { useState } from "react";
import ConfigManager from "../../classes/config/ConfigManager";

function MidiConfig() {
  let configManager: ConfigManager = new ConfigManager();
  let initialMachines: MidiMachine[] = [];

  // get the current config for midi machines from the config manager
  const initialMachineJSON = configManager.getConfig("machine");
  console.log("MidiConfig Component");

  // load up the machines from config
  for (const m in initialMachineJSON) {
    let newMachineJSON = initialMachineJSON[m];
    console.log(newMachineJSON);
    console.log("adding machine from json config", m);
    initialMachines.push(MidiMachine.fromJSON(JSON.stringify(newMachineJSON)));
  }
  // initialise the machines from the list
  const [machineList, setMachineList] = useState(initialMachines);

  const saveMachine = (machine: MidiMachine) => {
    configManager.saveObject("machine." + machine.id, machine);
  };
  const deleteMachine = (machine: MidiMachine) => {
    console.log("Deleting Machine", machine);

    configManager.deleteObject("machine." + machine.id);
    let newMachineList = machineList.filter((m) => m.id !== machine.id);
    setMachineList([...newMachineList]);
  };
  const addMachine = () => {
    console.log("Adding Machine");
    machineList.push(
      new MidiMachine(machineList.length + 1, "New ", "testport", [], 15, {})
    );
    setMachineList([...machineList]);
  };
  return (
    <Container fluid="md">
      <Row>
        <Col>
          <h2>Machines</h2>
          {machineList.map((machine, index) => (
            <div key={index}>
              {" "}
              <MidiMachineForm
                midiMachine={machine}
                onSave={(m) => {
                  saveMachine(m);
                }}
                onDelete={(m) => {
                  console.log("dm");

                  deleteMachine(m);
                }}
              ></MidiMachineForm>
            </div>
          ))}

          <Button
            variant="secondary"
            onClick={() => {
              addMachine();
            }}
          >
            <PlusCircle /> Add New Machine
          </Button>
        </Col>
        <Col>
          <h2>Other Config</h2>
          <p>This is where all the other configuration options will go</p>
        </Col>
      </Row>
    </Container>
  );
}
export default MidiConfig;
