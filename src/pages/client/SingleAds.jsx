import { Box, Container, Grid, Paper , styled , Typography} from "@mui/material";
import React    , { useState , useEffect }    from "react";
import Navbar             from "../../components/Navbar";
import LinksFooter        from '../../components/client/home/LinksFooter'
import Footer             from '../../components/client/home/Footer'
import { useNavigate, useParams } from "react-router-dom";
import Loading            from "../../components/Loading";
import Cookies            from 'js-cookie';
import { useSelector }    from "react-redux";
import {useSnackbar}      from 'notistack'
import { useTranslation }     from "react-i18next";
import EmailOutlinedIcon      from "@mui/icons-material/EmailOutlined";
import { useSocialMedia }     from "../../hooks/useSocialMedia";
import { useAdsSingle }       from "../../hooks/useAdsSingle";
import AdsImages              from "../../components/guest/AdsImages";
import call                   from "../../images/callsvg.svg";
import currencies             from "../../data/currencies";
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
export default function SingleDiscount() {
  const { AdsId }         = useParams();
  const [image, setImage]                      = useState(null);
  const [currentObject, setCurrentObject]      = useState([]);
  const { data, isLoading }                    = useAdsSingle(AdsId);
  
  const lang                  = Cookies.get("i18next") || "en";
  const {closeSnackbar,enqueueSnackbar} = useSnackbar()
  const { t }               = useTranslation();
  const navigate            = useNavigate();
  const { dataSocial } = useSocialMedia();
  const links = dataSocial?.data;
  const whatsAppLink = links
    ?.filter((obj) => obj.type === "Whatsapp")
    .map((obj) => obj.link);

  useEffect(() => {
  if (data?.data) {
      const alldata = data?.data;
  }

  }, [data]);


  let current_currency = "";
  current_currency = currencies.find((e) => e.title == data?.data?.currency);
  return (
    <Navbar>
      <div className="breadcrumb">
        <ul>
          <li><a href="/home">{t("lnk_home")}</a></li>
          <li><a href="/home">{t("lnk_ads")}</a></li>
          <li><a href="javascript:void(0);">{lang==="ar"?data?.data?.titleAR:data?.data?.titleEN}</a></li>
        </ul>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <Container sx={{ marginTop: "20px", marginBottom: "60px" }}>
      <Grid container spacing={2}>
      <Grid item xs={12} lg={9}>
      <Paper sx={{padding:"40px 20px"}}>
      <table className="table_student">
            <tr>
              <td><h4> {t("titleAR")} </h4></td>
              <td> <p> <p>{data?.data?.titleAR}</p> </p></td>
            </tr>
            <tr>
              <td><h4> {t("titleEN")} </h4></td>
              <td> <p> <p>{data?.data?.titleEN}</p> </p></td>
            </tr>
            <tr>
              <td><h4> {t("descriptionAR")} </h4></td>
              <td> <p> <p>{data?.data?.descriptionAR}</p> </p></td>
            </tr>
            <tr>
              <td><h4> {t("descriptionEN")} </h4></td>
              <td> <p> <p>{data?.data?.descriptionEN}</p> </p></td>
            </tr>
            <tr>
              <td><h4> {t("link")} </h4></td>
              <td> <p> <p>{data?.data?.link}</p> </p></td>
            </tr>
            <tr>
              <td><h4> {t("departmentAds")} </h4></td>
              <td> <p> <p>{data?.data?.AdsDepartment.titleEN}</p> </p></td>
            </tr>

            <tr>
              <td><h4> {t("price")} </h4></td>
              <td> <p>{data?.data?.carPrice} { ( lang == "ar" ) ? current_currency?.titleAr : current_currency?.titleEn }</p></td>
            </tr>

            <tr>
              <td><h4> {t("carModel")} </h4></td>
              <td><p>{data?.data?.carModel == "" ? t("carModel_notfound") : data?.data?.carModel}</p></td>
            </tr>

            <tr>
              <td><h4> {t("yearManufacture")} </h4></td>
              <td><p>{data?.data?.yearManufacture == "" ? t("yearManufacture_notfound") : data?.data?.yearManufacture}</p></td>
            </tr>

    <tr>
      <td><h4> {t("advertiserPhone")} </h4></td>
      <td> <p> <p>{data?.data?.advertiserPhone}</p> </p></td>
    </tr>

        <tr>
          <td><h4>{t("images")}</h4></td>
          <td> 
            <p>
            <AdsImages AdsId={AdsId} />
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
      </Container>
      )}
      <LinksFooter/>
      <Footer/>
    </Navbar>
  );
}
