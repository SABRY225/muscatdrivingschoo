import { Avatar, Box, Paper, Typography , styled} from "@mui/material";
import React from "react";
import ReactPlayer      from "react-player";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import LocationOnIcon   from "@mui/icons-material/LocationOn";
import SchoolIcon       from "@mui/icons-material/School";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
const Image = styled("img")({
  width: "50px",
  height: "50px",
});

export default function HeaderSingleTeacher({ teacher }) {
  const lang = Cookies.get("i18next") || "en";
  const { t } = useTranslation();

  return (
    <Paper sx={{ padding: "24px", marginY: "30px" }}>
      <ReactPlayer url={teacher?.videoLink} width="100%" />
      {teacher?.F2FSessionStd?.discount > 0 && (
        <Box sx={{ backgroundColor: "#e2efff", mb: 2, p: 0.2 }}>
          <Typography textAlign={"center"}>
            <img src="../gift.svg" alt="" />
            {t("discount_precent")} {teacher?.F2FSessionStd?.discount}%
          </Typography>
        </Box>
      )}
      <Box sx={{ marginTop: "30px", display: "flex", columnGap: "20px" }}>
        <Avatar
          src={`${process.env.REACT_APP_API_KEY}images/${teacher?.image}`}
          sx={{ width: "141px", height: "141px" }}
        />
        <Box>
          <Typography
            sx={{ fontSize: "20px", marginBottom: "8px", fontWeight: "700" }}
          >
            {teacher?.firstName + " " + teacher?.lastName}
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
              {t("speaks")}:{" "}
            </Typography>
            <Typography sx={{ color: "#616161", fontSize: "14px" }}>
              {lang === "ar"
                ? teacher?.LangTeachStds?.map(
                    (item) => item?.Language?.titleAR + " "
                  )
                : teacher?.LangTeachStds?.map(
                    (item) => item?.Language?.titleEN + " "
                  )}
            </Typography>
          </Box>

{teacher?.TeacherTypes.length > 0 ?
    <Box
            sx={{
              display       : "flex",
              columnGap     : "4px",
              alignItems    : "center",
              marginBottom  : "8px",
            }}
          >
            <Image
                  alt={lang==="ar"?teacher?.TeacherTypes[0]?.TrainingCategoryType.titleAR:teacher?.TeacherTypes[0]?.TrainingCategoryType.titleEN}
                  src={`${process.env.REACT_APP_API_KEY}images/${teacher?.TeacherTypes[0]?.TrainingCategoryType.image}`}
                  sx={{ width: "25px", height: "25px" , borderRadius:"12px" , border:"1px solid #CCC;" , padding:"2px"}}
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
 {teacher?.TeacherLimits.length > 0 ?
    <Box
            sx={{
              display       : "flex",
              columnGap     : "4px",
              alignItems    : "center",
              marginBottom  : "8px",
            }}
          >
            <Image
                  alt={lang==="ar"?teacher?.TeacherLimits[0]?.LimeType.titleAR:teacher?.TeacherLimits[0]?.LimeType.titleEN}
                  src={`${process.env.REACT_APP_API_KEY}images/${teacher?.TeacherLimits[0]?.LimeType.image}`}
                  sx={{ width: "25px", height: "25px" , borderRadius:"12px" , border:"1px solid #CCC;" , padding:"2px"}}
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
              {t("certifiedTeacher")}:{" "}
            </Typography>
            <Typography sx={{ color: "#616161", fontSize: "14px" }}>
              {teacher?.experienceYears} {t("yearsofexperience")}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              columnGap: "4px",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <LocationOnIcon sx={{ fontSize: "16px", color: "#d5d5d5" }} />
            <Typography
              sx={{ color: "#4f4f51", fontSize: "14px", fontWeight: "bold" }}
            >
              {t("location")}:{" "}
            </Typography>
            <Typography sx={{ color: "#616161", fontSize: "14px" }}>
              {teacher?.city + " , " + teacher?.country}
            </Typography>
          </Box>
          <Box
            sx={{
              display: "flex",
              columnGap: "4px",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <SchoolIcon sx={{ fontSize: "16px", color: "#d5d5d5" }} />
            <Typography
              sx={{ color: "#4f4f51", fontSize: "14px", fontWeight: "bold" }}
            >
              {t("subjects")}:{" "}
            </Typography>
            <Typography sx={{ color: "#616161", fontSize: "14px" }}>
              {lang === "ar"
                ? teacher?.TeacherSubjects?.map(
                    (item) => item?.Subject?.titleAR + " "
                  )
                : teacher?.TeacherSubjects?.map(
                    (item) => item?.Subject?.titleEN + " "
                  )}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}
