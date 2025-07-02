import { Box, Button, Container, FormControl, FormControlLabel, InputLabel, MenuItem, Paper, Radio, RadioGroup, Select, TextField, Typography, } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PaidIcon from "@mui/icons-material/Paid";
import { useNavigate, useParams } from "react-router-dom";

import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Loading from "../../../components/Loading";
import Cookies from "js-cookie";
import { useLecture } from "../../../hooks/useLecture";
import { convertCurrency } from "../../../utils/convertCurrency";

export default function BookLecture() {
  const lang = Cookies.get("i18next") || "en";
  const { lectureId } = useParams();
  const { data, isLoadingTest } = useLecture(lectureId);
  const [ObjLecture, setLecture] = useState("");
  const { currency } = useSelector((state) => state.currency);
  const { conversionRate } = useSelector((state) => state.conversionRate);
  const { t } = useTranslation();
  const [load, setLoad] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const {
    register, control, formState: { errors }, handleSubmit, reset, watch,
  } = useForm({
    defaultValues: {
      typeLesson: "", date: "", typeofbook: "", price: ObjLecture?.price,
    },
  });

  const { student } = useSelector((state) => state.student);
  const navigate = useNavigate();
  async function onSubmit(data) {
    setLoad(true);
    try {
      closeSnackbar();
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/payment/bookingLecture`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            StudentId: student.id,
            TeacherId: ObjLecture?.TeacherId,
            price: price,
            TeacherLectureId: lectureId,
            currency: currency,
            typeOfPayment: data.typeofbook,
            date: "",
            title: "",
            language: lang,
          }),
        }
      );
      setLoad(false);
      const resData = await response.json();
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
        navigate("/student/lecture");
        enqueueSnackbar(
          lang === "ar" ? resData.msg.arabic : resData.msg.english,
          { variant: "success", autoHideDuration: 8000 }
        );
      } else if (data.typeofbook === "points") {
        navigate("/student/lecture");
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

  const [price, setPrice] = useState(0);

  useEffect(() => {
    if (data?.data) {
      console.log(data?.data);
      setPrice(data.data?.price);
      setLecture(data.data);
    }
  }, [data]);

  const [convertedAmount, setConvertedAmount] = React.useState(null);

  React.useEffect(() => {
    async function fetchConvertedAmount() {
      const result = await convertCurrency(price, data?.data?.currency, currency);
      setConvertedAmount(result);
    }
    fetchConvertedAmount();
  }, [price, currency, data?.data?.currency]);
  return (
    <Navbar>
      <Container sx={{ marginTop: "120px" }}>
        {!ObjLecture && isLoadingTest ? (
          <Loading />
        ) : (
          <Paper sx={{ padding: "30px 20px" }}>
            <Typography sx={{ fontSize: "24px", fontWeight: "600", marginBottom: "24px" }}>
              {t("bookDetails_Lecture")} {(lang == "en") ? ObjLecture?.titleEN : ObjLecture?.titleAR}
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>

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
                    {convertedAmount} {t(currency)}
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
                    {convertedAmount}{" "}
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
