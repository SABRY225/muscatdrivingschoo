import React from "react";
import Navbar from "../../components/Navbar";
import TeacherLayout from "../../components/teacher/TeacherLayout";
import { Controller, useForm } from "react-hook-form";
import { Box, InputLabel, TextField, Typography ,Paper } from "@mui/material";
import StepperButtons from "../../components/reusableUi/StepperButtons";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";
import { useTeacher } from "../../hooks/useTeacher";
import { useEffect } from "react";
import { useSnackbar } from "notistack";

export default function TeacherDescription() {
  const { teacher, token } = useSelector((state) => state.teacher);
  const { data } = useTeacher(teacher?.id);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      description_ar: "",
    },
  });

  useEffect(() => {
    if (data) {
      const user = data?.data;
      reset({
        description_ar: user?.descriptionAr,
      });
    }
  }, [data]);

  async function onSubmit(data) {
    try {
      setLoad(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/description/${teacher.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            descriptionAr: data.description_ar,
          }),
        }
      );
      const resData = await response.json();
      enqueueSnackbar(t("update_success"), {
        variant: "success",
        autoHideDuration: 1000,
      });
      navigate("/teacher/video");
    } catch (err) {
      console.log(err);
    }
  }

  const { t } = useTranslation();

  return (
      <TeacherLayout active={6} title={t("Description")}>
      <Paper sx={{padding:"40px 20px"}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ width: { md: "500px", xs: "100%" } }}>
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
            <StepperButtons skipLink="video" load={load} />
          </Box>
        </form>
        </Paper>
      </TeacherLayout>
  );
}
