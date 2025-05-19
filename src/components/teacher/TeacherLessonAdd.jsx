import { Box, Button, InputLabel, TextField, Typography , Autocomplete , Paper} from '@mui/material'
import React , { useState } from 'react';
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {useSnackbar} from 'notistack'
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useTeacherLectures }     from "../../hooks/useTeacherLectures";

export default function TeacherLessonAdd() {
    
    const [ value, setValue]        = useState(null);
    const { teacher , token}        = useSelector((state)=>state.teacher);
    const { data:lectures , isLoading  }              = useTeacherLectures(teacher?.id , token);

    const {t}                       = useTranslation()
    const {closeSnackbar,enqueueSnackbar} = useSnackbar()

    const lang = Cookies.get("i18next") || "en";
    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            title_ar        :   "",
            title_en        :   "",
        }
    });
    
    async function onSubmit(data)
    {
      closeSnackbar();
    const formData = new FormData();
    console.log(teacher.id);
    console.log(data.title_ar);
    console.log(data.title_en);
    console.log(value);
    formData.append("TeacherId",  teacher.id);
    formData.append("titleAR",    data.title_ar);
    formData.append("titleEN",    data.title_en);
    formData.append("videoLink",  data.videoLink);
    formData.append("LectureId",  value);
   
        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/createLesson`,{
                method:"POST",
                headers:{
                  Authorization: token,
                },
                body:formData,
            })
            if(response.status!==200&&response.status!==201)
            {
                throw new Error('failed occured')
            }
            const resData = await response.json()
            enqueueSnackbar(lang==="ar"?resData.msg.arabic:resData.msg.english,{variant:"success",autoHideDuration:8000})
        }
        catch(err)
        {
            console.log(err)
        }
    }

    return (
        <>
      <Box sx={{width:"500px",maxWidth:"100%"}}>
      <Paper sx={{ width: "100%", padding: "20px" }}>
      {!isLoading && (
            <form onSubmit={handleSubmit(onSubmit)}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("choose_lectures")}
              </InputLabel>

            <Autocomplete
                onChange={(event, newValue) => {
                  setValue(newValue?.id || null);
                }}
                id="size-small-standard-multi"
                size="small"
                options={lectures.data}
                getOptionLabel={(option) => option.titleAR}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" />
                )}
              />

                <Box sx={{marginBottom:"18px", marginTop:"20px"}}>
                    <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('titleAr')}</InputLabel>
                            <Controller
                            name="title_ar"
                            control={control}
                            render={({ field }) => <TextField {...field} fullWidth/>}
                            {...register("title_ar", { required: "title Address is required" })}
                            />
                            {errors.title_ar?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
                </Box>
                <Box sx={{marginBottom:"18px"}}>
                            <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('titleEn')}</InputLabel>
                            <Controller
                            name="title_en"
                            control={control}
                            render={({ field }) => <TextField {...field} fullWidth/>}
                            {...register("title_en", { required: "title Address is required" })}
                            />
                            {errors.title_en?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
                </Box>

            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("YoutubeLink")}
              </InputLabel>
              <Controller
                name="videoLink"
                control={control}
                render={({ field }) => (
                  <TextField type="url" {...field} fullWidth />
                )}
                {...register("videoLink", { required: "link Address is required" })}
              />
              {errors.videoLink?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>

            <Button variant="contained" type="submit" sx={{ml:"6px",mr:"6px"}}>{t('save')}</Button>
            </form>
        )}
        </Paper>
        </Box>
        </>
    )
}