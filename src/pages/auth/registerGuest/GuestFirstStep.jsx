import { Box,Button,Container,InputLabel,Paper,TextField,  Typography, } from "@mui/material";
import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import PhoneInput from "react-phone-input-2";
import Navbar from "../../../components/Navbar";
import HeaderSteps from "../../../components/auth/HeaderSteps";

export default function GuestFirstStep() {
  const { register, control, formState: { errors }, handleSubmit, } = useForm({
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = Cookies.get("i18next") || "en";

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        localStorage.setItem("latitude", position.coords.latitude);
        localStorage.setItem("longitude", position.coords.longitude);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  async function onSubmit(data) {
    closeSnackbar();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/guest/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email      : data.email,
            phoneNumber: "+" + data.phone,
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
      localStorage.setItem("teacherEmail", data.email);
      navigate("/guestRegister/step2/");
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
            textAlign : "center"
          }}
        >
          <HeaderSteps step={1} title={t("newAccount")} steps={3} />
          <Button
            sx={{
              marginTop: "20px",      marginBottom: "20px",
              marginLeft:"10px",      marginRight:"10px",
              padding : "50px 10px",
              fontSize: "14px",       fontWeight: "700",
              textAlign: "center",
              borderRadius  : "20px",
              cursor  : "pointer",
              width   : "45%",
              display : "inline-flex",
              backgroundColor : "transparent",
              border  :"2px solid #800000",
              color   :"#800000", 
            }}
            variant="contained"
            onClick={() => navigate("/guestRegister/step2/registerAds")}
          >
            {t("registerAds")}
          </Button>

          <Button
            sx={{
              marginTop: "20px",      marginBottom: "20px",
              marginLeft:"10px",      marginRight:"10px",
              padding : "50px 10px",
              fontSize: "14px",       fontWeight: "700",
              borderRadius  : "20px",
              textAlign: "center",
              cursor  : "pointer",
              width   : "45%",
              display : "inline-flex",
              backgroundColor : "transparent",
              border  :"2px solid #800000",
              color   :"#800000", 
            }}
            variant="contained"
            onClick={() => navigate("/guestRegister/step2/registerCareer")}
          >
            {t("registerCareer")}
          </Button>

          <br />
          <br />
            <Typography
            sx={{
              marginTop: "20px",
              fontSize: "14px",
              textAlign: "center",
              fontWeight: "700",
              marginBottom: "20px",
              cursor: "pointer",
            }}
            onClick={() => navigate("/login")}
          >
            {t("haveanaccount")}
          </Typography>
          <Button
             sx={{
              width: "90%",
             }}
            color="secondary"
            variant="contained"
            onClick={() => navigate("/loginGuest")}
          >
            {t("loginGuest")}
          </Button>
        </Paper>
      </Container>
    </Navbar>
  );
}
