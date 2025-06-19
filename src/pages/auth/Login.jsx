import {Box,Button,Grid,InputLabel,Paper,TextField,Typography,Container,} from "@mui/material";
import React, { useEffect, useRef } from "react";
import Navbar from "../../components/Navbar";
import { useForm, Controller } from "react-hook-form";
import ReactCodeInput     from "react-code-input";
import { useNavigate }    from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar }    from "notistack";
import { useState }       from "react";
import { loginTeacher }   from "../../redux/teacherSlice";
import { loginStudent }   from "../../redux/studentSlice";
import { loginParent }    from "../../redux/parentSlice";
import { loginGuest }     from "../../redux/guestSlice";
import { useDispatch }    from "react-redux";
import Cookies from "js-cookie";

export default function Login() {
  const dispatch = useDispatch();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [load, setLoad] = useState(false);
  const { t } = useTranslation();
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
  const lang = Cookies.get("i18next") || "en";
  console.log(lang);
  

  const input1 = useRef();
  const navigate = useNavigate();

  const [location, setLocation] = useState({ latitude: null, longitude: null });

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  async function onSubmit(data) {
    setLoad(true);
    closeSnackbar();
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
            email: data.email,
            lang,
            long: location?.longitude,
            lat: location?.latitude,
          }),
        }
      );
      const resData = await response.json();
      console.log(resData);
      
      if (response.status !== 200 && response.status !== 201) {
        setLoad(false);
        enqueueSnackbar(resData.message, {
          variant: "error",
          autoHideDuration: "8000",
        });
        throw new Error("failed occured");
      }
      localStorage.clear();
      if (resData.role === "teacher") {
        dispatch(loginTeacher({ token: resData.token, teacher: resData.data }));
        navigate("/teacher/dashboard");
      } else if (resData.role === "student") {
        dispatch(loginStudent({ token: resData.token, student: resData.data }));
        navigate("/student/dashboard");
      } else if (resData.role === "parent") {
        dispatch(loginParent({ token: resData.token, parent: resData.data }));
        navigate("/parent");
      }else if(resData.role === "guest") {
        dispatch(loginGuest({ token: resData.token, guest: resData.data }));
        navigate("/parent");
      }
      setLoad(false);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Navbar>
      <Container sx={{ marginTop: "150px" }}>
        <Paper
          sx={{
            width: { md: "450px" },
            padding: "30px 50px",
            margin: "60px auto 60px",
          }}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Typography
              sx={{ fontSize: "28px", fontWeight: "600", marginBottom: "16px" }}
            >
              {t("loginemail")}
            </Typography>
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
                  {t("required")}
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
              color="secondary"
              fullWidth
              type="submit"
              sx={{ textTransform: "capitalize" }}
            >
              {load ? t("login") + "..." : t("login")}
            </Button>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                sx={{
                  marginTop: "40px",
                  fontSize: "15px",
                  textAlign: "center",
                  fontWeight: "700",
                  marginBottom: "20px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/teacherRegister/step1")}
              >
                {t("donthaveacount")}
              </Typography>
              <Typography
                sx={{
                  marginTop: "40px",
                  fontSize: "15px",
                  textAlign: "center",
                  fontWeight: "700",
                  marginBottom: "20px",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/forgetPassword/step1")}
              >
                {t("forgetpassword")}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={4}>
                <Button
                  sx={{ textTransform: "capitalize" }}
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/studentregister/step1")}
                >
                  {t("student")}
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  sx={{ textTransform: "capitalize" }}
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/teacherRegister/step1")}
                >
                  {t("teacher")}
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  sx={{ textTransform: "capitalize" }}
                  variant="outlined"
                  fullWidth
                  onClick={() => navigate("/parent/register")}
                >
                  {t("parent")}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Container>
    </Navbar>
  );
}
