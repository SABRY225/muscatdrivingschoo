import React from "react";
import Navbar from "../../components/Navbar";
import { Box, Container,  Grid, Paper, Tab, Tabs, Typography, } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import { useAllLessons } from "../../hooks/useAllLessons";
import BookedLesson from "../../components/student/BookedLesson";
import Loading from "../../components/Loading";
import { useTranslation } from "react-i18next";

export default function StudentLessons() {
  const { id } = useParams();
  const { data, isLoading } = useAllLessons(id);
  const { t } = useTranslation();

  return (
    <Navbar>
      <Container sx={{ marginTop: "120px" }}>
        <Typography
          sx={{
            color: "#000000",
            fontWeight: "700",
            fontSize: "24px",
            marginBottom: "8px",
          }}
        >
          {t("parent_welcome")}
        </Typography>
        <Typography
          sx={{
            color: "#000000",
            fontWeight: "500",
            fontSize: "18px",
            marginBottom: "32px",
          }}
        >
          {t("parent_desc")}
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Link to={"/parent"}>
            <Tabs value="1">
              <Tab label={t("view_lessons")} value="1" />
            </Tabs>
          </Link>
        </Box>
        <Container>
          {!isLoading ? (
            <Paper sx={{ marginY: "20px", padding: "40px 20px 20px" }}>
              <Typography
                sx={{
                  marginBottom: "30px",
                  fontSize: "24px",
                  fontWeight: "600",
                }}
              >
                {t("registeredlessons")}
              </Typography>
              {data?.data?.length > 0 &&
                data.data.map((lesson, index) => {
                  return (
                    <BookedLesson
                      image={lesson?.Teacher?.image}
                      name={
                        lesson?.Teacher.firstName +
                        " " +
                        lesson?.Teacher.lastName
                      }
                      date={lesson?.date}
                      type={lesson?.type}
                      period={lesson?.period}
                      key={index + "zw3"}
                    />
                  );
                })}
            </Paper>
          ) : (
            <Loading />
          )}
        </Container>
      </Container>
    </Navbar>
  );
}
