import { Button, Container, Grid, Paper , styled , Typography} from "@mui/material";
import React    , { useState , useEffect }    from "react";
import Navbar             from "../../components/Navbar";
import LinksFooter        from '../../components/client/home/LinksFooter'
import Footer             from '../../components/client/home/Footer'
import { useDiscounts }    from "../../hooks/useDiscounts";
import { useNavigate, useParams } from "react-router-dom";
import Loading            from "../../components/Loading";
import Cookies            from 'js-cookie';
import { useSelector }    from "react-redux";
import {useSnackbar}      from 'notistack'
import { useTranslation } from "react-i18next";
import swal               from "sweetalert";
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

export default function SingleDiscount() {
  const { id }                              = useParams();
  const { student  , token}                 = useSelector((state) => state.student);
  const [image, setImage]                   = useState(null);
  const [currentObject, setCurrentObject]   = useState([]);

  const { data, isLoading }           = useDiscounts();
  const [teacher , setTeacher]        = useState("");
  const lang                          = Cookies.get("i18next") || "en";
  const {closeSnackbar,enqueueSnackbar} = useSnackbar()
  const { t }                         = useTranslation();
  const navigate                      = useNavigate();

  const handleGoTeacher = async () => {
    navigate(`/teacher/${data?.data.teacherId}`);
  };

  useEffect(() => {
    if (data?.data) {
      const alldata = data?.data;
      let c   = alldata.find((e) => e.id == id)
      setCurrentObject(c);
      setTeacher(c?.Teacher);
  }
  }, [data]);

  const handleRequestDiscount = async () => {
    if (!student) {
      swal({ text: t("login_as_student"), icon: "error", button: t("ok") });
      return;
    }
    navigate(`/book-discount/${id}`);
  }

  return (
    <Navbar>
      <div className="breadcrumb">
        <ul>
          <li><a href="/home">{t("lnk_home")}</a></li>
          <li><a href="/driving-licenses">{t("lnk_discounts")}</a></li>
          <li><a href="javascript:void(0);">{lang==="ar"?currentObject?.titleAR:currentObject?.titleEN}</a></li>
        </ul>
      </div>

      <br />

      {isLoading ? (
        <Loading />
      ) : (
        <Container sx={{ marginBottom: "40px" }}>
          <Grid container spacing={3}>
          <Grid data md={12} lg={8}>
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

              <table className="table_student">
                            <tr>
                                <td>{t("conditions")}</td>
                                <td>{(lang === "ar" ? currentObject.conditionsAR : currentObject.conditionsEN)}</td>
                            </tr>

                            <tr>
                                <td>{t("discount_startDate")}</td>
                                <td>{currentObject.startDate }</td>
                            </tr>

                            <tr>
                                <td>{t("discount_endDate")}</td>
                                <td>{currentObject.endDate }</td>
                            </tr>
                            <tr>
                                <td>{t("discount_amountBeforeDiscount")}</td>
                                <td>{currentObject.amountBeforeDiscount }</td>
                            </tr>
                            <tr>
                                <td>{t("discount_amountAfterDiscount")}</td>
                                <td>{currentObject.amountAfterDiscount }</td>
                            </tr>
                            
                        </table>

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
                  onClick={handleRequestDiscount}
                >
                  {t("requestDiscountBook")}
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
