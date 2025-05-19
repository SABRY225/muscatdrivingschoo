import {Avatar, Box,  Container,  Divider,  Grid,  List,   ListItem,   ListItemButton,   ListItemText,   Paper,    Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { deepOrange } from "@mui/material/colors";

export default function StudentLayout({ children }) {
  const { t } = useTranslation();
  const topics = [
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

  const { student } = useSelector((state) => state.student);
  return (
    <Navbar>
      <Container sx={{ marginTop: "120px", marginBottom: "60px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={3} sx={{ display: { md: "block", xs: "none" },}}>
            <Paper sx={{ padding: "20px" }}>
              <Box sx={{ display: "flex", alignItems: "center",flexDirection: "column",}}>
                <Avatar
                  src={`${process.env.REACT_APP_API_KEY}images/${student?.image}`}
                  alt={student?.name}
                  sx={{
                    width: "95px",
                    height: "95px",
                    fontSize: "36px",
                    bgcolor: deepOrange[500],
                  }}
                />
                <Typography sx={{ marginTop: "16px", fontWeight: "700" }}>
                  {student?.name}
                </Typography>
              </Box>
              <Divider sx={{ marginY: "20px" }} />
              <List>
                {topics.map((topic, index) => {
                  return (
                    <Link to={`/student${topic.link}`}>
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
      {/* <Box sx={{marginTop:"120px"}}>
                <DownloadApp/>
                <LinksFooter/>
                <Footer/>
            </Box> */}
    </Navbar>
  );
}
