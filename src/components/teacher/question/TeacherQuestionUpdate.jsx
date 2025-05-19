import { DialogContent,DialogActions,InputLabel,Button, Box,TextField,Typography , styled , Autocomplete} from '@mui/material'
import React , { useState , useEffect } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {useSnackbar} from 'notistack'
import Cookies from 'js-cookie';
import { useTeacherLectures }     from "../../../hooks/useTeacherLectures";

export default function TeacherQuestionUpdate({handleClose,Question,setQuestions}) {
  const [ value, setValue]        = useState(null);
    const { teacher , token}       = useSelector((state)=>state.teacher)
    const {t} = useTranslation()
    const {closeSnackbar , enqueueSnackbar} = useSnackbar();
    const [image, setImage] = useState(null);
    const lang = Cookies.get("i18next") || "en";
    const { data , isLoading  }              = useTeacherLectures(teacher?.id , token);
    const [ Lectures , setLectures]   = useState([]);
    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
          LectureId    : Question?.TeacherLectureId,
          title_ar:    Question?.titleAR,
          title_en:    Question?.titleEN,
          description_ar : Question?.descriptionAr,
          description_en  : Question?.descriptionEn,
        }
    });

    useEffect(() => {
      if (data?.data) {
        setLectures(data.data);
        console.log(data.data);
        let c;
        c = data.data.find((e) => e.id == Question?.TeacherLectureId);
        console.log("Get Current Object");
        console.log(c);

        setValue(lang === "en" ? c.titleEN : c.titleAR);
      }
      
    }, [data]);

    async function onSubmit(data)
    {
       // closeSnackbar();
    const formData = new FormData();
    formData.append("TeacherId",        teacher.id);
    formData.append("titleAR",          data.title_ar);
    formData.append("titleEN",          data.title_en);
    formData.append("descriptionAr",    data.description_ar);
    formData.append("descriptionEn",    data.description_en);
    formData.append("LectureId",  value);

        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/question/${Question.id}`,{
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

            setQuestions(back=>back.map(item=>
                {
                    console.log("Update Row");
                    console.log(data);
                    console.log("End Row Update");
                    return item.id === Question.id?{...item,
                        titleAr         : data.title_ar,
                        titleEn         : data.title_en,
                        descriptionAr   : data.description_ar,
                        descriptionEn   : data.description_en}:item
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

                <Autocomplete
                onChange={(event, newValue) => {
                  setValue(newValue?.id || null);
                }}
                id="size-small-standard-multi"
                size="small"
                options={Lectures}
                value={value}
                inputValue={value}
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
                        {...register("title_en", { required: "title arabic is required" })}
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
