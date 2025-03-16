import React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { Card, Form, Button } from "react-bootstrap";
import { adminLoginAuthPayloadSchema } from "../../schema";
import { useDispatch } from "react-redux";
import { userAuthActions } from "../../store/auth.slice";

export const Route = createFileRoute("/auth/login/")({
  component: RouteComponent,
});

function RouteComponent() {
  const formRef = useRef<HTMLFormElement>(null);
  const authApi = Route.useRouteContext({ select: (s) => s.authAPI });
  const dispatch = useDispatch();
  const navigation = Route.useNavigate();

  async function formOnSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
    // TODO: Add proper error handling
    if (formRef.current === null) return;
    const formData = new FormData(formRef.current);
    const rawPayload = Object.fromEntries(formData);
    // TODO: add error handling
    const result = adminLoginAuthPayloadSchema.parse(rawPayload);
    const token = await authApi.login(result);
    const user = await authApi.me(token);
    dispatch(userAuthActions.setAccessToken(token));
    dispatch(userAuthActions.setUser(user));
    navigation({ from: Route.fullPath, to: "/", replace: true });
  }
  return (
    <div
      dir="rtl"
      className="d-flex align-items-center justify-content-center h-100"
    >
      <Card>
        <Card.Header>ورود</Card.Header>
        <Card.Body>
          <Form onSubmit={formOnSubmitHandler} ref={formRef}>
            <Form.Group>
              <Form.Label>نام کاربری</Form.Label>
              <Form.Control name="username" dir="ltr" type="text" />
            </Form.Group>

            <Form.Group>
              <Form.Label>رمز عبور</Form.Label>
              <Form.Control name="password" dir="ltr" type="password" />
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
