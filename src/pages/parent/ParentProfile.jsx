import React, { useEffect, useState } from "react";
import {
  Grid,
  InputLabel,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import ParentLayout from "../../components/parent/ParentLayout";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import Cookies from "js-cookie";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSnackbar } from "notistack";
import { changeParentName } from "../../redux/parentSlice";
import { useParent } from "../../hooks/useParent";

export default function ParentProfile() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const lang = Cookies.get("i18next") || "en";
  const dispatch = useDispatch();

  const { parent, token } = useSelector((s) => s.parent);
  const { data, isLoading } = useParent(parent?.id, token);
  const [loading, setLoading] = useState(false);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (data) {
      const user = data.data;
      reset({
        name: user?.name || "",
        phone: user?.phone || "",
        email: user?.email || "",
      });
    }
  }, [data, reset]);

  const onSubmit = async (formData) => {
    closeSnackbar();
    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/parent/editProfile/${parent.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
          }),
        }
      );

      const result = await response.json();

      if (result.status !== 200 && result.status !== 201) {
        throw new Error("Failed to update profile");
      }

      dispatch(changeParentName({ name: formData.name }));
      enqueueSnackbar(
        lang === "ar" ? result.msg.arabic : result.msg.english,
        { variant: "success", autoHideDuration: 5000 }
      );
    } catch (error) {
      enqueueSnackbar(t("An error occurred"), {
        variant: "error",
        autoHideDuration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParentLayout>
      <Paper sx={{ padding: 4 }}>
        <Typography variant="h5" fontWeight={600} mb={4}>
          {t("personalInformation")}
        </Typography>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <InputLabel sx={{ mb: 1 }}>{t("fullname")}</InputLabel>
              <Controller
                name="name"
                control={control}
                rules={{ required: t("required") }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors.name ? errors.name.message : ""}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <InputLabel sx={{ mb: 1 }}>{t("phone")}</InputLabel>
              <Box sx={{ direction: lang === "ar" ? "rtl" : "ltr" }}>
                <Controller
                  name="phone"
                  control={control}
                  rules={{ required: t("required") }}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      inputStyle={{ width: "100%" }}
                      country={"om"}
                    />
                  )}
                />
              </Box>
              {errors.phone && (
                <Typography
                  variant="caption"
                  color="error"
                  sx={{ mt: 1, display: "block" }}
                >
                  {errors.phone.message}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <InputLabel sx={{ mb: 1 }}>{t("email")}</InputLabel>
              <TextField
                fullWidth
                disabled
                {...register("email")}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="secondary"
                disabled={loading}
                sx={{ minWidth: 150 }}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "#fff" }} />
                ) : (
                  t("save")
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </ParentLayout>
  );
}
