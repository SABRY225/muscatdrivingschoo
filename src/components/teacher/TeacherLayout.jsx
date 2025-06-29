import { Container, Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Typography, } from "@mui/material";
import Navbar from "../Navbar";
import TeacherStepper from "./TeacherStepper";
import Loading from "../../components/Loading";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useTeacher } from "../../hooks/useTeacher";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import {  AccountTree, CardGiftcard, Help, HelpOutline, LibraryBooks, MessageOutlined,  Percent, PlayLesson, Quiz,  School} from "@mui/icons-material";
import cookies from "js-cookie";


export default function TeacherLayout({ active, title, children }) {
  const { t } = useTranslation();
  const location = useLocation();
  const topics = [
    { icon: <SpaceDashboardIcon />, title: t("controlBoard"), link: "/dashboard" },
    { icon: <AccountTree />, title: t("Statistics"), link: "/statistics" },
    { icon: <School />, title: t("lessons"), link: "/sessions" },
    { icon: <MessageOutlined />, title: t("messages"), link: "/messages" },
    { icon: <PlayLesson />, title: t("lectures"), link: "/lectures" },
    { icon: <LibraryBooks />, title: t("view_teacher_lesson"), link: "/lessons" },
    { icon: <CardGiftcard />, title: t("package"), link: "/package" },
    { icon: <Quiz />, title: t("tests"), link: "/tests" },
    { icon: <Percent />, title: t("discounts"), link: "/discounts" },
    { icon: <Help />, title: t("quesiton"), link: "/question" },
    { icon: <HelpOutline />, title: t("quesiton_choose"), link: "/question-choose" },
  ];
  const lang = cookies.get("i18next") || "en";

  const { teacher } = useSelector((state) => state.teacher);
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
                  sx={{
                    bgcolor: "#f50000", padding: "10px 20px", color: "#fff", fontWeight: "600", borderRadius: "10px",
                  }} variant="h5"
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

            <Grid container spacing={2} style={{ marginTop: "78px", }}>
              <Grid item xs={12} lg={3} sx={{ display: { md: "block", xs: "none" }, }}>
               <Paper sx={{
  padding: "0px 20px 0px",
  backgroundColor: "#800020",
  borderRadius: 0,
  margin: "6.5rem 0 0",
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  width: "230px",
  zIndex: 7,
}}>

                  {/* <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
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
               */}
                  <List>
                    <>
                      {topics.map((topic, index) => {
                        const fullPath = `/teacher${topic.link}`;
                        const isSelected = location.pathname === fullPath;
                        return (
                          <Link key={index} to={fullPath} style={{ textDecoration: "none" }}>
                            <ListItem disablePadding>
                              <ListItemButton
                                selected={isSelected}
                                sx={{
                                  backgroundColor: isSelected ? "#000" : "#fff",
                                  color: isSelected ? "#fff" : "#000",
                                  borderRadius: 1,
                                  margin: "0.2rem 0",
                                  "&:hover": {
                                    backgroundColor: "rgba(25, 118, 210, 0.04)",
                                  },
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 40, color: isSelected ? "#fff" : "#000" }}>
                                  {topic.icon}
                                </ListItemIcon>
                                <ListItemText primary={topic.title} sx={{ textAlign: "start" }} />
                              </ListItemButton>
                            </ListItem>
                          </Link>
                        );
                      })}
                      <Divider sx={{ marginY: "15px", backgroundColor: "#fff" }} />
                    </>

                  </List>
                </Paper>
              </Grid>
              <Grid item xs={12} lg={8} sx={{ marginTop: "2rem" ,height: "80vh"}}>
                {children}
              </Grid>
            </Grid>
          }
        </>
      )}
    </Navbar>
  );
}
