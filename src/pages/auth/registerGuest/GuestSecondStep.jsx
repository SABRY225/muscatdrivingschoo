import {Box,Button,Container,InputLabel,Paper,TextField,Typography,} from "@mui/material";
import React, { useEffect , useRef} from "react";
import { useForm, Controller } from "react-hook-form";
import ReactCodeInput from "react-code-input";
import Navbar from "../../../components/Navbar";
import HeaderSteps from "../../../components/auth/HeaderSteps";
import { useNavigate , useParams} from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import PhoneInput from "react-phone-input-2";

export default function GuestSecondStep() {
  const { register, control,  formState: { errors }, handleSubmit, } = useForm({
    defaultValues: { email: "", phone: "", },
  });
  const { type }         = useParams();
  const input1 = useRef();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = Cookies.get("i18next") || "en";
 

  useEffect(() => {
    window.navigator.geolocation.getCurrentPosition(
      (position) => {
        localStorage.setItem("latitude",  position.coords.latitude);
        localStorage.setItem("longitude", position.coords.longitude);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  async function onSubmit(data) {
    console.log(data.phone);

    closeSnackbar();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/guest/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            phoneNumber: "+" + data.phone,
            language: lang,
            password: input1.current.state.value,
            long:     localStorage.getItem("longitude"),
            lat:      localStorage.getItem("latitude"),
          }),
        }
      );
      const resData = await response.json();
      if(response.status == "201"){
        enqueueSnackbar(
          lang === "ar" ? resData.message.arabic : resData.message.english,
          { variant: "error", autoHideDuration: "8000" }
        );

        localStorage.setItem("guestPhone", resData.data);
        navigate(`/guestRegister/step3/${type}`);
      }
      else if (response.status !== 200 && response.status !== 201) {
        throw new Error("failed occured");
      }

      enqueueSnackbar(
        lang === "ar" ? resData.msg.arabic : resData.msg.english,
        { variant: "success", autoHideDuration: "8000" }
      );

      localStorage.setItem("guestPhone",JSON.stringify( resData.data ) );
      navigate(`/guestRegister/step3/${type}`);
      
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
            
          <Box sx={{ marginBottom: "26px" }}>
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
               <b className="b-pass" sx={{ textAlign: "right !important;" , display:"block", width : "100%"}}> {t("password")} </b>
            </InputLabel>
            <ReactCodeInput type="number" fields={4} ref={input1} />
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
