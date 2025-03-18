import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Fragment, useRef, useState } from "react";
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
  const userApi = Route.useRouteContext({ select: (t) => t.userAPI });
  const [users, setUsers] = useState(result.users);
  const formRef = useRef<HTMLFormElement>(null);
  async function onSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
    if (formRef.current === null) return;
    const formData = new FormData(formRef.current);
    const filter = Object.fromEntries(formData.entries());
    const result = await userApi.getUsersByFilter(filter);
    setUsers(result.users);
  }
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
            <Form ref={formRef} onSubmit={onSubmitHandler}>
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
                      name="nationalCode"
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
      <UserTable fullPath={Route.fullPath} users={users} />
    </Fragment>
  );
}
