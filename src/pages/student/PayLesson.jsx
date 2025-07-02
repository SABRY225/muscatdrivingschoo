import {
  Box,
  Button,
  Container,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import Navbar from "../../components/Navbar";
import { useRequestLessonById } from "../../hooks/useRequestLessionById";
import Loading from "../../components/Loading";
import axios from "axios";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

export default function PayLesson() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { student } = useSelector((state) => state.student);

  const [load, setLoad] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { data, isLoading } = useRequestLessonById(id);
  const [lession, setlession] = useState([]);
  const { conversionRate } = useSelector((state) => state.conversionRate);
  const { currency }                  = useSelector((state) => state.currency);
    const lang                          = Cookies.get("i18next") || "en";
  

  useEffect(() => {
    if (data) {
      setlession(data?.data);
    }
  }, [data]);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      hours: "1",
      typeLesson: "online",
      date: "",
      time: "",
      typeofbook: "",
    },
  });

  async function onSubmit(data) {
    setLoad(true);
    closeSnackbar();
    try {
      const tmpData = {
        StudentId: lession?.studentId,
        TeacherId: lession?.teacher.id,
        lessionRequestId: id,
        price: lession?.price,
        currency: "OMR",
        typeOfPayment: data.typeofbook,
        period: lession?.period,
        date: lession?.date,
        type: lession?.type,
        title: "Lesson Booking",
      };
      const response = await axios.post(`${process.env.REACT_APP_API_KEY}api/v1/payment/booking`, tmpData);
      const resData = await response.data;
      setLoad(false);
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
        navigate("/student/lessons");
        enqueueSnackbar(
          lang === "ar" ? resData.msg.arabic : resData.msg.english,
          { variant: "success", autoHideDuration: 8000 }
        );
      } else if (data.typeofbook === "points") {
        navigate("/student/lessons");
        enqueueSnackbar(
          lang === "ar" ? resData.msg.arabic : resData.msg.english,
          { variant: "success", autoHideDuration: 8000 }
        );
      }
      else {
        window.location.replace(resData.data);
      }
    } catch (err) {
      setLoad(false);
      const message = t(err.response?.data.msg);
      enqueueSnackbar(t(message), {
        variant: "error",
        autoHideDuration: 5000,
      });
    }
  }

  return (
    <Navbar>
      <Container sx={{ marginY: "100px" }}>
        <Paper sx={{ padding: "30px 20px" }}>
          <Typography
            sx={{ fontSize: "24px", fontWeight: "600", marginBottom: "24px", textAlign: "center" }}
          >
            {t("bookDetails")}
          </Typography>

          {!isLoading ? (
            <>
            

              {/* INVOICE SECTION */}
              <Box sx={{ mt: 4, borderTop: "2px solid #ddd", pt: 3 }}>
                {/* <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>{t("invoice")}</Typography> */}

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography>{t("Student Name")}:</Typography>
                  <Typography>{lession.student?.name}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography>{t("Teacher Name")}:</Typography>
                  <Typography>{lession.teacher?.firstName} {lession.teacher?.lastName}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography>{t("Type")}:</Typography>
                  <Typography>{t("Session with the coach")}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography>{t("Session number")}:</Typography>
                  <Typography>{lession?.period}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography>{t("day")}:</Typography>
                  <Typography>{new Date(lession?.date).toLocaleDateString()}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                  <Typography>{t("Time")}:</Typography>
                  <Typography>{new Date(lession?.date).toLocaleTimeString()}</Typography>
                </Box>

                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2, pt: 2, borderTop: "1px dashed #ccc" }}>
                  <Typography variant="h6">{t("price")}:</Typography>
                  <Typography variant="h6" sx={{ color: "#1976d2" }}>
                    {parseFloat(lession?.price * conversionRate).toFixed(
                    2
                  )}
                  {" "}
                  {t(currency)}
                  </Typography>
                </Box>
              </Box>
            </>
          ) : (
            <><Loading /></>
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ marginBottom: "26px" }}>
              <Controller
                name="typeofbook"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <FormControlLabel value="points" control={<Radio size="2px" />} label={t("Buy with points")} />
                    <FormControlLabel value="wallet" control={<Radio size="2px" />} label={`${t("credit")} (${t("wallet")})`} />
                    <FormControlLabel value="thawani" control={<Radio size="2px" />} label={t("gateway")} />
                  </RadioGroup>
                )}
                {...register("typeofbook", { required: "typeofbook Address is required" })}
              />
              {errors.typeofbook?.type === "required" && (
                <Typography color="error" role="alert" sx={{ fontSize: "13px", marginTop: "6px" }}>
                  {t("required")}
                </Typography>
              )}
            </Box>

            {!load ? (
              <Button fullWidth type="submit" variant="contained">
                {t("next")}
              </Button>
            ) : (
              <Button fullWidth variant="contained">
                {t("next")}...
              </Button>
            )}
          </form>
        </Paper>
      </Container>
    </Navbar>
  );
}
