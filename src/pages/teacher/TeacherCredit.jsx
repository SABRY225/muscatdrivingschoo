import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Button, Container, Grid, Paper, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCreditTeacher } from "../../hooks/useCreditTeacher";
import { useSelector } from "react-redux";
import { useTeacherHistroy } from "../../hooks/useTeacherHistroy";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import Loading from "../../components/Loading";

export default function TeacherCredit() {
  const { t } = useTranslation();
  const { teacher, token }  = useSelector((state) => state.teacher);
  const { data, isLoading } = useCreditTeacher(teacher?.id, token);
  const finicails           = useTeacherHistroy(teacher?.id, token);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const lang = Cookies.get("i18next") || "en";
  const { currency } = useSelector((state) => state.currency);
  const { conversionRate } = useSelector((state) => state.conversionRate);

  const handleRequestCheckout = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/request-checkout/` +
          teacher.id,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      const responseData = await response.json();
      if (response.ok) {
        enqueueSnackbar(
          lang === "en" ? responseData.msg.english : responseData.msg.arabic,
          {
            variant: "success",
            autoHideDuration: 5000,
          }
        );
        window.location.reload();
      }
    } catch (error) {
      console.log("error: ", error);
      enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 1000,
      });
    }
  };
  return (
    <Navbar>
      <Container sx={{ marginY: "120px" }}>
        {isLoading || data.data.totalAmount - data.data.dues < 35.5 ? (
          <Button
            sx={{
              textTransform: "capitalize",
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "600",
              opacity: 0.7,
            }}
            variant="contained"
            color="success"
            title={t("lowBalance")}
            onClick={() => alert(t("lowBalance"))}
          >
            {t("requestPayment")}
          </Button>
        ) : (
          <Button
            sx={{
              textTransform: "capitalize",
              marginBottom: "20px",
              fontSize: "18px",
              fontWeight: "600",
            }}
            variant="contained"
            color="success"
            onClick={handleRequestCheckout}
          >
            {t("requestPayment")}
          </Button>
        )}
        {!isLoading && conversionRate ? (
          <Paper sx={{ padding: "40px 20px" }}>
            <Grid
              container
              rowGap={2}
              spacing={2}
              justifyContent="center"
              alignItems="center"
            >
              <Grid item xs={12} md={4}>
                <Typography sx={{ fontSize: "18px", textAlign: "center" }}>
                  {t("totalbalance")}
                </Typography>
                <Typography sx={{ fontSize: "24px", textAlign: "center" }}>
                  {isLoading
                    ? 0
                    : (data.data.totalAmount * conversionRate).toFixed(2)}{" "}
                  {currency}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ fontSize: "18px", textAlign: "center" }}>
                  {t("availablebalance")}
                </Typography>
                <Typography sx={{ fontSize: "24px", textAlign: "center" }}>
                  {isLoading
                    ? 0
                    : (
                        (data.data.totalAmount - data.data.dues) *
                        conversionRate
                      ).toFixed(2)}{" "}
                  {currency}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ fontSize: "18px", textAlign: "center" }}>
                  {t("withdrawnbalance")}
                </Typography>
                <Typography sx={{ fontSize: "24px", textAlign: "center" }}>
                  {isLoading ? 0 : (data.data.dues * conversionRate).toFixed(2)}{" "}
                  {currency}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Loading />
        )}
        {!finicails.isLoading ? (
          <TableContainer component={Paper} sx={{ marginTop: "30px" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">{t("amount")}</TableCell>
                  <TableCell align="right">{t("status")}</TableCell>
                  <TableCell align="right">{t("history")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {finicails.data?.data.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="right">{row.amount}</TableCell>
                    <TableCell align="right">{t(row.type)}</TableCell>
                    <TableCell align="right">
                      {row.createdAt.split("T")[0]}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          ""
        )}
      </Container>
    </Navbar>
  );
}
