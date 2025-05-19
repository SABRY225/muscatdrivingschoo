import React, { useEffect, useState } from "react";

import { useForm, Controller }  from "react-hook-form";
import { Box, Container, Grid,   styled,  RadioGroup,   TextField,  Typography,   Paper} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector }    from "react-redux";
import { useNavigate }    from "react-router-dom";
import { useGuest }       from "../../../hooks/useGuest";
import { useSnackbar }    from "notistack";
import { useSocialMedia } from "../../../hooks/useSocialMedia";
import EmailOutlinedIcon              from "@mui/icons-material/EmailOutlined";
import call                           from "../../../images/callsvg.svg";
import AdsStepperCareer               from "../../../components/guest/AdsStepperCareer";
import StepperButtonsGuest            from "../../../components/reusableUi/StepperButtonsGuest";
import CheckBoxCategoriesCareer       from "../../../components/guest/CheckBoxCategoriesCareer";
import Navbar                         from "../../../components/Navbar";
import Cookies from "js-cookie";
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

export default function StepOne() {
  const { t }                     = useTranslation();
  const lang                      = Cookies.get("i18next") || "en";
  const [checked, setChecked]     = useState([]);
  const {guest, token}            = useSelector((state) => state.guest);
  const { data }                  = useGuest(guest.id);
  const [load, setLoad]           = useState(false);
  const navigate                  = useNavigate();
  const { closeSnackbar, enqueueSnackbar} = useSnackbar();
  const [profit, setProfit]       = useState("");

  const { dataSocial } = useSocialMedia();
  const links = dataSocial?.data;
  const whatsAppLink = links
    ?.filter((obj) => obj.type === "Whatsapp")
    .map((obj) => obj.link);
  const {
    register, control, formState: { errors },  handleSubmit, reset,
  } = useForm({
    defaultValues: {
    },
  });
  useEffect(() => {
   
  }, []);

  useEffect(() => {

    if (!data) return;
    const user = data?.data;
    console.log(user);
    /*
    setChecked(
      user?.AdsDepartments.map((l) => {
        return { CareerDepartmentId: l.CareerDepartmentId, TeacherId: l.TeacherId };
      })
    );
    */
    
    reset({
      
    });
  }, [data]);

  const onSubmit = async (passedData) => {
    console.log(guest);
    
    setLoad(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/guest/addcareer/step1/${guest.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            CareerDepartmentId      : checked,
            advertiserPhone         : guest?.phoneNumber,
            advertiserName          : guest?.name,
            
          }),
        }
      );
      const resData = await response.json();
      console.log("response: ", resData);
      console.log(resData.data);
      setLoad(false);
      if (resData.status !== 200 && resData.status !== 201) {
        console.log("some error Occurred, response is: ", resData);
        throw new Error("");
      } else {
        enqueueSnackbar(
          lang === "ar" ? resData.msg.arabic : resData.msg.english, 
          {
          variant: "success",
          autoHideDuration: 1000, }
        );
        navigate("/guest/create-career/step2/" + resData.data.id);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Navbar>
      <AdsStepperCareer title={t("Career")} active={0}></AdsStepperCareer>
      <Container sx={{ marginTop: "40px", marginBottom: "60px" }}>
        <Grid container spacing={2}>
        <Grid item xs={12} lg={9}>
        <Paper sx={{padding:"40px 20px" , margin:"auto" , marginTop:"0px"}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CheckBoxCategoriesCareer  checked={checked} setChecked={setChecked} />
          <StepperButtonsGuest load={load} skipLink="step2" />
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
