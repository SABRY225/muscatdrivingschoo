import React from "react";
import { Avatar, Box,  Button, Grid, Paper,  styled, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect }    from "react";
import { useTranslation } from "react-i18next";
import { useSelector }  from "react-redux";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import ShieldIcon       from "@mui/icons-material/Shield";
import Cookies          from "js-cookie";
import StarIcon         from "@mui/icons-material/Star";
import Loading          from "../../../components/Loading";
import verify           from "../../../images/verify.svg";
import video            from "../../../images/videosvg.svg";
import ReactCountryFlag from "react-country-flag";
import { useTeacherTests }        from "../../../hooks/useTeacherTests";
import currencies                   from "../../../data/currencies";
import AddIcon from '@mui/icons-material/Add';
const MatLink = styled(Link)({});
const Image = styled("img")({
  width: "25px",
  height: "25px",
});

export default function TeacherSearchBox({ teacher }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lang = Cookies.get("i18next") || "en";
  const { currency }            = useSelector((state) => state.currency);
  const { conversionRate }      = useSelector((state) => state.conversionRate);
  const { data, isLoadingTest } = useTeacherTests(teacher?.id);
  const [ Tests , setTests]     = useState([]);
  useEffect(() => {
    if (data?.data) {
      console.log("GET :: Tests");
      console.log(data);

      setTests(data.data);
    }
  }, [data]);
return (
<Paper sx={{ padding: "32px 24px", marginY: "20px" }}>
<Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={3}>
           <Avatar
      src={`${process.env.REACT_APP_API_KEY}images/${teacher?.image}`}
      variant="square"
      alt={teacher?.firstName}
      sx={{
        width: "100%",
        // maxWidth: "200px",
        maxHeight:"300px",
        aspectRatio: "2 / 3",
        height: "auto",
        objectFit: "cover",
        borderRadius: "8px"
      }}
    />
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ display: "flex", columnGap: "6px", alignItems: "start" }}>
            <Typography
              sx={{ fontSize: "18px", marginBottom: "8px", fontWeight: "700" }}
            >
              {teacher?.firstName} {teacher?.lastName}
            </Typography>
            <Link to={`/teacher/${teacher.id}`}>
              <Image src={verify} />
            </Link>
            <a href={teacher?.videoLink}>
              <Image src={video} />
            </a>
            {teacher.country && (
              <Box>
                <ReactCountryFlag
                  style={{
                    width: "1.5em",
                    height: "2em",
                    display: "flex",
                    alignItems: "start",
                    marginTop: "-2px",
                  }}
                  countryCode={teacher.country}
                  svg
                />
              </Box>
            )}
          </Box>
          {teacher?.F2FSessionStd?.discount > 0 && (
            <Box sx={{ backgroundColor: "#e2efff", width: "170px", mb: 2, p: 0.2 }}>
              <Typography>
                <img src="../gift.svg" alt="" />
                {t("discount_precent")} {teacher?.F2FSessionStd?.discount}%
              </Typography>
            </Box>
          )}
          {/* <Typography sx={{ fontSize: "15px", fontWeight: "600", marginBottom: "10px" }}>
            {lang === "en" ? teacher.shortHeadlineEn : teacher.shortHeadlineAr}
          </Typography> */}
          <Box
            sx={{display: "flex",columnGap: "4px",alignItems: "center",marginBottom: "8px",}}>
            <SpeakerNotesIcon sx={{ fontSize: "16px", color: "#d5d5d5" }} />
            <Typography sx={{ color: "#4f4f51", fontSize: "14px", fontWeight: "bold" }}>{t("location")}:{" "}</Typography>
            <Typography sx={{ color: "#616161", fontSize: "14px" }}>{teacher?.city}</Typography>
          </Box>
          
          <Box sx={{display: "flex",columnGap: "4px",alignItems: "center",marginBottom: "8px",}}>
            <ShieldIcon sx={{ fontSize: "16px", color: "#d5d5d5" }} />
            <Typography
              sx={{ color: "#4f4f51", fontSize: "14px", fontWeight: "bold" }}
            >
              {t("certifiedTeacher")}:{" "}
            </Typography>
            <Typography sx={{ color: "#616161", fontSize: "14px" }}>
              {teacher?.experienceYears} {teacher.experienceYearss}{" "}
              {t("yearsofexperience")}
            </Typography>
          </Box>
          <Typography sx={{ fontSize: "13px", width: "90%" }}>
<Box
  sx={{
    display: "-webkit-box",
    WebkitLineClamp: 3, // عدد الأسطر الظاهرة
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "400px", // أو أي عرض تريده
  }}
>
  {lang === "en" ? teacher?.descriptionEn : teacher?.descriptionAr}
</Box>

<MatLink
  to={`/teacher/${teacher.id}`}
  sx={{
    display: "inline-block",
    color: "#1a477e",
    fontSize: "13px",
    marginX: "5px",
  }}
>
  {t("read_more")}
