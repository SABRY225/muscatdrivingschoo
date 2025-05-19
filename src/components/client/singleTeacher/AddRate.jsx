import React, { useState } from 'react'
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import {Box, Rating, TextField, Typography} from '@mui/material'
import { useTranslation } from 'react-i18next'
import {useSnackbar} from 'notistack'

import {Button} from '@mui/material'
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
export default function AddRate({handleClose,TeacherId}) {
    const {closeSnackbar,enqueueSnackbar} = useSnackbar()
    const {t} = useTranslation()
    const [rating,setRating] = useState(0)
    const [comment,setComment] = useState(null)
    const [load,setLoad] = useState(false)
    const {student,token} = useSelector((state)=>state.student)
    const lang = Cookies.get("i18next") || "en";

    async function rateTeacher()
    {
        closeSnackbar()
        setLoad(true)
        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/rateTeacher`,{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                    "Authorization":token
                },
                body:JSON.stringify({TeacherId,StudentId:student.id,rating, comment})
            })
            const data = await response.json()
            if(response.status!==200&&response.status!==201)
            {
                enqueueSnackbar(lang==="ar"?data.message.arabic:data.message.english,{variant:"error",autoHideDuration:8000})
                handleClose()
                throw new Error('failed occured')
            }
            enqueueSnackbar(lang==="ar"?data.msg.arabic:data.msg.english,{variant:"success",autoHideDuration:8000})
            handleClose()
        }
        catch(err)
        {
            console.log(err)
        }
    }

    return (
        <Box sx={{width:"450px",maxWidth:"100%"}}>
            <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                    <Typography sx={{fontSize:"15px",fontWeight:"500",marginBottom:"4px"}}>{t('rating')}</Typography>
                    <Box sx={{direction:"ltr"}}>
                        <Rating value={rating} onChange={(event, newValue) => {setRating(newValue);}}/>
                    </Box>
                    <Typography sx={{fontSize:"15px",fontWeight:"500",marginBottom:"4px",marginTop:"12px"}}>{t('comment')}</Typography>
                    <TextField fullWidth rows={3} multiline value={comment} onChange={(e)=>setComment(e.target.value)}/>
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>{t('cancel')}</Button>
                {
                    !load?
                    <Button onClick={rateTeacher}>{t('save')}</Button>
                    :
                    <Button>{t('save')}...</Button>
                }
            </DialogActions>
        </Box>
    )
}
