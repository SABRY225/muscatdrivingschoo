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

export default function TeacherCertificatesUpdate({handleClose,certificates,setCertificates}) {
    const {t} = useTranslation()
    const {enqueueSnackbar} = useSnackbar()
    const lang = Cookies.get("i18next") || "en";
    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            name:certificates?.name,
            subject:certificates?.subject,
            from : certificates?.from,
            to  : certificates?.to,
        }
    });

    const {token}       = useSelector((state)=>state.teacher)
    async function onSubmit(data)
    {
        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/updateTeacherCertificates/${certificates.id}`,{
                method:"PUT",
                headers:{
                    "Authorization":token,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({name:data.name,subject:data.subject,to:data.to,from:data.from})
            })
            if(response.status!==200&&response.status!==201)
            {
                throw new Error('failed occured')
            }
            const resData = await response.json()
            enqueueSnackbar(lang==="ar"?resData.msg.arabic:resData.msg.english,{variant:"success",autoHideDuration:8000})

            setCertificates(back=>back.map(item=>
                {
                    return item.id===certificates.id?{...item,name:data.name,subject:data.subject,to:data.to,from:data.from}:item
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
                        <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('name')}</InputLabel>
                        <Controller
                        name="name"
                        control={control}
                        render={({ field }) => <TextField {...field} fullWidth/>}
                        {...register("name", { required: "title Address is required" })}
                        />
                        {errors.name?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
                </Box>
                <Box sx={{marginBottom:"18px"}}>
                        <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('subject')}</InputLabel>
                        <Controller
                        name="subject"
                        control={control}
                        render={({ field }) => <TextField {...field} fullWidth/>}
                        {...register("subject", { required: "title Address is required" })}
                        />
                        {errors.subject?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
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
