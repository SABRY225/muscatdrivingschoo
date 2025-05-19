import {
  Box,
  Button,
  Container,
  InputLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Navbar from "../../../components/Navbar";
import HeaderSteps from "../../../components/auth/HeaderSteps";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";

const ForgetPassSecondStep = () => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      code: "",
    },
  });

  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = Cookies.get("i18next") || "en";
  const { enqueueSnackbar } = useSnackbar();
  const email = useSelector((state) => state.forgetPassword.email);

  const onSubmit = async (data) => {
    if (!`${data.code}`.match("^[0-9]{4}$")) {
      enqueueSnackbar(t("code_error"), { variant: "error" });
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/forgetPassword/code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            registerCode: data.code,
          }),
        }
      );
      const json = await response.json();
      if (response.status === 200) {
        enqueueSnackbar(lang === "en" ? json.msg.english : json.msg.arabic, {
          variant: "success",
        });
        navigate("/forgetpassword/step3");
      } else {
        enqueueSnackbar(lang === "en" ? json.msg.english : json.msg.arabic, {
          variant: "error",
        });
      }
    } catch (error) {
      enqueueSnackbar(t("code_error"), { variant: "error" });
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
          <HeaderSteps step={2} title={t("enter_code")} steps={3} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("code")}
              </InputLabel>
              <Controller
                name="code"
                control={control}
                render={({ field }) => (
                  <TextField type="text" {...field} fullWidth />
                )}
                {...register("code", {
                  required: "the code is required",
                })}
              />
              {errors.code?.type === "required" && (
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
};

export default ForgetPassSecondStep;
