import { Container, Divider, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuItem, Paper, Typography, } from "@mui/material";
import Navbar from "../Navbar";
import TeacherStepper from "./TeacherStepper";
import Loading from "../../components/Loading";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useTeacher } from "../../hooks/useTeacher";
import { Link, useLocation } from "react-router-dom";
import { AccountTree, CardGiftcard, Help, HelpOutline, LibraryBooks, MessageOutlined, Percent, PlayLesson, Quiz, School } from "@mui/icons-material";
import cookies from "js-cookie";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ImageIcon from '@mui/icons-material/Image';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { AccessTime, Lock, MenuBook, ReceiptLong, Replay, Star, Videocam, WorkspacePremium } from '@mui/icons-material';
import Groups2Icon from "@mui/icons-material/Groups2";

export default function TeacherLayout({ active, title, children }) {
  const { t } = useTranslation();
  const location = useLocation();

  const topics = [
  // 🟢 الإحصائيات وطلبات الحجز
  { icon: <AccountTree />, title: t("Statistics"), link: "/statistics" },
  { icon: <ListAltIcon />, title: t("Lesson booking requests"), link: "/request-lesson" },
  { icon: <ListAltIcon />, title: t("Student Reservations"), link: "/request-student" },

  // 🟡 المحتوى التعليمي
  { icon: <School />, title: t("lessons"), link: "/sessions" },
  { icon: <PlayLesson />, title: t("lectures"), link: "/lectures" },
  { icon: <LibraryBooks />, title: t("view_teacher_lesson"), link: "/lessons" },
  { icon: <Quiz />, title: t("tests"), link: "/tests" },
  { icon: <Percent />, title: t("discounts"), link: "/discounts" },
  { icon: <CardGiftcard />, title: t("package"), link: "/package" },

  // 🟣 الأسئلة
  { icon: <Help />, title: t("quesiton"), link: "/question" },
  { icon: <HelpOutline />, title: t("quesiton_choose"), link: "/question-choose" },

  // 🔵 المحفظة والدفع
  { icon: <WalletIcon />, title: t("credit"), link: "/credit" },
  { icon: <Star />, title: t("Points earned"), link: "/pointsearned" },
  { icon: <ReceiptLong />, title: t("My bills"), link: "/mybills" },
  { icon: <Replay />, title: t("refunds"), link: "/refunds" },

  // 🔴 الرسائل
  { icon: <MessageOutlined />, title: t("messages"), link: "/messages" },

  // 🟤 المعلومات الشخصية
  { icon: <AccountCircleIcon />, title: t("About me"), link: "/about" },
  { icon: <ImageIcon />, title: t("profile_photo"), link: "/photo" },
  { icon: <InfoIcon />, title: t("additionalInformation"), link: "/additionalInformation" },
  { icon: <DescriptionIcon />, title: t("description"), link: "/description" },
  { icon: <MenuBook />, title: t("subjects"), link: "/subjects" },
  { icon: <AccessTime />, title: t("availability"), link: "/availability" },
  { icon: <WorkspacePremium />, title: t("certification"), link: "/certificates" },
  { icon: <Videocam />, title: t("Video presentation"), link: "/Video" },
  { icon: <Lock />, title: t("setting_changepassword"), link: "/changepassword" },

  // ⚫ الطلاب
  { icon: <Groups2Icon />, title: t("my_students"), link: "/students" },
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
                  margin: ".5rem 0 0",
                  // position: "fixed",
                  // top: 0,
                  // left: 0,
                  // right: 0,
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
              <Grid item xs={12} lg={8} sx={{ marginTop: "2rem", height: "80vh" }}>
                {children}
              </Grid>
            </Grid>
          }
        </>
      )}
    </Navbar>
  );
}
