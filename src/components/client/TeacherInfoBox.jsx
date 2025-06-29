import React from "react";
import {
  Avatar,
  Box,
  Button,
  Grid,
  Paper,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import ShieldIcon from "@mui/icons-material/Shield";
import StarIcon from "@mui/icons-material/Star";
import Cookies from "js-cookie";
import verify from "../../images/verify.svg";
import video from "../../images/videosvg.svg";
import ReactCountryFlag from "react-country-flag";

const MatLink = styled(Link)({});
const SmallIcon = styled("img")({
  width: "24px",
  height: "24px",
  marginInline: "6px",
  verticalAlign: "middle",
});

export default function TeacherInfoBox({ teacher }) {
  const { t } = useTranslation();
  const lang = Cookies.get("i18next") || "en";
  const { currency } = useSelector((state) => state.currency);
  const { conversionRate } = useSelector((state) => state.conversionRate);

  return (
    <Paper sx={{ padding: { xs: 2, md: 4 }, marginY: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Avatar
            src={`${process.env.REACT_APP_API_KEY}images/${teacher?.image}`}
            variant="square"
            sx={{
             width: "141px", height: "141px" ,
              borderRadius: "16px",
            }}
            alt={teacher?.firstName}
          />
        </Grid>

        <Grid item xs={12} md={7}>
          <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
            {teacher?.firstName} {teacher?.lastName}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", mb: 2 }}>
            <Link to={`/teacher/${teacher.id}`}>
              <SmallIcon src={verify} alt="verify" />
            </Link>
            {teacher?.videoLink && (
              <a href={teacher.videoLink} target="_blank" rel="noreferrer">
                <SmallIcon src={video} alt="video" />
              </a>
            )}
            {teacher.country && (
              <ReactCountryFlag
                countryCode={teacher.country}
                svg
                style={{
                  width: "1.5em",
                  height: "1em",
                  marginInline: "6px",
                }}
              />
            )}
          </Box>

          {teacher?.F2FSessionStd?.discount > 0 && (
            <Box
              sx={{
                backgroundColor: "#e2efff",
                width: "fit-content",
                padding: "6px 12px",
                borderRadius: "8px",
                mb: 2,
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "500" }}>
                🎁 {t("discount_precent")} {teacher?.F2FSessionStd?.discount}%
              </Typography>
            </Box>
          )}

          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            {lang === "en"
              ? teacher.shortHeadlineEn
              : teacher.shortHeadlineAr}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
            <SpeakerNotesIcon fontSize="small" sx={{ color: "#aaa" }} />
            <Typography variant="body2" fontWeight="bold" color="text.secondary">
              {t("location")}:
            </Typography>
            <Typography variant="body2">{teacher?.city}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center" mb={2}>
            <ShieldIcon fontSize="small" sx={{ color: "#aaa" }} />
            <Typography variant="body2" fontWeight="bold" color="text.secondary">
              {t("certifiedTeacher")}:
            </Typography>
            <Typography variant="body2">
              {teacher?.experienceYears} {t("yearsofexperience")}
            </Typography>
          </Stack>

          <Typography variant="body2" sx={{ mb: 2 }}>
            {lang === "en" ? teacher?.descriptionEn : teacher?.descriptionAr}{" "}
            <MatLink
              to={`/teacher/${teacher.id}`}
              sx={{
                color: "#1a477e",
                fontSize: "13px",
                fontWeight: "bold",
              }}
            >
              {t("read_more")}
            </MatLink>
          </Typography>

          <Stack direction="row" spacing={3} mb={2}>
            <Typography variant="body2" fontWeight="700">
              {t("students_num")}: {teacher.bookingNumbers}
            </Typography>
            <Typography variant="body2" fontWeight="700">
              {t("hours")}: {teacher.hoursNumbers}
            </Typography>
          </Stack>

          {teacher?.rate != 0 && (
            <Stack direction="row" spacing={1} alignItems="center" mb={2}>
              <StarIcon sx={{ color: "#FDCC0D" }} />
              <Typography variant="body2">{teacher?.rate}</Typography>
            </Stack>
          )}

          {(teacher.F2FSessionStd ||
            teacher.F2FSessionTeacher ||
            teacher.RemoteSession) && (
            <Paper variant="outlined" sx={{ p: 2 }}>
              {teacher.F2FSessionStd && (
                <Typography variant="body2" mb={1}>
                  {t("studenthome")}:{" "}
                  {(teacher.F2FSessionStd?.price * conversionRate).toFixed(2)}{" "}
                  {currency}
                </Typography>
              )}
              {teacher.F2FSessionTeacher && (
                <Typography variant="body2" mb={1}>
                  {t("teacherhome")}:{" "}
                  {(teacher.F2FSessionTeacher?.price * conversionRate).toFixed(
                    2
                  )}{" "}
                  {currency}
                </Typography>
              )}
              {teacher.RemoteSession && (
                <Typography variant="body2">
                  {t("onlineStudy")}:{" "}
                  {(teacher.RemoteSession?.price * conversionRate).toFixed(2)}{" "}
                  {currency}
                </Typography>
              )}
            </Paper>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
