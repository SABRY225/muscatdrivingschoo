import React from "react";
import StudentLayout from '../../components/student/StudentLayout';
import {Box,Container,Tab,Tabs,Typography,Paper} from "@mui/material";
import { Link, useParams }      from "react-router-dom";
import { useTranslation }       from "react-i18next";
import ParentTable              from '../../components/student/ParentTable';


export default function ParentView() {
  const { id }              = useParams();
  const { t } = useTranslation();

  return (
    <StudentLayout>
      <Paper sx={{padding:"40px 20px"}}>

        <Typography
          sx={{
            color: "#000000",
            fontWeight: "500",
            fontSize: "18px",
            marginBottom: "32px",
          }}
        >
          {t("parent_name")}
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Link to={"/student"}>
            <Tabs value="1">
              <Tab label={t("view_parent")} value="1" />
            </Tabs>
          </Link>
        </Box>
        <Container>
         
            <ParentTable />
          
        </Container>
      </Paper>
    </StudentLayout>
  );
}
