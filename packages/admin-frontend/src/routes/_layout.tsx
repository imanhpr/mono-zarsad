import { createFileRoute, Link, Outlet } from "@tanstack/react-router";
import { Container, Nav, Navbar, NavDropdown, Row } from "react-bootstrap";

export const Route = createFileRoute("/_layout")({
  component: RouteComponent,
});

function RouteComponent() {
  const user = null;
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
                  <NavDropdown
                    dir="rtl"
                    title="مدیریت کاربران"
                    id="basic-nav-dropdown"
                  >
                    <Link className="nav-link" to="/user">
                      <NavDropdown.ItemText>
                        ایجاد کاربر جدید
                      </NavDropdown.ItemText>
                    </Link>
                    <Link className="nav-link" to="/user/manage">
                      <NavDropdown.ItemText>کاربران</NavDropdown.ItemText>
                    </Link>
                  </NavDropdown>
                  <NavDropdown
                    dir="rtl"
                    title="مدیریت تراکنش ها"
                    id="basic-nav-dropdown"
                  >
                    <NavDropdown.ItemText>
                      <Link className="nav-link active" to="/transaction">
                        ایجاد تراکنش جدید
                      </Link>
                    </NavDropdown.ItemText>
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
