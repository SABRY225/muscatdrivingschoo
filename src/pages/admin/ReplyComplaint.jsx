import React from 'react';
import {Button, FormControl } from "@mui/material";
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/admin/AdminLayout';
import instance from '../../lib/axios';
import axios from 'axios';

function ReplyComplaint() {
    const {messageId,studentId}=useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const lang = Cookies.get("i18next") || "en";
  const { t } = useTranslation();
  const BASE_URL = process.env.REACT_APP_API_KEY;


    async function sendMail(event) {

      event.preventDefault();
      const value = event.target.message.value;
      try {
        const endpoint = `${BASE_URL}api/v1/message/reply-message`;
        const res = await axios.put(endpoint, { messageId,studentId,reply:value },{headers: {
          "Content-Type": "application/json",
        }});
        const resMessage = res.data.message ;
        const message = lang === "en" ? resMessage.en : resMessage.ar;
        enqueueSnackbar(message, { variant: "success", autoHideDuration: 5000 });
        navigate(`/admin/complaints`)
      } catch(error) {
        enqueueSnackbar(t("error"), { variant: "error", autoHideDuration: 5000 });
      }
    }
  
  const handelCancel=()=>{
    navigate(`/admin/customer-complaints`)
  }
  return (
    <AdminLayout>
    <form onSubmit={sendMail}>
            <FormControl fullWidth margin="dense">
              <TextareaAutosize required name="message" minRows={4} placeholder={t("What is your response to the complaint?")} style={{padding:"0.5rem 1rem 0",fontSize:"17px"}}/>
            </FormControl>
            <Button variant="contained" type="submit" sx={{ width: "300px", marginTop: "20px" }}>
              {t("send")}
            </Button>
            <Button variant="outlined" onClick={handelCancel} sx={{ width: "300px", marginTop: "20px" ,marginLeft:"2rem"}}>
              {t("cancel")}
            </Button>
          </form>

    </AdminLayout>
  );
}

export default ReplyComplaint;
