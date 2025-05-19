import { Box, Button, InputLabel, TextField, Typography , Autocomplete , Paper , FormControl , Select , MenuItem} from '@mui/material'
import React , { useState , useEffect } from 'react';
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import {useSnackbar} from 'notistack'
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import { useTeacherQuestion }     from "../../../hooks/useTeacherQuestion";

export default function TeacherQuestionChooseAdd() {
    const [ value, setValue]        = useState(null);
    const { teacher , token}       = useSelector((state)=>state.teacher)
    const {t}                      = useTranslation()
    const {closeSnackbar,enqueueSnackbar} = useSnackbar()
    const { data , isLoading  }              = useTeacherQuestion(teacher?.id , token);
    const [ Questions , setQuestions]   = useState([]);

    const lang = Cookies.get("i18next") || "en";
    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            title_ar        :   "",
            title_en        :   "",
        }
    });

    useEffect(() => {
      if (data?.data) {
        setQuestions(data.data);
      }
    }, [data]);
    
    async function onSubmit(data)
    {

      closeSnackbar();
    const formData = new FormData();
    formData.append("TeacherId",          teacher.id);
    formData.append("titleAR",            data.title_ar);
    formData.append("titleEN",            data.title_en);
    formData.append("TeacherQuestionId",  value);
    formData.append("isCorrect",          data.isCorrectAnswer);

        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/questionchoose`,{
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
        <form onSubmit={handleSubmit(onSubmit)}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("choose_questions")}
              </InputLabel>

            <Autocomplete
                onChange={(event, newValue) => {
                  setValue(newValue?.id || null);
                }}
                id="size-small-standard-multi"
                size="small"
                options={Questions}
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
                {t("isCorrectAnswer")}
              </InputLabel>
              <Controller
                name="isCorrectAnswer"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <Select
                      {...field}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      {...register("isCorrectAnswer", {
                        required: "isCorrectAnswer is required",
                      })}
                    >
                      <MenuItem value={"1"}>{t("yes")}</MenuItem>
                      <MenuItem value={"0"}>{t("no")}</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              {errors.isCorrectAnswer?.type === "required" && (
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
    </Box>
    </>
    )
}