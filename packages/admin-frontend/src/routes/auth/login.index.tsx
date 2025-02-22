import { createFileRoute } from "@tanstack/react-router";
import { Card, Form, Button } from "react-bootstrap";

export const Route = createFileRoute("/auth/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div
      dir="rtl"
      className="d-flex align-items-center justify-content-center h-100"
    >
      <Card>
        <Card.Header>ورود</Card.Header>
        <Card.Body>
          <Form>
            <Form.Group>
              <Form.Label>نام کاربری</Form.Label>
              <Form.Control dir="ltr" type="text" />
            </Form.Group>

            <Form.Group>
              <Form.Label>رمز عبور</Form.Label>
              <Form.Control dir="ltr" type="password" />
            </Form.Group>

            <Form.Group className="mt-2">
              <Button variant="primary" type="submit">
                ورود
              </Button>
            </Form.Group>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
