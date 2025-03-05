import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";

const DEFAULT_CURRENCY_TYPE_ID = 1;
const intl = new Intl.NumberFormat("fa-IR");

async function getCurrencyPrice(id: number) {
  const response = await (
    await fetch(`http://localhost:3000/currency?currency=${id}`)
  ).json();
  console.log("Loader Response :", response);
  return response;
}
export const Route = createFileRoute("/_layout/currency/")({
  component: RouteComponent,
  loader() {
    return getCurrencyPrice(DEFAULT_CURRENCY_TYPE_ID);
  },
});

function RouteComponent() {
  const [mount, setMount] = useState(false);
  const priceRef = useRef<HTMLInputElement>(null);
  const currencyTypeRef = useRef<HTMLInputElement>(null);
  const [currencyTypeId, setCurrencyTypeId] = useState(
    DEFAULT_CURRENCY_TYPE_ID
  );

  const loaderData = Route.useLoaderData();
  const [data, setData] = useState<any[]>(loaderData);
  console.log(data);
  const tableData = data.map((data) => (
    <tr key={data.id}>
      <td>{data.id}</td>
      <td>{data.currency.name_farsi}</td>
      <td>{data.currency.id}</td>
      <td>{intl.format(data.price)}</td>
      <td>{data.createdAt}</td>
    </tr>
  ));
  useEffect(() => {
    if (mount === false) {
      setMount(true);
      return;
    }
    getCurrencyPrice(currencyTypeId).then((d) => setData(d));
  }, [currencyTypeId, mount]);

  async function formSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
    const price = priceRef.current?.value;
    const currencyId = currencyTypeRef.current?.value;
    const payload = { price, currencyId };

    const response = await fetch("http://localhost:3000/currency", {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
    });
    const json = await response.json();
    setData((d) => {
      const data = [json].concat(d);
      return data;
    });
  }

  return (
    <>
      <Container dir="rtl" className="mt-5">
        <h2>بروزرسانی قیمت ارز ها</h2>
      </Container>

      <Container dir="rtl" className="mt-5">
        <Card>
          <Card.Body>
            <Form onSubmit={formSubmitHandler}>
              <Row>
                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>قیمت</Form.Label>
                    <Form.Control
                      className="text-center"
                      ref={priceRef}
                      type="text"
                    />
                    <Form.Text className="text-muted">
                      قیمت به تومان وارد کنید
                    </Form.Text>
                  </Form.Group>
                </Col>

                <Col>
                  <Form.Group className="mb-3">
                    <Form.Label>ارز</Form.Label>
                    <Form.Control
                      onChange={(e) =>
                        setCurrencyTypeId(parseInt(e.target.value))
                      }
                      ref={currencyTypeRef}
                      type="text"
                      value={currencyTypeId}
                      className="text-center"
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col>
                  <Button variant="primary" type="submit">
                    ثبت
                  </Button>
                </Col>
              </Row>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <Container className="mt-4" dir="rtl">
        <h3>آخرین قیمت های ارز 'x'</h3>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>نام</th>
              <th>شناسه یکتا</th>
              <th>قیمت (تومان)</th>
              <th>تاریخ</th>
            </tr>
          </thead>
          {tableData.length !== 0 && <tbody>{tableData}</tbody>}
        </Table>
        {tableData.length === 0 && (
          <h2 className="text-center">ارز وارد شده اشتباه میباشد.</h2>
        )}
      </Container>
    </>
  );
}
