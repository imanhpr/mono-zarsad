import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { Row } from "react-bootstrap";

export const Route = createRootRoute({
  component: () => (
    <>
      <Row>
        <Navbar
          expand="lg"
          className="bg-body-tertiary"
          bg="dark"
          data-bs-theme="dark"
        >
          <Container>
            <Link to="/">
              <Navbar.Brand>زرصــاد</Navbar.Brand>
            </Link>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Link to="/">
                  <Nav>خانه</Nav>
                </Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Row>

      <Outlet />

      <TanStackRouterDevtools />
    </>
  ),
});
