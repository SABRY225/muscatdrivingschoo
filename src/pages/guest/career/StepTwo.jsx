import React                    from "react";
import Navbar                   from "../../../components/Navbar";
import AdsStepper               from "../../../components/guest/AdsStepper";
import StepperButtonsGuest      from "../../../components/reusableUi/StepperButtonsGuest";
import { Controller, useForm }  from "react-hook-form";
import { Box, InputLabel, TextField, Typography ,Paper , styled , Button, Container, Grid} from "@mui/material";
import { useTranslation }       from "react-i18next";
import { useNavigate , useParams }  from "react-router-dom";
import { useSelector }          from "react-redux";
import { useState }             from "react";
import { useGuest }             from "../../../hooks/useGuest";
import { useEffect }            from "react";
import { useSnackbar }          from "notistack";
import { useSocialMedia }       from "../../../hooks/useSocialMedia";
import EmailOutlinedIcon        from "@mui/icons-material/EmailOutlined";
import call                     from "../../../images/callsvg.svg";
import Cookies from "js-cookie";
const Image = styled("img")({
  width: "300px",
});
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

export default function StepTwo() {
  const { CareerId }          = useParams();
  const lang                  = Cookies.get("i18next") || "en";
  const { guest, token }      = useSelector((state) => state.guest);
  const { data }              = useGuest(guest?.id);
  const [ load, setLoad ]     = useState(false);
  const navigate              = useNavigate();
  const [image,setImage]      = useState(null);
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
      descriptionEN: "",
    },
  });

  useEffect(() => {
    if (data) {
      const user = data?.data;
      reset({ titleAR: "",  titleEN: "",  descriptionAR: "", descriptionEN: "",  });
    }
  }, [data]);

  async function onSubmit(data) {
    console.log(CareerId);

    if( !data.titleAR ){
      enqueueSnackbar( t("title_en_required"), {
        variant: "error",
        autoHideDuration: 8000,
      });
      throw new Error("failed occured");
    }
    if( !data.titleEN ){
      enqueueSnackbar( t("title_ar_required"), {
        variant: "error",
        autoHideDuration: 8000,
      });
      throw new Error("failed occured");
    }
    //
    if (!image) {
      enqueueSnackbar( t("image_required"), {
        variant: "error",
        autoHideDuration: 8000,
      });
      throw new Error("failed occured");
  }

  console.log(data);

    const formData = new FormData();
    formData.append("image",          image);
    formData.append("titleAR",        data.titleAR);
    formData.append("titleEN",        data.titleEN);
    formData.append("descriptionAR",  data.descriptionAR);
    formData.append("descriptionEN",  data.descriptionEN);
    //formData.append("advertiserName", data.advertiserName);
    //formData.append("advertiserPhone", data.advertiserPhone);

    try {
      setLoad(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/guest/addcareer/step2/${CareerId}`,
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body:formData,
        }
      );
      const resData = await response.json();
      console.log(resData);
      if(response.status!==200&&response.status!==201)
      {
        throw new Error('failed occured')
      }

      enqueueSnackbar(
        lang === "ar" ? resData.msg.arabic : resData.msg.english, 
        {
        variant: "success",
        autoHideDuration: 1000,
      });
      navigate("/guest/career/details/" + CareerId);
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
                name="descriptionEN"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("descriptionEN", {
                  required: "descriptionAR Address is required",
                })}
              />
              {errors.descriptionEN?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
        </Box>
        <input type="file" id="image" hidden onChange={(e) => setImage(e.target.files[0])} />
        <Button variant="contained" color="secondary"
              sx={{ textTransform: "capitalize", padding: 0, marginBottom: "20px", }}
            >
            <InputLabel htmlFor="image">{t("addphoto")}</InputLabel>
        </Button>
        <Box>{image && <Image src={URL.createObjectURL(image)} />}</Box>

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
