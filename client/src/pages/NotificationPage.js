import { message, Tabs, Button, Card, Space, Typography } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hideLoading, showLoading } from "../redux/features/alertSlice";
import { setUser } from "../redux/features/userSlice";
import Layout from "./../components/Layout";

const { Text } = Typography;

const NotificationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  const [refreshNotifications, setRefreshNotifications] = useState(false);

  // Handle Mark All Read
  const handleMarkAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/user/get-all-notification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        const unreadNotifications = res.data.notifications
          ? res.data.notifications.filter((notification) => !notification.isRead)
          : [];
        updateNotificationsInStore(unreadNotifications);
        setRefreshNotifications(!refreshNotifications);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("Something Went Wrong");
    }
  };

  // Handle Delete All Read
  const handleDeleteAllRead = async () => {
    try {
      dispatch(showLoading());
      const res = await axios.post(
        "/api/user/delete-all-notification",
        { userId: user._id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (res.data.success) {
        const updatedNotifications = res.data.notifications || [];
        const updatedUser = {
          ...user,
          notification: updatedNotifications.filter((notification) => !notification.isRead),
          seennotification: updatedNotifications.filter((notification) => notification.isRead),
        };
        dispatch(setUser(updatedUser));
        setRefreshNotifications(!refreshNotifications);
        message.success(res.data.message);
      } else {
        message.error(res.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      message.error("Something Went Wrong");
    }
  };

  const updateNotificationsInStore = (notifications) => {
    const updatedUser = { ...user, notification: [], seennotification: [] };
    notifications.forEach((notification) => {
      if (notification.isRead) {
        updatedUser.seennotification.push(notification);
      } else {
        updatedUser.notification.push(notification);
      }
    });
    dispatch(setUser(updatedUser));
  };

  return (
    <Layout>
      <div style={{ padding: '24px', backgroundColor: '#fff', borderRadius: '8px' }}>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>Notifications</Typography.Title>

        <Tabs defaultActiveKey="0" size="large">
          <Tabs.TabPane tab="New" key="0">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="primary" onClick={handleMarkAllRead} block>
                Mark All Read
              </Button>
              {user?.notification?.length > 0 ? (
                user.notification.map((notification) => (
                  <Card
                    key={notification._id}
                    hoverable
                    style={{ marginBottom: '16px' }}
                    onClick={() => navigate(notification.onClickPath)}
                  >
                    <Text>{notification.message}</Text>
                  </Card>
                ))
              ) : (
                <Text type="secondary" style={{ textAlign: 'center' }}>You have no new notifications.</Text>
              )}
            </Space>
          </Tabs.TabPane>

          <Tabs.TabPane tab="Read" key="1">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button type="danger" onClick={handleDeleteAllRead} block>
                Delete All Read
              </Button>
              {user?.seennotification?.length > 0 ? (
                user.seennotification.map((notification) => (
                  <Card
                    key={notification._id}
                    hoverable
                    style={{ marginBottom: '16px' }}
                    onClick={() => navigate(notification.onClickPath)}
                  >
                    <Text>{notification.message}</Text>
                  </Card>
                ))
              ) : (
                <Text type="secondary" style={{ textAlign: 'center' }}>You have no read notifications.</Text>
              )}
            </Space>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </Layout>
  );
};

export default NotificationPage;
