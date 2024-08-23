import React, { useEffect, useState, useCallback, useRef } from "react";
import classNames from "classnames";
import withHeaderItem from "utils/hoc/withHeaderItem";
import {
  Avatar,
  Dropdown,
  ScrollBar,
  Spinner,
  Badge,
  Button,
  Tooltip,
} from "components/ui";
import {
  HiOutlineBell,
  HiOutlineCalendar,
  HiOutlineClipboardCheck,
  HiOutlineBan,
  HiOutlineMailOpen,
} from "react-icons/hi";
import {
  apiGetNotificationList,
  apiGetNotificationCount,
  getApi,
  postApi,
} from "services/CommonService";
import { Link, useNavigate } from "react-router-dom";
import isLastChild from "utils/isLastChild";
import useTwColorByName from "utils/hooks/useTwColorByName";
import useThemeClass from "utils/hooks/useThemeClass";
import { useSelector } from "react-redux";
import useResponsive from "utils/hooks/useResponsive";
import acronym from "utils/acronym";
import { APIS } from "constants/api.constant";
import dayjs from "dayjs";
import { DATE_TIME_FORMAT } from "constants/app.constant";

const notificationHeight = "h-72";
const imagePath = "/img/avatars/";

const GeneratedAvatar = ({ target }) => {
  const color = useTwColorByName();
  return (
    <Avatar shape="circle" className={`${color(target)}`}>
      {acronym(target)}
    </Avatar>
  );
};

const notificationTypeAvatar = (data) => {
  const { type, target, image, status } = data;
  switch (type) {
    case 0:
      if (image) {
        return <Avatar shape="circle" src={`${imagePath}${image}`} />;
      } else {
        return <GeneratedAvatar target={target} />;
      }
    case 1:
      return (
        <Avatar
          shape="circle"
          className="bg-blue-100 text-blue-600 dark:bg-blue-500/20 dark:text-blue-100"
          icon={<HiOutlineCalendar />}
        />
      );
    case 2:
      const statusSucceed = status === "succeed";
      const statusColor = statusSucceed
        ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100"
        : "bg-red-100 text-red-600 dark:bg-red-500/20 dark:text-red-100";
      const statusIcon = statusSucceed ? (
        <HiOutlineClipboardCheck />
      ) : (
        <HiOutlineBan />
      );
      return (
        <Avatar shape="circle" className={statusColor} icon={statusIcon} />
      );
    default:
      return <Avatar />;
  }
};
const ADMIN_NOTIFICATION_TYPE = {
  ECOM_ORDER: 1,
  SERVICE_ORDER: 2,
  CANCEL_REQUEST: 3,
  PATIENT_ADD: 4,
  PROVIDER_ADD: 5,
  STAFF_ADD: 6,
  FEEDBACK_ADD: 7,
  CUSTOMER_QUERY_ADD: 8,
  PRODUCT_QUANTITY_LESS: 9,
};

const NotificationToggle = ({ className, content }) => {
  return (
    <div className={classNames("text-2xl", className)}>
      {content ? (
        <Badge badgeStyle={{ top: "3px", right: "6px" }} content={content}>
          <HiOutlineBell />
        </Badge>
      ) : (
        <HiOutlineBell />
      )}
    </div>
  );
};

