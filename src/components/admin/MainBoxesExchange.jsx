import React from "react";
import { Card, Grid, Typography, styled, Box } from "@mui/material";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import { useTranslation } from "react-i18next";
import { useMainBoxesExchange } from "../../hooks/useMainBoxesExchange";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

// === Styled Components ===
const IconWrapper = styled(Box)(({ theme }) => ({
  borderRadius: "50%",
  padding: "12px",
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "60px",
  height: "60px",
}));

const CardBox = styled(Card)(({ theme }) => ({
  padding: "24px",
  display: "flex",
  alignItems: "center",
  gap: "20px",
  borderRadius: "16px",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  cursor: "pointer",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.1)",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)",
  },
  backgroundColor: theme.palette.primary.main,
}));

export default function Statistics() {
  const { t } = useTranslation();
  const { token } = useSelector((state) => state.admin);
  const { data } = useMainBoxesExchange(token);

  const details = [
    {
      title: t("view_ExchangeRequestTeachers_waiting"),
      number: data?.data.teacherNumWaiting,
      icon: PeopleAltOutlinedIcon,
      color: "#5e72e4",
      link: "/exchange-request-teachers/waiting",
    },
    {
      title: t("view_ExchangeRequestTeachers_accept"),
      number: data?.data.teacherNumAccept,
      icon: PeopleAltOutlinedIcon,
      color: "#3bb54a",
      link: "/exchange-request-teachers",
    },
    {
      title: t("view_ExchangeRequestTeachers_rejected"),
      number: data?.data.teacherNumRejected,
      icon: PeopleAltOutlinedIcon,
      color: "#dc3545",
      link: "/exchange-request-teachers/cancel",
    },
    {
      title: t("ExchangeRequestStudents_waiting"),
      number: data?.data.studentNumWaiting,
      icon: SchoolOutlinedIcon,
      color: "#ffca28",
      link: "/exchange-request-students/waiting",
    },
    {
      title: t("view_ExchangeRequestStudents_accept"),
      number: data?.data.studentNumAccept,
      icon: SchoolOutlinedIcon,
      color: "#28a745",
      link: "/exchange-request-students",
    },
    {
      title: t("view_ExchangeRequestStudents_rejected"),
      number: data?.data.studentNumRejected,
      icon: SchoolOutlinedIcon,
      color: "#e53935",
      link: "/exchange-request-students/cancel",
    },
  ];

  return (
    <Grid container spacing={4}>
      {details.map((item, index) => (
        <Grid item xs={12} sm={6} lg={4} key={index}>
          <Link to={`/admin${item.link}`} style={{ textDecoration: "none" }}>
            <CardBox sx={{ backgroundColor: item.color }}>
              <IconWrapper>
                <item.icon sx={{ fontSize: 32, color: "#fff" }} />
              </IconWrapper>
              <Box>
                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 500,
                    color: "#fff",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "26px",
                    fontWeight: "bold",
                    color: "#fff",
                    marginTop: "4px",
                  }}
                >
                  {item.number}
                </Typography>
              </Box>
            </CardBox>
          </Link>
        </Grid>
      ))}
    </Grid>
  );
}
