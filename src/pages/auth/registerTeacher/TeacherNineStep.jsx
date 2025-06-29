import { Controller, useForm } from "react-hook-form";
import {
  Box,
  InputLabel,
  TextField,
  Typography,
  Container,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Navbar from "../../../components/Navbar";
import HeaderSteps from "../../../components/auth/HeaderSteps";

function TeacherNineStep() {
          const token = localStorage.getItem("token")
  const teacher  = JSON.parse(localStorage.getItem("teacher"))
  const navigate = useNavigate();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      description_ar: "",
      link: "",
      invitationLink: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/personal-description/${teacher.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            descriptionAr: data.description_ar,
            videoLink: data.link,
            invitationLink: data.invitationLink,
          }),
        }
      );
      const resData = await response.json();

      if (!response.ok) throw new Error();

      enqueueSnackbar(t("update_success"), {
        variant: "success",
        autoHideDuration: 1000,
      });

      navigate("/teacherwelcome");
    } catch (err) {
      console.log(err);
      enqueueSnackbar(t("something_went_wrong"), {
        variant: "error",
      });
    }
  };

  return (
    <Navbar>
      <Container sx={{ marginTop: "110px", marginBottom: "2rem" }}>
        <HeaderSteps step={9} title={t("Personal description")} steps={9} />
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ width: { md: "500px", xs: "100%" } }}>
            {/* الوصف العربي */} 
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("descAr")}
              </InputLabel>
              <Controller
                name="description_ar"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
              />
              {errors.description_ar && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", mt: 1 }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>

            {/* رابط يوتيوب (اختياري) */}
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("YoutubeLink")}
              </InputLabel>
              <Controller
                name="link"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth type="url" />
                )}
              />
            </Box>

            {/* رابط الدعوة (اختياري) */}
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("Invitation link (optional)")}
              </InputLabel>
              <Controller
                name="invitationLink"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth type="url" />
                )}
              />
            </Box>

            {/* زر الإرسال */}
            <Button
              type="submit"
              variant="contained"
              sx={{ textTransform: "capitalize" }}
            >
               {t("next")}
            </Button>
          </Box>
        </form>
      </Container>
    </Navbar>
  );
}

export default TeacherNineStep;
