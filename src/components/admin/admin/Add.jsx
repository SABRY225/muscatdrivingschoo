import { Typography,Button, Box, InputLabel, TextField ,Paper , Radio , RadioGroup , FormControlLabel} from '@mui/material'
import React from 'react'
import { useForm, Controller } from "react-hook-form";
import { useTranslation }   from 'react-i18next';
import {useSnackbar}        from 'notistack';
import { useSelector }      from 'react-redux';
import Cookies from 'js-cookie';

export default function Add() {
    //const [admin,setAdmin]      = useState();
    const {admin} = useSelector((state)=>state.admin);
    const {token}               = useSelector((state)=>state.admin);
    const {t}                   = useTranslation();
    const {closeSnackbar,enqueueSnackbar} = useSnackbar();    
    const lang      = Cookies.get("i18next") || "en";
    const {
        register,   control,  formState: { errors },  handleSubmit,
      } = useForm({
        defaultValues: {
          name              : "",
          email             : "",
          password          : "",
          whatsappPhone     : "",
          address           : "",
        },
      });

    const onSubmit = async (passedData) => {
console.log(passedData.role);

        closeSnackbar()
        try{
            if(!passedData.name||!passedData.email)
            {
                enqueueSnackbar('empty field',{variant:"error",autoHideDuration:8000})
                throw new Error('failed occured')
            }
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/addAdmin`,{
                method:"POST",
                headers:{
                    "Content-Type"  :   "application/json",
                    "Authorization" :   token
                },
                body:JSON.stringify({
                    name      : passedData.name,
                    whatsappPhone:passedData.whatsappPhone,
                    email     : passedData.email,
                    password  : passedData.password,
                    address   : passedData.address,
                    role   : passedData.role,
                })
            })
            const resData = await response.json()
            if(response.status!==200&&response.status!==201)
            {
                enqueueSnackbar(lang==="ar"?resData.message.arabic:resData.message.english,{variant:"error",autoHideDuration:8000})
                throw new Error('failed occured')
            }
            enqueueSnackbar(lang==="ar"?resData.msg.arabic:resData.msg.english,{variant:"success",autoHideDuration:8000})
        }
        catch(err)
        {
            console.log(err)
        }
    }
    
    return (
        <Paper sx={{ padding: "20px" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <Box >
            <Typography sx={{fontSize:"24px",fontWeight:"600",color:"#424242",marginBottom:"15px"}}>{t('page_admin_title')}</Typography>
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("name")}
              </InputLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth />}
                {...register("name", {
                  required: "name is required",
                })}
              />
              {errors.name?.type === "required" && (
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
                {t("address")}
              </InputLabel>
              <Controller
                name="address"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth />}
                {...register("address", {
                  required: "address Phone is required",
                })}
              />
              {errors.address?.type === "required" && (
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
                {t("whatsappPhone")}
              </InputLabel>
              <Controller
                name="whatsappPhone"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth />}
                {...register("whatsappPhone", {
                  required: "whatsapp Phone is required",
                })}
              />
              {errors.whatsappPhone?.type === "required" && (
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
                {t("email")}
              </InputLabel>
              <Controller
                name="email"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth />}
                {...register("email", {
                  required: "email is required",
                })}
              />
              {errors.email?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>

            <Box sx={{ marginTop: "32px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("password")}
              </InputLabel>
              <Controller
                name="password"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth />}
                {...register("password", {
                  required: "password Address is required",
                })}
              />
              {errors.password?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  this field is required
                </Typography>
              )}
            </Box>

            <Box sx={{ marginBottom: "26px" , marginTop: "32px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                {t("role")}
              </InputLabel>
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    <FormControlLabel
                      value="admin"
                      control={<Radio size="2px" />}
                      label={t("admin")}
                    />
                    <FormControlLabel
                      value="accountant"
                      control={<Radio size="2px" />}
                      label={t("accountant")}
                    />
                  </RadioGroup>
                )}
                {...register("role", {
                  required: "role is required",
                })}
              />
              {errors.role?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>


            <Button sx={{marginTop:"20px"}} variant="contained" type="submit">{t('save')}</Button>
            </Box>
        </form>
        </Paper>
    )
}