import React from "react";
import { Card, Grid, Typography, styled, Box } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SubjectOutlinedIcon  from "@mui/icons-material/SubjectOutlined";
import SchoolOutlinedIcon   from "@mui/icons-material/SchoolOutlined";
import LectureIcon          from "@mui/icons-material/Leaderboard";
import DvrIcon              from '@mui/icons-material/Dvr';
import MoneyIcon            from "@mui/icons-material/Money";
import DiscountIcon         from "@mui/icons-material/Discount";
import AdsIcon              from '@mui/icons-material/Campaign';
import CareeIcon            from "@mui/icons-material/ListAltOutlined";
//adsNumWaiting
import CastForEducationOutlinedIcon from "@mui/icons-material/CastForEducationOutlined";
import { useTranslation } from "react-i18next";
import { useMainBoxes } from "../../hooks/useMainBoxes";
import { useSelector } from "react-redux";
//discountsNumWaiting
// Edited by eng.reem.shwky@gmail.com
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
  const { data, isLoading } = useMainBoxes(token);

  const details = [
    {
      title: t("totalstudents"),
      number: data?.data.studentsNumber,
      icon: PeopleAltOutlinedIcon,
      color: "#5e72e4",
      link: "/students",
    },
    {
      title: t("totalteachers"),
      number: data?.data.teachersNumber,
      icon: SchoolOutlinedIcon,
      color: "#FFAA16",
      link: "/teachers",
    },
    {
      title: t("parents"),
      number: data?.data.parentsNumber,
      icon: CastForEducationOutlinedIcon,
      color: "#FF1616",
      link: "/parent-student",
    },
    {
      title: t("ads"),
      number: data?.data.adsNumWaiting,
      icon: AdsIcon,
      color: "#8BC34A",
      link: "/ads/waiting",
    },
    {
      title: t("registeredlessons"),
      number: data?.data.sessionsNumber,
      icon: SubjectOutlinedIcon,
      color: "#673BB7",
      link: "/booked-lessons",
    },

    {
      title: t("package_view_waiting"),
      number: data?.data.packageOnline,
      icon: SubjectOutlinedIcon,
      color: "#2fd388",
      link: "/package",
    },

    {
      title: t("teacher_online"),
      number: data?.data.teacherOnline,
      icon: LectureIcon,
      color: "#9e3bb7",
      link: "/teachers",
    },

    {
      title: t("student_online"),
      number: data?.data.studentOnline,
      icon: PeopleAltOutlinedIcon,
      color: "#3e98c7",
      link: "/students",
    },

    {
      title: t("lecture_waiting"),
      number: data?.data.teacherLectureWaiting,
      icon: DvrIcon,
      color: "#3f51b5",
      link: "/lectures",
    },

    {
      title: t("view_ExchangeRequestTeachers_waiting"),
      number: data?.data.teacherExchangeNumWaiting,
      icon: MoneyIcon,
      color: "#009688",
      link: "/exchange-request-teachers/waiting",
    },

    {
      title: t("view_ExchangeRequestStudents_waiting"),
      number: data?.data.studentExchangeNumWaiting,
      icon: MoneyIcon,
      color: "#ff5722",
      link: "/exchange-request-students/waiting",
    },

    //
/*
    {
      title: t("view_ExchangeRequestParents_waiting"),
      number: data?.data.parentExchangeNumWaiting,
      icon: MoneyIcon,
      color: "#00bcd4",
      link: "/exchange-request-parents/waiting",
    },
    */

    {
      title: t("discount_view_waiting"),
      number: data?.data.discountsNumWaiting,
      icon: DiscountIcon,
      color: "#795548",
      link: "/discounts/waiting",
    },

    {
      title: t("view_career_waiting"),
      number: data?.data.careerNumWaiting,
      icon: CareeIcon,
      color: "#00bcd4",
      link: "/career/waiting",
    },
  ];

  return (
    <Grid container spacing={4}>
      {details.map((item, index) => {
        return (
          <Grid item xs={12} sm={6} lg={3} key={index + "q1"}>
            {/*  Edited by Abdelwahab */}
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
