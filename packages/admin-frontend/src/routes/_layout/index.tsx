import { createFileRoute } from "@tanstack/react-router";
import { Card, Col, Container, Row, Table } from "react-bootstrap";

import { BsBag, BsEnvelope, BsFillPersonFill } from "react-icons/bs";
import LineChart from "../../components/Line-Chart";
import { useSelector } from "react-redux";

const intl = new Intl.NumberFormat("fa-IR");

export const Route = createFileRoute("/_layout/")({
  component: Index,
  async loader() {
    const response = fetch("http://localhost:3000/currency?currency=1");
    const result = await Promise.all([response]);
    const json = await Promise.all([result[0].json()]);
    return [json[0].toReversed()];
  },
});

function Index() {
  const navigate = Route.useNavigate();
  const user = useSelector<unknown | undefined>(
    (state) => state?.userAuth?.currentUser
  );
  if (!user) navigate({ from: Route.fullPath, to: "/auth/login" });

  const [loaderData] = Route.useLoaderData();
  console.log(loaderData);
  const data = loaderData.map((data) => data.price);
  const labels = loaderData.map((data) => data.createdAt);
  const lastUpdate = loaderData[loaderData.length - 1];

  return (
    <>
      <Container dir="rtl" className="mt-5">
        <Row>
          <Col>
            <h2>به پنل مدیریتی زرصــاد خوش آمدید</h2>
          </Col>
        </Row>
      </Container>
      <Container dir="rtl" className="mt-5">
        <Row className="gap-2 gap-md-0">
          <Col md={6}>
            <Card>
              <Card.Header>
                <h6 className="mb-0">طلا آب شده</h6>
              </Card.Header>
              <Card.Body>
                <div></div>
                <div className="d-flex flex-column text-center">
                  <Table>
                    <thead>
                      <tr>
                        <th>توضیحات</th>
                        <th>قیمت (تومان)</th>
                        <th>تاریخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr></tr>
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Header>
                <h6 className="mb-0">سکه</h6>
              </Card.Header>
              <Card.Body>
                <LineChart
                  data={data}
                  label="طلا آب شده"
                  labels={labels}
                  backgroundColor="rgb(255, 232, 161)"
                  borderColor="rgb(255, 182, 47)"
                />
                <div className="d-flex flex-column text-center">
                  <Table>
                    <thead>
                      <tr>
                        <th>توضیحات</th>
                        <th>قیمت (تومان)</th>
                        <th>تاریخ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>آخرین قیمت</td>
                        <td>{intl.format(lastUpdate.price)}</td>
                        <td>{lastUpdate.createdAt}</td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <Container dir="rtl" className="mt-3">
        <Row className="gap-3 gap-md-0">
          <Col xs={12} md={4}>
            <Card>
              <Card.Body className="d-flex align-items-center justify-content-around">
                <BsFillPersonFill size={64} color="rgb(26, 139, 177)" />
                <div>
                  <p className="mb-0">تعداد کاربران</p>
                  <p className="mb-0 text-center">32</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card>
              <Card.Body className="d-flex align-items-center justify-content-around">
                <BsEnvelope size={64} color="rgb(142, 185, 48)" />
                <div>
                  <p className="mb-0">پیام ها</p>
                  <p className="mb-0 text-center">132</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col xs={12} md={4}>
            <Card>
              <Card.Body className="d-flex align-items-center justify-content-around">
                <BsBag size={64} color="rgb(79, 102, 197)(26, 139, 177)" />
                <div>
                  <p className="mb-0">سفارش ها</p>
                  <p className="mb-0 text-center">32</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
