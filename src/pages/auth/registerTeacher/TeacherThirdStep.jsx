import { Box, Button, Container, Paper } from "@mui/material";
import React, { useEffect, useRef } from "react";
import Navbar from "../../../components/Navbar";
import HeaderSteps from "../../../components/auth/HeaderSteps";
import ReactCodeInput from "react-code-input";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { loginTeacher } from "../../../redux/teacherSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

export default function TeacherThirdStep() {
  const dispatch = useDispatch();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const input1 = useRef();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const lang = Cookies.get("i18next") || "en";

  useEffect(() => {
    if (!localStorage.getItem("teacherCode")) {
      navigate("/teacherRegister/step1");
    }
  }, []);

  async function savePassword() {
    closeSnackbar();
    try {
      if (input1.current.state.value.length !== 4) {
        enqueueSnackbar("length should be 4", {
          variant: "error",
          autoHideDuration: "8000",
        });
        throw new Error("failed occured");
      }
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/signup/pass`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password: input1.current.state.value,
            email: localStorage.getItem("teacherEmail"),
            language: lang,
          }),
        }
      );
      const resData = await response.json();
      if (response.status !== 200 && response.status !== 201) {
        enqueueSnackbar(
          lang === "ar" ? resData.message.arabic : resData.message.english,
          { variant: "error", autoHideDuration: "8000" }
        );
        throw new Error("failed occured");
      }
      if (!resData.data.isRegistered) {
        throw new Error("failed occured");
      }
      enqueueSnackbar(
        lang === "ar" ? resData.msg.arabic : resData.msg.english,
        { variant: "success", autoHideDuration: "8000" }
      );
      // ----------------------------
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password: input1.current.state.value,
              email: localStorage.getItem("teacherEmail"),
              long: localStorage.getItem("longitude"),
              lat: localStorage.getItem("latitude"),
            }),
          }
        );
        const resData = await response.json();
        if (response.status !== 200 && response.status !== 201) {
          enqueueSnackbar(resData.message, {
            variant: "error",
            autoHideDuration: "8000",
          });
          throw new Error("failed occured");
        }
        localStorage.clear();
        dispatch(loginTeacher({ token: resData.token, teacher: resData.data }));
        navigate("/teacher/about");
      } catch (error) {
        console.log(error);
      }
      // ----------------------------
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Navbar>
      <Container sx={{ marginTop: "110px" }}>
        <Paper
          sx={{
            width: { md: "450px" },
            padding: "30px 50px",
            margin: "60px auto 60px",
          }}
        >
          <HeaderSteps step={3} title={t("enterpassword")} steps={3} />
          <Box
            sx={{ marginTop: "40px", marginBottom: "80px", direction: "rtl" }}
          >
            <ReactCodeInput type="number" fields={4} ref={input1} />
          </Box>
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            type="submit"
            sx={{ textTransform: "capitalize" }}
            onClick={savePassword}
          >
            {t("savepassword")}
          </Button>
        </Paper>
      </Container>
    </Navbar>
  );
}
