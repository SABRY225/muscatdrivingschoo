import {
  Avatar, Box,  Container, Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState  , useEffect} from "react";
import { Link  ,useParams} from "react-router-dom";
import Navbar from "../Navbar";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { deepOrange } from "@mui/material/colors";
import { useTeacher } from "../../hooks/useTeacher";
import Loading        from "../Loading";

export default function TeacherLayout({ children }) {
  const { t } = useTranslation();
  const { teacherId }                        = useParams();
  console.log(teacherId);
  const topics = [
    { title: t("profile"),                link: "/edit/teacher" },
    { title: t("profile_photo"),          link: "/edit/teacher/photo" },
    { title: t("additionalInformation"),  link: "/edit/teacher/additionalInformation" },
    { title: t("subjects"),               link: "/edit/teacher/subjects" },
    // { title: t("resume"),                 link: "/edit/teacher/resume" },
    { title: t("availability"),           link: "/edit/teacher/availability" },
    { title: t("description"),            link: "/edit/teacher/description" },
    { title: t("video"),                  link: "/edit/teacher/video" },
   
  ];

  const { data , isLoading } = useTeacher(teacherId);
  const [ teacher , setTeacher ] = useState("");
  useEffect(() => {
    if (data) {
      setTeacher(data);
    }
  }, [data]);
  console.log(teacher);
  return (
      <Container sx={{ marginTop: "120px", marginBottom: "60px" }}>
        {!isLoading ? 
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
                    <Link to={`/admin${topic.link}/`+ teacherId }>
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
        : (
          <Loading />
        )}
      </Container>
  );
}
