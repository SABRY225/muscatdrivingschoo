import {
  DialogContent,
  DialogActions,
  InputLabel,
  Button,
  Box,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useSocialMedia } from "../../hooks/useSocialMedia";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";

export default function UpdateSocial({ handleClose, social }) {
  const { token } = useSelector((state) => state.admin);
  const { t } = useTranslation();
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      link: social?.link,
    },
  });
  const { enqueueSnackbar } = useSnackbar();

  const lang = Cookies.get("i18next") || "en";

  async function onSubmit(data) {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/editSocialMedia/${social.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            link: data.link,
          }),
        }
      );
      const secondResponse = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/socialMedia/all`
      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("failed occured");
      }
      const resData = await response.json();
      enqueueSnackbar(
        lang === "ar" ? resData.msg.arabic : resData.msg.english,
        { variant: "success", autoHideDuration: 8000 }
      );
      handleClose();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Box sx={{ width: "500px", maxWidth: "100%", paddingTop: "12px" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ marginBottom: "18px" }}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
              {t("link")}
            </InputLabel>
            <Controller
              name="link"
              control={control}
              render={({ field }) => <TextField {...field} fullWidth />}
              {...register("link", { required: "link Address is required" })}
            />
            {errors.link?.type === "required" && (
              <Typography
                color="error"
                role="alert"
                sx={{ fontSize: "13px", marginTop: "6px" }}
              >
                {t("required")}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("cancel")}</Button>
          <Button type="submit">{t("save")}</Button>
        </DialogActions>
      </form>
    </Box>
  );
}
