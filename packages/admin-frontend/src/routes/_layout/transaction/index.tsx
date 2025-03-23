import { createFileRoute } from "@tanstack/react-router";
import { Fragment, useCallback, useEffect, useReducer, useState } from "react";
import {
  Button,
  Card,
  Col,
  Container,
  Form,
  Row,
  Table,
} from "react-bootstrap";
import { debounce, isNil } from "es-toolkit";
import Select from "react-select";
import { numberToWords } from "@persian-tools/persian-tools";
import { isNumericString } from "../../../helper";

export const Route = createFileRoute("/_layout/transaction/")({
  component: RouteComponent,
  async loader(ctx) {
    const transactionApi = ctx.context.transactionAPI;
    const result = await transactionApi.setupTransactionPage();
    return result.transactionTypes as { type: string; nameFa: string }[];
  },
});

function RouteComponent() {
  const intLocal = new Intl.NumberFormat("fa-IR");

  const [transactionType, setTransactionType] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<number | null>(null);
  const [priceValue, setPriceValue] = useState("");
  const [nationalCode, setNationalCode] = useState("");
  const [user, setUser] = useState<object | null>(null);

  const routeData = Route.useLoaderData();
  const optionsList = routeData.map((obj) => ({
    value: obj.type,
    label: obj.nameFa,
  }));

  const userAPI = Route.useRouteContext({ select: (t) => t.userAPI });
  const transactionAPI = Route.useRouteContext({
    select: (t) => t.transactionAPI,
  });

  const userFilterD = useCallback(
    () =>
      debounce((code: string) => {
        userAPI
          .getUsersByFilter({ nationalCode: code, wallet: true })
          .then((u) => {
            const user = u.users[0];
            setUser(user);
          });
      }, 600),
    [userAPI]
  );

  function sumbitHandler(e: React.FormEvent) {
    e.preventDefault();
    // TODO: fix error handling
    if (isNil(user)) return;

    if (transactionType === null) throw new Error("Set Transaction Type");
    if (walletId === null) throw new Error("Please set wallet Id");
    transactionAPI
      .createTransaction(walletId, priceValue.toString(), transactionType)
      .then((result) => {
        const walletIndex = user.wallets.findIndex(
          (v) => v.id === result.wallet.id
        );
        setUser((u) => {
          const user = structuredClone(u)!;
          user.wallets[walletIndex].amount = result.wallet.amount;
          return user;
        });
      });
  }
  useEffect(() => {
    if (nationalCode === "") return;
    const fn = userFilterD();
    fn(nationalCode);
    return () => fn.cancel();
  }, [nationalCode, userFilterD]);

  return (
    <Fragment>
      <Container dir="rtl" className="mt-5">
        <Row>
          <Col>
            <h2>تراکنش جدید</h2>
          </Col>
        </Row>
        <Row></Row>
      </Container>

      <Container dir="rtl" className="mt-5">
        <Row>
          <Card>
            <Card.Body>
              <div>
                <h6>جستجو کاربر</h6>
              </div>
              <Form.Group>
                <Form.Label>کد ملی</Form.Label>
                <Form.Control
                  type="text"
                  onChange={(e) => setNationalCode(e.target.value)}
                  value={nationalCode}
                ></Form.Control>
              </Form.Group>
            </Card.Body>
          </Card>
        </Row>
        {user && (
          <Row className="mt-2">
            <Card>
              <Card.Body>
                <Row>
                  <Col>
                    <div className="d-flex flex-column gap-3">
                      <Table striped bordered hover>
                        <thead>
                          <tr>
                            <th>نام فیلد</th>
                            <th>مقدار</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>شناسه کاربری</td>
                            <td>{user.id}</td>
                          </tr>
                          <tr>
                            <td>نام</td>
                            <td>{user.firstName}</td>
                          </tr>
                          <tr>
                            <td>نام خانوادگی</td>
                            <td>{user.lastName}</td>
                          </tr>
                          <tr>
                            <td>کد ملی</td>
                            <td>{user.nationalCode}</td>
                          </tr>
                          <tr>
                            <td>موبایل</td>
                            <td>{user.phoneNumber}</td>
                          </tr>
                          <tr>
                            <td>اعتبار منفی</td>
                            <td>
                              {user.profile.debtPrem ? (
                                <span className="text-success">فعال</span>
                              ) : (
                                <span className="text-danger">غیرفعال</span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </div>
                  </Col>
                  <Col>
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>شناسه ولت</th>
                          <th>ولت</th>
                          <th>مقدار</th>
                        </tr>
                      </thead>
                      <tbody>
                        {user.wallets.map((wallet) => {
                          return (
                            <tr key={wallet.id}>
                              <td>{wallet.id}</td>
                              <td>{wallet.currencyType.name_farsi}</td>
                              <td>{wallet.amount}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </Col>
                </Row>
                <hr />
                <Form onSubmit={sumbitHandler}>
                  <Row>
                    <Col>
                      <Form.Group>
                        <Form.Label>نوع تراکنش</Form.Label>
                        <Select
                          options={optionsList}
                          onChange={(e) => {
                            if (e?.value) return setTransactionType(e.value);
                            setTransactionType(null);
                          }}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>ولت</Form.Label>
                        <Select
                          options={user.wallets.map((wallet) => ({
                            value: wallet.id,
                            label: wallet.currencyType.name_farsi,
                          }))}
                          onChange={(e) => setWalletId(parseInt(e.value))}
                        />
                      </Form.Group>
                    </Col>
                    <Col>
                      <Form.Group>
                        <Form.Label>مقدار</Form.Label>
                        <Form.Control
                          value={priceValue}
                          onChange={(e) => {
                            if (e.target.value === "") return setPriceValue("");
                            if (
                              e.target.value &&
                              isNumericString(e.target.value)
                            )
                              setPriceValue(e.target.value);
                          }}
                          type="text"
                        ></Form.Control>
                        {priceValue !== "" &&
                          Number.isSafeInteger(parseFloat(priceValue)) && (
                            <Form.Text muted>
                              {numberToWords(priceValue).toString()} تومان -{" "}
                              {intLocal.format(parseInt(priceValue))}
                            </Form.Text>
                          )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button className="mt-2" type="submit">
                    ثبت تراکنش
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Row>
        )}
        {!user && (
          <Row className="mt-2">
            <Card>
              <Card.Body>کاربری یافت نشد</Card.Body>
            </Card>
          </Row>
        )}
      </Container>
    </Fragment>
  );
}
