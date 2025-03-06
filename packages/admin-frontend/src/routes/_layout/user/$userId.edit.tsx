import { createFileRoute } from "@tanstack/react-router";
import { Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IUser } from "../../../types";
import { updateUserSliceActions } from "../../../store/update-user.slice";

export const Route = createFileRoute("/_layout/user/$userId/edit")({
  component: RouteComponent,
});

function RouteComponent() {
  const formRef = useRef<HTMLFormElement>(null);
  const dispatch = useDispatch();
  const user: IUser = useSelector((state: any) => state.updateUser.user);
  const [firstLoad, setFirstLoad] = useState(true);
  const [userDebt, setUserDebt] = useState(user?.profile?.debtPrem);
  const userAPI = Route.useRouteContext().userAPI;

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      return;
    }
    return () => {
      dispatch(updateUserSliceActions.clearUser());
    };
  }, [firstLoad, dispatch]);

  function onSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    const data: Record<string, any> = Object.fromEntries(
      new FormData(form).entries()
    );
    if (data.debtPrem) data.debtPrem = true;
    else data.debtPrem = false;
    console.log(data);
    userAPI
      .updateUserById(user.id, data)
      .then((v) => console.log("result:", v));
  }

  if (!user)
    return (
      <Container className="h-100">
        <div
          dir="rtl"
          className="d-flex align-items-center justify-content-center h-100"
        >
          <h4>کاربری یافت نشد.</h4>
        </div>
      </Container>
    );

  return (
    <Fragment>
      <Container dir="rtl" className="mt-5">
        <h2>ویرایش کاربر</h2>
      </Container>

      <Container dir="rtl" className="mt-5">
        <Card>
          <Card.Body>
            <Form onSubmit={onSubmitHandler} ref={formRef}>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>نام</Form.Label>
                    <Form.Control
                      name="firstName"
                      className="text-center"
                      type="text"
                      defaultValue={user.firstName}
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
                      defaultValue={user.lastName}
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
                      defaultValue={user.nationalCode}
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
                      defaultValue={user.phoneNumber}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>تاریخ ثبت نام</Form.Label>
                    <Form.Control
                      disabled
                      className="text-center"
                      type="text"
                      defaultValue={user.createdAt}
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="">
                    <Form.Label>دسترسی ها</Form.Label>
                    <Form.Check
                      name="debtPrem"
                      onChange={() => setUserDebt((prev) => !prev)}
                      type="checkbox"
                      label={
                        <>
                          اعتبار منفی -{" "}
                          <span
                            className={
                              userDebt ? "text-success" : "text-danger"
                            }
                          >
                            {userDebt ? "فعال" : "غیرفعال"}
                          </span>
                        </>
                      }
                      defaultChecked={userDebt}
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="warning" type="submit">
                    ویرایش
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </Fragment>
  );
}
