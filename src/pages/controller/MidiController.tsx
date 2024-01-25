import { Col, Container, Row } from "react-bootstrap";

function MidiController() {
  return (
    <>
      <Container fluid="md">
        <Row>
          <Col>
            <div id="controller-main">
              <h1>Main Controller Page</h1>
              <p>This is it.</p>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
export default MidiController;
