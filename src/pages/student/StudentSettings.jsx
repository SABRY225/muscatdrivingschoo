import { Box, FormControlLabel, Button, InputLabel, Paper, Radio,
    RadioGroup, Typography } from '@mui/material'
import React, { useEffect, useRef } from 'react'
import StudentLayout from '../../components/student/StudentLayout'
import ReactCodeInput from "react-code-input";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {useSnackbar} from 'notistack'
import { useState } from 'react';
import { useStudent } from '../../hooks/useStudent';

export default function StudentSettings() {
    const input1 = useRef();
    const input2 = useRef();

    const {t} = useTranslation()
    const {student,token} = useSelector((state)=>state.student)
    const { data } = useStudent(student?.id);
    const {closeSnackbar,enqueueSnackbar} = useSnackbar()
    const [load,setLoad] = useState(false)
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
            `${process.env.REACT_APP_API_KEY}api/v1/student/setting/${student.id}`,
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
        <StudentLayout>
            <Paper sx={{padding:"40px 20px"}}>
            <Typography sx={{marginBottom:"30px"}}>{t('setting_page')}</Typography>
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
                required: "isnotify is required",
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

                        {
                            !load?
                            <Button type="submit" sx={{marginTop:"30px"}} 
                            variant="contained" color="secondary">{t('save')}</Button>
                            :
                            <Button type="submit" sx={{marginTop:"30px"}}
                            variant="contained" color="secondary">{t('save')}...</Button>
                        }
            </Paper>
        </StudentLayout>
    )
}