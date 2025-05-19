import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../components/admin/AdminLayout";
import TeacherLayout from "../../components/admin/TeacherLayout";
import { Box, Button, InputLabel, TextField, Typography , Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { useTeacher } from "../../hooks/useTeacher";
import { Controller, useForm } from "react-hook-form";
import StepperButtons from "../../components/reusableUi/StepperButtons";

const AdminEditTeacherDescription = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { token } = useSelector((state) => state.admin);
  const { data } = useTeacher(teacherId);
  const [load, setLoad] = useState(false);

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      headline_ar: "",
      headline_en: "",
      description_ar: "",
      description_en: "",
    },
  });
  useEffect(() => {
    if (data) {
      const user = data?.data;
      reset({
        headline_ar: user?.shortHeadlineAr,
        headline_en: user?.shortHeadlineEn,
        description_ar: user?.descriptionAr,
        description_en: user?.descriptionEn,
      });
    }
  }, [data]);

  async function onSubmit(data) {
    try {
      setLoad(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/edit/teacher/description/${teacherId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            shortHeadlineAr: data.headline_ar,
            shortHeadlineEn: data.headline_en,
            descriptionAr: data.description_ar,
            descriptionEn: data.description_en,
          }),
        }
      );
      const resData = await response.json();
      enqueueSnackbar(t("update_success"), {
        variant: "success",
        autoHideDuration: 1000,
      });
      navigate("/admin/edit/teacher/video/" + teacherId);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AdminLayout>
      <Box sx={{marginTop:"-100px"}}>
      <TeacherLayout active={6} title={t("Description")}>
      <Paper sx={{ width: "100%", padding: "20px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ width: { md: "500px", xs: "100%" } }}>
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("headAr")}
              </InputLabel>
              <Controller
                name="headline_ar"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth />}
                {...register("headline_ar", {
                  required: "headline_ar Address is required",
                })}
              />
              {errors.headline_ar?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("descAr")}
              </InputLabel>
              <Controller
                name="description_ar"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("description_ar", {
                  required: "description_ar Address is required",
                })}
              />
              {errors.description_ar?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("headEn")}
              </InputLabel>
              <Controller
                name="headline_en"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth />}
                {...register("headline_en", {
                  required: "headline_en Address is required",
                })}
              />
              {errors.headline_en?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("descEn")}
              </InputLabel>
              <Controller
                name="description_en"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("description_en", {
                  required: "description_ar Address is required",
                })}
              />
              {errors.description_en?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: "flex", gap: "12px" }}>
              <StepperButtons skipLink="video" load={load} />
              <Button
                sx={{ textTransform: "capitalize", marginTop: "40px" }}
                variant="outlined"
                onClick={() =>
                  navigate("/admin/edit/teacher/video/" + teacherId)
                }
              >
                {t("skip")}
              </Button>
            </Box>
          </Box>
        </form>
        </Paper>
      </TeacherLayout>
      </Box>
    </AdminLayout>
  );
};

export default AdminEditTeacherDescription;