</MatLink>

            <Box
              sx={{
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                columnGap: "8px",
              }}
            >
              <Typography sx={{ fontSize: "13px", fontWeight: "700" }}>
                {t("students_num")} {teacher.bookingNumbers}
              </Typography>
              <Typography sx={{ fontSize: "13px", fontWeight: "700" }}>
                {t("hours")} {teacher.hoursNumbers}
              </Typography>
            </Box>
            
            
            {!isLoadingTest ? (
            <>
            {
              Tests?.length == 0 ? "" : 
              <table className='table_test'>
                <tr>
                  <td> {t("level")} </td>
                  <td> {t("price")} </td>
                  <td> {t("currency")} </td>
                  <td> {t("book_test")} </td>
                </tr>
                { 
                  Tests.length > 0 ?
                  Tests.map((item) => {
                    console.log(item);
                    let current_currency;
                    current_currency = currencies.find((e) => e.title == item?.currency);
                    console.log(current_currency);

                  return (
                    <>
                    <tr>
                      <td>{ (lang === "en") ? item?.Level.titleEN : item?.Level.titleAR }</td>
                      <td>{item?.price}</td>
                      <td>{ (lang == "en") ? current_currency.titleEn : current_currency.titleAr}</td>
                      <Button className="btn-test" onClick={() => navigate(`/book-test/${item.id}`)}>
                        <AddIcon />
                      </Button>
                  </tr>
                      </>
                    );
                  })
                  : <tr><td colSpan={3}><p class='notfound'>{t("notfound_tests_teacher")}</p></td></tr>
                }
              </table>
            }
              </>
              ) : (
                <Loading />
              )
              }
              
          </Typography>
        </Grid>
<Grid item xs={12} lg={5}>
          {teacher?.rate != 0 && (
            <Box sx={{display: "flex",fontSize: "16px",marginBottom: "12px",columnGap: "4px",}}>
              <StarIcon sx={{ color: "#FDCC0D" }} />
              <Typography>{teacher?.rate}</Typography>
            </Box>
          )}
          <Button variant="contained" fullWidth onClick={() => navigate(`/teacher/${teacher.id}`)} sx={{ textTransform: "capitalize" }}>
            {t("requestBook")}
          </Button>
          <Button variant="outlined" fullWidth onClick={() => navigate(`/teacher/${teacher.id}`)}
            sx={{ marginTop: "16px", textTransform: "capitalize" }}>
            {t("contactTeacher")}
          </Button>
          {(teacher.F2FSessionStd ||
            teacher.F2FSessionTeacher ||
            teacher.RemoteSession) && (
            <Paper sx={{ marginTop: "20px", padding: "8px" }}>
              {teacher.F2FSessionStd && (
                <Typography sx={{ marginBottom: "5px", fontSize: "13px" }}>
                  {t("studenthome")} -{" "}
                  {(teacher.F2FSessionStd?.price * conversionRate).toFixed(2)}{" "}
                  {t(currency)}
                </Typography>
              )}
              {teacher.F2FSessionTeacher && (
                <Typography sx={{ marginBottom: "5px", fontSize: "13px" }}>
                  {t("teacherhome")} -{" "}
                  {(teacher.F2FSessionTeacher?.price * conversionRate).toFixed(
                    2
                  )}{" "}
                  {t(currency)}
                </Typography>
              )}
              {teacher.RemoteSession && (
                <Typography sx={{ fontSize: "13px" }}>
                  {t("onlineStudy")} -{" "}
                  {(teacher.RemoteSession?.price * conversionRate).toFixed(2)}{" "}
                  {t(currency)}
                </Typography>
              )}
            </Paper>
          )}

<Paper sx={{ marginTop: "20px", padding: "8px" }}>
    {teacher?.TeacherTypes?.length > 0 ? 
        <Box sx={{ display: "flex",  columnGap: "6px", alignItems: "center",  marginBottom: "8px",  }}>
            <Image
                  alt={lang==="ar"?teacher?.TeacherTypes[0]?.TrainingCategoryType.titleAR:teacher?.TeacherTypes[0]?.TrainingCategoryType.titleEN}
                  src={`${process.env.REACT_APP_API_KEY}images/${teacher?.TeacherTypes[0]?.TrainingCategoryType.image}`}
                  sx={{ width: "55px", height: "55px" , borderRadius:"12px" , border:"1px solid #CCC;" , padding:"2px"}}
                />
            <Typography
              sx={{ color: "#4f4f51", fontSize: "14px", fontWeight: "bold" }}
            >
              {t("title_TrainingCategoryTypes")}:{" "}
            </Typography>
            <Typography sx={{ color: "#616161", fontSize: "14px" }}>
              {lang === "ar"
                ? teacher?.TeacherTypes?.map(
                    (item) => item?.TrainingCategoryType?.titleAR + " " 
                  )
                : teacher?.TeacherTypes?.map(
                    (item) => item?.TrainingCategoryType?.titleEN + " "
              )}
            </Typography>
        </Box>
    : ""}
    {teacher?.TeacherLimits?.length > 0 ? 
        <Box  sx={{ display       : "flex",   columnGap     : "6px",   alignItems    : "center",  marginBottom  : "8px", }}>
            <Image
                  alt={lang==="ar"?teacher?.TeacherLimits[0]?.LimeType.titleAR:teacher?.TeacherLimits[0]?.LimeType.titleEN}
                  src={`${process.env.REACT_APP_API_KEY}images/${teacher?.TeacherLimits[0]?.LimeType.image}`}
                  sx={{ width: "55px", height: "55px" , borderRadius:"12px" , border:"1px solid #CCC;" , padding:"2px"}}
                />
            <Typography
              sx={{ color: "#4f4f51", fontSize: "14px", fontWeight: "bold" }}
            >
              {t("title_LimeType")}:{" "}
            </Typography>
            <Typography sx={{ color: "#616161", fontSize: "14px" }}>
              {lang === "ar"
                ? teacher?.TeacherLimits?.map(
                    (item) => item?.LimeType?.titleAR + " " 
                  )
                : teacher?.TeacherLimits?.map(
                    (item) => item?.LimeType?.titleEN + " "
                  )}
            </Typography>
        </Box>
    : ""}
  </Paper>
</Grid>
</Grid>
</Paper>
  );
}
