import { Button, Container, Row, Col, Form } from "react-bootstrap";
import { useState } from "react";

function HelpHome() {
  const [reactBSSearchString, setReactBSSearchString] = useState("");

  function searchReactBootstrap() {
    const query =
      "site:https://react-bootstrap.netlify.app/docs/ " + reactBSSearchString;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(
      query
    )}`;
    window.open(searchUrl, "_blank");
  }

  return (
    <Container fluid="md">
      <Row>
        <Col>
          Hulp
          <div>
            <h2>React Bootstrap</h2>

            <Form>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlInput1"
              >
                <Form.Label>
                  Search React Bootstrap (
                  <a
                    href="https://react-bootstrap.netlify.app/docs/"
                    target="_blank"
                  >
                    react-bootstrap
                  </a>
                  )
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Search React Bootstrap"
                  value={reactBSSearchString}
                  onChange={(e) => setReactBSSearchString(e.target.value)}
                />
              </Form.Group>

              <Button onClick={searchReactBootstrap}>
                Search React Bootstrap
              </Button>
            </Form>
          </div>
          <div>
            <a href="https://icons.getbootstrap.com/" target="_blank">
              icons
            </a>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
export default HelpHome;
