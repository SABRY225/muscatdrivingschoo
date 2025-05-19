import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import {
  Box,
  Button,
  Container,
  InputLabel,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import HeaderSteps from "../../../components/auth/HeaderSteps";
import { loginTeacher } from "../../../redux/teacherSlice";
import { loginStudent } from "../../../redux/studentSlice";

const ForgetPassThirdStep = () => {
  const {
    register,
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const lang = Cookies.get("i18next") || "en";
  const { enqueueSnackbar } = useSnackbar();
  const email = useSelector((state) => state.forgetPassword.email);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      enqueueSnackbar(t("password_missMach"), { variant: "error" });
      reset({ password: "", confirmPassword: "" });
      return;
    }
    if (`${data.password}`.length < 4) {
      enqueueSnackbar(
        lang === "en"
          ? "password should be at least 4 characters"
          : "كلمة المرور يجب ان تكون على الأقل 4 حرف",
        {
          variant: "error",
        }
      );
      reset({ password: "", confirmPassword: "" });
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/forgetPassword/edit`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email,
            password: data.password,
          }),
        }
      );
      const json = await response.json();
      if (response.status === 200) {
        enqueueSnackbar(lang === "en" ? json.msg.english : json.msg.arabic, {
          variant: "success",
        });
        localStorage.clear();
        if (json.role === "teacher") {
          dispatch(loginTeacher({ token: json.token, teacher: json.data }));
          navigate("/teacher/about");
        } else if (json.role === "student") {
          dispatch(loginStudent({ token: json.token, student: json.data }));
          navigate("/");
        } else {
          navigate("/login");
        }
      } else {
        enqueueSnackbar(
          lang === "en" ? json.message.english : json.message.arabic,
          {
            variant: "error",
          }
        );
      }
    } catch (error) {
      enqueueSnackbar("something went wrong, please try another time", {
        variant: "error",
      });
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
          <HeaderSteps step={3} title={t("enterpassword")} steps={3} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("newPassword")}
              </InputLabel>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField type="password" {...field} fullWidth />
                )}
                {...register("password", {
                  required: "password is required",
                })}
              />
              {errors.password?.type === "required" && (
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
                {t("confirmPassword")}
              </InputLabel>
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField type="password" {...field} fullWidth />
                )}
                {...register("confirmPassword", {
                  required: "password is required",
                })}
              />
              {errors.confirmPassword?.type === "required" && (
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

export default ForgetPassThirdStep;
