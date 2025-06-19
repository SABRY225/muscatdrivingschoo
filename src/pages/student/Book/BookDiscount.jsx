import {Box,Button,Container,FormControl,FormControlLabel,InputLabel,MenuItem,Paper,Radio,RadioGroup,Select,TextField,   Typography,} from "@mui/material";
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
import { useDiscount } from "../../../hooks/useDiscount";

export default function BookDiscount() {
  const lang                          = Cookies.get("i18next") || "en";
  const { discountId }                = useParams();
  console.log(discountId);

  const { data , isLoadingPackage}    = useDiscount(discountId);
  const [ objDiscount , setDiscount]  = useState("");
  const { currency }                  = useSelector((state) => state.currency);
  const { conversionRate }            = useSelector((state) => state.conversionRate);
  const { t } = useTranslation();
  const [load, setLoad] = useState(false);
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const {
    register, control,  formState: { errors }, handleSubmit, reset,  watch,
  } = useForm({
    defaultValues: {
      typeLesson: "",   date: "",   typeofbook: "", price : objDiscount?.price,
    },
  });

  const { student } = useSelector((state) => state.student);
  const navigate = useNavigate();
  async function onSubmit(data) {
    setLoad(true);
    try {
      closeSnackbar();
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/payment/bookingDiscount`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            StudentId     : student.id,
            TeacherId     : objDiscount?.TeacherId,
            price         : price,//.toFixed(3),
            DiscountId  :discountId,
            currency      : currency,
            typeOfPayment : data.typeofbook,
            date          : "",
            title         : "",
            language      : lang,
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
      if (data.typeofbook === "wallet") {
        navigate("/student/discounts");
        enqueueSnackbar(
          lang === "ar" ? resData.msg.arabic : resData.msg.english,
          { variant: "success", autoHideDuration: 8000 }
        );
      } else {
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
      setPrice(data.data?.amountAfterDiscount);
      setDiscount(data.data);
    }
   
  }, [data] );

  return ( 
    <Navbar>
      <Container sx={{ marginTop: "120px" }}>
      { !objDiscount && isLoadingPackage ? ( 
        <Loading />
        ) : (
        <Paper sx={{ padding: "30px 20px" }}>
          <Typography sx={{ fontSize: "24px", fontWeight: "600", marginBottom: "24px" }}>
            {t("bookDetails_Discount")} { (lang=="en") ? objDiscount?.titleEN : objDiscount?.titleAR}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            
            <Box sx={{ marginBottom: "26px" }}>
              <Controller name="typeofbook" control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
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
                  {parseFloat(objDiscount?.amountAfterDiscount * conversionRate).toFixed(2)} {currency}
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
                  {parseFloat(objDiscount?.amountAfterDiscount * conversionRate).toFixed(
                    2
                  )}{" "}
                  {currency}
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
