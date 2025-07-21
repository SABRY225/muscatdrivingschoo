import Cookies from "js-cookie";
import React from "react";
import {Box,Paper,Table,TableBody,TableCell,TableHead,TableRow,Typography} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import StudentLayout from "../../components/student/StudentLayout";
import moment from "moment";
import Loading from "../../components/Loading";
import { useStudentPackages } from "../../hooks/useStudentPackages";
import { useNavigate } from "react-router-dom";

function StudentPackages() {
  const lang = Cookies.get("i18next") || "en";
  const { t } = useTranslation();
  const { student, token }    = useSelector((state) => state.student);
  const { data, isLoading }   = useStudentPackages(student.id);


  return (
    <StudentLayout>
      {!isLoading ? (
        <Paper sx={{ padding: "20px", marginBottom: "40px" }}>
          <Typography
            sx={{
              fontSize: "24px",
              marginTop: "12px",
              fontWeight: "600",
              marginBottom: "30px",
            }}
          >
            {t("paymentOperations")}
          </Typography>
          <Box sx={{ overflow: "auto" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("package")}
                  </TableCell>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("amount")}
                  </TableCell>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("currency")}
                  </TableCell>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("status")}
                  </TableCell>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("history")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.length > 0 ?
                  data?.data.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        { (lang == "ar") ? row.Package?.titleAR + " " : row.Package?.titleEN}
                      </TableCell>
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {row.price}
                      </TableCell>
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {row.currency}
                      </TableCell>
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {row.type}
                      </TableCell>
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {moment(row.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                  :
                <TableRow>
                  <TableCell colSpan={5}><p className="notfound">{t("student_packages_notfound")}</p> </TableCell>
                </TableRow>
                }
              </TableBody>
            </Table>
          </Box>
        </Paper>
      ) : (
        <Loading />
      )}
      
    </StudentLayout>
  );
}

export default StudentPackages;