export const Notification = ({ className }) => {
  const [notificationList, setNotificationList] = useState([]);
  const listInnerRef = useRef();
  const [currPage, setCurrPage] = useState(0);
  const [prevPage, setPrevPage] = useState(0);
  const [lastList, setLastList] = useState(false);
  const [count, setCount] = useState();
  const [noResult, setNoResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { bgTheme } = useThemeClass();

  const { larger } = useResponsive();

  const direction = useSelector((state) => state.theme.direction);

  const navigationHandler = (type, id) => {
    switch (type) {
      case ADMIN_NOTIFICATION_TYPE.ECOM_ORDER:
        navigate(`/app/orderManagement/ecom-order/view/${id}`);
        break;
      case ADMIN_NOTIFICATION_TYPE.SERVICE_ORDER:
        navigate(`/app/service-order/view/${id}`);
        break;
      case ADMIN_NOTIFICATION_TYPE.CANCEL_REQUEST:
        navigate(`/app/order-management/cancel-request/order-reply/${id}`);
        break;
      case ADMIN_NOTIFICATION_TYPE.PATIENT_ADD:
        navigate(`/app/patient/edit/${id}`);
        break;
      case ADMIN_NOTIFICATION_TYPE.PROVIDER_ADD:
        navigate(`/app/provider/edit/${id}`);
        break;
      case ADMIN_NOTIFICATION_TYPE.STAFF_ADD:
        navigate(`/app/staff/edit/${id}`);
        break;
      case ADMIN_NOTIFICATION_TYPE.FEEDBACK_ADD:
        navigate(`/app/users-feedback`);
        break;
      case ADMIN_NOTIFICATION_TYPE.CUSTOMER_QUERY_ADD:
        navigate(`/app/contact-queries`);
        break;
      case ADMIN_NOTIFICATION_TYPE.PRODUCT_QUANTITY_LESS:
        navigate(`/app/products/edit/${id}`);
        break;
      default:
        return false;
    }
  };

  const fetchNotifications = () => {
    // setLoading(true);
    // getApi(APIS.GET_NOTIFICATION, { limit: 10, skip: currPage * 10 }) // Pass limit and skip as parameters
    //   .then((res) => {
    //     setLoading(false);
    //     setNoResult(false);
    //     setCount(res?.data?.unread);
    //     setNotificationList((prevList) => [...prevList, ...res?.data?.data]);
    //     if (res?.data?.count === 0) {
    //       setNoResult(true);
    //     }
    //     if (!res.data.data.length) {
    //       setLastList(true);
    //       return;
    //     }
    //     setPrevPage(currPage);
    //   })
    //   .finally(() => {
    //     setLoading(false);
    //   });
  };
  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 60000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!lastList && prevPage !== currPage) {
      fetchNotifications();
    }
  }, [currPage, lastList, prevPage]);
  const onScroll = () => {
    if (listInnerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = listInnerRef.current;
      if (scrollTop + clientHeight === scrollHeight) {
        setCurrPage(currPage + 1);
      }
    }
  };
  // const onMarkAllAsRead = useCallback(() => {
  //   const list = notificationList.map((item) => {
  //     if (!item.readed) {
  //       item.readed = true;
  //     }
  //     return item;
  //   });
  //   setNotificationList(list);
  //   setUnreadNotification(false);
  // }, [notificationList]);

  const onMarkAsRead = (id) => {
    const list = notificationList.map((item) => {
      if (item.id === id) {
        console.log();
        postApi(APIS.UNREAD_NOTIFICATION, { id });
        navigationHandler(item?.type, item?.recordId);
      }
      return item;
    });
    setNotificationList(list);
  };

  return (
    <Dropdown
      renderTitle={<NotificationToggle content={count} className={className} />}
      menuClass="p-0 min-w-[280px] md:min-w-[540px]"
      placement={larger.md ? "bottom-end" : "bottom-center"}
      onOpen={fetchNotifications}
    >
      <Dropdown.Item variant="header">
        <div className="border-b border-gray-200 dark:border-gray-600 px-4 py-2 flex items-center justify-between">
          <h6>Notifications</h6>
          <Tooltip title="Mark all as read">
            {/* <Button
              variant="plain"
              shape="circle"
              size="sm"
              icon={<HiOutlineMailOpen className="text-xl" />}
              // onClick={onMarkAllAsRead}
            /> */}
          </Tooltip>
        </div>
      </Dropdown.Item>
      <div
        ref={listInnerRef}
        onScroll={onScroll}
        className={classNames("overflow-y-auto", notificationHeight)}
      >
        {/* <ScrollBar direction={direction}> */}
        {notificationList.length > 0 &&
          notificationList.map((item, index) => (
            <Dropdown.Item
              key={item.id}
              className={` relative flex px-4 py-4 cursor-pointer hover:bg-gray-50 active:bg-gray-100 dark:hover:bg-black dark:hover:bg-opacity-20  ${
                !isLastChild(notificationList, index)
                  ? "border-b border-gray-200 dark:border-gray-600"
                  : ""
              }`}
              onClick={() => onMarkAsRead(item.id)}
            >
              {/* <div>{notificationTypeAvatar(item)}</div> */}
              <div className="ltr:ml-3 rtl:mr-3 ">
                <div>
                  {item.title && (
                    <div className="font-semibold heading-text">
                      {item.title}{" "}
                    </div>
                  )}
                  <p>{item.body}</p>
                </div>
                <div className="text-xs">
                  {dayjs(item.createdAt).format(DATE_TIME_FORMAT)}
                </div>
              </div>
              <Badge
                className="absolute top-4 ltr:right-4 rtl:left-4 mt-1.5"
                innerClass={`${item.isRead === 1 ? "bg-gray-300" : bgTheme} `}
              />
            </Dropdown.Item>
          ))}
        {loading && (
          <div
            className={classNames(
              "flex items-center justify-center",
              notificationHeight
            )}
          >
            <Spinner size={40} />
          </div>
        )}
        {noResult && (
          <div
            className={classNames(
              "flex items-center justify-center",
              notificationHeight
            )}
          >
            <div className="text-center">
              <img
                className="mx-auto mb-2 max-w-[150px]"
                src="/img/others/no-notification.png"
                alt="no-notification"
              />
              <h6 className="font-semibold">No notifications!</h6>
              <p className="mt-1">Please Try again later</p>
            </div>
          </div>
        )}
        {/* </ScrollBar> */}
      </div>
      {/* <Dropdown.Item variant="header">
        <div className="flex justify-center border-t border-gray-200 dark:border-gray-600 px-4 py-2">
          <Link
            to="/app/account/activity-log"
            className="font-semibold cursor-pointer p-2 px-3 text-gray-600 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
          >
            View All Activity
          </Link>
        </div>
      </Dropdown.Item> */}
    </Dropdown>
  );
};

export default withHeaderItem(Notification);
