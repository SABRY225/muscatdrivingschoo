import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Typography,
  Link,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import StudentLayout from "./StudentLayout";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";


const StudentCertificatesTable = () => {
  const { t } = useTranslation();
  const [certificates, setCertificates] = useState([]);
    const { student } = useSelector((state) => state.student);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/evaluations/${student.id}`);
        const result = await res.json();
        if (res.ok) {
          setCertificates(result.data);
        } else {
          console.error("❌ Error loading certificates:", result.msg);
        }
      } catch (error) {
        console.error("❌ Fetch error:", error);
      }
    };

    fetchCertificates();
  }, []);
 const printPDF = (cert) => {
        navigate(`/certificate/${cert.StudentName}/${cert.teacherSignature}/${cert.trainingStage}/${cert.certificateDate}`)
    };
  return (
    <Navbar>
      <StudentLayout>
        <Box p={3}>
          <Typography variant="h5" gutterBottom>
            {t("Student Certificates")}
          </Typography>

          <TableContainer component={Paper}>
            <Table>
              <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>{t("date")}</TableCell>
                  <TableCell>{t("Teacher Name")}</TableCell>
                  <TableCell>{t("actions")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {certificates.map((cert, index) => (
                  <TableRow key={cert.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{cert.certificateDate}</TableCell>
                    <TableCell>{cert.Teacher.firstName+" "+cert.Teacher.lastName}</TableCell>
                    <TableCell>
                         <Button
                                                        onClick={() => printPDF(cert)}
                                                        className="bg-green-500 text-white w-28 py-2 rounded"
                                                        variant="outlined"
                                                    >
                                                        {t("open")}
                                                    </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </StudentLayout>
    </Navbar>
  );
};

export default StudentCertificatesTable;
