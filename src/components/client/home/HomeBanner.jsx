import { Box, Button, styled, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import NumberTab from "./NumberTab";
import whatsapp from "../../../images/whatsapp.png";
import email from "../../../images/email.png";

const Wrapper = styled(Box)(({ theme }) => ({
  backgroundPosition: "top",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  color: "white",
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  textAlign: "center",
  height: "70vh",
  padding: "50px 10px",
  [theme.breakpoints.down("md")]: {
    flexDirection: "column",
    height: "auto",
    padding: "30px 10px",
    gap: "30px",
  },
}));

export default function HomeBanner() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      {/* Left side: Text & contact info */}
      <Box
        sx={{
          mt: { md: "5rem", xs: "5rem" },
          textAlign: "center",
          maxWidth: "600px",
          // width: "100%",
          px: 2,
        }}
      >
        <Typography
          sx={{
            mb: 2,
            fontSize: { md: "30px", xs: "22px" },
            fontWeight: "bold",
            color: "#800020",
          }}
        >
          {t("bannerTitle")}
        </Typography>

        <Typography
          sx={{
            fontSize: { md: "16px", xs: "14px" },
            fontWeight: 400,
            color: "#000",
            mb: 3,
          }}
        >
          {t("bannerDesc")}
        </Typography>

        {/* Contact info */}
        <Box
          sx={{
            fontSize: { md: "16px", xs: "14px" },
            fontWeight: 300,
            color: "#fff",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            mt: 3,
          }}
        >
          {/* Email */}
          <a href="mailto:info@muscatdrivingschool.com" style={{ textDecoration: "none" }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: { md: "18px", xs: "16px" },
                  color: "#800020",
                  fontWeight: 700,
                }}
              >
                info@muscatdrivingschool.com
              </Typography>
              <Box
                component="img"
                src={email}
                alt="Email"
                sx={{ width: { xs: 30, md: 40 }, height: { xs: 30, md: 40 } }}
              />
            </Box>
          </a>

          {/* WhatsApp */}
          <a
            href="https://api.whatsapp.com/send?phone=96894085688"
            target="_blank"
            rel="noopener noreferrer"
            style={{ textDecoration: "none" }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: { md: "18px", xs: "16px" },
                  color: "#800020",
                  fontWeight: 700,
                }}
              >
                +96894085688
              </Typography>
              <Box
                component="img"
                src={whatsapp}
                alt="WhatsApp"
                sx={{ width: { xs: 30, md: 40 }, height: { xs: 30, md: 40 } }}
              />
            </Box>
          </a>
        </Box>
      </Box>

      {/* Right side: NumberTab */}
      <Box sx={{ px: 2}}>
        <NumberTab />
      </Box>
    </Wrapper>
  );
}
