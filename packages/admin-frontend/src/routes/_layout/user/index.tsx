import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useRef } from "react";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import UserTable from "../../../components/User-Table";

export const Route = createFileRoute("/_layout/user/")({
  component: RouteComponent,
  async loader(ctx) {
    const userAPI = ctx.context.userAPI;
    const result = await userAPI.findLatestUsers();
    return result;
  },
});

function RouteComponent() {
  const users = Route.useLoaderData();
  const formRef = useRef<HTMLFormElement>(null);
  const userAPI = Route.useRouteContext().userAPI;

  function onSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    // TODO: Validation
    userAPI.createNew(data as any).then((r) => console.log(r));
  }

  return (
    <Fragment>
      <Container>
        <h2 dir="rtl" className="mt-5">
          ایجاد کاربر جدید
        </h2>
      </Container>
      <Container dir="rtl" className="mt-5">
        <Card>
          <Card.Body>
            <Form ref={formRef} onSubmit={onSubmitHandler}>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>نام</Form.Label>
                    <Form.Control
                      name="firstName"
                      className="text-center"
                      type="text"
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>نام خانوادگی</Form.Label>
                    <Form.Control
                      name="lastName"
                      className="text-center"
                      type="text"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
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
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>شماره موبایل</Form.Label>
                    <Form.Control
                      name="phoneNumber"
                      className="text-center"
                      type="text"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="primary" type="submit">
                    ایجاد کاربر جدید
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
