import * as React from "react";
import LoginIcon from '@mui/icons-material/Login';
import SchoolIcon from '@mui/icons-material/School';
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import MapIcon from '@mui/icons-material/Map';
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import ChangeLanguage from "./reusableUi/ChangeLanguage";
import { Badge, Button, Stack, styled, } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { logoutTeacher } from "../redux/teacherSlice";
import { logoutParent } from "../redux/parentSlice";
import { studentLogout } from "../redux/studentSlice";
import { logoutGuest } from "../redux/guestSlice";
import SelectCurrency from "./reusableUi/SelectCurrency";
import logoImage from "../images/logo1.png";
import cookies from "js-cookie";
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from "@mui/icons-material/Notifications";
import axios from "axios";
import { AccountTree, CardGiftcard, Help, HelpOutline, LibraryBooks, MessageOutlined, Percent, PlayLesson, Quiz, School } from "@mui/icons-material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ImageIcon from '@mui/icons-material/Image';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { AccessTime, Lock, MenuBook, ReceiptLong, Replay, Star, Videocam, WorkspacePremium} from '@mui/icons-material';
import Groups2Icon from "@mui/icons-material/Groups2";
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PeopleIcon from '@mui/icons-material/People';
import LockResetIcon from '@mui/icons-material/LockReset';
import AddBoxIcon from '@mui/icons-material/AddBox';
import WorkIcon from '@mui/icons-material/Work';

const drawerWidth = 240;

const ImageLogo = styled("img")({
  height: "50px",
  backgroundColor: "#fff",
  padding: "0.3rem",
  borderRadius: "50%",

  "@media screen and (max-width: 600px) ": {
    height: "45px",
  },
  "@media screen and (max-width: 320px) ": {
    height: "27px",
  },
  objectFit: "cover",
  objectPosition: "bottom",
});


