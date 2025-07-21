import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Link,
  CircularProgress,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import AdminLayout from "./AdminLayout";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Studentcertificatesadmin() {
  const { t } = useTranslation();
  const [certificatesadmin, setcertificatesadmin] = useState([]);
  const [loading, setLoading] = useState(true);
  const { token } = useSelector((state) => state.admin);
    const navigate = useNavigate();

  useEffect(() => {
    fetchcertificatesadmin();
  }, []);

  const fetchcertificatesadmin = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/certificates`, {
  headers: {
    Authorization: `${token}`,
  },
});  

      const data = await response.json();
console.log(data);

      setcertificatesadmin(data.data);
    } catch (error) {
      console.error(t("errors.fetch_certificatesadmin"), error);
    } finally {
      setLoading(false);
    }
  };
const printPDF = (cert) => {
        navigate(`/certificate/${cert.StudentName}/${cert.teacherSignature}/${cert.trainingStage}/${cert.certificateDate}`)
    };
  return (
    <AdminLayout>
    <Box sx={{ padding: 4 }}>
      <Typography variant="h5" gutterBottom>
        {t("certificatesadmin.title")}
      </Typography>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ backgroundColor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white" }}>{t("certificatesadmin.id")}</TableCell>
                <TableCell sx={{ color: "white" }}>{t("certificatesadmin.student_name")}</TableCell>
                <TableCell sx={{ color: "white" }}>{t("certificatesadmin.course_name")}</TableCell>
                <TableCell sx={{ color: "white" }}>{t("certificatesadmin.issue_date")}</TableCell>
                <TableCell sx={{ color: "white" }}>{t("certificatesadmin.link")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {certificatesadmin.map((cert) => (
                <TableRow key={cert.id}>
                  <TableCell>{cert.id}</TableCell>
                  <TableCell>{cert.StudentName}</TableCell>
                  <TableCell>{cert.trainingStage}</TableCell>
                  <TableCell>
                    {new Date(cert.certificateDate).toLocaleDateString("ar-EG")}
                  </TableCell>
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
      )}
    </Box>
    </AdminLayout>

  );
}
