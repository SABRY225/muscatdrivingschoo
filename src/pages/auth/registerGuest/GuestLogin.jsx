import {Box,Button,Grid,InputLabel,Paper,TextField,Typography,Container,} from "@mui/material";
import React, { useEffect, useRef } from "react";
import Navbar   from "../../../components/Navbar";
import { useForm, Controller } from "react-hook-form";
import ReactCodeInput from "react-code-input";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useState } from "react";
import { loginGuest } from "../../../redux/guestSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import PhoneInput from "react-phone-input-2";

export default function GuestLogin() {
  const dispatch        = useDispatch();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [load, setLoad] = useState(false);
  const { t }           = useTranslation();
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
    console.log(data);

    setLoad(true);
    closeSnackbar();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/guest/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            password      : input1.current.state.value,
            phoneNumber   : "+" + data.phone,
            long          : location?.longitude,
            lat           : location?.latitude,
          }),
        }
      );
      const resData = await response.json();
      if (response.status !== 200 && response.status !== 201) {
        setLoad(false);
        enqueueSnackbar(resData.message, {
          variant: "error",
          autoHideDuration: "8000",
        });
        throw new Error("failed occured");
      }
      localStorage.clear();
      if (resData.role === "guest") {
        dispatch(loginGuest({ token: resData.token, guest: resData.data }));
        navigate("/guest/profile");
      }
      setLoad(false);
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
          <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ marginBottom: "26px" }}>
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
            {t("login")}
          </Typography>

              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
              <b sx={{ textAlign: "right !important;" , display:"block", width : "100%"}}> {t("phone")} </b>
              </InputLabel>
              <Box sx={{ direction: "rtl" }}>
                <Controller
                  name="phone"
                  control={control} render={({ field }) => <PhoneInput {...field} />}
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
          <Box sx={{ marginTop: "40px", marginBottom: "80px", direction: "rtl" }}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" , textAlign:"right !important;" , direction: "ltr" }}>
               <b className="b-pass"> {t("password")} </b>
            </InputLabel>
            <ReactCodeInput type="number" fields={4} ref={input1} />
          </Box>

            <Button
              variant="contained"
              
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
                onClick={() => navigate("/guestRegister/step1")}
              >
                {t("donthaveacount")}
              </Typography>
            </Box>

            <Button variant="contained" color="secondary" fullWidth type="submit" sx={{ textTransform: "capitalize" }}>
              {t("register")}
            </Button>

          </form>
        </Paper>
      </Container>
    </Navbar>
  );
}