function Navbar(props) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { student } = useSelector((state) => state.student);
  const { teacher } = useSelector((state) => state.teacher);
  const { parent } = useSelector((state) => state.parent);
  const { guest } = useSelector((state) => state.guest);
  const lang = cookies.get("i18next") || "en";
  console.log("guest :", guest);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  async function handleParentLogout() {
    try {
      console.log("Start To Logout Parent");
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/parent/updatelogout/${parent.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: parent.id,
            email: parent.email
          }),
        }
      );

      const resData = await response.json();
      // console.log("response: ", resData);
      if (resData.status !== 200 && resData.status !== 201) {
        console.log("some error Occurred, response is: ", resData);
        throw new Error("");
      } else {
        console.log("Sucesss");
      }

    } catch (err) {
      console.log("error: ", err);
    }

    dispatch(logoutParent());
    navigate("/login");
  }

  async function handleTeacherLogout() {
    try {
      console.log("Start To Logout Teacher");
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/updatelogout/${teacher.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: teacher.id,
            email: teacher.email
          }),
        }
      );

      const resData = await response.json();
      // console.log("response: ", resData);
      if (resData.status !== 200 && resData.status !== 201) {
        console.log("some error Occurred, response is: ", resData);
        throw new Error("");
      } else {
        console.log("Sucesss");
      }

    } catch (err) {
      console.log("error: ", err);
    }

    dispatch(logoutTeacher());
    navigate("/login");
  }

  async function handleStudentLogout() {
    //This Code Developer by eng.reem.shwky@gmail.com
    try {
      console.log("Start To Logout");
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/student/updatelogout/${student.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id: student.id,
            email: student.email
          }),
        }
      );

      const resData = await response.json();
      // console.log("response: ", resData);
      if (resData.status !== 200 && resData.status !== 201) {
        console.log("some error Occurred, response is: ", resData);
        throw new Error("");
      } else {
        console.log("Sucesss");
      }

    } catch (err) {
      console.log("error: ", err);
    }
    dispatch(studentLogout());
    navigate("/login");
  }

  async function handleGuestLogout() {
    //This Code Developer by eng.reem.shwky@gmail.com
    /*
    try {
      console.log("Start To Logout");
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/guest/updatelogout/${student.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id          : guest.id,
            phoneNumber : guest.phoneNumber
          }),
        }
      );

      const resData = await response.json();
      if (resData.status !== 200 && resData.status !== 201) {
        console.log("some error Occurred, response is: ", resData);
        throw new Error("");
      } else {
        console.log("Sucesss");
      }

    }catch (err) {
      console.log("error: ", err);
    }
    */
    dispatch(logoutGuest());
    navigate("/loginGuest");
  }
  const [notSeenTeacher, setNotSeenTeacher] = React.useState(0);
  const [notSeenStudent, setNotSeenStudent] = React.useState(0);
  const useUnreadNotification = (user, setUserCount) => {
    React.useEffect(() => {
      if (!user) return;

      let isMounted = true;

      const fetchUnreadCount = async () => {
        try {
          const response = await axios.get(
            `${process.env.REACT_APP_API_KEY}api/v1/notification/unread-count/${user.id}`
          );
          const count = response.data.unreadCount || 0;
          if (isMounted) setUserCount(count);
        } catch (error) {
          console.error("Failed to fetch unread notifications count:", error);
        }
      };

      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 15000); // كل 15 ثانية

      return () => {
        isMounted = false;
        clearInterval(interval);
      };
    }, [user]);
  };

  // في الكومبوننت:
  useUnreadNotification(student, setNotSeenStudent);
  useUnreadNotification(teacher, setNotSeenTeacher);

  const container =
    window !== undefined ? () => window().document.body : undefined;



  const teacherProfileMobile = [
    { icon: <AccountTree />, title: t("Statistics"), link: "/statistics" },
    { icon: <ListAltIcon />, title: t("Lesson booking requests"), link: "/request-lesson" },

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

  const parentProfileMobile = [
    { title: t("profile"), link: "/profile", icon: <AccountCircleIcon /> },
    { title: t("profile_photo"), link: "/profile_photo", icon: <PhotoCameraIcon /> },
    { title: t("view_children"), link: "/", icon: <PeopleIcon /> },
    { title: t("setting_changepassword"), link: "/changepassword", icon: <LockResetIcon /> },
  ];


    const guestProfileMobile = [
      { title: t("profile"),        link: "/profile",          icon: <AccountCircleIcon /> },
  { title: t("profile_photo"),  link: "/photo",            icon: <PhotoCameraIcon /> },
  { title: t("add-ads"),        link: "/create-ads/step1", icon: <AddBoxIcon /> },
  { title: t("ads"),            link: "/ads",              icon: <ListAltIcon /> },
  { title: t("careers"),        link: "/careers",          icon: <WorkIcon /> },
  ];


  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", minHeight: "auto", height: "100%", overflow: "scroll", backgroundColor: "#800020" }}>
      <Typography variant="h6" sx={{ my: 2 }}><ImageLogo src={logoImage} /></Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
        </ListItem>
        <Link to="/landing">
          <ListItem
            sx={{
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1.5, // مسافة بين الأيقونة والنص
              px: 2,
            }}
          >
            <PersonSearchIcon />
            {t("search_for_teachers")}
          </ListItem>
        </Link>
        {!teacher && !parent && !student && !guest && (
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start", }}>
            <Button sx={{ my: 1, color: "white", display: "flex", alignItems: "center", gap: 1, textTransform: "capitalize", padding: "1px 18px", }}
              variant="text" onClick={() => navigate("/login")}> 
              <LoginIcon sx={{ fontSize: 22 }} />
              {t("login")}
            </Button>
            <Button
              onClick={() => navigate("/teacherRegister/step1")}
              sx={{
                display: "flex", alignItems: "center", gap: 1, textTransform: "capitalize", padding: "1px 13px",
                color: "#fff",
                fontSize: "14px", height: "50px", borderRadius: "10px",
              }}
              variant="text"
            >
              <SchoolIcon sx={{ fontSize: 22 }} />
              {t("becometeacher")}
            </Button>
          </Box>
        )}
        <SelectCurrency />

        {teacher && (
          <>
          
            <Link to="/teacher/notifications">
              <ListItem sx={{
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 1.5, // مسافة بين الأيقونة والنص
                px: 2,
              }}>
                <NotificationsIcon />
                {t("notifications")}
              </ListItem>
            </Link>
            {teacherProfileMobile.map((item, index) => {
              return (
                <Link to={`/teacher${item.link}`} key={index + "a1"} style={{ textDecoration: "none" }}>
                  <ListItem
                    sx={{
                      color: "white",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-start",
                      gap: 1.5, // مسافة بين الأيقونة والنص
                      px: 2,
                    }}
                  >
                    {item.icon}
                    {item.title}
                  </ListItem>
                </Link>
              );
            })}

            <Link to="/" onClick={handleTeacherLogout}>
              <ListItem
                sx={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 1.5, // مسافة بين الأيقونة والنص
                  px: 2,
                }}
              >
                <LogoutIcon />
                {t("logout")}
              </ListItem>
            </Link>
          </>
        )}
        {student && (
          <>
          <Link to="/map-browser">
          <ListItem
            sx={{
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: 1.5, // مسافة بين الأيقونة والنص
              px: 2,
            }}
          >
            <MapIcon />
            {t("mapBroswer")}
          </ListItem>
        </Link>
            <Link to="/student/statistics">
              <ListItem
                sx={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 1.5, // مسافة بين الأيقونة والنص
                  px: 2,
                }}>
                <AccountTree />
                {t("Statistics")}
              </ListItem>
            </Link>
            <Link to="/student/notifications">
              <ListItem
                sx={{
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: 1.5, // مسافة بين الأيقونة والنص
                  px: 2,
                }}>
                <NotificationsIcon />
                {t("notifications")}
              </ListItem>
            </Link>
            <Link to="/" onClick={handleStudentLogout}>
              <ListItem sx={{
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 1.5, // مسافة بين الأيقونة والنص
                px: 2,
              }}>
                <LogoutIcon />
                {t("logout")}
              </ListItem>
            </Link>
          </>
        )}
        {parent && (
          <>
            {parentProfileMobile.map((item, index) => (
              <Link
                to={`/parent${item.link}`}
                key={index + "a1"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem
                  sx={{
                    color: "white",
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    gap: 1, // مسافة بين الأيقونة والنص
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {item.icon}
                    <Typography variant="body1" sx={{ color: "white", fontWeight: 500 }}>
                      {item.title}
                    </Typography>
                  </Box>
                </ListItem>
              </Link>
            ))}

            <Link to="/" onClick={handleParentLogout}>
              <ListItem sx={{
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 1.5, // مسافة بين الأيقونة والنص
                px: 2,
              }}>
                <LogoutIcon />
                {t("logout")}
              </ListItem>
            </Link>
          </>
        )}
        {guest && (
          <>
          {guestProfileMobile.map((item, index) => (
              <Link
                to={`/guest${item.link}`}
                key={index + "a1"}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <ListItem
                  sx={{
                    color: "white",
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    gap: 1, // مسافة بين الأيقونة والنص
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {item.icon}
                    <Typography variant="body1" sx={{ color: "white", fontWeight: 500 }}>
                      {item.title}
                    </Typography>
                  </Box>
                </ListItem>
              </Link>
            ))}

            <Link to="/" onClick={handleGuestLogout}>
              <ListItem sx={{
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
                gap: 1.5, // مسافة بين الأيقونة والنص
                px: 2,
              }}>
                <LogoutIcon />
                {t("logout")}
              </ListItem>
            </Link>
          </>
        )}

      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        {/* nav */}
        <AppBar component="nav" sx={{
          background: "#800020",
          margin: "1rem 0rem",
          padding: "0.5rem 0rem",
          borderRadius: "20rem",
        }}>
          <Toolbar sx={{ display: 'flex', justifyContent: "space-between", justifyItems: "center" }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, ml: 2, display: { md: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Box sx={{
              display: { xs: "none", md: "flex" },
              alignItems: "center",
              justifyContent: "center"
            }}>
              <Link to="/" >
                <ImageLogo src={logoImage} />
              </Link>
              <Link to="/landing">
                <Box
                  sx={{
                    gap: 1,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "0 0.6rem",
                    fontSize: "17px"
                  }}
                >
                  <PersonSearchIcon />
                  {t("search_for_teachers")}

                </Box>
              </Link>
            </Box>
            <Box>
              <Box
                sx={{
                  display: { xs: "none", md: "flex" },
                  alignItems: "center",
                  justifyContent: "space-around",
                  columnGap: "5px",
                }}
              >
                <ChangeLanguage lang={lang} />
                <SelectCurrency />
                {!teacher && !student && !parent && !guest && (
                  <>
                    <Link to="/login">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          padding: "3px"
                        }}
                      >
                        {t("login")}
                      </Box>
                    </Link>
                    <Link to="/teacherRegister/step1" style={{ textDecoration: "none" }}>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                          px: 2,
                          py: 1,
                          borderRadius: "8px",
                          border: "2px solid #800020",
                          color: "#800020",
                          backgroundColor: "#fff",
                          fontWeight: "bold",
                          transition: "all 0.3s ease",
                          boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
                          "&:hover": {
                            backgroundColor: "#800020",
                            color: "#fff",
                          },
                        }}
                      >
                        {t("becometeacher")}
                      </Box>
                    </Link>

                  </>
                )}
                {teacher && (
                  <Stack alignItems={"center"} direction="row" gap="12px">
                    <Box
                      sx={{
                        width: "35px",
                        height: "35px",
                        backgroundColor: "#fc5a5a",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate("/teacher/notifications")}
                    >
                      <Badge
                        badgeContent={notSeenTeacher}
                        color="success">
                        <NotificationsIcon sx={{ fontSize: "22px" }} />
                      </Badge>
                    </Box>

                    <Button
                      color="Blue"
                      variant="contained"
                      sx={{ mx: "8px" }}
                      onClick={() => navigate("/teacher/statistics")}
                    >
                      {teacher?.firstName + " " + teacher?.lastName}
                    </Button>
                    <Button
                      color="Blue"
                      variant="contained"
                      onClick={handleTeacherLogout}
                    >
                      {t("logout")}
                    </Button>
                  </Stack>
                )}
                {student && (
                  <Stack direction="row" alignItems={"center"}>
                    <Box
                      sx={{
                        width: "35px",
                        height: "35px",
                        backgroundColor: "#fc5a5a",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: "50%",
                        cursor: "pointer",
                      }}
                      onClick={() => navigate("/student/notifications")}
                    >
                      <Badge
                        badgeContent={notSeenStudent}
                        color="success">
                        <NotificationsIcon sx={{ fontSize: "22px" }} />
                      </Badge>
                    </Box>
                    <Button
                      color="Blue"
                      variant="contained"
                      sx={{ mx: "8px" }}
                      onClick={() => navigate("/student/statistics")}
                    >
                      {student?.name ? student.name : t("username")}
                    </Button>
                    <Button
                      color="Blue"
                      variant="contained"
                      onClick={handleStudentLogout}
                    >
                      {t("logout")}
                    </Button>
                  </Stack>
                )}
                {parent && (
                  <Stack direction="row" alignItems={"center"}>
                    <Button
                      color="Blue"
                      variant="contained"
                      sx={{ mx: "8px" }}
                      onClick={() => navigate("/parent/profile")}
                    >
                      {parent?.name}
                    </Button>
                    <Button
                      color="Blue"
                      variant="contained"
                      onClick={() => dispatch(logoutParent())}
                    >
                      {t("logout")}
                    </Button>
                  </Stack>
                )}
                {guest && (
                  <>
                    <Stack direction="row" alignItems={"center"}>
                      <Button
                        color="Blue"
                        variant="contained"
                        sx={{ mx: "8px" }}
                        onClick={() => navigate("/guest/profile")}
                      >
                        {t("profile")}
                      </Button>
                      <Button
                        color="Blue"
                        variant="contained"
                        onClick={() => dispatch(logoutGuest())}
                      >
                        {t("logout")}
                      </Button>
                    </Stack>
                  </>
                )}
              </Box>
              <Box
                sx={{
                  display: { xs: "flex", md: "none" },
                  alignItems: "center",
                  columnGap: "10px",
                }}
              >
                <ChangeLanguage lang={lang} />
              </Box>
            </Box>
          </Toolbar>
        </AppBar>

        {/* Drawer */}
        <Box component="nav">
          <Drawer
            container={container}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },

            }}
          >
            {drawer}
          </Drawer>
        </Box>

        <Box component="main" sx={{ paddingY: 0, width: "100%", backgroundColor: "#F5F5F5" }}>
          {props.children}
        </Box>
      </Box>
    </>
  );
}

Navbar.propTypes = {
  window: PropTypes.func,
};

export default Navbar;
