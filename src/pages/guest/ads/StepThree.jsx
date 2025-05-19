import React from "react";
import Navbar               from "../../../components/Navbar";
import AdsStepper           from "../../../components/guest/AdsStepper";
import { Controller, useForm } from "react-hook-form";
import { Box, InputLabel, TextField, Typography ,Paper , styled , Container, Grid} from "@mui/material";
import StepperButtonsGuest      from "../../../components/reusableUi/StepperButtonsGuest";
import { useTranslation } from "react-i18next";
import { useNavigate , useParams }  from "react-router-dom";
import { useSelector }  from "react-redux";
import { useState }     from "react";
import { useGuest }     from "../../../hooks/useGuest";
import { useEffect }    from "react";
import { useSnackbar }  from "notistack";
import { useSocialMedia } from "../../../hooks/useSocialMedia";
import EmailOutlinedIcon  from "@mui/icons-material/EmailOutlined";
import call               from "../../../images/callsvg.svg"
const ImageLogo = styled("img")({
  height: "60px",

  "@media screen and (max-width: 600px) ": {
    height: "45px",
  },
  "@media screen and (max-width: 320px) ": {
    height: "27px",
  },
  objectFit: "cover",
  objectPosition: "bottom",
});
const ImageCall = styled("img")({
  width: "18px",
  height: "18px",
});

export default function StepThree() {
  const { AdsId }         = useParams();
  const { guest, token } = useSelector((state) => state.guest);
  const { data } = useGuest(guest?.id);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const { dataSocial } = useSocialMedia();
  const links = dataSocial?.data;
  const whatsAppLink = links
    ?.filter((obj) => obj.type === "Whatsapp")
    .map((obj) => obj.link);
  const {
    register,
    control,
    reset,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      titleAR: "",
      titleEN: "",
      descriptionAR: "",
      description_en: "",
    },
  });

  useEffect(() => {
    if (data) {
      const user = data?.data;
      reset({
        titleAR: "",
        titleEN: "",
        descriptionAR: "",
        descriptionEN: "",
      });
    }
  }, [data]);

  async function onSubmit(data) {
    try {
      setLoad(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/guest/addads/step3/${AdsId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            titleAR: data.titleAR,
            titleEN: data.titleEN,
            descriptionAR: data.descriptionAR,
            descriptionEN: data.description_en,
            link         : data.link
          }),
        }
      );
      const resData = await response.json();
      enqueueSnackbar(t("update_success"), {
        variant: "success",
        autoHideDuration: 1000,
      });
      navigate("/guest/create-ads/step4/" + AdsId);
    } catch (err) {
      console.log(err);
    }
  }

  const { t } = useTranslation();

  return (
    <Navbar>
      <AdsStepper active={2} title={t("Description")}>
      </AdsStepper>
      <Container sx={{ marginTop: "20px", marginBottom: "60px" }}>
        <Grid container spacing={2}>
        <Grid item xs={12} lg={9}>
        <Paper sx={{padding:"40px 20px"}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ width: { md: "500px", xs: "100%" } }}>
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("titleAR")}
              </InputLabel>
              <Controller
                name="titleAR"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth />}
                {...register("titleAR", {
                  required: "titleAR Address is required",
                })}
              />
              {errors.titleAR?.type === "required" && (
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
                {t("descriptionAR")}
              </InputLabel>
              <Controller
                name="descriptionAR"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("descriptionAR", {
                  required: "descriptionAR Address is required",
                })}
              />
              {errors.descriptionAR?.type === "required" && (
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
                {t("titleEN")}
              </InputLabel>
              <Controller
                name="titleEN"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth />}
                {...register("titleEN", {
                  required: "titleEN Address is required",
                })}
              />
              {errors.titleEN?.type === "required" && (
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
                {t("descriptionEN")}
              </InputLabel>
              <Controller
                name="description_en"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("description_en", {
                  required: "descriptionAR Address is required",
                })}
              />
              {errors.description_en?.type === "required" && (
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
                {t("link")}
              </InputLabel>
              <Controller
                name="link" control={control}
                render={({ field }) => <TextField {...field} fullWidth />}
                
              />
              {errors.titleEN?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            <StepperButtonsGuest load={load} />
          </Box>
        </form>
      </Paper>
      </Grid>
        <Grid item xs={12} lg={3} sx={{ overflow: "hidden" }}>
        <Paper sx={{padding:"40px 20px" , margin:"auto" , marginTop:"0px"}}>
        
        <h3>هل تحتاج الي مساعدة ؟</h3>
        <p>تواصل معنا الان</p>

        <a target="_blank" href="mailto:info@muscatdrivingschool.com">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: "8px",
              justifyContent: "center",
              color: "#323232",
              margin : "auto",
              marginBottom: "12px",
              padding:"10px",
              border:"1px solid #323232",
              borderRadius : "15px",
              maxWidth:"230px" }}
          >
            <EmailOutlinedIcon sx={{ fontSize: "15px" }} />
            <Typography sx={{ fontSize: "14px" }}>
              info@muscatdrivingschool.com
            </Typography>
          </Box>
        </a>
        <a target="_blank" href={whatsAppLink || "/"}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: "8px",
              justifyContent: "center",
              color: "#323232",
              margin : "auto",
              marginBottom: "12px",
              padding:"10px",
              border:"1px solid #323232",
              borderRadius : "15px",
              maxWidth:"230px"
            }}
          >
            <ImageCall src={call} />
            <Typography sx={{ fontSize: "14px" }}>{t("call")}</Typography>
          </Box>
        </a>
        </Paper>
        </Grid>
        </Grid>
      </Container>
      
      
    </Navbar>
  );
}
