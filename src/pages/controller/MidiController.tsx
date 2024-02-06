import { Col, Container, Row } from "react-bootstrap";
import Keyboard from "../../components/PainoKeyboard/PainoKeyboard";
import BPMDisplay from "../../components/BPMDisplay/BPMDisplay";
import PlayControls from "../../components/PlayControls/PlayControls";
import App from "../../App";
import Ramp from "../../components/Ramp/Ramp";

function MidiController() {
  return (
    <>
      <App></App>

      <Container fluid="md">
        <Row>
          <Col>
            <BPMDisplay></BPMDisplay>
          </Col>
        </Row>
        <Row>
          <Col>
            <PlayControls></PlayControls>
          </Col>
        </Row>

        <Row>
          <Col>
            <Keyboard onDown={() => {}} onUp={() => {}}></Keyboard>
          </Col>
        </Row>
        <Row>
          <Col>
            <Ramp type="fish"></Ramp>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default MidiController;
