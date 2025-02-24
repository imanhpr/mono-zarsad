import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { useContext } from "react";
import { Container, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";
import { AuthCtx } from "../context";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = useContext(AuthCtx);
  return (
    <>
      {!user && (
        <Row>
          <Navbar
            expand="lg"
            className="bg-body-tertiary"
            bg="dark"
            data-bs-theme="dark"
          >
            <Container>
              <Link to="/">
                <Navbar.Brand>پنل مدیریت زرصــاد</Navbar.Brand>
              </Link>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse dir="rtl" id="basic-navbar-nav">
                <Nav className="me-auto">
                  <Nav.Item>
                    <Link className="nav-link" to="/">
                      خانه
                    </Link>
                  </Nav.Item>
                  <NavDropdown
                    dir="rtl"
                    title="مدیریت ارز ها"
                    id="basic-nav-dropdown"
                  >
                    <Link className="nav-link" to="/currency">
                      <NavDropdown.ItemText>
                        بروزرسانی قیمت
                      </NavDropdown.ItemText>
                    </Link>
                  </NavDropdown>
                </Nav>
              </Navbar.Collapse>
            </Container>
          </Navbar>
        </Row>
      )}
      <Outlet />
    </>
  );
}
