import {
  Box,
  Button,
  Grid,
  InputLabel,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Navbar from "../../components/Navbar";
import { loginParent } from "../../redux/parentSlice";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import ReactCodeInput from "react-code-input";

export default function ParentRegister() {
  const { t } = useTranslation();
  const lang = Cookies.get("i18next") || "en";
  const input1 = useRef();

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
    },
  });

  const navigate = useNavigate();

  async function onSubmit(data) {
    closeSnackbar();
    if (input1.current.state.value.length !== 4) {
      enqueueSnackbar(
        lang == "en"
          ? "password is a required field"
          : "الرجاء ادخال الرقم السري",
        {
          variant: "error",
          autoHideDuration: "8000",
        }
      );
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/parent/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
            password: input1.current.state.value,
            name: data.name,
          }),
        }
      );
      const resData = await response.json();
      if (response.status !== 200 && response.status !== 201) {
        enqueueSnackbar(
          lang == "en" ? resData.message.english : resData.message.arabic,
          {
            variant: "error",
            autoHideDuration: "8000",
          }
        );
        throw new Error("failed occured");
      }
      dispatch(loginParent({ parent: resData.data, token: resData.token }));
      enqueueSnackbar("success", {
        variant: "success",
        autoHideDuration: "8000",
      });
      navigate("/parent");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Navbar>
      <Container sx={{ marginTop: "120px" }}>
        <Paper
          sx={{
            width: { md: "450px" },
            padding: "30px 50px",
            margin: "60px auto",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography
              sx={{
                fontSize: "28px",
                fontWeight: "600",
                marginBottom: "22px",
                textAlign: "center",
              }}
            >
              {t("register")}
            </Typography>
            <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("name")}
              </InputLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField type="text" {...field} fullWidth />
                )}
                {...register("name", { required: "name Address is required" })}
              />
              {errors.name?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  this field is required
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
                  <TextField type="email" {...field} fullWidth />
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
                  this field is required
                </Typography>
              )}
            </Box>
            <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("password")}
              </InputLabel>
              <Box sx={{ direction: "rtl" }}>
                <ReactCodeInput type="number" fields={4} ref={input1} />
              </Box>
            </Box>
            <Button
              variant="contained"
              fullWidth
              type="submit"
              sx={{ textTransform: "capitalize" }}
            >
              {t("register")}
            </Button>
          </form>
        </Paper>
      </Container>
    </Navbar>
  );
}
