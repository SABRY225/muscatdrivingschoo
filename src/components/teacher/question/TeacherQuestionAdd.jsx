import { Box, Button, InputLabel, TextField, Typography , Autocomplete , Paper} from '@mui/material'
import React , { useState , useEffect } from 'react';
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {useSnackbar} from 'notistack'
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useTeacherLectures }     from "../../../hooks/useTeacherLectures";

export default function TeacherQuestionAdd() {
    const [ value, setValue]        = useState(null);
    const { teacher , token}       = useSelector((state)=>state.teacher)
    const {t}                      = useTranslation()
    const {closeSnackbar,enqueueSnackbar} = useSnackbar()
    const { data , isLoading  }              = useTeacherLectures(teacher?.id , token);
    const [ Lectures , setLectures]   = useState([]);

    const lang = Cookies.get("i18next") || "en";
    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            title_ar        :   "",
            title_en        :   "",
            description_ar   :   "",
            description_en   :   "",
        }
    });

    useEffect(() => {
      if (data?.data) {
        setLectures(data.data);
      }
    }, [data]);
    
    async function onSubmit(data)
    {
      closeSnackbar();
    const formData = new FormData();
    formData.append("TeacherId", teacher.id);
    formData.append("titleAR",        data.title_ar);
    formData.append("titleEN",        data.title_en);
    formData.append("descriptionAr", data.description_ar);
    formData.append("descriptionEn", data.description_en);
    formData.append("LectureId",  value);

        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/question`,{
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
      <Paper sx={{ padding: "20px" }}>
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
                options={Lectures}
                getOptionLabel={(option) => option.titleAR}
                renderInput={(params) => (
                  <TextField {...params} variant="standard" />
                )}
              />

                <Box sx={{marginBottom:"18px"}}>
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
                {t("lecture_descAr")}
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
                {t("lecture_descEn")}
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

            <Button variant="contained" type="submit" sx={{ml:"6px",mr:"6px"}}>{t('save')}</Button>
      </form>
      </Paper>
    </>
    )
}