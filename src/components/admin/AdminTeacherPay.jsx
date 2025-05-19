import { Box, Button, InputLabel, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";

export default function AdminTeacherPay({ id }) {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const lang = Cookies.get("i18next") || "en";
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      amount: "",
    },
  });
  const [load, setLoad] = useState(false);

  const { token } = useSelector((state) => state.admin);
  async function onSubmit(data) {
    closeSnackbar();
    setLoad(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/pay`,
        {
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({ price: +data.amount, TeacherId: id }),
        }
      );
      setLoad(false);
      const resData = await response.json();
      if (response.status !== 200 && response.status !== 201) {
        enqueueSnackbar(
          lang === "ar" ? resData.msg.arabic : resData.msg.english,
          { variant: "error", autoHideDuration: "8000" }
        );
        throw new Error("failed occured");
      }
      enqueueSnackbar(
        lang === "ar" ? resData.msg.arabic : resData.msg.english,
        { variant: "success", autoHideDuration: "8000" }
      );
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Box>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ marginBottom: "18px" }}>
          <InputLabel sx={{ marginBottom: "10px", fontSize: "14px" }}>
            {t("amount")}
          </InputLabel>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => <TextField {...field} fullWidth />}
            {...register("amount", { required: "amount Address is required" })}
          />
          {errors.amount?.type === "required" && (
            <Typography
              color="error"
              role="alert"
              sx={{ fontSize: "13px", marginTop: "6px" }}
            >
              {t("required")}
            </Typography>
          )}
        </Box>
        {!load ? (
          <Button type="submit" variant="contained">
            {t("pay")}
          </Button>
        ) : (
          <Button variant="contained">{t("pay")}...</Button>
        )}
      </form>
    </Box>
  );
}
