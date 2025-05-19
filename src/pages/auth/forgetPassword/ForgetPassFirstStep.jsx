import {
  Box,
  Button,
  Container,
  InputLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import Navbar from "../../../components/Navbar";
import HeaderSteps from "../../../components/auth/HeaderSteps";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import { useDispatch } from "react-redux";
import { setEmail } from "../../../redux/ForgetPasswordSlice";

export default function ForgetPasswordFirstStep() {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = Cookies.get("i18next") || "en";
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/forgetPassword`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: data.email,
          }),
        }
      );
      const responseData = await response.json();
      if (response.status === 200) {
        const message =
          lang === "en"
            ? "Email sent successfully"
            : "تم ارسال البريد الالكتروني بنجاح";
        enqueueSnackbar(message, {
          variant: "success",
        });
        dispatch(setEmail(data.email));
        navigate("/forgetpassword/step2");
      } else {
        enqueueSnackbar(
          lang === "en"
            ? responseData.message.english
            : responseData.message.arabic,
          {
            variant: "error",
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

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
          <HeaderSteps step={1} title={t("forgetpassword")} steps={3} />
          <form onSubmit={handleSubmit(onSubmit)}>
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
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              type="submit"
              sx={{ textTransform: "capitalize" }}
            >
              {t("submit")}
            </Button>
          </form>
        </Paper>
      </Container>
    </Navbar>
  );
}
