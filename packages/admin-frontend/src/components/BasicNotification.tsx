import { Fragment } from "react";
import NotificationCard from "./NotificationCard";
import { useAppDispatch, useAppSelector } from "../hooks/redux-hooks";
import { notificationSliceAction } from "../store/notification.slice";

export default function BasicNotification() {
  const notifications = useAppSelector(
    (state) => state.notification.notifications
  );

  const dispatch = useAppDispatch();

  return (
    <Fragment>
      <div
        className="right-10 bottom-5 md:bottom-10 z-40 absolute min-w-80 max-w-1/3"
        dir="rtl"
      >
        <div className="flex flex-col gap-y-2">
          {notifications.map((item) => {
            const timeOutId = setTimeout(() => {
              dispatch(
                notificationSliceAction.removeNotificationByKey(item.id)
              );
            }, item.duration * 1000);

            return (
              <NotificationCard
                key={item.id}
                message={item.message}
                type={item.status}
                onClose={() => {
                  clearTimeout(timeOutId);
                  dispatch(
                    notificationSliceAction.removeNotificationByKey(item.id)
                  );
                }}
              />
            );
          })}
        </div>
      </div>
    </Fragment>
  );
}
