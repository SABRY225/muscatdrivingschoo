import { Box, Button, InputLabel, TextField, Typography , styled , Paper} from '@mui/material'
import React , { useState } from 'react';
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack'
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';

export default function Add() {
    
    const {token} = useSelector((state)=>state.admin)
    const {t} = useTranslation()
    const {closeSnackbar,enqueueSnackbar} = useSnackbar()
    const [image, setImage] = useState(null);

    const lang = Cookies.get("i18next") || "en";
    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            title_ar:"",
            title_en:""
        }
    });
    
    async function onSubmit(data)
    {
        const formData = new FormData();
        formData.append("titleAR", data.title_ar);
        formData.append("titleEN", data.title_en);
        
        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/careerdepartment`,{
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
            

            <Button variant="contained" type="submit" sx={{ml:"6px",mr:"6px"}}>{t('save')}</Button>
            </form>
            </Paper>
        </Box>
        </>
    )
}