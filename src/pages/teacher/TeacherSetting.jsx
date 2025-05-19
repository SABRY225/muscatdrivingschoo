import React, { useEffect, useState } from "react";
import TeacherLayout from "../../components/teacher/TeacherLayout";
import { useForm, Controller } from "react-hook-form";
import {
  Box,FormControlLabel,InputLabel,Radio,
  Paper,RadioGroup,Typography,
} from "@mui/material";
import StepperButtons from "../../components/reusableUi/StepperButtons";

import Navbar from "../../components/Navbar";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useTeacher  } from "../../hooks/useTeacher";
import { useSnackbar } from "notistack";

export default function TeacherSetting() {
  const { t }                     = useTranslation();
  const { teacher, token }        = useSelector((state) => state.teacher);
  const { data }                  = useTeacher(teacher.id);
  console.log(teacher);
  const [load, setLoad]           = useState(false);
  const { enqueueSnackbar }       = useSnackbar();

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      isnotify: "",
    },
  });

  useEffect(() => {
    if (!data) return;
    const user = data?.data;
    console.log(user);

    reset({
      isnotify: user?.isnotify ? "yes" : "no",
    });
  }, [data]);

  const onSubmit = async (passedData) => {
    setLoad(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/setting/${teacher.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            isnotify: passedData.isnotify == "no" ? false : true,
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
        
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Navbar>
      <TeacherLayout title={t("setting_page")} active={7}>
      <Paper sx={{padding:"40px 20px"}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ marginBottom: "26px" }}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
              {t("setting_notification")}
            </InputLabel>
            <Controller
              name="isnotify"
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
              {...register("isnotify", {
                required: "isnotify Address is required",
              })}
            />
            {errors.isnotify?.type === "required" && (
              <Typography
                color="error"
                role="alert"
                sx={{ fontSize: "13px", marginTop: "6px" }}
              >
                {t("required")}
              </Typography>
            )}
          </Box>

          <StepperButtons load={load} skipLink="subjects" />
        </form>
        </Paper>
      </TeacherLayout>
    </Navbar>
  );
}
