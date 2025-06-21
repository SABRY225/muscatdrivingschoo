import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Container, styled, Box, Typography, Paper, IconButton, Button } from "@mui/material";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { format } from "timeago.js";
import { useTranslation } from "react-i18next";

const Wrapper = styled(Box)({
  display: "flex",
  columnGap: "10px",
  justifyContent: "space-between",
  alignItems: "center",
});

const IconWrapper = styled(Box)({
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export default function TeacherNotifications() {
  const { teacher, token } = useSelector((s) => s.teacher);
  const lang = Cookies.get("i18next") || "en";
  const [notifications, setNotifications] = useState([]);
  const { t } = useTranslation();

  // Fetch Notifications
  useEffect(() => {
    async function getNotifications() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/notification/${teacher.id}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
          }
        );
        const data = await res.json();
        setNotifications(data.data.notifications || []); 
      } catch (error) {
        console.error(error);
      }
    }
    if (teacher?.id) {
      getNotifications();
    }
  }, [teacher, token]);

  // Read notification
  const handleReadNotification = async (id) => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/notification/read/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      setNotifications((prev) =>
        prev.map((not) =>
          not.id === id ? { ...not, isRead: true } : not
        )
      );
    } catch (error) {
      console.error(error);
    }
  };

  // Delete notification
  const handleDeleteNotification = async (id) => {
    try {
      await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/notification/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
        }
      );
      setNotifications((prev) => prev.filter((not) => not.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Navbar>
      <Container
        sx={{
          marginBottom: "60px",
          marginTop: "120px",
          padding: "40px 20px 20px",
        }}
        component={Paper}
      >
        {notifications.length > 0 ? (
          notifications.map((not) => (
            <Wrapper sx={{ marginBottom: "35px" }} key={not.id}>
              <Box sx={{ display: "flex", alignItems: "center", columnGap: "10px", flexGrow: 1 }}>
                <IconWrapper
                  sx={{
                    backgroundColor: !not.isRead? "#e66b4c47" : "#40c0dc33",
                  }}
                >
                  <NotificationsActiveOutlinedIcon
                    sx={{
                      color: "black",
                      fontSize: "26px",
                      transform: "rotate(45deg)",
                    }}
                  />
                </IconWrapper>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      color: "#303030",
                      fontWeight: "400",
                      marginBottom: "8px",
                    }}
                  >
                    {lang === "en" ? not.messageEn : not.messageAr}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#949494",
                      fontWeight: "500",
                    }}
                  >
                    {typeof not?.createdAt !== "undefined" && new Date(not?.createdAt).toLocaleString()}
                  </Typography>

                  {!not.isRead && (
                    <Button
                      variant="outlined"
                      size="small"
                      sx={{ marginTop: "8px" }}
                      onClick={() => handleReadNotification(not.id)}
                    >
                      {t("Mark as Read")}
                    </Button>
                  )}
                </Box>
              </Box>

              <IconButton onClick={() => handleDeleteNotification(not.id)}>
                <DeleteOutlineIcon sx={{ color: "#c62828" }} />
              </IconButton>
            </Wrapper>
          ))
        ) : (
          <>{t("There are currently no messages available")}</>
        )}
      </Container>
    </Navbar>
  );
}
