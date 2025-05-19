import { Box, Button, InputLabel, Paper, Typography } from '@mui/material'
import React, { useRef }    from 'react'
import ParentLayout         from '../../components/parent/ParentLayout'
import ReactCodeInput       from "react-code-input";
import { useTranslation }   from 'react-i18next';
import { useSelector } from 'react-redux';
import {useSnackbar} from 'notistack'
import { useState } from 'react';
import {useParent}              from '../../hooks/useParent';
import Cookies                  from 'js-cookie';

export default function ParentChangePassword() {
    const input1 = useRef();
    const input2 = useRef();

    const {t} = useTranslation()
    const {closeSnackbar,enqueueSnackbar} = useSnackbar()
    const [load,setLoad]        = useState(false)
    const {parent,token}      = useSelector((state)=>state.parent)
    const { data, isLoading }     = useParent(parent?.id , token);
    const lang = Cookies.get("i18next") || "en";

    async function handleChangePassword()
    {
        closeSnackbar()
        setLoad(true)
        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/parent/resetPassword/${parent?.id}`,{
                method:"PUT",
                headers:{
                    'Content-Type':"application/json",
                    "Authorization":token
                },
                body:JSON.stringify({oldPassword:input1.current.state.value,newPassword:input2.current.state.value})
            })
            const data = await response.json()
            console.log(response);
            
            setLoad(false)
            if(response.status!==200&&response.status!==201)
            {
                enqueueSnackbar(data.message,{variant:"error",autoHideDuration:8000})
                throw new Error('failed occured')
            }
            enqueueSnackbar(lang === "ar" ? data.msg.arabic : data.msg.english,{variant:"success",autoHideDuration:8000})
        }
        catch(err)
        {
            console.log(err)
        }
    }

    return (
            <ParentLayout>
                <Paper sx={{padding:"40px 20px"}}>
                    <Typography sx={{marginBottom:"30px"}}>{t('changepassword')}</Typography>
                        <Box sx={{display:"flex",marginBottom:"32px",flexDirection:"column",alignItems:"start"}}>
                            <InputLabel sx={{marginBottom:"12px",fontSize:"13px"}}>{t('oldPassword')}</InputLabel>
                            <ReactCodeInput fields={4} ref={input1}/>
                        </Box>
                        <Box sx={{display:"flex",marginBottom:"24px",flexDirection:"column",alignItems:"start"}}>
                            <InputLabel sx={{marginBottom:"12px",fontSize:"13px"}}>{t('newPassword')}</InputLabel>
                            <ReactCodeInput fields={4} ref={input2}/>
                        </Box>
                        {
                            !load?
                            <Button type="submit" sx={{marginTop:"30px"}} onClick={handleChangePassword}
                            variant="contained" color="secondary">{t('save')}</Button>
                            :
                            <Button type="submit" sx={{marginTop:"30px"}}
                            variant="contained" color="secondary">{t('save')}...</Button>
                        }
                </Paper>
            </ParentLayout>
    )
}