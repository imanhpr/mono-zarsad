import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";

export const Route = createFileRoute("/_layout/transaction/history/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <Fragment>
      <Container>
        <Container dir="rtl" className="mt-5">
          <h2>گزارش حساب کاربری</h2>
        </Container>
      </Container>

      <Container dir="rtl" className="mt-5">
        <Row>
          <Col>
            <Card>
              <Card.Body>
                <Row>
                  <Col className="d-flex">sss</Col>
                  <Col></Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}
