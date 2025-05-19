import { Button, Container, Grid, Paper , styled , Typography , Box} from "@mui/material";
import React    , { useState , useEffect }    from "react";
import Navbar         from "../../components/Navbar";
import LinksFooter        from '../../components/client/home/LinksFooter'
import Footer             from '../../components/client/home/Footer'

import { usePackage } from "../../hooks/usePackage";
import { useNavigate, useParams } from "react-router-dom";
import Loading      from "../../components/Loading";
import Cookies from 'js-cookie';
import { useSelector }          from "react-redux";
import {useSnackbar}            from 'notistack'
import { useTranslation }       from "react-i18next";
import swal                     from "sweetalert";
import currencies               from "../../data/currencies";
import TeacherInfoBox           from "../../components/client/TeacherInfoBox";

const Label = styled("label")({
  width: "100%",
  display: "block",
  padding: "6px 16px",
  cursor: "pointer",
});

const Image = styled("img")({
  width: "300px",
});

export default function SinglePackage() {
  const { id }                        = useParams();
  const { student  , token}           = useSelector((state) => state.student);
  const [image, setImage]             = useState(null);
  const [currency, setCurrency]       = useState("");
  const [gender, setGender]           = useState("");
  const { data, isLoading }           = usePackage(id);
  const [teacher , setTeacher]        = useState("");
  
  const data_package     = data?.data;
  const url_image        = data_package?.image;
  const [imageUrl, setImageUrl] = useState(data_package?.image);

  const lang                  = Cookies.get("i18next") || "en";
  const {closeSnackbar,enqueueSnackbar} = useSnackbar()
  const { t }               = useTranslation();
  const navigate            = useNavigate();

  const handleGoTeacher = async () => {
    navigate(`/teacher/${data?.data.teacherId}`);
  };

  const handleRequestBookCourse = async () => {
    if (!student) {
      swal({ text: t("login_as_student"), icon: "error", button: t("ok") });
      return;
    }
    if(data_package.price != "0"){
      navigate(`/book-package/${data?.data.id}`);
    }else{

    closeSnackbar();
    try {
      const formData = new FormData();
      formData.append("StudentId"       , student.id);
      formData.append("PackageId"       , data_package?.id);
      formData.append("currency"        , data_package?.currency);

      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/student/registerPackage`,
        {
          method: "POST",
          headers: { Authorization: `${token}`},
          body:formData,
        }
      );
      if (res.ok) {
        const json = await res.json();
        if (lang === "en") {
          enqueueSnackbar(json.msg.english, { variant: "success" });
        } else {
          enqueueSnackbar(json.msg.arabic,  { variant: "success" });
        }
      } else {
        const json = await res.json();
        if (lang === "en") {
          enqueueSnackbar(json.message.english, { variant: "error" });
        } else {
          enqueueSnackbar(json.message.arabic, { variant: "error" });
        }
        
      }
    } catch (err) {
      enqueueSnackbar(t("somethingWentWrong"), { variant: "error" });
    }
    }
    //navigate(`/coursebook/${data?.data.id}`);
  };

  useEffect(() => {
    if (!data) return;
    const data_package = data?.data;
    let current_currency = "";
    current_currency = currencies.find((e) => e.title == data_package?.currency);
    setCurrency(current_currency);
    setTeacher(data_package?.Teacher);

    if(data_package?.gender == "male"){
      setGender ( t("male") );
    }else if(data_package?.gender == "female"){
      setGender ( t("female") );
    }else{
      setGender ( t("male&female") );
    }
  }, [data]);

  return (
    <Navbar>
      <div className="breadcrumb">
        <ul>
          <li><a href="/">{t("lnk_home")}</a></li>
          <li><a href="/">{t("lnk_package")}</a></li>
          <li><a href="javascript:void(0);">{lang==="ar"?data_package?.titleAR:data_package?.titleEN}</a></li>
        </ul>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <Container sx={{ marginBottom: "40px", marginTop: "20px" }}>
          <Grid container spacing={3}>
            <Grid data md={12} lg={8}>
            <Paper
              sx={{ padding: "8px 20px", display: "flex",flexDirection: "column",
                    alignItems: "center",margin: "10px" }}
            >
             
                <Image
                  alt={lang==="ar"?data_package?.titleAR:data_package?.titleEN}
                  src={`${process.env.REACT_APP_API_KEY}images/${data_package?.image}`}
                  sx={{ width: "100%", height: "100%", fontSize: "42px" }}
                />

              <Typography sx={{
                        fontWeight: "500", marginTop:    "20px",fontSize:   "16px",
                        minHeight:  "auto",color:"#212121", width :"100%" 
                      }}
                >
                  {lang==="ar"?data_package?.titleAR:data_package?.titleEN}
              </Typography>

              <Typography
                      sx={{
                        fontWeight: "500",  marginTop:    "10px",    fontSize:   "13px",
                        minHeight:  "50px", color:"#888" , width :"100%"
                      }}
                    >
                 {lang==="ar"?data_package?.descriptionAr:data_package?.descriptionEn}
              </Typography>

            <Box sx={{ display: "flex", alignItems: "center" , width : "100%"}}>
              <Label> {t("package_trainingtype")} </Label>
              <Typography variant="h6" sx={{ fontSize: "13px", color: "#888" , width:"50%" , textAlign:"left"}} component="div">
              { lang==="ar"? data_package?.TrainingCategoryType.titleAR :  data_package?.TrainingCategoryType.titleEN}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" , width : "100%"}}>
              <Label> {t("package_limittype")} </Label>
              <Typography variant="h6" sx={{ fontSize: "13px", color: "#888" , width:"50%" , textAlign:"left"}} component="div">
              { lang==="ar"? data_package?.LimeType.titleAR :  data_package?.LimeType.titleEN}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" , width : "100%"}}>
              <Label> {t("package_level")} </Label>
              <Typography variant="h6" sx={{ fontSize: "13px", color: "#888" , width:"50%" , textAlign:"left"}} component="div">
              { lang==="ar"? data_package?.Level?.titleAR :  data_package?.Level?.titleEN}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" , width : "100%"}}>
              <Label> {t("package_subject")} </Label>
              <Typography variant="h6" sx={{ fontSize: "13px", color: "#888" , width:"50%" , textAlign:"left"}} component="div">
              { lang==="ar"? data_package?.SubjectCategory?.titleAR :  data_package?.SubjectCategory?.titleEN}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" , width : "100%"}}>
              <Label> {t("package_gender")} </Label>
              <Typography variant="h6" sx={{ fontSize: "13px", color: "#888" , width:"50%" , textAlign:"left"}} component="div">
              { gender }
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" , width : "100%"}}>
              <Label> {t("package_duration")} </Label>
              <Typography variant="h6" sx={{ fontSize: "13px", color: "#888" , width:"50%" , textAlign:"left;"}} component="div">
              {data_package?.duration}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" , width : "100%"}}>
              <Label> {t("package_numTotalLesson")} </Label>
              <Typography variant="h6" sx={{ fontSize: "13px", color: "#888" , width:"50%" , textAlign:"left"}} component="div">
              {data_package?.numTotalLesson}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" , width : "100%"}}>
              <Label> {t("package_numWeekLesson")} </Label>
              <Typography variant="h6" sx={{ fontSize: "13px", color: "#888" , width:"50%" , textAlign:"left"}} component="div">
              {data_package?.numWeekLesson}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" , width : "100%"}}>
              <Label> {t("package_startDate")} </Label>
              <Typography variant="h6" sx={{ fontSize: "13px", color: "#888" , width:"50%" , textAlign:"left"}} component="div">
              {data_package?.startDate}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" , width : "100%"}}>
              <Label> {t("package_endDate")} </Label>
              <Typography variant="h6" sx={{ fontSize: "13px", color: "#888" , width:"50%" , textAlign:"left"}} component="div">
              {data_package?.endDate}
              </Typography>
            </Box>

            <Box sx={{ display: "flex", alignItems: "center" , width : "100%"}}>
              <Label> {t("package_price")} </Label>
              <Typography variant="h6" sx={{ fontSize: "18px", color: "#800000" , width:"50%" , textAlign:"left"}} component="div" className="h4_price">
              
              {  data_package?.price == "0" ? t("price_free") : ( data_package?.price ) }
              { (data_package.price != "0" ? ( lang == "ar" ) ? currency?.titleAr : currency?.titleEn : "") }
              </Typography>
            </Box>

            </Paper>
            </Grid>
            <Grid data md={12} lg={4}>
              <TeacherInfoBox teacher={teacher} />
              <Paper sx={{ padding: "24px 12px", marginTop: "30px" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ textTransform: "capitalize", marginBottom: "16px" }}
                  onClick={handleRequestBookCourse}
                >
                  {t("requestPackageBook")}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ textTransform: "capitalize" }}
                  onClick={handleGoTeacher}
                >
                  {t("contactTeacher")}
                </Button>
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
