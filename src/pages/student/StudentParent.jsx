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
        <ParentTable />
    </StudentLayout>
  );
}
