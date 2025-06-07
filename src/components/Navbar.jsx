import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import { Link, useNavigate } from "react-router-dom";
import ChangeLanguage from "./reusableUi/ChangeLanguage";
import {Badge,Button,ListItemIcon,Menu,MenuItem,Stack,styled,} from "@mui/material";
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
import SearchIcon from "@mui/icons-material/Search";
import EmailIcon from "@mui/icons-material/Email";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import Groups2Icon from "@mui/icons-material/Groups2";
import call from "../images/callsvg.svg";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { useSocialMedia } from "../hooks/useSocialMedia";

const drawerWidth = 240;

const ImageLogo = styled("img")({
  height: "60px",
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

const ImageCall = styled("img")({
  width: "18px",
  height: "18px",
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

  const [notSeen, setNotSeen] = React.useState(0);
  React.useEffect(() => {
    if (teacher) {
      const q = query(
        collection(db, "Notifications"),
        where("TeacherId", "==", `${teacher.id}`)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let conv = [];
        querySnapshot.forEach((doc) => {
          conv.push({ ...doc.data(), id: doc.id });
        });
        setNotSeen(conv.filter((not) => not.seen === false).length);
      });
      return () => unsubscribe();
    } else if (student) {
      const q = query(
        collection(db, "Notifications"),
        where("StudentId", "==", `${student.id}`)
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        let conv = [];
        querySnapshot.forEach((doc) => {
          conv.push({ ...doc.data(), id: doc.id });
        });
        setNotSeen(conv.filter((not) => not.seen === false).length);
      });
      return () => unsubscribe();
    }
  }, [teacher, student]);

  const container =
    window !== undefined ? () => window().document.body : undefined;

  /** teacher profile links */
  const teacherProfile = [
    {title: t("profile"),      link: "/about",    icon: <ManageAccountsIcon fontSize="small" />,  },
    {title: t("lessons"),      link: "/lessons",  icon: <CastForEducationIcon fontSize="small" />,},
    {title: t("my_students"),  link: "/students", icon: <Groups2Icon fontSize="small" />,},
    {
      title: t("messages"),
      link: "/messages",
      icon: <EmailIcon fontSize="small" />,
    },
    {
      title: t("credit"),
      link: "/credit",
      icon: <CreditCardIcon fontSize="small" />,
    },
  ];
  const teacherProfileMobile = [
    { title: t("profile"),      link: "/about",    icon: <ManageAccountsIcon fontSize="small" />,  },
    { title: t("lessons"),      link: "/sessions",  icon: <CastForEducationIcon fontSize="small" />,},
    { title: t("view_teacher_lesson"),    link: "/lessons" },
    { title: t("my_students"),  link: "/students", icon: <Groups2Icon fontSize="small" />,},
    { title: t("messages"),     link: "/messages", icon: <EmailIcon fontSize="small" />,},
    { title: t("credit"),       link: "/credit",   icon: <CreditCardIcon fontSize="small" />,},
    { title: t("profile_photo"),         link: "/photo",   icon: <CreditCardIcon fontSize="small" />,},
    { title: t("additionalInformation"), link: "/additionalInformation" },
    { title: t("subjects"),                link: "/subjects" },
    { title: t("resume"),                 link: "/resume" },
    { title: t("availability"),           link: "/availability" },
    { title: t("description"),            link: "/description" },
    { title: t("video"),                  link: "/video" },
    { title: t("setting_changepassword"), link: "/changepassword" },
    { title: t("students"),               link: "/students" },
    { title: t("certification"),          link: "/certificates" },
    { title: t("lectures"),               link: "/lectures" },
    { title: t("quesiton"),               link: "/question" },
    { title: t("quesiton_choose"),        link: "/question-choose" },
    { title: t("package"),                link: "/package" },
    { title: t("tests"),                  link: "/tests" },
    { title: t("discounts"),              link: "/discounts" },
    { title: t("refunds"),                link: "/refunds" },
    { title: t("setting_page"),           link: "/settings" },
  ];

  const studentProfileMobile = [
    { title: t("profile"),            link: "/profile" },
    { title: t("profile_photo"),      link: "/profile_photo" },
    { title: t("lessons"),            link: "/lessons" },
    { title: t("my_teachers"),        link: "/teachers" },
    { title: t("setting_parent"),     link: "/parents" },
    { title: t("setting_changepassword"), link: "/changepassword" },
    { title: t("messages"),           link: "/messages" },
    { title: t("credit"),             link: "/credit" },
    { title: t("payment_history"),    link: "/payment-history" },
    { title: t("paymentOperations"),  link: "/financial-records" },
    { title: t("refunds"),            link: "/refunds" },
    { title: t("tests"),              link: "/tests" },
    { title: t("lectures"),           link: "/lectures" },
    { title: t("packages"),           link: "/packages" },
    { title: t("discounts"),           link: "/discounts" },
    { title: t("setting_page"),           link: "/settings" },
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
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { data } = useSocialMedia();
  const links = data?.data;
  const whatsAppLink = links
    ?.filter((obj) => obj.type === "Whatsapp")
    .map((obj) => obj.link);
// Change Style by eng.reem.shwky
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center", minHeight: "auto" , height:"100%" , overflow: "scroll", backgroundColor: "#800000" }}>
    <Typography variant="h6" sx={{ my: 2 }}><ImageLogo src={logoImage} /></Typography>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton sx={{ textAlign: "center" }}>
            <ListItemText primary="" />
          </ListItemButton>
        </ListItem>
        <a target="_blank" href="mailto:info@muscatdrivingschool.com">
          <Box sx={{display: "flex",alignItems: "center",columnGap: "4px",justifyContent: "center",color: "white", marginBottom: "12px", }}>
            <EmailOutlinedIcon sx={{ fontSize: "15px" }} />
            <Typography sx={{ fontSize: "14px" }}>info@muscatdrivingschool.com</Typography>
          </Box>
        </a>
        <a target="_blank" href={whatsAppLink || "/"}>
          <Box sx={{display: "flex", alignItems: "center", columnGap: "8px",justifyContent: "center",color: "white", marginBottom: "12px",}}>
            <ImageCall src={call} />
            <Typography sx={{ fontSize: "14px" }}>{t("call")}</Typography>
          </Box>
        </a>
        <SelectCurrency />
        <a href="/careers">
        <Box sx={{display: "flex", alignItems: "center",columnGap: "8px",justifyContent: "center",color: "white", marginBottom: "8px", marginTop:"10px",
              textTransform: "capitalize",padding: "1px 13px",
              backgroundColor: "#ffc93c",color:"#FFF", width:"78%", margin:"auto",
              fontSize: "14px",height: "50px",borderRadius: "10px",}}><Typography sx={{ fontSize: "14px" }}>{t("careers")}</Typography></Box></a>
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
            <Link to="/student/notifications">
              <ListItem
                sx={{ color: "white", display: "flex", justifyContent: "center",}}>
                {t("notifications")}
              </ListItem>
            </Link>
            {studentProfileMobile.map((item, index) => {
              return (
                <Link to={`/student${item.link}`} key={index + "a1"}>
                  <ListItem sx={{ color: "white", display: "flex", justifyContent: "center", }}>
                    {item.title}
                  </ListItem>
                </Link>
              );
            })}
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
                backgroundColor: "#ffc93c",color:"#000",
                fontSize: "14px",height: "50px",borderRadius: "10px",
              }}
              variant="text"
            >
              {t("becometeacher")}
            </Button>

            <Button
                  onClick={() => navigate("/guestRegister/step1")}
                  sx={{
                    my: 2,color: "white",display: "block",textTransform: "capitalize",padding: "1px 13px",backgroundColor: "#000",fontSize: "14px",height: "50px",borderRadius: "10px",}}
                  variant="text"
                >
                  {t("addAds")}
            </Button>
          </Box>
       )}
      </List>
    </Box>
  );

  return (
    <>
      <Box sx={{ display: "flex" }}>
        {/* nav */}
        <AppBar component="nav" sx={{
          background: "#e74c3c",
          margin: "1rem 0rem",
          padding:"0.5rem 0rem",
          borderRadius: "50px",
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
                    padding: "0 0.6rem",
                    fontSize: "15px"
                  }}
                >
                  {t("search_for_teachers")}
                </Box>
              </Link>
              <Link to="/packages">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    padding: "0 0.6rem",
                    fontSize: "15px"
                  }}
                >
                  {t("packages")}
                </Box>
              </Link>
              <Link to="/lectures">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    padding: "0 0.6rem",
                    fontSize: "15px"
                  }}
                >
                  {t("Lectures")}

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
                          color: "#e74c3c",
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
                      // badgeContent={notSeenTeacher} 
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
                        onClick={handleClick}
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
                      <Menu
                        id="account-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            overflow: "visible",
                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            mt: 1.5,
                            "& .MuiAvatar-root": {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            "&:before": {
                              content: '""',
                              display: "block",
                              position: "absolute",
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: "background.paper",
                              transform: "translateY(-50%) rotate(45deg)",
                              zIndex: 0,
                            },
                          },
                        }}
                      >
                        {teacherProfile.map((item) => {
                          return (
                            <MenuItem
                              sx={{ fontSize: "14px" }}
                              onClick={() => {
                                navigate(`/teacher${item.link}`);
                                handleClose();
                              }}
                            >
                              <ListItemIcon>{item.icon}</ListItemIcon>
                              {item.title}
                            </MenuItem>
                          );
                        })}
                        <MenuItem
                          sx={{ fontSize: "14px" }}
                          onClick={handleTeacherLogout}
                        >
                          <ListItemIcon>
                            <LogoutIcon fontSize="small" />
                          </ListItemIcon>
                          {t("logout")}
                        </MenuItem>
                      </Menu>
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
                      // badgeContent={notSeenStudent} 
                      color="success">
                        <NotificationsIcon sx={{ fontSize: "22px" }} />
                      </Badge>
                    </Box>
                    <Button
                      color="Blue"
                      variant="contained"
                      sx={{ mx: "8px" }}
                      onClick={() => navigate("/student/profile")}
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
                {/* <Link to="/landing">
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  marginBottom: "12px",
                }}
              >
                <SearchIcon />
              </Box>
            </Link> */}
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
