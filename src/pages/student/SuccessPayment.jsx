import { Box, Container, Paper, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import CheckIcon from "@mui/icons-material/Check";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

export default function SuccessPayment() {
  const lang = Cookies.get("i18next") || "en";

  useEffect(() => {
    async function handleSuccess() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/payment/bookingSuccess`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              language: lang,
            }),
          }
        );
        const data = await response.json();
        if (response.status !== 200 && response.status !== 201) {
          throw new Error("failed occured");
        }
        console.log(data);
      } catch (err) {
        console.log(err);
      }
    }
    handleSuccess();
  }, []);

  const { t } = useTranslation();
  return (
    <Navbar>
      <Container sx={{ marginTop: "120px" }}>
        <Paper
          sx={{
            width: "350px",
            margin: "80px auto",
            borderRadius: "12px",
            padding: "20px",
          }}
        >
          <Box
            sx={{
              width: "55px",
              height: "55px",
              backgroundColor: "#0cbc87",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "auto",
            }}
          >
            <CheckIcon sx={{ color: "white", fontSize: "34px" }} />
          </Box>
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "22px",
              fontWeight: "600",
              marginTop: "20px",
            }}
          >
            {t("pay_success")}
          </Typography>
        </Paper>
      </Container>
    </Navbar>
  );
}
