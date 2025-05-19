import { DialogContent,DialogActions,InputLabel,Button, Box,TextField,Typography } from '@mui/material'
import React , { useState } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

export default function Update({handleClose,admin , setAdmins}) {
    
    const {token}   = useSelector((state)=>state.admin)
    //const [admins,  setAdmins] = useState([]);
    const {t}       = useTranslation()
    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            name            :   admin?.name,
            email           :   admin?.email,
            whatsappPhone   :   admin?.whatsappPhone,
        }
    });

    async function onSubmit(data)
    {
        console.log(admin.id);

        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/updateAdmin/${admin.id}`,{
                method:"PUT",
                headers:{
                    "Authorization":token,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({name:data.name,email:data.email,whatsappPhone:data.whatsappPhone})
            })
            setAdmins(back=>back.map(item=>
                {
                    return item.id===admin.id?{...item,name:data.name,email:data.email,whatsappPhone:data.whatsappPhone}:item
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
                        {...register("name", { required: "Name is required" })}
                        />
                        {errors.name?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
                    </Box>
                    <Box sx={{marginBottom:"18px"}}>
                        <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('email')}</InputLabel>
                        <Controller
                        name="email"
                        control={control}
                        render={({ field }) => <TextField {...field} fullWidth/>}
                        {...register("email", { required: "Email Address is required" })}
                        />
                        {errors.email?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
                    </Box>
                    <Box sx={{marginBottom:"18px"}}>
                        <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('whatsappPhone')}</InputLabel>
                        <Controller
                        name="whatsappPhone"
                        control={control}
                        render={({ field }) => <TextField {...field} fullWidth/>}
                        {...register("whatsappPhone", { required: "whatsappPhone is required" })}
                        />
                        {errors.whatsappPhone?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
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
