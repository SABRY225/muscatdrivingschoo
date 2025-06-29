import {
  Box,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Navbar from "../Navbar";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SchoolIcon from "@mui/icons-material/School";
import MessageIcon from "@mui/icons-material/Message";
import MenuIcon from "@mui/icons-material/Menu";
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import QuizIcon from '@mui/icons-material/Quiz'; // ✅ للأسئلة
import AssignmentIcon from '@mui/icons-material/Assignment'; // ✅ للامتحانات
import DiscountIcon from '@mui/icons-material/Percent'; // ✅ للخصومات
import SupportAgentIcon from '@mui/icons-material/SupportAgent'; // ✅ للدعم الفني
import { AccountTree, WorkspacePremium } from "@mui/icons-material";

export default function StudentLayout({ children }) {
  const { t } = useTranslation();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

 const topics = [
  { icon: <SpaceDashboardIcon />, title: t("controlBoard"), link: "/dashboard" },
      { icon: <AccountTree />, title: t("Statistics"), link: "/statistics" },
  { icon: <WorkspacePremium />, title: t("certification"), link: "/certificates" },
  { icon: <MenuBookIcon />, title: t("alllessons"), link: "/lessons" },
  { icon: <LocalOfferIcon />, title: t("packages"), link: "/package" },
  { icon: <SchoolIcon />, title: t("Lectures"), link: "/lecture" },
  { icon: <QuizIcon />, title: t("Questions"), link: "/questions" },          // ✅ تغيير لأيقونة Quiz
  { icon: <AssignmentIcon />, title: t("Exams"), link: "/exam" },             // ✅ تغيير لأيقونة Assignment
  { icon: <DiscountIcon />, title: t("Discounts"), link: "/discount" },       // ✅ تغيير لأيقونة Percent
  { icon: <MessageIcon />, title: t("messages"), link: "/messages" },
  { icon: <SupportAgentIcon />, title: t("Complaints"), link: "/technical-support" } // ✅ تغيير لأيقونة دعم
];


  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
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
                    margin: "0.2rem 0",
                    "&:hover": {
                      backgroundColor: "rgba(25, 118, 210, 0.04)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: isSelected ? "#fff" : "#000" }}>{topic.icon}</ListItemIcon>
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
      <Box sx={{ marginTop: "7rem", paddingBottom: "1rem", }}>
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
              "& .MuiDrawer-paper": { width: 270,background:"rgba(255, 255, 255, 0)" },

            }}
          >
            {drawer}
          </Drawer>

          <Grid item xs={12} lg={8} sx={{ marginTop: "2rem" ,height: "80vh"}}>
            {children}
          </Grid>
        </Grid>
      </Box>
    </Navbar>
  );
}
