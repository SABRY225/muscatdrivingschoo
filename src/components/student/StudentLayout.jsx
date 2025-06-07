import {
  Avatar,
  Box,
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { deepOrange } from "@mui/material/colors";

import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import AttachmentIcon from "@mui/icons-material/Attachment";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SchoolIcon from "@mui/icons-material/School";
import LockIcon from "@mui/icons-material/Lock";
import MessageIcon from "@mui/icons-material/Message";
import PaymentIcon from "@mui/icons-material/Payment";
import SupportIcon from "@mui/icons-material/Support";
import MenuIcon from "@mui/icons-material/Menu";
import RequestPageIcon from "@mui/icons-material/RequestPage";
import GradingIcon from "@mui/icons-material/Grading";

export default function StudentLayout({ children }) {
  const { t } = useTranslation();
  const location = useLocation();
  const { student } = useSelector((state) => state.student);
  const [mobileOpen, setMobileOpen] = useState(false);

  const topics = [
    { title: t("profile"), link: "/profile", icon: <AccountCircleIcon /> },
    { title: t("parent"), link: "/parents", icon: <EscalatorWarningIcon /> },
    { title: t("Points earned"), link: "/referral-system", icon: <AttachmentIcon /> },
    { title: t("profile_photo"), link: "/profile_photo", icon: <PhotoCameraIcon /> },
    { title: t("Lesson booking requests"), link: "/request-lesson", icon: <GradingIcon /> },
    { title: t("alllessons"), link: "/lessons", icon: <MenuBookIcon /> },
    // { title: t("pastlessons"), link: "/pastLessons", icon: <MenuBookIcon /> },
    // { title: t("cominglessons"), link: "/comingLessons", icon: <MenuBookIcon /> },
    { title: t("packages"), link: "/package", icon: <LocalOfferIcon /> },
    { title: t("Lectures"), link: "/lecture", icon: <SchoolIcon /> },
    { title: t("Questions"), link: "/questions", icon: <MenuBookIcon /> },
    { title: t("Exams"), link: "/exam", icon: <MenuBookIcon /> },
    { title: t("Resource"), link: "/resource", icon: <MenuBookIcon /> },
    { title: t("Discounts"), link: "/discount", icon: <LocalOfferIcon /> },
    { title: t("my_teachers"), link: "/teachers", icon: <SchoolIcon /> },
    { title: t("Change Password"), link: "/changepassword", icon: <LockIcon /> },
    { title: t("messages"), link: "/messages", icon: <MessageIcon /> },
    { title: t("credit"), link: "/credit", icon: <PaymentIcon /> },
    // { title: t("payment_history"), link: "/payment-history", icon: <PaymentIcon /> },
    { title: t("paymentOperations"), link: "/financial-records", icon: <PaymentIcon /> },
    { title: t("Complaints"), link: "/technical-support", icon: <SupportIcon /> },
    { title: t("My bills"), link: "/mybills", icon: <RequestPageIcon /> },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Paper sx={{ padding: "20px 20px 100px", width: 230,backgroundColor:"#e74c3c",borderRadius:"20rem",margin:"0 1rem" }}>
      <Box sx={{ display: "flex", alignItems: "center", flexDirection: "column" }}>
        <Avatar
          src={`${process.env.REACT_APP_API_KEY}images/${student?.image}`}
          alt={student?.name}
          sx={{
            width: 95,
            height: 95,
            fontSize: 36,
            bgcolor: deepOrange[500],
            backgroundColor:"#fff"
          }}
        />
        <Typography sx={{ marginTop: 2, fontWeight: "700",color:"#fff" }}>
          {student?.name}
        </Typography>
      </Box>
      <Divider sx={{ marginY: 2 ,backgroundColor:"#fff"}} />
      <List>
        {topics.map((topic, index) => {
          const fullPath = `/student${topic.link}`;
          const isSelected = location.pathname === fullPath;

          return (
            <Link
              key={index}
              to={fullPath}
              style={{ textDecoration: "none", color: "inherit" }}
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
  );

  return (
    <Navbar>
      <Paper sx={{ marginTop: "120px", paddingBottom: "1rem",}}>
        <Grid container spacing={2}>
          {/* زر القائمة للجوال */}
          <Grid item xs={12} sx={{ display: { md: "none" }, textAlign: "left" }}>
            <IconButton onClick={handleDrawerToggle}>
              <MenuIcon />
            </IconButton>
          </Grid>

          {/* القائمة الجانبية - تظهر دائمًا في الشاشات الكبيرة */}
          <Grid item xs={12} md={3} sx={{ display: { xs: "none", md: "block" } }}>
            {drawer}
          </Grid>

          {/* القائمة الجانبية للجوال */}
          <Drawer
            anchor="left"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": { width: 300 },
            }}
          >
            {drawer}
          </Drawer>

          {/* المحتوى الرئيسي */}
          <Grid item xs={12} md={8} mt={5} sx={{ overflow: "hidden"}}>
            {children}
          </Grid>
        </Grid>
      </Paper>
    </Navbar>
  );
}
