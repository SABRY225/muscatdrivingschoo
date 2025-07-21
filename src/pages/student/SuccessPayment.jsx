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
            body: JSON.stringify({ language: lang }),
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
      <Container maxWidth="sm" sx={{ marginTop:"8rem" }}>
        <Paper
          elevation={3}
          sx={{
            mx: "auto",
            borderRadius: "16px",
            p: { xs: 3, sm: 4 },
            textAlign: "center",
          }}
        >
          <Box
            sx={{
              width: 70,
              height: 70,
              backgroundColor: "#0cbc87",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
            }}
          >
            <CheckIcon sx={{ color: "#fff", fontSize: 40 }} />
          </Box>

          <Typography
            variant="h6"
            component="h2"
            sx={{
              mt: 3,
              fontWeight: "bold",
              fontSize: { xs: "18px", sm: "22px" },
            }}
          >
            {t("pay_success")}
          </Typography>
        </Paper>
      </Container>
    </Navbar>
  );
}
