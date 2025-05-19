import { DialogContent,DialogActions,InputLabel,Button, Box,TextField,Typography , styled} from '@mui/material'
import React , { useState } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack'
import Cookies from 'js-cookie';

const Image = styled("img")({
    width: "300px",
});

export default function Update({handleClose,careerdepartment,setCareerDepartments}) {
    const {t} = useTranslation()
    const {enqueueSnackbar} = useSnackbar()
    const lang = Cookies.get("i18next") || "en";
    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            title_ar:careerdepartment?.titleAR,
            title_en:careerdepartment?.titleEN
        }
    });
    const [image, setImage] = useState(null);
    const {token} = useSelector((state)=>state.admin)
    async function onSubmit(data)
    {
        const formData = new FormData();
    formData.append("titleAR",          data.title_ar);
    formData.append("titleEN",          data.title_en);

        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/careerdepartment/${careerdepartment.id}`,{
                method:"PUT",
                headers:{
                    "Authorization":token,
                },
                body:formData
            })
            if(response.status!==200&&response.status!==201)
            {
                throw new Error('failed occured')
            }
            const resData = await response.json()
            enqueueSnackbar(lang==="ar"?resData.msg.arabic:resData.msg.english,{variant:"success",autoHideDuration:8000})

            setCareerDepartments(back=>back.map(item=>
                {
                    return item.id===careerdepartment.id?{...item,titleAR:data.title_ar,titleEN:data.title_en}:item
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
                        {...register("title_en", { required: "title Address is required" })}
                        />
                        {errors.title_en?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
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
