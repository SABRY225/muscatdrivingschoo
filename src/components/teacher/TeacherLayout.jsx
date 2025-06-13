import {Avatar, Box,  Container, Divider, Grid, List, ListItem,   ListItemButton,   ListItemIcon,   ListItemText,   Paper,  Typography,} from "@mui/material";
import Navbar           from "../Navbar";
import TeacherStepper   from "./TeacherStepper";
import Loading          from "../../components/Loading";
import { useTranslation } from "react-i18next";
import { useSelector }  from "react-redux";
import { useTeacher }   from "../../hooks/useTeacher";
import { deepOrange }   from "@mui/material/colors";
import { Link, useLocation } from "react-router-dom";

import { AccessTime, AccountCircle, CardGiftcard, Description, EventNote, Group, Help, HelpOutline, Info, LibraryBooks, Lock, MenuBook, MessageOutlined, Notes, Percent, PhotoCamera, PlayLesson, Quiz, ReceiptLong, Replay, School, Settings, Star, Videocam, WorkspacePremium } from "@mui/icons-material";

export default function TeacherLayout({ active, title, children }) {
  const { t } = useTranslation();  
  const location = useLocation();
  
const topics = [
  { icon: <AccountCircle />,       title: t("profile"),                    link: "/about" },
  { icon: <PhotoCamera/>,         title: t("profile_photo"),              link: "/photo" },
  { icon: <Description />,         title: t("resume"),                     link: "/resume" },
  { icon: <Info />,                title: t("additionalInformation"),      link: "/additionalInformation" },
  { icon: <MenuBook />,            title: t("subjects"),                   link: "/subjects" },
  { icon: <AccessTime />,          title: t("availability"),               link: "/availability" },
  { icon: <WorkspacePremium/>,    title: t("certification"),              link: "/certificates" },
  { icon: <Notes/>,               title: t("description"),                link: "/description" },
  { icon: <Videocam/>,            title: t("Video presentation"),                      link: "/video" },
  { icon: <Lock />,                title: t("setting_changepassword"),     link: "/changepassword" },
  { icon: <School />,              title: t("lessons"),                    link: "/sessions" },
  { icon: <MessageOutlined/>,     title: t("messages"),                   link: "/messages" },
  { icon: <PlayLesson />,          title: t("lectures"),                   link: "/lectures" },
  { icon: <LibraryBooks />,        title: t("view_teacher_lesson"),        link: "/lessons" },
  { icon: <CardGiftcard/>,        title: t("package"),                    link: "/package" },
  { icon: <Quiz/>,                title: t("tests"),                      link: "/tests" },
  { icon: <Percent />,             title: t("discounts"),                  link: "/discounts" },
  { icon: <Help/>,                title: t("quesiton"),                   link: "/question" },  
  { icon: <HelpOutline/>,         title: t("quesiton_choose"),            link: "/question-choose" },
  // { icon: <Settings/>,            title: t("setting_page"),               link: "/settings" },  
  { icon: <Star/>,                title: t("Points earned"),              link: "/pointsearned" },  
  { icon: <EventNote/>,           title: t("Lesson booking requests"),    link: "/request-lesson" },
  { icon: <ReceiptLong />,         title: t("My bills"),                   link: "/mybills" },
  { icon: <Replay/>,              title: t("refunds"),                    link: "/refunds" },
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

        <Grid container spacing={2} style={{marginTop: "78px",}}>
          <Grid item xs={12} lg={3} sx={{ display: { md: "block", xs: "none" },}}>
            <Paper sx={{ padding: "20px 20px 100px", width: 230,backgroundColor:"#e74c3c",borderRadius:"0rem",margin:"0rem" }}>
             <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
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
                <Typography sx={{ marginTop: 2, fontWeight: "700",color:"#fff" }}>
                  {teacher?.firstName}
                  {" "}
                  {teacher?.lastName}
                </Typography>
              </Box>
              <Divider sx={{ marginY: "20px" ,backgroundColor:"#fff"}} />
              <List>
                {topics.map((topic, index) => {
                  const fullPath = `/teacher${topic.link}`;
                   const isSelected = location.pathname === fullPath;
                  return (
                    <Link 
                    key={index}
                       to={fullPath}
                    >
              <ListItem disablePadding>
                <ListItemButton
                  selected={isSelected}
                  sx={{
                    backgroundColor: isSelected ? "#000" : "#fff",
                    color: isSelected ? "#fff" : "#000",
                    borderRadius: 1,
                    margin:"0.2rem 0",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.04)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40,color: isSelected ? "#fff" : "#000" }}>{topic.icon}</ListItemIcon>
                  <ListItemText primary={topic.title} sx={{ textAlign: "start" }} />
                </ListItemButton>
              </ListItem>
                    </Link>
                  );
                })}
              </List>
            </Paper>
          </Grid>
          <Grid item xs={12} lg={8} sx={{ overflow: "hidden" ,marginTop:"2rem"}}>
            {children}
          </Grid>
        </Grid>
    }
    </>
  )}
  </Navbar>
  );
}
