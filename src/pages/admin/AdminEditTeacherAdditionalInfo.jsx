import AdminLayout from "../../components/admin/AdminLayout";
import TeacherLayout from "../../components/admin/TeacherLayout";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,  Paper,
  Button,
  FormControlLabel,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import StepperButtons from "../../components/reusableUi/StepperButtons";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTeacher } from "../../hooks/useTeacher";
import { useSnackbar } from "notistack";
import CheckBoxCurriculum from "../../components/admin/edit-teacher/CheckBoxCurriculum";
import CheckBoxLevels from "../../components/admin/edit-teacher/CheckBoxLevels";

const AdminEditTeacherAdditionalInfo = () => {
  const { teacherId } = useParams();
  const { t } = useTranslation();
  const [checked, setChecked] = useState([]);
  const [checked_2, setChecked_2] = useState([]);
  const { token } = useSelector((state) => state.admin);
  const { data } = useTeacher(teacherId);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      certificates: "",
      experience: "",
      yearsOfExperience: "",
      gender: "",
      hours_per_week: "",
      bank_name: "",
      acc_name: "",
      acc_number: "",
      iban: "",
      paypal_acc: "",
    },
  });

  useEffect(() => {
    if (!data) return;
    const user = data?.data;
    setChecked(
      user?.TeacherLevels.map((l) => {
        return { LevelId: l.LevelId, TeacherId: l.TeacherId };
      })
    );
    setChecked_2(
      user?.CurriculumTeachers.map((c) => {
        return { CurriculumId: c.CurriculumId, TeacherId: c.TeacherId };
      })
    );
    reset({
      certificates: user?.haveCertificates ? "yes" : "no",
      experience: user?.haveExperience ? "yes" : "no",
      yearsOfExperience: user?.experienceYears,
      hours_per_week: user?.favHours,
      gender: user?.favStdGender,
      bank_name: user?.bank_name,
      acc_name: user?.acc_name,
      acc_number: user?.acc_number,
      iban: user?.iban,
      paypal_acc: user?.paypal_acc,
    });
  }, [data, reset]);

  const onSubmit = async (passedData) => {
    setLoad(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/edit/teacher/additionalInfo/${teacherId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            curriculums: checked_2,
            levels: checked,
            haveCertificates: passedData.certificates === "no" ? false : true,
            haveExperience: passedData.experience === "no" ? false : true,
            favHours: passedData.hours_per_week,
            favStdGender: passedData.gender,
            experienceYears: passedData.yearsOfExperience,
            bank_name: passedData.bank_name,
            acc_name: passedData.acc_name,
            acc_number: passedData.acc_number,
            iban: passedData.iban,
            paypal_acc: passedData.paypal_acc,
          }),
        }
      );
      const resData = await response.json();
      // console.log("response: ", resData);
      setLoad(false);
      if (resData.status !== 200 && resData.status !== 201) {
        console.log("some error Occurred, response is: ", resData);
        throw new Error("");
      } else {
        closeSnackbar();
        enqueueSnackbar(t("update_success"), {
          variant: "success",
          autoHideDuration: 1000,
        });
        navigate("/admin/edit/teacher/subjects/" + teacherId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{marginTop:"-100px"}}>
      
      <TeacherLayout active={2} title={t("additionalInformation")}>
      <Paper sx={{ padding: "20px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ marginBottom: "26px" }}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
              {t("certificates")}
            </InputLabel>
            <Controller
              name="certificates"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="yes"
                    control={<Radio size="2px" />}
                    label={t("yes")}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio size="2px" />}
                    label={t("no")}
                  />
                </RadioGroup>
              )}
              {...register("certificates", {
                required: "certificates Address is required",
              })}
            />
            {errors.certificates?.type === "required" && (
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
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
              {t("experience")}
            </InputLabel>
            <Controller
              name="experience"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="yes"
                    control={<Radio size="2px" />}
                    label={t("yes")}
                  />
                  <FormControlLabel
                    value="no"
                    control={<Radio size="2px" />}
                    label={t("no")}
                  />
                </RadioGroup>
              )}
              {...register("experience", {
                required: "experience Address is required",
              })}
            />
            {errors.experience?.type === "required" && (
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
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
              {t("yearsExp")}
            </InputLabel>
            <Controller
              name="yearsOfExperience"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="0"
                    control={<Radio size="2px" />}
                    label="0"
                  />
                  <FormControlLabel
                    value="1"
                    control={<Radio size="2px" />}
                    label="1"
                  />
                  <FormControlLabel
                    value="2-4"
                    control={<Radio size="2px" />}
                    label="2-4"
                  />
                  <FormControlLabel
                    value="5-10"
                    control={<Radio size="2px" />}
                    label="5-10"
                  />
                  <FormControlLabel
                    value="+10"
                    control={<Radio size="2px" />}
                    label="+10"
                  />
                </RadioGroup>
              )}
              {...register("yearsOfExperience", {
                required: "yearsOfExperience Address is required",
              })}
            />
            {errors.yearsOfExperience?.type === "required" && (
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
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
              {t("genderType")}
            </InputLabel>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="male"
                    control={<Radio size="2px" />}
                    label={t("male")}
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio size="2px" />}
                    label={t("female")}
                  />
                  <FormControlLabel
                    value="both"
                    control={<Radio size="2px" />}
                    label={t("both")}
                  />
                </RadioGroup>
              )}
              {...register("gender", {
                required: "gender Address is required",
              })}
            />
            {errors.yearsOfExperience?.type === "required" && (
              <Typography
                color="error"
                role="alert"
                sx={{ fontSize: "13px", marginTop: "6px" }}
              >
                {t("required")}
              </Typography>
            )}
          </Box>
          <div className="hide">
          <p style={{ marginBottom: "15px" }} htmlFor="">
            {t("bankID")}
          </p>
          <Box sx={{ width: { md: "500px", xs: "100%" } }}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
              {t("bank_name")}
            </InputLabel>
            <Controller
              name="bank_name"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  sx={{ marginBottom: 3 }}
                  name="bank_name"
                  {...field}
                  {...register("bank_name")}
                />
              )}
            />

            {errors.bank_name?.type === "required" && (
              <Typography
                color="error"
                role="alert"
                sx={{ fontSize: "13px", marginTop: "6px" }}
              >
                {t("required")}
              </Typography>
            )}
            <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
              {t("acc_name")}
            </InputLabel>
            <Controller
              name="acc_name"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  sx={{ marginBottom: 3 }}
                  name="acc_name"
                  {...field}
                  {...register("acc_name")}
                />
              )}
            />

            {errors.acc_name?.type === "required" && (
              <Typography
                color="error"
                role="alert"
                sx={{ fontSize: "13px", marginTop: "6px" }}
              >
                {t("required")}
              </Typography>
            )}
            <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
              {t("acc_number")}
            </InputLabel>
            <Controller
              name="acc_number"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  sx={{ marginBottom: 3 }}
                  name="acc_number"
                  {...field}
                  {...register("acc_number")}
                />
              )}
            />

            {errors.acc_number?.type === "required" && (
              <Typography
                color="error"
                role="alert"
                sx={{ fontSize: "13px", marginTop: "6px" }}
              >
                {t("required")}
              </Typography>
            )}
            <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
              {t("IBAN")}
            </InputLabel>
            <Controller
              name="iban"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  sx={{ marginBottom: 3 }}
                  name="iban"
                  {...field}
                  {...register("iban")}
                />
              )}
            />

            {errors.iban?.type === "required" && (
              <Typography
                color="error"
                role="alert"
                sx={{ fontSize: "13px", marginTop: "6px" }}
              >
                {t("required")}
              </Typography>
            )}
            <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
              {t("paypal_acc")}
            </InputLabel>
            <Controller
              name="paypal_acc"
              control={control}
              render={({ field }) => (
                <TextField
                  fullWidth
                  sx={{ marginBottom: 3 }}
                  type="paypal_acc"
                  {...field}
                  {...register("paypal_acc")}
                />
              )}
            />
            {errors.paypal_acc?.type === "required" && (
              <Typography
                color="error"
                role="alert"
                sx={{ fontSize: "13px", marginTop: "6px" }}
              >
                {t("required")}
              </Typography>
            )}
            <p>{t("note_teacher")}</p>
          </Box>
          </div>


          <Box sx={{ marginBottom: "26px" }}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
              {t("hoursPerWeek")}
            </InputLabel>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel
                    value="1-5"
                    control={<Radio size="2px" />}
                    label="1-5"
                  />
                  <FormControlLabel
                    value="6-10"
                    control={<Radio size="2px" />}
                    label="6-10"
                  />
                  <FormControlLabel
                    value="11-20"
                    control={<Radio size="2px" />}
                    label="11-20"
                  />
                  <FormControlLabel
                    value="21-35"
                    control={<Radio size="2px" />}
                    label="21-35"
                  />
                  <FormControlLabel
                    value="+35"
                    control={<Radio size="2px" />}
                    label="+35"
                  />
                </RadioGroup>
              )}
              {...register("hours_per_week", {
                required: "hours_per_week Address is required",
              })}
            />
            {errors.hours_per_week?.type === "required" && (
              <Typography
                color="error"
                role="alert"
                sx={{ fontSize: "13px", marginTop: "6px" }}
              >
                {t("required")}
              </Typography>
            )}
          </Box>
          <CheckBoxLevels
            checked={checked}
            setChecked={setChecked}
            teacher={data?.data}
          />
          <CheckBoxCurriculum
            checked={checked_2}
            setChecked={setChecked_2}
            teacher={data?.data}
          />
          <Box sx={{ display: "flex", gap: "12px" }}>
            <StepperButtons load={load} />
            {/* <Button
              sx={{ textTransform: "capitalize", marginTop: "40px" }}
              variant="outlined"
              onClick={() =>
                navigate("/admin/edit/teacher/subjects/" + teacherId)
              }
            >
              {t("skip")}
            </Button> */}
          </Box>
        </form>
        </Paper>
      </TeacherLayout>
      </Box>
    </AdminLayout>
  );
};

export default AdminEditTeacherAdditionalInfo;
