import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Fragment } from "react";
import UserTable from "../../../components/User-Table";

export const Route = createFileRoute("/_layout/user/manage")({
  component: RouteComponent,
  loader(ctx) {
    const zar = ctx.context.userAPI;
    return zar.getUsersByFilter({});
  },
});

function RouteComponent() {
  // TODO: fix type safety
  const result = Route.useLoaderData();
  console.log(result);
  return (
    <Fragment>
      <Container dir="rtl" className="mt-5">
        <h2>مدیریت کاربران</h2>
      </Container>

      <Container dir="rtl" className="mt-5">
        <Card>
          <Card.Header>
            <Card.Text>جستجو</Card.Text>
          </Card.Header>
          <Card.Body>
            <Form>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>شناسه کاربر</Form.Label>
                    <Form.Control
                      name="userId"
                      className="text-center"
                      type="text"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>شماره ملی</Form.Label>
                    <Form.Control
                      name="userId"
                      className="text-center"
                      type="text"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="primary" type="submit">
                    فیلتر
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <UserTable fullPath={Route.fullPath} users={result.users} />
    </Fragment>
  );
}
