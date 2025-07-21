import {
  Avatar,
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Tab,
  Tabs,
  Typography,
  CircularProgress,
} from "@mui/material";
import React, { useState, useMemo } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ParentAddStudent from "../../components/parent/ParentAddStudent";
import { useStudentsForParent } from "../../hooks/useStudentsForParent";
import { useSelector } from "react-redux";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
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
    id: `tab-${index}`,
    "aria-controls": `tabpanel-${index}`,
  };
}

export default function HomeParent() {
  const navigate = useNavigate();
  const [value, setValue] = useState(0);
  const { parent, token } = useSelector((s) => s.parent);
  const { t } = useTranslation();

  const { data, isLoading } = useStudentsForParent(parent.id, token);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const students = useMemo(() => data?.data || [], [data]);

  return (
    <Navbar>
      <Container sx={{ marginTop: "100px", marginBottom: "30px" }}>
        <Typography variant="h5" fontWeight="bold" mb={1}>
          {t("parent_welcome")}
        </Typography>
        <Typography variant="body1" fontWeight="medium" mb={3}>
          {t("parent_desc")}
        </Typography>

        <Box borderBottom={1} borderColor="divider" mb={3}>
          <Tabs value={value} onChange={handleChange}>
            <Tab label={t("view_children")} {...a11yProps(0)} />
            <Tab label={t("add")} {...a11yProps(1)} />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          {isLoading ? (
            <Box display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          ) : students.length > 0 ? (
            <Grid container spacing={2}>
              {students.map((st) => (
                <Grid item xs={12} md={6} lg={4} key={st.Student.id}>
                  <Paper
                    sx={{
                      padding: 2,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      borderRadius: 3,
                    }}
                    elevation={3}
                  >
                    <Avatar
                      src={`${process.env.REACT_APP_API_KEY}images/${st.Student.image}`}
                      alt={st.Student.name}
                      sx={{ width: 100, height: 100, fontSize: "32px" }}
                    />
                    <Typography mt={1.5} fontWeight="500" textAlign="center">
                      {t("student")} : {st.Student.name}
                    </Typography>
                    <Typography fontSize="14px" color="text.secondary" textAlign="center">
                      {t("email")} : {st.Student.email}
                    </Typography>

                    <Box mt={2} display="flex" flexDirection="column" gap={1} width="100%">
                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => navigate(`/parent/student/${st.Student.id}`)}
                      >
                        {t("view_student_profile")}
                      </Button>
                      <Button
                        fullWidth
                        variant="outlined"
                        onClick={() => navigate(`/parent/student-lessons/${st.Student.id}`)}
                      >
                        {t("view_student_lessons")}
                      </Button>
                    </Box>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Typography align="center" color="text.secondary">
              {t("no_students_found")}
            </Typography>
          )}
        </TabPanel>

        <TabPanel value={value} index={1}>
          <ParentAddStudent />
        </TabPanel>
      </Container>
    </Navbar>
  );
}
