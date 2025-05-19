import { Button, Container, Grid, Paper , styled , Typography} from "@mui/material";
import React    , { useState , useEffect }    from "react";
import Navbar                         from "../../components/Navbar";
import LinksFooter                    from '../../components/client/home/LinksFooter';
import Footer                         from '../../components/client/home/Footer';
import { useTeacherLecture }          from "../../hooks/useTeacherLecture";
import { useNavigate, useParams }     from "react-router-dom";
import Loading                        from "../../components/Loading";
import Cookies                        from 'js-cookie';
import { useSelector }                from "react-redux";
import {useSnackbar}                  from 'notistack'
import { useTranslation }             from "react-i18next";
import swal                           from "sweetalert";
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

export default function SingleCourse() {
  const { id }                        = useParams();
  const { student  , token}           = useSelector((state) => state.student);
  const [image, setImage]             = useState(null);
  const {data,    isLoading }         = useTeacherLecture(id);
  const [teacher , setTeacher]        = useState("");
  const lecture = data?.data;
  const url_image = lecture?.image;
  const [imageUrl, setImageUrl] = useState(lecture?.image);

  const lang                  = Cookies.get("i18next") || "en";
  const {closeSnackbar,enqueueSnackbar} = useSnackbar()
  const { t }               = useTranslation();
  const navigate            = useNavigate();

  const handleGoTeacher = async () => {
    navigate(`/teacher/${data?.data.TeacherId}`);
  };

  const handleRequestBook = async () => {
    if (!student) {
      swal({ text: t("login_as_student"), icon: "error", button: t("ok") });
      return;
    }
    navigate(`/book/${data?.data.id}`);
  };

  const handleRequestBookCourse = async () => {
    if (!student) {
      swal({ text: t("login_as_student"), icon: "error", button: t("ok") });
      return;
    }
    navigate(`/book-lecture/${data?.data.id}`);

    // Codeing to book lecture
    /*
    closeSnackbar();
    try {
      const formData = new FormData();
      formData.append("StudentId"       , student.id);
      formData.append("TeacherLectureId", lecture?.id);

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
    */
    //navigate(`/coursebook/${data?.data.id}`);
  };

  useEffect(() => {
    if (!data) return;
    const lecture = data?.data;
    setTeacher(lecture?.Teacher);
  }, [data]);

  return (
    <Navbar>
      <div className="breadcrumb">
        <ul>
          <li><a href="/home">{t("lnk_home")}</a></li>
          <li><a href="/lectures">{t("lnk_course")}</a></li>
          <li><a href="javascript:void(0);">{lang==="ar"?lecture?.titleAR:lecture?.titleEN}</a></li>
        </ul>
      </div>

      {!isLoading ? (
        <Container sx={{ marginBottom: "40px", marginTop: "40px" }}>
          <Grid container spacing={3}>
            <Grid data md={12} lg={8}>
            <Paper
              sx={{ padding: "8px 20px", display: "flex",flexDirection: "column",
                    alignItems: "center",margin: "10px" }}
            >
             
                <Image
                  alt={lang==="ar"?lecture?.titleAR:lecture?.titleEN}
                  src={`${process.env.REACT_APP_API_KEY}images/${lecture?.image}`}
                  sx={{ width: "100%", height: "100%", fontSize: "42px" }}
                />

              <Typography sx={{
                        fontWeight: "500", marginTop:    "20px",fontSize:   "16px",
                        minHeight:  "auto",color:"#212121", width :"100%" 
                      }}
                >
                  {lang==="ar"?lecture?.titleAR:lecture?.titleEN}
              </Typography>

              
              <Typography
                      sx={{
                        fontWeight: "500",  marginTop:    "10px",    fontSize:   "13px",
                        minHeight:  "50px", color:"#888" , width :"100%"
                      }}
                    >
                 {lang==="ar"?lecture?.descriptionAr:lecture?.descriptionEn}
              </Typography>

            </Paper>
            </Grid>
            <Grid data md={12} lg={4}>
              <TeacherInfoBox teacher={teacher} />
              <Paper sx={{ padding: "24px 12px", margin: "10px" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ textTransform: "capitalize", marginBottom: "16px" }}
                  onClick={handleRequestBookCourse}
                >
                  {t("requestCourseBook")}
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
      )
    :
    (
      <Loading />
    )
    }
      <LinksFooter/>
      <Footer/>
    </Navbar>
  );
}
