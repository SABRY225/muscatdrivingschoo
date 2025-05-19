import {Avatar, Box,  Container, Divider, Grid, List, ListItem,   ListItemButton,   ListItemText,   Paper,  Typography,} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { deepOrange } from "@mui/material/colors";

export default function TeacherLayout({ children }) {
  const { t } = useTranslation();
  const topics = [
    { title: t("profile"),            link: "/about" },
    { title: t("profile_photo"),      link: "/photo" },
    { title: t("additionalInformation"),      link: "/additionalInformation" },
    { title: t("subjects"),               link: "/subjects" },
    { title: t("resume"),                 link: "/resume" },
    { title: t("availability"),           link: "/availability" },
    { title: t("description"),            link: "/description" },
    { title: t("video"),                  link: "/video" },
    { title: t("messages"),               link: "/messages" },
    { title: t("setting_changepassword"), link: "/changepassword" },
    { title: t("lessons"),                link: "/sessions" },
    { title: t("students"),               link: "/students" },
    { title: t("certification"),          link: "/certificates" },
    { title: t("lectures"),               link: "/lectures" },
    { title: t("view_teacher_lesson"),    link: "/lessons" },
    { title: t("quesiton"),               link: "/question" },
    { title: t("quesiton_choose"),        link: "/question-choose" },
    { title: t("package"),                link: "/package" },
    { title: t("tests"),                  link: "/tests" },
    { title: t("discounts"),              link: "/discounts" },
    { title: t("refunds"),                link: "/refunds" },
    { title: t("setting_page"),           link: "/settings" },
  ];

  const { teacher } = useSelector((state) => state.teacher);
  return (
    <Navbar>
      <Container sx={{ marginTop: "120px", marginBottom: "60px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={3}>
            <Paper sx={{ padding: "20px" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Avatar
                  src={`${process.env.REACT_APP_API_KEY}images/${teacher?.image}`}
                  alt={teacher?.name}
                  sx={{
                    width: "95px",
                    height: "95px",
                    fontSize: "36px",
                    bgcolor: deepOrange[500],
                  }}
                />
                <Typography sx={{ marginTop: "16px", fontWeight: "700" }}>
                  {teacher?.name}
                </Typography>
              </Box>
              <Divider sx={{ marginY: "20px" }} />
              <List>
                {topics.map((topic, index) => {
                  return (
                    <Link to={`/teacher${topic.link}`}>
                      <ListItem key={topic.title + index + "o"} disablePadding>
                        <ListItemButton>
                          <ListItemText
                            primary={topic.title}
                            sx={{ textAlign: "start" }}
                          />
                        </ListItemButton>
                      </ListItem>
                    </Link>
                  );
                })}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={9} sx={{ overflow: "hidden" }}>
            {children}
          </Grid>
        </Grid>
      </Container>
    </Navbar>
  );
}
