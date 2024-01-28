import { useContext, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { MidiManagerContext } from "../../Context";
import MidiMachine from "../../classes/midi/MidiMachine";
import ConfigManager from "../../classes/config/ConfigManager";
import Keyboard from "../../components/PainoKeyboard/PainoKeyboard";
import BPMDisplay from "../../components/BPMDisplay/BPMDisplay";

function MidiController() {
  // connect the midiManager up to the midi machines from the config
  let initialMachines: MidiMachine[] = [];
  const config = new ConfigManager();
  const MidiManager = useContext(MidiManagerContext);
  // get the current config for midi machines from the config manager
  const initialMachineJSON = config.getConfig("machine");
  MidiManager.addEventListener("midiSuccess", () => {
    // load up the machines from config
    for (const m in initialMachineJSON) {
      let newMachineJSON = initialMachineJSON[m];
      let newMachine = MidiMachine.fromJSON(JSON.stringify(newMachineJSON));
      initialMachines.push(newMachine);
      MidiManager.addMachine(newMachine);
    }
  });
  // initialise the machines from the list
  const [machineList, setMachineList] = useState(initialMachines);

  return (
    <>
      <Container fluid="md">
        <Row>
          <Col>
            <div id="controller-main">
              <h1>Main Controller Page</h1>
              <p>This is it.</p>
              <p>Add rows and columns of controls as you wish</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <BPMDisplay></BPMDisplay>
          </Col>
        </Row>

        <Row>
          <Col>
            <Keyboard onDown={() => {}} onUp={() => {}}></Keyboard>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default MidiController;
