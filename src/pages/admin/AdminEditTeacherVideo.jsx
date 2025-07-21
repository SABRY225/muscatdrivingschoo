import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../components/admin/AdminLayout";
import TeacherLayout from "../../components/admin/TeacherLayout";
import { Box, Button, InputLabel, TextField, Typography , Paper } from "@mui/material";
import StepperButtons from "../../components/reusableUi/StepperButtons";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useTeacher } from "../../hooks/useTeacher";
import { Controller, useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const urlRegex = new RegExp(
  "^(http(s)://.)[-a-zA-Z0-9@:%._+~#=]{2,256}.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)$"
);

const AdminEditTeacherVideo = () => {
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
      link: "",
    },
  });
  async function onSubmit(data) {
    if (
      !data.link ||
      data.link.trim() === "" ||
      urlRegex.test(data.link.trim())
    )
      return;
    try {
      setLoad(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/edit/teacher/videoLink/${teacherId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({ videoLink: data.link }),
        }
      );
      const resData = await response.json();
      enqueueSnackbar(t("update_success"), {
        variant: "success",
        autoHideDuration: 1000,
      });
      navigate("/admin/teachers");
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    if (data) {
      const user = data?.data;
      reset({
        link: user?.videoLink,
      });
    }
  }, [data]);

  return (
    <AdminLayout>
      <TeacherLayout active={7}  title={t("Videointroduction")} >
      <Paper sx={{ padding: "20px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ width: { md: "500px", xs: "100%" } }}>
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("YoutubeLink")}
              </InputLabel>
              <Controller
                name="link"
                control={control}
                render={({ field }) => (
                  <TextField type="url" {...field} fullWidth />
                )}
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
          </Box>
          <Box sx={{ display: "flex", gap: "12px" }}>
            <StepperButtons onSubmit={onSubmit} load={load} />
            {/* <Button
              sx={{ textTransform: "capitalize", marginTop: "40px" }}
              variant="outlined"
              onClick={() => navigate("/admin/teachers")}
            >
              {t("skip")}
            </Button> */}
          </Box>
        </form>
        </Paper>
      </TeacherLayout>
    </AdminLayout>
  );
};

export default AdminEditTeacherVideo;
