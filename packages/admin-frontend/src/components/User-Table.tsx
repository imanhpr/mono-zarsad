import { Button, Container, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { updateUserSliceActions } from "../store/update-user.slice";
import { useNavigate } from "@tanstack/react-router";
import { BsFillPenFill, BsFileTextFill } from "react-icons/bs";

export default function UserTable({
  users,
  fullPath,
}: {
  users: any;
  fullPath: string;
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <Container dir="rtl" className="mt-5">
      {users.length === 0 ? (
        <div>
          <h3 className="text-center">کاربری برای نمایش وجود ندارد</h3>
        </div>
      ) : (
        <>
          <h2>لیست کاربران</h2>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>نام</th>
                <th>نام خانوادگی</th>
                <th>شماره ملی</th>
                <th>شماره موبایل</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.nationalCode}</td>
                  <td>{user.phoneNumber}</td>
                  <td className="d-flex gap-2">
                    <Button
                      onClick={() => {
                        dispatch(
                          updateUserSliceActions.updateUserRequest(user)
                        );
                        navigate({
                          to: `/user/${user.id}/edit`,
                        });
                      }}
                      variant="secondary"
                    >
                      ویرایش <BsFillPenFill />
                    </Button>
                    <Button
                      onClick={() => {
                        dispatch(
                          updateUserSliceActions.updateUserRequest(user)
                        );
                        navigate({
                          to: `/transaction/history/${user.id}`,
                        });
                      }}
                      variant="warning"
                    >
                      گزارش حساب
                      <BsFileTextFill />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </>
      )}
    </Container>
  );
}
