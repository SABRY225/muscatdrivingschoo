import {Avatar, Box,  Container, Divider, Grid, List, ListItem,   ListItemButton,   ListItemText,   Paper,  Typography,} from "@mui/material";
import React            from "react";
import Navbar           from "../Navbar";
import TeacherStepper   from "./TeacherStepper";
import Loading          from "../../components/Loading";
import { Link }         from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector }  from "react-redux";
import { useTeacher }   from "../../hooks/useTeacher";
import { deepOrange }   from "@mui/material/colors";

export default function TeacherLayout({ active, title, children }) {
  const { t } = useTranslation();
  const topics = [
    { title: t("profile"),                    link: "/about" },
    { title: t("profile_photo"),              link: "/photo" },
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
  const { teacher }         = useSelector((state) => state.teacher);
  const { data, isLoading } = useTeacher(teacher?.id);
  return (
    <Navbar>
    {isLoading ? (
      <Loading />
    ) : (
      <>
    
   {data?.data.isVerified === false ? 
    <Container sx={{ marginBottom: "60px", marginTop: "120px" }}>
      {!isLoading &&
      (!data?.data?.firstName ||
        !data?.data?.lastName ||
        !data?.data?.gender ||
        !data?.data?.dateOfBirth ||
        !data?.data?.phone ||
        !data?.data?.email ||
        !data?.data?.country ||
        !data?.data?.city ||
        !data?.data?.image ||
        !data?.data?.favStdGender ||
        !data?.data?.experienceYears ||
        !data?.data?.favHours ||
        !data?.data?.shortHeadlineAr ||
        !data?.data?.shortHeadlineEn ||
        !data?.data?.descriptionAr ||
        !data?.data?.descriptionEn ||
        data?.data?.CurriculumTeachers.length === 0 ||
        data?.data?.TeacherLevels.length === 0) ? (
        <Typography
          sx={{bgcolor: "#f50000",padding: "10px 20px",color: "#fff", fontWeight: "600",  borderRadius: "10px",
          }}variant="h5"
        >
          {t("complete_teacher_account")}
        </Typography>
      ) : (
        !data?.data?.isVerified && (
          <Typography
            sx={{
              bgcolor: "orange",
              padding: "10px 20px",
              color: "#fff",
              fontWeight: "600",
              borderRadius: "10px",
            }}
            variant="h5"
          >
            {t("account_under_review")}
          </Typography>
        )
      )}

      <TeacherStepper active={active} />
      <Paper sx={{ marginY: "50px", paddingY: "40px", paddingX: "30px" }}>
        <Typography sx={{ fontSize: "24px", fontWeight: "600", marginBottom: "30px" }}>
          {title}
        </Typography>
        {children}
      </Paper>
    </Container>

      :

    <Container sx={{ marginTop: "120px", marginBottom: "60px" }}>
        <Grid container spacing={2}>
          {/* Added by eng.reem.shwky@gmail.com */}
          <Grid item xs={12} lg={3} sx={{ display: { md: "block", xs: "none" },}}>
            <Paper sx={{ padding: "20px" }}>
              <Box sx={{display: "flex",alignItems: "center",flexDirection: "column",}}>
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
    }
    </>
  )}
  </Navbar>
  );
}
