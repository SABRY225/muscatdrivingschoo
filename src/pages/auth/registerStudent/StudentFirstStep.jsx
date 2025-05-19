import {
  Autocomplete,
  Box,
  Button,
  Container,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,Typography,} from "@mui/material";
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

export default function StudentFirstStep() {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
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
  const [countryValue, setCountryValue] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [countryError, setCountryError] = useState(false);
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
    if (countryCode === "") {
      setCountryError(true);
      return;
    }
    closeSnackbar();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/student/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            name: data.fullName,
            location: countryCode,
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
      localStorage.setItem("studentEmail", data.email);
      navigate("/studentregister/step2");
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
          <HeaderSteps step={1} title={t("newAccount")} steps={4} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("fullname")}
              </InputLabel>
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <TextField type="text" {...field} fullWidth />
                )}
                {...register("fullName", {
                  required: "fullName Address is required",
                })}
              />
              {errors.fullName?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("email")}
              </InputLabel>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField type="text" {...field} fullWidth />
                )}
                {...register("email", {
                  required: "email Address is required",
                })}
              />
              {errors.email?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("phone")}
              </InputLabel>
              <Box sx={{ direction: "rtl" }}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => <PhoneInput {...field} />}
                  {...register("phone", {
                    required: "Phone Number is required",
                  })}
                />
                {errors.phone?.type === "required" && (
                  <Typography
                    color="error"
                    role="alert"
                    sx={{ fontSize: "13px", marginTop: "6px" }}
                  >
                    {t("required")}
                  </Typography>
                )}
              </Box>
            </Box>
            {/* ------------------- */}
            {/* <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("place")}
              </InputLabel>
              <Controller
                name="place"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    fullWidth
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    MenuProps={{
                      elevation: 1,
                      PaperProps: {
                        style: {
                          maxHeight: 48 * 3 + 8,
                          width: 160,
                        },
                      },
                    }}
                    {...register("place", { required: "place is required" })}
                  >
                    {countries.map((op, index) => {
                      return (
                        <MenuItem key={index + "mjnnj"} value={op.code}>
                          {lang === "en" ? op.name_en : op.name_ar}
                        </MenuItem>
                      );
                    })}
                  </Select>
                )}
              />
              {errors.place?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box> */}
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("country")}
              </InputLabel>
              <Autocomplete
                fullWidth
                name="country"
                options={countries}
                value={countryValue}
                inputValue={countryValue}
                onChange={(event, newInputValue) => {
                  if (newInputValue) {
                    setCountryValue(
                      lang === "en"
                        ? newInputValue?.name_en
                        : newInputValue?.name_ar
                    );
                    setCountryCode(newInputValue?.code);
                    setCountryError(false);
                  } else {
                    setCountryValue("");
                    setCountryCode("");
                  }
                }}
                onInputChange={(event, newInputValue) => {
                  setCountryValue(newInputValue);
                }}
                getOptionLabel={(op) =>
                  (lang === "en" ? op.name_en : op.name_ar) || op
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={lang === "en" ? "Choose a country" : "إختر بلدك"}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                  />
                )}
              />
              {countryError && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
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
          <Button
            fullWidth
            variant="contained"
            onClick={() => navigate("/login")}
          >
            {t("login")}
          </Button>
        </Paper>
      </Container>
    </Navbar>
  );
}
