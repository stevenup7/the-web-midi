import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { Link } from "react-router-dom";

function App() {
  return (
    <>
      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="/">
            <img
              src="/midi-white.svg"
              alt="midi logo"
              className="d-inline-block align-text-top"
              id="midi-icon-logo"
            />
            &nbsp; The Web Midi
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Link to="/" className="nav-link">
                Home
              </Link>
              <Link to="/config" className="nav-link">
                Config
              </Link>
              <NavDropdown title="Help" id="basic-nav-dropdown">
                <Link to="/help/home" className="dropdown-item">
                  Home
                </Link>

                <Link to="/help/midi" className="dropdown-item">
                  Basics
                </Link>
                <NavDropdown.Divider />

                <NavDropdown.Item href="/help/config/3.3">
                  Configuration
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
