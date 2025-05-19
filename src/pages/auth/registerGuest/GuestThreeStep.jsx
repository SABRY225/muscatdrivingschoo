import {Box,Button,Container,InputLabel,Paper,TextField,Typography,} from "@mui/material";
import React, { useEffect , useRef, useState} from "react";
import { useForm, Controller } from "react-hook-form";
import ReactCodeInput from "react-code-input";
import Navbar from "../../../components/Navbar";
import HeaderSteps from "../../../components/auth/HeaderSteps";
import { json, useNavigate , useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar }    from "notistack";
import { useDispatch }    from "react-redux";
import { loginGuest }     from "../../../redux/guestSlice";
import Cookies            from "js-cookie";

export default function GuestThreeStep() {
  const {register, control,  formState: { errors },handleSubmit,} = useForm({
    defaultValues: { email: "", phone: "", },
  });
  const dispatch         = useDispatch();
  const { type }         = useParams();
  const input1 = useRef();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const [ GuestID , setGuestID ] = useState("0");
  const navigate = useNavigate();
  const lang = Cookies.get("i18next") || "en";
  
  const getObjectData = localStorage.getItem("guestPhone");
  const userData = JSON.parse( getObjectData );

  async function onSubmit(data) {

    closeSnackbar();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/guest/signup/data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            guestID : userData?.id,
            language: lang,
            name    : data.name,
            email   : data.email,
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

      enqueueSnackbar(
        lang === "ar" ? resData.msg.arabic : resData.msg.english,
        { variant: "success", autoHideDuration: "8000" }
      );

      localStorage.clear();
      dispatch(loginGuest({ token: resData.token, guest: resData.data }));
      navigate("/guest");
      //localStorage.setItem("guestPhone", resData.data.phone);
      //navigate(`/guest/main`);
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
          <HeaderSteps step={2} title={t("newAccount")} steps={3} />
          <form onSubmit={handleSubmit(onSubmit)}>
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
                {...register("name", {  required: "name is required",})}
              />
              {errors.name?.type === "required" && (
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
                {...register("email", {  required: "email is required",})}
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
              {t("register")}
            </Button>
          </form>
          
        </Paper>
      </Container>
    </Navbar>
  );
}
