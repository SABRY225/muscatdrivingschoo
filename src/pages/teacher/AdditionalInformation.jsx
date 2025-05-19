import React, { useEffect, useState } from "react";
import TeacherLayout            from "../../components/teacher/TeacherLayout";
import { useForm, Controller }  from "react-hook-form";
import { Box, FormControlLabel, InputLabel,   Radio,  RadioGroup,   TextField,  Typography,   Paper} from "@mui/material";
import StepperButtons from "../../components/reusableUi/StepperButtons";
import CheckBoxLevels from "../../components/teacher/CheckBoxLevels";
import CheckBoxCurriculum from "../../components/teacher/CheckBoxCurriculum";
import CheckBoxLimeType from "../../components/teacher/CheckBoxLimeType";
import CheckBoxTrainingCategoryTypes from "../../components/teacher/CheckBoxTrainingCategoryTypes";

import Navbar from "../../components/Navbar";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useTeacher } from "../../hooks/useTeacher";
import { useSnackbar } from "notistack";
import { DisplaySettings } from "@mui/icons-material";

export default function AdditionalInformation() {
  const { t }                     = useTranslation();
  const [checked, setChecked]     = useState([]);
  const [checked_2, setChecked_2] = useState([]);
  const [checked_3, setChecked_3] = useState([]);
  const [checked_4, setChecked_4] = useState([]);
  const {teacher, token}          = useSelector((state) => state.teacher);
  const { data }                  = useTeacher(teacher.id);
  const [load, setLoad]           = useState(false);
  const navigate                  = useNavigate();
  const { closeSnackbar, enqueueSnackbar} = useSnackbar();
  const [profit, setProfit]       = useState("");

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
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/teacher/profit-ratio`
        );

        if (!response.ok) {
          throw new Error("Request failed");
        }
        const resData = await response.json();
        setProfit(resData.profitRatio);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {

    if (!data) return;
    const user = data?.data;
    console.log(user);
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
    
    setChecked_3(
      user?.TeacherTypes.map((t) => {
        return { TrainingCategoryTypeId: t.TrainingCategoryTypeId, TeacherId: t.TeacherId };
      })
    );
    
    setChecked_4(
      user?.TeacherLimits.map((c) => {
        return { LimeTypeId: c.LimeTypeId, TeacherId: c.TeacherId };
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
  }, [data]);

  const onSubmit = async (passedData) => {
    setLoad(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/additionalInfo/${teacher.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            curriculums : checked_2,
            levels      : checked,
            trainingcategorytypes : checked_3,
            limetypes    : checked_4,
            haveCertificates: passedData.certificates == "no" ? false : true,
            haveExperience: passedData.experience == "no" ? false : true,
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
        enqueueSnackbar(t("update_success"), {
          variant: "success",
          autoHideDuration: 1000,
        });
        navigate("/teacher/subjects");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Navbar>
      <TeacherLayout title={t("additionalInformation")} active={2}>
        <Paper sx={{padding:"40px 20px"}}>
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
                <Typography color="error" role="alert" sx={{ fontSize: "13px", marginTop: "6px" }}>
                  {t("required")}
                </Typography>
              )}
            </Box>
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                {t("experience")}
              </InputLabel>
              <Controller name="experience" control={control} render={({ field }) => (
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
                <Typography color="error" role="alert" sx={{ fontSize: "13px", marginTop: "6px" }}>
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
            <p style={{ marginBottom: "15px" , display:"none"}} htmlFor="" className="hide">
              {t("bankID")}
            </p>

            <Box sx={{ width: { md: "500px", xs: "100%" } ,  display:"none" } } className="hide">
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
              <p>{t("note_teacher_1") + profit + "%" + t("note_teacher_2")}</p>
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
            <CheckBoxLevels         checked={checked} setChecked={setChecked} />
            <CheckBoxCurriculum     checked={checked_2} setChecked={setChecked_2} />
            <CheckBoxTrainingCategoryTypes  checked={checked_3} setChecked={setChecked_3} />
            <CheckBoxLimeType       checked={checked_4} setChecked={setChecked_4} />
            <StepperButtons load={load} skipLink="subjects" />
          </form>
        </Paper>
      </TeacherLayout>
    </Navbar>
  );
}
