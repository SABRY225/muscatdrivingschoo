import {
  Box,
  Button,
  Container,
  InputLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import Navbar from "../../../components/Navbar";
import HeaderSteps from "../../../components/auth/HeaderSteps";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import countries from "../../../data/countries";
import PhoneInput from "react-phone-input-2";
import Autocomplete from "@mui/material/Autocomplete";

export default function StudentFirstStep() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      place: "",
    },
  });

  const { t } = useTranslation();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [countryCode, setCountryCode] = useState("om"); // افتراضي عمان
  const lang = Cookies.get("i18next") || "en";

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        localStorage.setItem("latitude", position.coords.latitude);
        localStorage.setItem("longitude", position.coords.longitude);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const onSubmit = async (data) => {
    if (!countryCode) {
      enqueueSnackbar(t("required"), { variant: "error" });
      return;
    }

    closeSnackbar();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.email,
          name: data.fullName,
          location: countryCode,
          phoneNumber: "+" + data.phone,
          language: lang,
        }),
      });

      const resData = await response.json();

      if (!response.ok) {
        enqueueSnackbar(lang === "ar" ? resData.msg.arabic : resData.msg.english, {
          variant: "error",
          autoHideDuration: 8000,
        });
        return;
      }

      localStorage.setItem("studentEmail", data.email);
      navigate("/studentregister/step2");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Navbar>
      <Container sx={{ marginTop: "110px" }}>
        <Paper
          sx={{
            width: { md: "450px" },
            padding: "30px 50px",
            margin: "60px auto",
          }}
        >
          <HeaderSteps step={1} title={t("newAccount")} steps={4} />

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* الاسم الكامل */}
            <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("fullname")}
              </InputLabel>
              <Controller
                name="fullName"
                control={control}
                rules={{ required: t("required") }}
                render={({ field }) => <TextField {...field} fullWidth />}
              />
              {errors.fullName && (
                <Typography color="error" sx={{ fontSize: "13px", mt: 1 }}>
                  {errors.fullName.message}
                </Typography>
              )}
            </Box>

            {/* البريد الإلكتروني */}
            <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("email")}
              </InputLabel>
              <Controller
                name="email"
                control={control}
                rules={{
                  required: t("required"),
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: t("invalidEmail"),
                  },
                }}
                render={({ field }) => <TextField {...field} fullWidth />}
              />
              {errors.email && (
                <Typography color="error" sx={{ fontSize: "13px", mt: 1 }}>
                  {errors.email.message}
                </Typography>
              )}
            </Box>

            {/* رقم الهاتف */}
            <Box sx={{ marginBottom: "26px"  ,direction: "rtl" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("phone")}
              </InputLabel>
              <Controller
                name="phone"
                control={control}
                rules={{
                  required: t("required"),
                  minLength: { value: 8, message: t("invalidPhone") },
                  maxLength: { value: 15, message: t("invalidPhone") },
                  pattern: {
                    value: /^[0-9]+$/,
                    message: t("invalidPhone"),
                  },
                }}
                render={({ field }) => (
                  <PhoneInput
                    {...field}
                    country="om"
                    enableSearch
                    inputStyle={{ width: "100%" }}
                    onChange={(value, country) => {
                      field.onChange(value);
                      setCountryCode(country.countryCode);
                    }}
                  />
                )}
              />
              {errors.phone && (
                <Typography color="error" sx={{ fontSize: "13px", mt: 1 }}>
                  {errors.phone.message}
                </Typography>
              )}
            </Box>

            {/* الدولة */}
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("country")}
              </InputLabel>
              <Controller
                name="place"
                control={control}
                rules={{ required: t("required") }}
                render={({ field }) => (
                  <Autocomplete
                    options={countries}
                    getOptionLabel={(option) =>
                      lang === "en" ? option.name_en : option.name_ar
                    }
                    onChange={(_, selected) => {
                      field.onChange(selected?.code || "");
                      setCountryCode(selected?.code || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label={t("place")}
                        error={!!errors.place}
                        helperText={errors.place ? errors.place.message : ""}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} style={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={`https://flagcdn.com/w40/${option.code}.png`}
                          alt={option.code}
                          width="30"
                          style={{ marginLeft: 8 }}
                        />
                        <span>{lang === "en" ? option.name_en : option.name_ar}</span>
                      </li>
                    )}
                  />
                )}
              />
            </Box>

            {/* زر التسجيل */}
            <Button type="submit" variant="contained" color="secondary" fullWidth>
              {t("register")}
            </Button>
          </form>

          {/* تسجيل الدخول */}
          <Typography
            sx={{
              marginTop: "20px",
              fontSize: "14px",
              textAlign: "center",
              fontWeight: "700",
              marginBottom: "20px",
            }}
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
