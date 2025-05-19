import React from "react";
import { Card, Grid, Typography, styled, Box } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SubjectOutlinedIcon from "@mui/icons-material/SubjectOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import LectureIcon from "@mui/icons-material/Leaderboard";
import DvrIcon from '@mui/icons-material/Dvr';
import CastForEducationOutlinedIcon from "@mui/icons-material/CastForEducationOutlined";
import { useTranslation } from "react-i18next";
import { useMainBoxesExchange } from "../../hooks/useMainBoxesExchange";
import { useSelector } from "react-redux";

// Edited by Abdelwahab
import { Link } from "react-router-dom";

const IconWrapper = styled(Box)({
  borderRadius: "50%",
  padding: "12px 10px",
  backgroundColor: "#F5F7FB",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: "#464a53",
  width: "60px",
  height: "60px",
});

const CardBox = styled(Card)({
  padding: "30px 12px",
  display: "flex",
  width: "100%",
  columnGap: "20px",
});

export default function Statistics() {
  const { t } = useTranslation();

  const { token } = useSelector((state) => state.admin);
  const { data, isLoading } = useMainBoxesExchange(token);

  const details = [
    {
      title: t("view_ExchangeRequestTeachers_waiting"),
      number: data?.data.teacherNumWaiting,
      icon: PeopleAltOutlinedIcon,
      color: "#5e72e4",
      link: "/exchange-request-teachers",
    },

    {
      title: t("view_ExchangeRequestTeachers_accept"),
      number: data?.data.teachertNumAccept,
      icon: PeopleAltOutlinedIcon,
      color: "#5e72e4",
      link: "/exchange-request-teachers",
    },

    {
      title: t("view_ExchangeRequestTeachers_rejected"),
      number: data?.data.teacherNumRejected,
      icon: PeopleAltOutlinedIcon,
      color: "#5e72e4",
      link: "/exchange-request-teachers",
    },

    {
      title: t("view_ExchangeRequestStudents_waiting"),
      number: data?.data.studentNumWaiting,
      icon: SchoolOutlinedIcon,
      color: "#FFAA16",
      link: "/exchange-request-students",
    },

    {
      title: t("view_ExchangeRequestStudents_accept"),
      number: data?.data.studentNumAccept,
      icon: SchoolOutlinedIcon,
      color: "#FFAA16",
      link: "/exchange-request-students",
    },

    {
      title: t("view_ExchangeRequestStudents_rejected"),
      number: data?.data.studentNumRejected,
      icon: SchoolOutlinedIcon,
      color: "#FFAA16",
      link: "/exchange-request-students",
    },

    /*
    {
      title: t("view_ExchangeRequestParents_waiting"),
      number: data?.data.parentNumWaiting,
      icon: CastForEducationOutlinedIcon,
      color: "#FF1616",
      link: "/exchange-request-parents",
    },

    {
      title: t("view_ExchangeRequestParents_accept"),
      number: data?.data.parentNumAccept,
      icon: CastForEducationOutlinedIcon,
      color: "#FF1616",
      link: "/exchange-request-parents",
    },

    {
      title: t("view_ExchangeRequestParents_rejected"),
      number: data?.data.parentNumRejected,
      icon: CastForEducationOutlinedIcon,
      color: "#FF1616",
      link: "/exchange-request-parents",
    },
*/
  ];

  return (
    <Grid container spacing={4}>
      {details.map((item, index) => {
        return (
          <Grid item xs={12} sm={6} lg={3} key={index + "q1"}>
            <Link to={`/admin${item.link}`}>
              <CardBox sx={{ backgroundColor: item.color }}>
                <IconWrapper>
                  <item.icon sx={{ fontSize: "25px" }} />
                </IconWrapper>
                <Box>
                  <Typography
                    sx={{
                      fontSize: "16px",
                      fontWeight: "500",
                      color: "white",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography
                    sx={{ fontWeight: "700", fontSize: "24px", color: "white" }}
                  >
                    {item.number}
                  </Typography>
                </Box>
              </CardBox>
            </Link>
          </Grid>
        );
      })}
    </Grid>
  );
}
