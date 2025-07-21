import { Box, Button, InputLabel, TextField, Typography , styled , Paper} from '@mui/material'
import React , { useState } from 'react';
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack'
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
const Image = styled("img")({
    width: "300px",
});

export default function Add() {
    
    const {token} = useSelector((state)=>state.admin)
    const {t} = useTranslation()
    const {closeSnackbar,enqueueSnackbar} = useSnackbar()
    const [image, setImage] = useState(null);

    const lang = Cookies.get("i18next") || "en";
    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            title_ar:"",
            title_en:"",
            descriptionAR   : "",
            descriptionEN   : "",
        }
    });
    
    async function onSubmit(data)
    {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("titleAR",          data.title_ar);
        formData.append("titleEN",          data.title_en);
        formData.append("descriptionEN",    data.descriptionEN);
        formData.append("descriptionAR",    data.descriptionAR);
    if (!image) {
          enqueueSnackbar( t("image_required"), {
          variant: "error",
          autoHideDuration: 8000,
        });
        throw new Error("failed occured");
    }
        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/news`,{
                method:"POST",
                headers:{
                    "Authorization":token
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
        <Paper sx={{ padding: "20px" }}>
            <form onSubmit={handleSubmit(onSubmit)}>
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
                {t("news_descriptionAr")}
              </InputLabel>
              <Controller
                name="descriptionAR"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("descriptionAR", {
                  required: "descriptionAR Address is required",
                })}
              />
              {errors.descriptionAR?.type === "required" && (
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
                {t("news_descriptionEn")}
              </InputLabel>
              <Controller
                name="descriptionEN"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("descriptionEN", {
                  required: "descriptionEN Address is required",
                })}
              />
              {errors.descriptionEN?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
        </Box>

            <input type="file" id="image" hidden onChange={(e) => setImage(e.target.files[0])} />
            <Button
              variant="contained"
              color="secondary"
              sx={{ textTransform: "capitalize", padding: 0, marginBottom: "20px", }}
            >
            <InputLabel htmlFor="image">{t("addphoto")}</InputLabel>
            </Button>
            <Box>{image && <Image src={URL.createObjectURL(image)} />}</Box>

            <Button variant="contained" type="submit" sx={{ml:"6px",mr:"6px"}}>{t('save')}</Button>
            </form>
            </Paper>
        </Box>
        </>
    )
}