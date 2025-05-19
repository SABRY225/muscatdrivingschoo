import React from "react";
import Navbar               from "../../../components/Navbar";
import AdsStepper           from "../../../components/guest/AdsStepper";
import { Controller, useForm } from "react-hook-form";
import { Box, InputLabel, TextField, Typography ,Paper , styled , Container, Grid} from "@mui/material";
import StepperButtonsGuest      from "../../../components/reusableUi/StepperButtonsGuest";
import { useTranslation } from "react-i18next";
import { useNavigate , useParams }  from "react-router-dom";
import { useSelector }              from "react-redux";
import { useState }                 from "react";
import { useGuest }                 from "../../../hooks/useGuest";
import { useEffect }                from "react";
import { useSnackbar }              from "notistack";
import { useSocialMedia }           from "../../../hooks/useSocialMedia";
import { useCareer }                from "../../../hooks/useCareer";
import Loading                      from "../../../components/Loading";
import EmailOutlinedIcon            from "@mui/icons-material/EmailOutlined";
import call                         from "../../../images/callsvg.svg";
import Cookies                      from 'js-cookie';
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

const Image = styled("img")({
  width: "300px",
});

export default function Details() {
  const lang                   = Cookies.get("i18next") || "en";
  const { t }                  = useTranslation();
  const { CareerId }           = useParams();
  const { guest, token }       = useSelector((state) => state.guest);
  const { data , isLoading}    = useCareer(CareerId);
  const [ career , setCareer ] = useState();
 console.log(data);

 useEffect(() => {
  if (!data) return;
  console.log("Get DATA");
  
    setCareer(data?.data);
    console.log(career);
}, [data]);


  const navigate          = useNavigate();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { dataSocial } = useSocialMedia();
  const links = dataSocial?.data;
  const whatsAppLink = links
    ?.filter((obj) => obj.type === "Whatsapp")
    .map((obj) => obj.link);

  return (
    <Navbar>
      <AdsStepper active={2} title={t("Description")}></AdsStepper>
      <Container sx={{ marginTop: "20px", marginBottom: "60px" }}>

      {isLoading ? (
        <Loading />
      ) : (

      <Grid container spacing={2}>
      <Grid item xs={12} lg={9}>
      <Paper sx={{padding:"40px 20px"}}>
      <table className="table_student">
            <tr>
              <td><h4> {t("titleAR")} </h4></td>
              <td> <p>{data?.data?.titleAR}</p></td>
            </tr>
            <tr>
              <td><h4> {t("titleEN")} </h4></td>
              <td> <p>{data?.data?.titleEN}</p></td>
            </tr>
            <tr>
              <td><h4> {t("descriptionAR")} </h4></td>
              <td> <p>{data?.data?.descriptionAr}</p></td>
            </tr>
            <tr>
              <td><h4> {t("descriptionEN")} </h4></td>
              <td> <p>{data?.data?.descriptionEn}</p></td>
            </tr>
            <tr>
              <td><h4> {t("departmentCareer")} </h4></td>
              <td> 
                <p>
                  {lang==="ar"?data?.data?.CareerDepartment.titleAR:data?.data?.CareerDepartment.titleEN}
                </p>
              </td>
            </tr>

            <tr>
              <td><h4> {t("advertiserPhone")} </h4></td>
              <td> <p>{data?.data?.Guest.phoneNumber}</p></td>
            </tr>

        <tr>
          <td><h4>{t("images")}</h4></td>
          <td> 
            <p>
            <Image
                  alt={lang==="ar"?data?.data?.titleAR:data?.data?.titleEN}
                  src={`${process.env.REACT_APP_API_KEY}images/${data?.data?.image}`}
                  sx={{ width: "300px", height: "auto", fontSize: "42px" }}
                />
            </p>
          </td>
        </tr>
      </table>
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
      )}
      </Container>
    </Navbar>
  );
}
