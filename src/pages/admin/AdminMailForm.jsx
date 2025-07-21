import { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import { Button  , Box , InputLabel , Typography , Paper } from "@mui/material";
import { useForm,Controller }   from 'react-hook-form';
import TextField from "@mui/material/TextField";
import { useNavigate, useParams } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

const style = { marginBottom: 30 };

export default function AdminMailForm() {
  const { mail }              = useParams();
  
  const { t }               = useTranslation();
  const { enqueueSnackbar } = useSnackbar();
  const { token }           = useSelector((state) => state.admin);
  const lang = Cookies.get("i18next") || "en";
  const { register, control, formState: { errors }, handleSubmit } = useForm({
    defaultValues: {
      messageMail:""
    }
  });

  async function onSubmit(data){
    console.log("Enter Submit");

    const formData = new FormData();
    console.log(".............");
    console.log(mail);
    console.log(data.messageMail);

    formData.append("email",        mail);
    formData.append("messageMail",  data.messageMail);

    

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/sendMail`,
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formData,
        }
      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("failed occured");
      }
      const resData = await response.json();
      enqueueSnackbar(
        lang === "ar" ? resData.msg.arabic : resData.msg.english,
        { variant: "success", autoHideDuration: 8000 }
      );
    } catch (err) {
      console.log(err);
  }
  };

  useEffect(() => {
    
  }, []);

  return (
    <AdminLayout>
      <Paper sx={{ padding: "20px" }}>

          <Box sx={{ marginBottom: "26px" }}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h3 style={style}>{t("title_send_mail")}</h3>

              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("title_send_mail")}
              </InputLabel>
              <Controller
                name="messageMail"
                control={control}
                
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("messageMail", {
                  required: "messageMail is required",
                })}
              />
              {errors.messageMail?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
        

      
      <br />
      <br />

      
      <Button variant="contained" type="submit" sx={{ml:"6px",mr:"6px" , marginTop:"20px"}}>{t('send')}</Button>
     
      </form>
      </Box>
      </Paper>
    </AdminLayout>
  );
}
