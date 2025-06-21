import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { Link, useNavigate } from "react-router-dom";
import ChangeLanguage from "./reusableUi/ChangeLanguage";
import {Badge,Button,Stack,styled,} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { logoutTeacher }  from "../redux/teacherSlice";
import { logoutParent }   from "../redux/parentSlice";
import { studentLogout }  from "../redux/studentSlice";
import { logoutGuest }    from "../redux/guestSlice";
import SelectCurrency     from "./reusableUi/SelectCurrency";
import logoImage from "../images/logo1.png";
import cookies from "js-cookie";
import PersonIcon from "@mui/icons-material/Person";
import EmailIcon from "@mui/icons-material/Email";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import axios from "axios";

const drawerWidth = 240;

const ImageLogo = styled("img")({
  height: "50px",
  backgroundColor:"#fff",
  padding:"0.3rem",
  borderRadius:"50%",

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
  const { parent }  = useSelector((state) => state.parent);
  const { guest }   = useSelector((state) => state.guest);
  const lang = cookies.get("i18next") || "en";

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
            id    : parent.id,
            email : parent.email
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

    }catch (err) {
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
            id    : teacher.id,
            email : teacher.email
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

    }catch (err) {
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
            id    : student.id,
            email : student.email
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

    }catch (err) {
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
    { title: t("controlBoard"),      link: "/dashboard",    icon: <SpaceDashboardIcon fontSize="small" />,  },
    { title: t("lessons"),      link: "/sessions",  icon: <CastForEducationIcon fontSize="small" />,},
    { title: t("messages"),     link: "/messages", icon: <EmailIcon fontSize="small" />,},
    { title: t("lectures"),               link: "/lectures" },
    { title: t("quesiton"),               link: "/question" },
    { title: t("quesiton_choose"),        link: "/question-choose" },
    { title: t("package"),                link: "/package" },
    { title: t("tests"),                  link: "/tests" },
    { title: t("discounts"),              link: "/discounts" },
  ];

  const parentProfileMobile = [
    { title: t("profile"),                link: "/profile" },
    { title: t("profile_photo"),          link: "/profile_photo" },
    { title: t("view_children"),          link: "/" },
    { title: t("setting_changepassword"), link: "/changepassword" },
    { title: t("setting_page"),           link: "/settings" },
  ];

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };


// Change Style by eng.reem.shwky
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", minHeight: "auto" , height:"100%" , overflow: "scroll", backgroundColor: "#800020" }}>
    <Typography variant="h6" sx={{ my: 2 }}><ImageLogo src={logoImage} /></Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
        </ListItem>
            <Link to="/landing">
              <ListItem
                sx={{ color: "white", display: "flex", justifyContent: "center",}}>
                {t("search_for_teachers")}
                <PersonSearchIcon />
              </ListItem>
            </Link>
        {!teacher && !parent && !student && !guest &&(
          <Box sx={{ display: "flex", flexDirection: "column",alignItems: "center",}}>
            <Button sx={{my: 1, color: "white",display: "block",textTransform: "capitalize",padding: "1px 18px",}}
              variant="text" onClick={() => navigate("/login")}>
              {t("login")}
            </Button>
            <Button
              onClick={() => navigate("/teacherRegister/step1")}
              sx={{
                display: "block",textTransform: "capitalize",padding: "1px 13px",
                // backgroundColor: "#ffc93c",
                color:"#fff",
                fontSize: "14px",height: "50px",borderRadius: "10px",
              }}
              variant="text"
            >
              {t("becometeacher")}
            </Button>
          </Box>
       )}
        <SelectCurrency />

        {teacher && (
          <>
            <Link to="/teacher/notifications">
              <ListItem sx={{color: "white",display: "flex",justifyContent: "center",}}>
                {t("notifications")}
              </ListItem>
            </Link>
            {teacherProfileMobile.map((item, index) => {
              return (
                <Link to={`/teacher${item.link}`} key={index + "a1"}>
                  <ListItem sx={{ color: "white", display: "flex", justifyContent: "center", }}>
                    {item.title}
                  </ListItem>
                </Link>
              );
            })}
            <Link to="/" onClick={handleTeacherLogout}>
              <ListItem
                sx={{color: "white", display: "flex",justifyContent: "center",
                }}
              >
                {t("logout")}
              </ListItem>
            </Link>
          </>
        )}
        {student && (
          <>
            <Link to="/student/dashboard">
              <ListItem
                sx={{ color: "white", display: "flex", justifyContent: "center",}}>
                {t("controlBoard")}
              </ListItem>
            </Link>
            <Link to="/student/notifications">
              <ListItem
                sx={{ color: "white", display: "flex", justifyContent: "center",}}>
                {t("notifications")}
              </ListItem>
            </Link>
            <Link to="/" onClick={handleStudentLogout}>
              <ListItem sx={{ color: "white",display: "flex", justifyContent: "center",}}>{t("logout")}</ListItem>
            </Link>
          </>
        )}
        {parent && (
            <>
            {parentProfileMobile.map((item, index) => {
                return (
                  <Link to={`/parent${item.link}`} key={index + "a1"}>
                    <ListItem sx={{ color: "white", display: "flex", justifyContent: "center", }}>
                      {item.title}
                    </ListItem>
                  </Link>
                );
              })}
              <Link to="/" onClick={handleParentLogout}>
                <ListItem sx={{color: "white",display: "flex", justifyContent: "center",}}>
                  {t("logout")}
                </ListItem>
              </Link>
            </>
        )}
        {guest && (
            <>
              <Link to="/guest/profile">
                <ListItem
                  sx={{
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {t("profile")}
                </ListItem>
              </Link>
              <Link to="/guest/create-ads/step1">
                <ListItem
                  sx={{
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  {t("add-ads")}
                </ListItem>
              </Link>
              <Link to="/" onClick={handleGuestLogout}>
                <ListItem
                  sx={{
                    color: "white",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
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
          padding:"0.5rem 0rem",
          borderRadius: "20rem",
        }}>
          <Toolbar sx={{ display: 'flex',justifyContent:"space-between",justifyItems:"center" }}>
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
                    display:"flex",
                    justifyContent:"center",
                    alignItems:"center",
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
                {!teacher && !student && !parent && (
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
                    <Link to="/teacherRegister/step1">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          border: "1px solid",
                          borderRadius: "5px",
                          padding: "6px 4px",
                          color: "#800020",
                          backgroundColor: "#FFFFFF",
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
                    <Box>
                      <Box
                        sx={{
                          color: "white",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          columnGap: "6px",
                        }}
                        onClick={() => navigate("/teacher/dashboard")}
                      >
                        <Box
                          sx={{
                            width: "35px",
                            height: "35px",
                            backgroundColor: "#ffffff33",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: "50%",
                          }}
                        >
                          <PersonIcon sx={{ fontSize: "22px" }} />
                        </Box>
                        {teacher?.firstName
                          ? teacher?.firstName + " " + teacher?.lastName
                          : t("username")}
                      </Box>
                  
                    </Box>
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
                      onClick={() => navigate("/student/dashboard")}
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
                  <Stack alignItems={"center"}>
                    <Button
                      color="Blue"
                      variant="contained"
                      onClick={() => dispatch(logoutParent())}
                    >
                      {t("logout")}
                    </Button>
                  </Stack>
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
