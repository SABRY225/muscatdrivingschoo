import { DialogContent,DialogActions,InputLabel,Button, Box,TextField,Typography , styled} from '@mui/material'
import React , { useState } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {useSnackbar} from 'notistack'
import Cookies from 'js-cookie';

const Image = styled("img")({
    width: "300px",
});

export default function TeacherLectureUpdate({handleClose,Lectures,setLectures}) {
    const { teacher , token}       = useSelector((state)=>state.teacher)
    const {t} = useTranslation()
    const {closeSnackbar , enqueueSnackbar} = useSnackbar();
    const [image, setImage] = useState(null);
    const lang = Cookies.get("i18next") || "en";
    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            image           : Lectures?.image,
            title_ar        : Lectures?.titleAR,
            title_en        : Lectures?.titleEN,
            description_ar  : Lectures?.descriptionAr,
            description_en  : Lectures?.descriptionEn,
            location_en     : Lectures?.locationEn,
            location_ar     : Lectures?.locationAr,
        }
    });

    async function onSubmit(data)
    {
       // closeSnackbar();
    const formData = new FormData();
    formData.append("image",            image);
    formData.append("TeacherId",        teacher.id);
    formData.append("titleAR",          data.title_ar);
    formData.append("titleEN",          data.title_en);
    formData.append("descriptionAr",    data.description_ar);
    formData.append("descriptionEn",    data.description_en);
    formData.append("locationEn",     data.location_en);
    formData.append("locationAr",     data.location_ar);

        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/updateLecture/${Lectures.id}`,{
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

            setLectures(back=>back.map(item=>
                {
                    console.log("Update Row");
                    console.log(data);
                    console.log("End Row Update");
                    return item.id === Lectures.id?{...item,
                        image           : data.image,
                        titleAr         : data.title_ar,
                        titleEn         : data.title_en,
                        descriptionAr   : data.description_ar,
                        descriptionEn   : data.description_en,
                        locationAr      : data.location_ar,
                        locationEn      : data.location_en,
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

        <Box sx={{marginBottom:"18px"}}>
                <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('locationEn')}</InputLabel>
                <Controller
                        name="location_en"
                        control={control}
                        render={({ field }) => <TextField {...field} fullWidth/>}
                        {...register("location_en", { required: "Location english is required" })}
                />
                {errors.location_en?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
        </Box>

        <Box sx={{marginBottom:"18px"}}>
                <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('locationEn')}</InputLabel>
                <Controller
                        name="location_ar"
                        control={control}
                        render={({ field }) => <TextField {...field} fullWidth/>}
                        {...register("location_ar", { required: "Location arabic is required" })}
                />
                {errors.location_ar?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
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

            <input
              type="file"
              id="image"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
            <Button
              variant="contained"
              color="secondary"
              sx={{
                textTransform: "capitalize",
                padding: 0,
                marginBottom: "20px",
              }}
            >
            <InputLabel htmlFor="image">{t("addphoto")}</InputLabel>
            </Button>
            <Box>{image && <Image src={URL.createObjectURL(image)} />}</Box>
         
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
