import { Table } from "react-bootstrap";

export default function UserWalletTable({ user }: { user: any }) {
  return (
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
  );
}
