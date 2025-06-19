import { useTranslation } from "react-i18next";
import StudentLayout from "../../components/student/StudentLayout";
import { useSelector } from "react-redux";
import { Button, FormControl, TextareaAutosize, TextField, Typography } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Loading from "../../components/Loading";

function TechnicalSupport() {
  const { t } = useTranslation();
  const { student } = useSelector((state) => state.student);
  const { enqueueSnackbar } = useSnackbar();
  const lang = Cookies.get("i18next") || "en";
  const [loader, isLoader] = useState(false);

  const BASE_URL = process.env.REACT_APP_API_KEY;

  async function sendMail(event) {
    event.preventDefault();
    const value = event.target.message.value;
    const title = event.target.title.value;
    isLoader(true);
    try {
      const endpoint = `${BASE_URL}api/v1/message/messages`;
      console.log(endpoint);
      
      const res = await axios.post(endpoint, {
        message: value,
        title,
        from_user: student.id
      }, {
        headers: {
          "Content-Type": "application/json"
        }
      });
      if (res.status === 200) isLoader(false);
      const resMessage = res.data.message;
      const message = lang === "en" ? resMessage.en : resMessage.ar;
      enqueueSnackbar(message, { variant: "success", autoHideDuration: 5000 });
    } catch (error) {
      isLoader(false);
      enqueueSnackbar(t("error"), { variant: "error", autoHideDuration: 5000 });
    }
  }

  return (
    <StudentLayout>
      {loader ? <Loading /> : <>
        <Typography sx={{ fontSize: "24px", marginTop: "12px", fontWeight: "600", marginBottom: "30px" }}>
          {t("Send your complaint now")}
        </Typography>
        <form onSubmit={sendMail}>
          <FormControl fullWidth margin="dense">
            <TextField required fullWidth name="title" placeholder={t("What is the subject of the complaint?")} />
          </FormControl>
          <FormControl fullWidth margin="dense">
            <TextareaAutosize required name="message" minRows={5} placeholder={t("mailPlaceholder")} style={{ padding: "1px 10px", fontSize: "17px", width: "100%" }} />
          </FormControl>
          <Button variant="contained" type="submit" sx={{ width: "300px", marginTop: "20px" }}>
            {t("send")}
          </Button>
        </form>
      </>}
    </StudentLayout>
  );
}

export default TechnicalSupport;
