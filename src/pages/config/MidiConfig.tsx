import { Button, Col, Container, Row } from "react-bootstrap";
import { PlusCircle } from "react-bootstrap-icons";
import MidiMachineForm from "../../components/MidiMachineForm/MidiMachinceForm";
import MidiMachine from "../../classes/midi/MidiMachine";
import { useContext, useState } from "react";
import ConfigManager from "../../classes/config/ConfigManager";
import { MidiManagerContext } from "../../Context";
import App from "../../App";
function MidiConfig() {
  let configManager: ConfigManager = new ConfigManager(); // config manager stores confg to locoal storage
  let initialMachines: MidiMachine[] = []; // list of machines already in config
  // get the midi manager so we know what ports are available
  const midiManager = useContext(MidiManagerContext);

  midiManager.addEventListener("midiSuccess", () => {
    // console.log("midi success event listener in MidiConfig component");
    for (let port in midiManager.inPorts) {
      console.log(midiManager.inPorts[port].toString());
    }
  });

  // get the current config for midi machines from the config manager
  const initialMachineJSON = configManager.getConfig("machine");

  // load up the machines from config
  for (const m in initialMachineJSON) {
    let newMachineJSON = initialMachineJSON[m];
    initialMachines.push(MidiMachine.fromJSON(JSON.stringify(newMachineJSON)));
  }
  // initialise the machines from the list
  const [machineList, setMachineList] = useState(initialMachines);

  const saveMachine = (machine: MidiMachine) => {
    configManager.saveObject("machine." + machine.id, machine);
    midiManager.reloadConfig();
  };
  const deleteMachine = (machine: MidiMachine) => {
    configManager.deleteObject("machine." + machine.id);
    let newMachineList = machineList.filter((m) => m.id !== machine.id);
    setMachineList([...newMachineList]);
  };
  const getFreeMachineId = () => {
    let ids = machineList.map((m) => m.id);
    let max = Math.max(...ids);
    return max + 1;
  };
  const addMachine = () => {
    machineList.push(
      new MidiMachine(getFreeMachineId(), "New ", "", "", [], 15, {})
    );
    setMachineList([...machineList]);
  };
  return (
    <>
      <App></App>
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
            <h2>Connected Machines</h2>

            <h2>Other Config</h2>
            <p>This is where all the other configuration options will go</p>
            <p>[ ] Provide Midi Clock </p>
            <p>Listen to Midi Clock from [machine name^]</p>
            <p>Default keyboard style [ piano | octave | autochords] </p>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default MidiConfig;
