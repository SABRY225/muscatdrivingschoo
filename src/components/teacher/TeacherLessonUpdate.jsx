import { DialogContent,DialogActions,InputLabel,Button, Box,TextField,Typography , styled} from '@mui/material'
import React , { useState } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {useSnackbar} from 'notistack'
import Cookies from 'js-cookie';


export default function TeacherLessonUpdate({handleClose,lesson,setLessons}) {
    const { teacher , token}       = useSelector((state)=>state.teacher)
    const {t} = useTranslation()
    const {closeSnackbar , enqueueSnackbar} = useSnackbar();
    const [image, setImage] = useState(null);
    const lang = Cookies.get("i18next") || "en";
    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            title_ar    : lesson?.titleAR,
            title_en    : lesson?.titleEN,
            videoLink   : lesson?.videoLink,
        }
    });

    async function onSubmit(data)
    {
       // closeSnackbar();
    const formData = new FormData();
    formData.append("TeacherId",        teacher.id);
    formData.append("titleAR",          data.title_ar);
    formData.append("titleEN",          data.title_en);
    formData.append("videoLink",        data.videoLink);

        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/updateLesson/${lesson.id}`,{
                method:"PUT",
                headers:{
                    "Authorization":token,
                },
                body:formData,
            })
            if(response.status!==200&&response.status!==201)
            {
                throw new Error('failed occured')
            }
            const resData = await response.json()
            enqueueSnackbar(lang==="ar"?resData.msg.arabic:resData.msg.english,{variant:"success",autoHideDuration:8000})

            setLessons(back=>back.map(item=>
                {
                    return item.id === lesson.id?{...item,
                        titleAr         : data.title_ar,
                        titleEn         : data.title_en,
                        videoLink       : data.videoLink,
                    }:item
                }))
            handleClose()
        }
        catch(err)
        {
            console.log(err)
        }
    }
    
    return (
        <Box sx={{width:"500px",maxWidth:"100%",paddingTop:"12px"}}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                
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
                        {...register("title_en", { required: "title arabic is required" })}
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

                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>{t('cancel')}</Button>
                <Button type="submit">
                    {t('save')}
                </Button>
            </DialogActions>
            </form>
        </Box>
    )
}
