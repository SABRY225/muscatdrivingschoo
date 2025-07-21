import { Box, Button, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, TextField, Typography, } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PaidIcon from "@mui/icons-material/Paid";
import { useNavigate, useParams } from "react-router-dom";
import { useTest } from "../../../hooks/useTest";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Loading from "../../../components/Loading";
import Cookies from "js-cookie";

export default function BookTest() {
  const lang = Cookies.get("i18next") || "en";
  const { testId } = useParams();
  const { data, isLoadingTest } = useTest(testId);
  const [test, setTest] = useState([]);
  const { currency } = useSelector((state) => state.currency);
  const { conversionRate } = useSelector((state) => state.conversionRate);
  const { t } = useTranslation();
  const [load, setLoad] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    if (data?.data) {
      console.log(data.data);
      setPrice(data.data?.price);
      setTest(data.data);
    }
  }, [data]);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm({
    defaultValues: {
      hours: "1", typeLesson: "", date: "", time: "", typeofbook: "",
    },
  });

  const { student } = useSelector((state) => state.student);
  const navigate = useNavigate();
  async function onSubmit(data) {
    setLoad(true);
    try {
      closeSnackbar();
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/payment/bookingTest`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            StudentId: student.id,
            TeacherId: test?.TeacherId,
            price: price,//.toFixed(3),
            TestId: testId,
            currency: currency,
            typeOfPayment: data.typeofbook,
            date: data.date + " * " + data.time,
            title: "",
            language: lang,
            type : "test_booking"

          }),
        }
      );
      setLoad(false);
      const resData = await response.json();
      console.log(resData);
      
      if (response.status !== 200 && response.status !== 201) {
        enqueueSnackbar(resData.message, {
          variant: "error",
          autoHideDuration: 8000,
        });
        throw new Error("failed occured");
      }
      if (resData.status === 400) {
        enqueueSnackbar(
          lang === "ar" ? resData.msg.arabic : resData.msg.english,
          { variant: "error", autoHideDuration: 8000 }
        );
      }
      else if (data.typeofbook === "wallet") {
        navigate("/student/exam");
        enqueueSnackbar(
          lang === "ar" ? resData.msg.arabic : resData.msg.english,
          { variant: "success", autoHideDuration: 8000 }
        );
      } else if (data.typeofbook === "points") {
        navigate("/student/exam");
        enqueueSnackbar(
          lang === "ar" ? resData.msg.arabic : resData.msg.english,
          { variant: "success", autoHideDuration: 8000 }
        );
      }
      else {
        window.location.replace(resData.data);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const [price, setPrice] = useState(test?.price);



  return (
    <Navbar>
      <Container sx={{ marginTop: "120px" }}>
        {!test && isLoadingTest ? (
          <Loading />
        ) : (
          <Paper sx={{ padding: "30px 20px" }}>
            <Typography
              sx={{ fontSize: {md:"24px",xs:"20px"}, fontWeight: "600", marginBottom: "24px" }}
            >
              {t("bookDetails_Test")} {(lang == "en") ? test?.Level?.titleEN : test?.Level?.titleAR}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>

              <Box>

                <Box sx={{ display: "flex", gap: 1 }}>
                  <Box sx={{ marginBottom: "30px", width: "100%" }}>
                    <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                      {t("bookDate")}
                    </InputLabel>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field }) => (
                        <TextField type="date" {...field} fullWidth />
                      )}
                      {...register("date", {
                        required: "date Address is required",
                      })}
                    />
                    {errors.date?.type === "required" && (
                      <Typography
                        color="error"
                        role="alert"
                        sx={{ fontSize: "13px", marginTop: "6px" }}
                      >
                        {t("required")}
                      </Typography>
                    )}
                  </Box>
                  {/* ------------------------------- */}
                  <Box sx={{ marginBottom: "30px", width: "100%" }}>
                    <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                      {t("bookTime")}
                    </InputLabel>
                    <Controller
                      name="time"
                      control={control}
                      render={({ field }) => (
                        <TextField type="time" {...field} fullWidth />
                      )}
                      {...register("time", { required: "time is required", })}
                    />
                    {errors.time?.type === "required" && (
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
              </Box>
              <Box sx={{ marginBottom: "26px" }}>
                <Controller
                  name="typeofbook"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup {...field}>
                      <FormControlLabel
                        value="points"
                        control={<Radio size="2px" />}
                        label={`${t("Buy with points")}`}
                      />
                      <FormControlLabel
                        value="wallet"
                        control={<Radio size="2px" />}
                        label={`${t("credit")} (${t("wallet")})`}
                      />
                      <FormControlLabel
                        value="thawani"
                        control={<Radio size="2px" />}
                        label={t("gateway")}
                      />
                    </RadioGroup>
                  )}
                  {...register("typeofbook", {
                    required: "typeofbook Address is required",
                  })}
                />
                {errors.typeofbook?.type === "required" && (
                  <Typography
                    color="error"
                    role="alert"
                    sx={{ fontSize: "13px", marginTop: "6px" }}>
                    {t("required")}
                  </Typography>
                )}
              </Box>
              <Box sx={{ padding: "20px" }}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "24px",
                  }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "6px",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#005B8E",
                        color: "white",
                        width: "35px",
                        height: "35px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                      }}
                    >
                      <LocalOfferIcon sx={{ fontSize: "15px" }} />
                    </Box>
                    <Typography sx={{ fontSize: "14px" }}>
                      {t("bookPrice")}
                    </Typography>
                  </Box>
                  <Typography>
                    {parseFloat(test?.price * conversionRate).toFixed(2)} {t(currency)}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "14px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      columnGap: "6px",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#005B8E",
                        color: "white",
                        width: "35px",
                        height: "35px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                      }}
                    >
                      <PaidIcon sx={{ fontSize: "15px" }} />
                    </Box>
                    <Typography sx={{ fontSize: "14px" }}>
                      {t("totlalessonPrice")}
                    </Typography>
                  </Box>
                  <Typography>
                    {parseFloat(test?.price * watch("hours") * conversionRate).toFixed(
                      2
                    )}{" "}
                    {t(currency)}
                  </Typography>
                </Box>
              </Box>
              {!load ? (
                <Button fullWidth type="submit" variant="contained">
                  {t("next")}
                </Button>
              ) : (
                <Button fullWidth variant="contained" disabled>
                  {t("next")}...
                </Button>
              )}
            </form>
          </Paper>

        )
        }
      </Container>
    </Navbar>
  );
}
