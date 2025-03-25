import { createFileRoute, notFound } from "@tanstack/react-router";
import { Card, Col, Container, Row, Table } from "react-bootstrap";
import { Fragment } from "react";
import UserWalletTable from "../../../components/UserWalletTable";

export const Route = createFileRoute("/_layout/transaction/history/$userId/")({
  component: RouteComponent,
  async loader(ctx) {
    const userId = ctx.params.userId;
    const userIdNumber = Number.parseInt(userId);
    const userAPI = ctx.context.userAPI;
    const transactionAPI = ctx.context.transactionAPI;

    if (!Number.isFinite(userIdNumber)) throw notFound();

    const usersPromise = userAPI.getUsersByFilter({
      userId: userIdNumber,
      wallet: true,
    });

    const transactionGetResultPromise =
      transactionAPI.getWalletTransactionsByUserId(userIdNumber);
    const [users, transactionGetResult] = await Promise.all([
      usersPromise,
      transactionGetResultPromise,
    ]);
    return { user: users.users[0], transactions: transactionGetResult };
  },
});

function RouteComponent() {
  const { user: userData, transactions } = Route.useLoaderData();

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
                  <Col className="d-flex flex-column">
                    <p>
                      نام :{" "}
                      <span className="fw-bold">{userData.firstName}</span>
                    </p>
                    <p>
                      نام خانوادگی :{" "}
                      <span className="fw-bold">{userData.lastName}</span>
                    </p>
                    <p>
                      شماره ملی :{" "}
                      <span className="fw-bold">{userData.nationalCode}</span>
                    </p>
                    <p>
                      موبایل:{" "}
                      <span className="fw-bold">{userData.phoneNumber}</span>
                    </p>
                    <p>
                      تاریخ ثبت نام :{" "}
                      <span className="fw-bold">{userData.createdAt}</span>
                    </p>
                  </Col>

                  <Col>
                    <UserWalletTable user={userData} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      <Container dir="rtl" className="mt-3">
        <Row>
          <Col>
            <Table className="text-center">
              <thead>
                <tr>
                  <th>شناسه</th>
                  <th>نوع</th>
                  <th>مقدار</th>
                  <th>تاریخ ایجاد</th>
                  <th>منبع</th>
                  <th>ولت</th>
                </tr>
              </thead>
              <tbody>
                {transactions.transactions.map((transaction) => {
                  return (
                    <tr key={transaction.id} className="text-center">
                      <td>{transaction.id}</td>
                      <td>{transaction.type}</td>
                      <td dir="ltr" className="text-center">
                        {transaction.amount}
                      </td>
                      <td>{transaction.createdAt}</td>
                      <td>{transaction.source}</td>
                      <td>{transaction.currencyType.name_farsi}</td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    </Fragment>
  );
}
