import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Container, styled, Box, Typography, Paper , Button} from "@mui/material";
import NotificationsActiveOutlinedIcon from "@mui/icons-material/NotificationsActiveOutlined";
import { collection, query, onSnapshot, where, doc , updateDoc , arrayRemove , deleteDoc} from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { format } from "timeago.js";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import DeleteIcon from "@mui/icons-material/Delete";

const Wrapper = styled(Box)({display: "flex",  columnGap: "10px",  justifyContent: "center",});

const IconWrapper = styled(Box)({
  width: "55px",
  height: "55px",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

export default function TeacherNotifications() {
  const { t } = useTranslation();
  const { teacher, token } = useSelector((s) => s.teacher);
  const lang = Cookies.get("i18next") || "en";
  const [notifications, setNotifications]   = useState([]);
  const { closeSnackbar, enqueueSnackbar }  = useSnackbar();
  async function getAllNotifocation() {
    const q = query(
      collection(db, "Notifications"),
      where("TeacherId", "==", `${teacher.id}`)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let conv = [];
      querySnapshot.forEach((doc) => {
        conv.push({ ...doc.data(), id: doc.id });
      });
      setNotifications(conv);
    });
    return () => unsubscribe();
  }
  useEffect(() => {
    getAllNotifocation();
  }, [teacher]);

  useEffect(() => {
    async function updateNotification() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/teacher/updateNotification/${teacher.id}`,
          {
            headers: {
              Authorization: token,
              "Content-Type": "application/json",
            },
            method: "PUT",
          }
        );
        const resData = await response.json();
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("failed occured");
        }
      } catch (err) {
        console.log(err);
      }
    }
    setTimeout(() => {
      updateNotification();
    }, 5000);
  }, [teacher, token]);

  // Added by eng.reem.shwky@gmail.com
  const handleDelete = async (itemToDelete) => {
    console.log("Delete ID : ");
    console.log(itemToDelete);
    console.log(itemToDelete.id);

    closeSnackbar();
    const isConfirmed = window.confirm(t("confirm_dangerous_action"));
    if (!isConfirmed) return;

    
    try {
      await deleteDoc(doc(db, "Notifications", itemToDelete?.id))
      enqueueSnackbar( t("success_message") , { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
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
        { notifications.length > 0 ?
          notifications.map((not) => {
            return (
              <Wrapper sx={{ marginBottom: "35px" }} key={not.id}>
                <IconWrapper
                  sx={{backgroundColor: !not.seen ? "#e66b4c47" : "#40c0dc33",}}>
                  <NotificationsActiveOutlinedIcon
                    sx={{
                      color: "black",
                      fontSize: "26px",
                      transform: "rotate(45deg)",
                    }}
                  />
                </IconWrapper>
                <Box sx={{ width: "90%" }}>
                  <Typography
                    sx={{
                      fontSize: "15px",
                      color: "#303030",
                      fontWeight: "400",marginBottom: "8px",}}>
                    {lang === "en" ? not.titleEn : not.titleAR}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "13px",
                      color: "#949494",
                      fontWeight: "500",
                    }}
                  >
                    {typeof not?.date !== "undefined" && format(not?.date)}
                  </Typography>

                    <Button color="error"
                            onClick={() => handleDelete(not)}>
                      <DeleteIcon /> {t("delete")}
                    </Button>

                </Box>
              </Wrapper>
            );
          }):
          <p class="notfound">{t("notfound_notification")}</p>
        }
      </Container>
    </Navbar>
  );
}
