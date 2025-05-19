import {
  Box,
  Button,
  Checkbox,
  colors,
  Container,
  FormControlLabel,
  InputLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Navbar from "../../../components/Navbar";
import HeaderSteps from "../../../components/auth/HeaderSteps";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import PhoneInput from "react-phone-input-2";

export default function TeacherFirstStep() {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
      phone: "",
    },
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const lang = Cookies.get("i18next") || "en";
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        localStorage.setItem("latitude", position.coords.latitude);
        localStorage.setItem("longitude", position.coords.longitude);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  async function onSubmit(data) {
    closeSnackbar();

    if (!agreeTerms) {
      enqueueSnackbar(t("pleaseAcceptTerms"), { variant: "error" });
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            phoneNumber: "+" + data.phone,
            lang: lang,
          }),
        }
      );

      const resData = await response.json();
      console.log(resData);
      
      if (resData.status !== 200 && resData.status !== 201) {
        enqueueSnackbar(
          lang === "ar" ? resData.error.arabic : resData.error.english,
          { variant: "error", autoHideDuration: 8000 }
        );
        throw new Error("Failed occurred");
      }

      localStorage.setItem("teacherEmail", data.email);
      navigate("/teacherRegister/step2");
    } catch (err) {
      console.error(err);
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
          <HeaderSteps step={1} title={t("newAccount")} steps={3} />
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* 📧 حقل البريد الإلكتروني */}
            <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("email")}
              </InputLabel>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField type="email" {...field} fullWidth />
                )}
                rules={{
                  required: t("required"),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("invalidEmail"),
                  },
                }}
              />
              {errors.email && (
                <Typography color="error" sx={{ fontSize: "13px", marginTop: "6px" }}>
                  {errors.email.message}
                </Typography>
              )}
            </Box>

            {/* 📞 حقل رقم الهاتف */}
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("phone")}
              </InputLabel>
              <Box sx={{ direction: "rtl" }}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => <PhoneInput {...field} />}
                  rules={{
                    required: t("required"),
                    minLength: {
                      value: 10,
                      message: t("invalidPhone"),
                    },
                    maxLength: {
                      value: 15,
                      message: t("invalidPhone"),
                    },
                    pattern: {
                      value: /^[0-9]+$/,
                      message: t("invalidPhone"),
                    },
                  }}
                />
                {errors.phone && (
                  <Typography color="error" sx={{ fontSize: "13px", marginTop: "6px" }}>
                    {errors.phone.message}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* ✅ الموافقة على الشروط */}
            <Box sx={{ marginBottom: "26px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                  />
                }
                label={t("Terms and Conditions")}
              />

              <div>
                <Link
                  style={{ color: "blue" }}
                  to={"/Terms-Conditions-teacher"}
                >
                  {t("What are the terms and conditions ?")}
                </Link>
              </div>
            </Box>

            {/* 🔘 زر التسجيل */}
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              type="submit"
              sx={{ textTransform: "capitalize" }}
            >
              {t("register")}
            </Button>
          </form>

          {/* 🔗 تسجيل الدخول إذا كان لديه حساب */}
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
          <Button fullWidth variant="contained" onClick={() => navigate("/login")}>
            {t("login")}
          </Button>
        </Paper>
      </Container>
    </Navbar>
  );
}
