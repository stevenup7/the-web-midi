import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";

function App() {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">The Web Midi</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/">Home</Nav.Link>
              <Nav.Link href="/config">Config</Nav.Link>
              <NavDropdown title="Help" id="basic-nav-dropdown">
                <NavDropdown.Item href="/help/home">Home</NavDropdown.Item>
                <NavDropdown.Item href="/help/midi">
                  Midi Basics
                </NavDropdown.Item>
                <NavDropdown.Item href="/help/config/3.3">
                  Configuration
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/brokendedlink/3.4">
                  404 page
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default App;
