import { Button, Container, Grid, Paper , styled , Typography} from "@mui/material";
import React    , { useState , useEffect }    from "react";
import Navbar             from "../../components/Navbar";
import LinksFooter        from '../../components/client/home/LinksFooter'
import Footer             from '../../components/client/home/Footer'
import { useDrivingLicenses } from "../../hooks/useDrivingLicenses";
import { useNavigate, useParams } from "react-router-dom";
import Loading            from "../../components/Loading";
import Cookies            from 'js-cookie';
import { useSelector }    from "react-redux";
import {useSnackbar}      from 'notistack'
import { useTranslation } from "react-i18next";
import swal               from "sweetalert";

const Label = styled("label")({
  width: "100%",
  display: "block",
  padding: "6px 16px",
  cursor: "pointer",
});

const Image = styled("img")({
  width: "300px",
});

export default function SingleCourse() {
  const { id }                  = useParams();
  const { student  , token}             = useSelector((state) => state.student);
  const [image, setImage]                        = useState(null);
  const [currentObject, setCurrentObject]       = useState([]);

  const { data, isLoading } = useDrivingLicenses();
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
    // Codeing to book currentObject
    closeSnackbar();
    try {
      const formData = new FormData();
      formData.append("StudentId"       , student.id);
      formData.append("TeacherLectureId", currentObject?.id);

      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/student/registerLecture`,
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
          enqueueSnackbar(json.msg.arabic, { variant: "success" });
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
    //navigate(`/coursebook/${data?.data.id}`);
  };

  useEffect(() => {
    if (data?.data) {
      const alldata = data?.data;
      let c = alldata.find((e) => e.id == id)
      setCurrentObject(c);
  }

  }, [data]);

  return (
    <Navbar>
      <div className="breadcrumb">
        <ul>
          <li><a href="/home">{t("lnk_home")}</a></li>
          <li><a href="/driving-licenses">{t("lnk_driving")}</a></li>
          <li><a href="javascript:void(0);">{lang==="ar"?currentObject?.titleAR:currentObject?.titleEN}</a></li>
        </ul>
      </div>

      {isLoading ? (
        <Loading />
      ) : (
        <Container sx={{ marginBottom: "40px" }}>
          <Paper
              sx={{ padding: "8px 20px", display: "flex",flexDirection: "column",
                    alignItems: "center",margin: "10px" }}
            >
             
                <Image
                  alt={lang==="ar"?currentObject?.titleAR:currentObject?.titleEN}
                  src={`${process.env.REACT_APP_API_KEY}images/${currentObject?.image}`}
                  sx={{ width: "200px", height: "200px", marginTop:"40px" , borderRadius:"50%" , border:"2px solid #efefef" , padding:"10px"}}
                />

              <Typography sx={{
                        fontWeight: "500", marginTop:    "20px",fontSize:   "16px",
                        minHeight:  "auto",color:"#212121", width :"100%" , textAlign:"center"
                      }}
                >
                  {lang==="ar"?currentObject?.titleAR:currentObject?.titleEN}
              </Typography>

              <Typography
                      sx={{
                        fontWeight: "500",  marginTop:    "10px",    fontSize:   "13px",
                        minHeight:  "50px", color:"#888" , width :"100%" , textAlign : "center"
                      }}
                    >
                 {lang==="ar"?currentObject?.requirementsAR:currentObject?.requirementsEN}
              </Typography>

          </Paper>
        </Container>
      )}
      <LinksFooter/>
      <Footer/>
    </Navbar>
  );
}
