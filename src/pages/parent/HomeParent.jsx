import {Avatar,Box,Button,Container,Grid,Paper,Tab,Tabs,Typography,} from "@mui/material";
import React from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation }       from "react-i18next";
import ParentAddStudent         from "../../components/parent/ParentAddStudent";
import { useStudentsForParent } from "../../hooks/useStudentsForParent";
import { useSelector } from "react-redux";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function HomeParent() {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const { parent, token } = useSelector((s) => s.parent);

  const { data } = useStudentsForParent(parent.id, token);
  const { t } = useTranslation();

  return (
    <Navbar>
      <Container sx={{ marginTop: "120px" }}>
        <Typography
          sx={{
            color: "#000000",
            fontWeight: "700",
            fontSize: "24px",
            marginBottom: "8px",
          }}
        >
          {t("parent_welcome")}
        </Typography>
        <Typography
          sx={{
            color: "#000000",
            fontWeight: "500",
            fontSize: "18px",
            marginBottom: "32px",
          }}
        >
          {t("parent_desc")}
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label={t("view_children")} {...a11yProps(0)} />
            <Tab label={t("add")} {...a11yProps(1)} />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <Grid container spacing={2}>
            {data?.data.map((st) => {
              console.log(st.Student);
              return (
                <Grid
                  item
                  xs={12}
                  md={4}
                  lg={3}
                  sx={{ width: "100%" }}
                  key={st.Student.id + "kmk"}
                >
                  <Paper
                    sx={{
                      padding: "8px 6px",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Avatar
                      alt={st.name}
                      src={`${process.env.REACT_APP_API_KEY}images/${st.Student.image}`}
                      sx={{ width: "105px", height: "105px", fontSize: "42px" }}
                    />
                    <Typography
                      sx={{
                        fontWeight: "500",
                        marginY:    "10px",
                        fontSize:   "18px",
                        minHeight:  "50px",
                        textAlign:  "center",
                      }}
                    >
                      {t("student")} : {st.Student.name}
                      <br />
                      <p class="p_email">{t("email")} : {st.Student.email}</p>

                    </Typography>
                    <div>
                    <a className="btn-details-2"
                      onClick={() => navigate(`/parent/student/${st.Student.id}`)}
                    >
                      {t("view_student_profile")}
                    </a>
                    <a className="btn-details-2"
                      onClick={() => navigate(`/parent/student-lessons/${st.Student.id}`)}
                    >
                      {t("view_student_lessons")}
                    </a>
                    </div>
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </TabPanel>
        <TabPanel value={value} index={1}>
          <ParentAddStudent />
        </TabPanel>
      </Container>
    </Navbar>
  );
}
