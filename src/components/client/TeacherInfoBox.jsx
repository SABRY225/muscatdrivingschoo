import React from "react";
import { Avatar, Box,  Button, Grid, Paper,  styled, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector }  from "react-redux";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import ShieldIcon       from "@mui/icons-material/Shield";
import Cookies          from "js-cookie";
import StarIcon         from "@mui/icons-material/Star";
import verify           from "../../images/verify.svg";
import video            from "../../images/videosvg.svg";
import ReactCountryFlag from "react-country-flag";


const MatLink = styled(Link)({});
const Image = styled("img")({
  width: "25px",
  height: "25px",
});

export default function TeacherInfoBox({ teacher }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lang = Cookies.get("i18next") || "en";
  const { currency } = useSelector((state) => state.currency);
  const { conversionRate } = useSelector((state) => state.conversionRate);
  return (
<Paper sx={{ padding: "32px 24px", marginY: "10px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={5} lg={5}>
          <Avatar
            src={`${process.env.REACT_APP_API_KEY}images/${teacher?.image}`}
            variant="square"
            sx={{ width: "100%", height: "100%", fontSize: "30px" }}
            alt={teacher?.firstName}
          />
        </Grid>
        <Grid item xs={12} md={7} lg={7}>
          <Box sx={{ display: "block", columnGap: "6px", alignItems: "start" }}>
            <Typography
              sx={{ fontSize: "18px", marginBottom: "8px", fontWeight: "700" }}
            >
              {teacher?.firstName} {teacher?.lastName}
            </Typography>
            <div sx={{display:"block", width:"100%"}}>
            <Link to={`/teacher/${teacher.id}`}>
              <Image src={verify} sx={{display:"inline-block" , marginRight:"10px" , marginLeft:"10px"}}></Image>
            </Link>
            <a href={teacher?.videoLink} sx={{display:"inline-block"}}>
              <Image src={video} sx={{display:"inline-block" , marginRight:"10px" , marginLeft:"10px"}}></Image>
            </a>
            {teacher.country && (
              <Box sx={{display:"inline-block" , marginRight:"10px" , marginLeft:"10px"}}>
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
            </div>
          </Box>
          {teacher?.F2FSessionStd?.discount > 0 && (
            <Box
              sx={{ backgroundColor: "#e2efff", width: "170px", mb: 2, p: 0.2 }}
            >
              <Typography>
                <img src="../gift.svg" alt="" />
                {t("discount_precent")} {teacher?.F2FSessionStd?.discount}%
              </Typography>
            </Box>
          )}
          <Typography
            sx={{ fontSize: "15px", fontWeight: "600", marginBottom: "10px" }}
          >
            {lang === "en" ? teacher.shortHeadlineEn : teacher.shortHeadlineAr}
          </Typography>
          <Box
            sx={{
              display: "flex",
              columnGap: "4px",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <SpeakerNotesIcon sx={{ fontSize: "16px", color: "#d5d5d5" }} />
            <Typography
              sx={{ color: "#4f4f51", fontSize: "14px", fontWeight: "bold" }}
            >
              {t("location")}:{" "}
            </Typography>
            <Typography sx={{ color: "#616161", fontSize: "14px" }}>
              {teacher?.city}
            </Typography>
          </Box>
          
          <Box
            sx={{display: "flex",columnGap: "4px",alignItems: "center",marginBottom: "8px",}}
          >
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
            {lang === "en" ? teacher?.descriptionEn : teacher?.descriptionAr}
            <MatLink
              to={`/teacher/${teacher.id}`}
              sx={{
                marginRight: "4px",
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
          </Typography>

          <Grid item xs={12} lg={8}>
          {teacher?.rate != 0 && (
            <Box
              sx={{
                display: "flex",
                fontSize: "16px",
                marginBottom: "12px",
                columnGap: "4px",
              }}
            >
              <StarIcon sx={{ color: "#FDCC0D" }} />
              <Typography>{teacher?.rate}</Typography>
            </Box>
          )}
         
          {(teacher.F2FSessionStd ||
            teacher.F2FSessionTeacher ||
            teacher.RemoteSession) && (
            <Paper sx={{ marginTop: "20px", padding: "8px" }}>
              {teacher.F2FSessionStd && (
                <Typography sx={{ marginBottom: "5px", fontSize: "13px" }}>
                  {t("studenthome")} -{" "}
                  {(teacher.F2FSessionStd?.price * conversionRate).toFixed(2)}{" "}
                  {currency}
                </Typography>
              )}
              {teacher.F2FSessionTeacher && (
                <Typography sx={{ marginBottom: "5px", fontSize: "13px" }}>
                  {t("teacherhome")} -{" "}
                  {(teacher.F2FSessionTeacher?.price * conversionRate).toFixed(
                    2
                  )}{" "}
                  {currency}
                </Typography>
              )}
              {teacher.RemoteSession && (
                <Typography sx={{ fontSize: "13px" }}>
                  {t("onlineStudy")} -{" "}
                  {(teacher.RemoteSession?.price * conversionRate).toFixed(2)}{" "}
                  {currency}
                </Typography>
              )}


              
            </Paper>
          )}

        </Grid>
        </Grid>
      </Grid>
</Paper>
  );
}
