import {
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../../../components/Navbar";
import "react-datepicker/dist/react-datepicker.css";
import { useTranslation } from "react-i18next";
import { useForm, Controller } from "react-hook-form";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PaidIcon from "@mui/icons-material/Paid";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import { convertCurrency } from "../../../utils/convertCurrency";
import { useSingleTeacher } from "../../../hooks/useSingleTeacher";

export default function DetailsBook() {
  const lang = Cookies.get("i18next") || "en";
  const { teacherId } = useParams();
  const { currency } = useSelector((state) => state.currency);
  const { data } = useSingleTeacher(teacherId, currency);
  const { t } = useTranslation();

  const [load, setLoad] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const [availableDays, setAvailableDays] = useState([]);

  useEffect(() => {
    const fetchAvailableDays = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/${teacherId}/days`);
        const data = await res.json();
        console.log(data);
        
        setAvailableDays(data);
      } catch (error) {
        console.error("Error fetching available days:", error);
      }
    };
  
    fetchAvailableDays();
  }, [teacherId]);
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm({
    defaultValues: {
      hours: "1",
      typeLesson: "online",
      date: "",
      time: "",
      typeofbook: "",
    },
  });

  const { student } = useSelector((state) => state.student);
  const navigate = useNavigate();


  const [price, setPrice] = useState(0);
  const hour = watch("hours");
  const [convertedAmount, setConvertedAmount] = React.useState(0);
  // console.log(data?.data);
  
  useEffect(() => {
    const typeLesson = watch("typeLesson");
    const selectedHours = watch("hours");
    // console.log(typeLesson);
    
  
    let basePrice = 0;
    if (typeLesson === "online") {
      basePrice = data?.data?.RemoteSession?.price -(data?.data?.RemoteSession?.price*(data?.data?.RemoteSession?.discount/100)) || 0;
    } else if (typeLesson === "student") {
      basePrice = +data?.data?.F2FSessionStd?.price -(data?.data?.F2FSessionStd?.price*(data?.data?.F2FSessionStd?.discount/100)) || 0;
    } else if (typeLesson === "teacher") {
      basePrice = data?.data?.F2FSessionTeacher?.price -(data?.data?.F2FSessionTeacher?.price*(data?.data?.F2FSessionTeacher?.discount/100)) || 0;
    }
  
    const totalBasePrice = basePrice * selectedHours;
    // console.log("basePrice : ", basePrice);
    // console.log("totalBasePrice : ", totalBasePrice);
  
    if (totalBasePrice > 0) {
      const fetchConvertedAmount = async () => {
        const result = await convertCurrency(
          totalBasePrice,
          typeLesson === "student"?data?.data?.F2FSessionStd?.currency:data?.data?.F2FSessionTeacher?.currency,
          currency
        );
        // console.log(data?.data?.RemoteSession?.currency);
        
        setPrice(result/hour);
        setConvertedAmount(result)
      };
      
      fetchConvertedAmount();
    }
  
  }, [watch("typeLesson"), watch("hours"), currency, data?.data?.RemoteSession?.currency]);
  

  async function onSubmit(data) {
    setLoad(true);
    const result = await convertCurrency(convertedAmount, currency, "OMR");
    try {
      closeSnackbar();
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/lesson/create-request`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: student.id,
            studentName:student.name,
            lang,
            teacherId: teacherId,
            price: Number(result),
            currency: "OMR",
            period: data.hours,
            date: data.date + "T" + data.time,
            type: data.typeLesson,
          }),
        }
      );
      setLoad(false);
      const resData = await response.json();
      
      if (response.status !== 200 && response.status !== 201) {
        enqueueSnackbar(lang === "ar" ? resData.message.arabic : resData.message.english, {
          variant: "error",
          autoHideDuration: 8000,
        });
        console.log(response);
        throw new Error("failed occurred");
      } else {
        enqueueSnackbar(lang === "ar" ? resData.message.arabic : resData.message.english, {
          variant: "success",
          autoHideDuration: 8000,
        });
        navigate(`/student/request-lesson`);
      }
    } catch (err) {
      console.log(err);
      enqueueSnackbar(t("failed occurred"), {
        variant: "error",
        autoHideDuration: 8000,
      });
    }
  }
  return (
    <Navbar>
      <Container sx={{ marginY: "100px" }}>
        <Paper sx={{ padding: "30px 20px" }}>
          <Typography
            sx={{ fontSize: "24px", fontWeight: "600", marginBottom: "24px" }}
          >
            {t("bookDetails")}
          </Typography>
          <Box sx={{ marginBottom: "26px" }}>
  <Typography sx={{ marginBottom: "15px", fontWeight: 500 }}>
    {t("The teacher's available times")}
  </Typography>

  {availableDays.length > 0 ? (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {availableDays.map((slot, index) => (
        <Paper
          key={slot.id}
          sx={{
            padding: 2,
            backgroundColor: "#f9f9f9",
            border: "1px solid #ccc",
            borderRadius: 2,
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>
            {lang === "ar" ? slot.day.titleAR : slot.day.titleEN}
          </Typography>
          <Typography variant="body2">
            {slot.from} - {slot.to}
          </Typography>
        </Paper>
      ))}
    </Box>
  ) : (
    <Typography variant="body2">{t("Unfortunately, there are no fixed appointments for the teacher.")}</Typography>
  )}
</Box>


          <form onSubmit={handleSubmit(onSubmit)}>
            <Box>
              <Box sx={{ marginBottom: "26px" }}>
                <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                  {t("hours")}
                </InputLabel>
                <Controller
                  name="hours"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        {...register("hours", {
                          required: "hours is required",
                        })}
                      >
                        {[...Array(9).keys()].map((num, index) => {
                          return <MenuItem value={num + 1}>{num + 1}</MenuItem>;
                        })}
                      </Select>
                    </FormControl>
                  )}
                />
                {errors.hours?.type === "required" && (
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
            <Box>
              <Box sx={{ marginBottom: "26px" }}>
                <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                  {t("lessonType")}
                </InputLabel>
                <Controller
                  name="typeLesson"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        {...register("typeLesson", {
                          required: "type is required",
                        })}
                      >
                        {data?.data.RemoteSession && (
                          <MenuItem value={"online"}>
                            {lang === "ar" ? "عن بعد" : "online"}
                          </MenuItem>
                        )}
                        {data?.data.F2FSessionStd && (
                          <MenuItem value={"student"}>
                            {lang === "ar" ? "في منزل الطالب" : "Student home"}
                          </MenuItem>
                        )}
                        {data?.data.F2FSessionTeacher && (
                          <MenuItem value={"teacher"}>
                            {lang === "ar" ? "في منزل المعلم" : "Teacher home"}
                          </MenuItem>
                        )}
                      </Select>
                    </FormControl>
                  )}
                />
                {errors.typeLesson?.type === "required" && (
                  <Typography
                    color="error"
                    role="alert"
                    sx={{ fontSize: "13px", marginTop: "6px" }}
                  >
                    {t("required")}
                  </Typography>
                )}
              </Box>
              <Box sx={{ display: "flex", gap: 3 }}>
                {/* موعد الحجز */}
                <Box sx={{ marginBottom: "30px", width: "100%" }}>
                  <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                    {t("lessonDate")}
                  </InputLabel>
                  <Controller
                    name="date"
                    control={control}
                    render={({ field }) => (
                      <TextField type="date" {...field} fullWidth />
                    )}
                    {...register("date", {
                      required: "date is required",
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
                    {t("lessonTime")}
                  </InputLabel>
                  <Controller
                    name="time"
                    control={control}
                    render={({ field }) => (
                      <TextField type="time" {...field} fullWidth />
                    )}
                    {...register("time", {
                      required: "time is required",
                    })}
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
          
            <Box sx={{ padding: "20px" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "24px",
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
                    <LocalOfferIcon sx={{ fontSize: "15px" }} />
                  </Box>
                  <Typography sx={{ fontSize: "14px" }}>
                    {t("lessonPrice")}
                  </Typography>
                </Box>
                <Typography>
                  {price.toFixed(2)}{" "}{t(currency)}
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
                  {convertedAmount }{" "}{t(currency)}
                </Typography>
              </Box>
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
