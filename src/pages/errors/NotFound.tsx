import { Col, Container, Row } from "react-bootstrap";
import { useRouteError } from "react-router-dom";

function NotFound() {
  const error: any = useRouteError();
  //   console.error(error);

  return (
    <Container fluid>
      <Row>
        <Col>
          <div id="error-page" className="text-center">
            <br />
            <br />
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
              <b>{error.status}</b>:<i>{error.statusText}</i>
            </p>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default NotFound;
