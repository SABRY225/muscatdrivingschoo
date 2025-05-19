import {Avatar, Box,  Container,  Divider,  Grid,  List,   ListItem,   ListItemButton,   ListItemText,   Paper,    Typography,
} from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { deepOrange } from "@mui/material/colors";
import Navbar from "../Navbar";

export default function Layout({ children }) {
  const { t } = useTranslation();
  const topics = [
    { title: t("profile"),                link: "/profile"  },
    { title: t("profile_photo"),          link: "/photo"    },
    { title: t("setting_changepassword"), link: "/changepassword" },
    { title: t("add-ads"),                link: "/create-ads/step1" },
    { title: t("ads"),                    link: "/ads" },
    { title: t("careers"),                link: "/careers" },
    
  ];

  const { guest } = useSelector((state) => state.guest);
  return (
    <Navbar>
      <Container sx={{ marginTop: "120px", marginBottom: "60px" }}>
        <Grid container spacing={2}>
          <Grid item xs={12} lg={3}>
            <Paper sx={{ padding: "20px" }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <Avatar
                  src={`${process.env.REACT_APP_API_KEY}images/${guest?.image}`}
                  alt={guest?.name}
                  sx={{
                    width: "95px",
                    height: "95px",
                    fontSize: "36px",
                    bgcolor: deepOrange[500],
                  }}
                />
                <Typography sx={{ marginTop: "16px", fontWeight: "700" }}>
                  {guest?.name}
                </Typography>
              </Box>
              <Divider sx={{ marginY: "20px" }} />
              <List>
                {topics.map((topic, index) => {
                  return (
                    <Link to={`/guest${topic.link}`}>
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
