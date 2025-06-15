import { Box, Button, styled, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
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
      <Box
        sx={{
          mt: { md: "5rem", xs: "5rem" },
          textAlign: "center",
          maxWidth: "600px",
          width: "100%",
          px: 2,
        }}
      >
        <Typography
          sx={{
            marginBottom: "12px",
            fontSize: { md: "30px", xs: "20px" },
            fontWeight: "bold",
            color: "#800020",
          }}
        >
          {t("bannerTitle")}
        </Typography>

        <Typography
          sx={{
            fontSize: { md: "16px", xs: "14px" },
            fontWeight: "400",
            color: "#000",
            mb: 2,
          }}
        >
          {t("bannerDesc")}
        </Typography>

        <Box
          sx={{
            fontSize: { lg: "18px", md: "16px", xs: "14px" },
            fontWeight: "300",
            mt: "1.5rem",
            color: "#fff",
            display: "flex",
            flexDirection: { md: "row", xs: "column" },
            alignItems: "center",
            justifyContent: "center",
            gap: "16px",
          }}
        >
          <a href="mailto:info@muscatdrivingschool.com">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                columnGap: "8px",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: { md: "20px", xs: "16px" },
                  color: "#800020",
                  fontWeight: "700",
                }}
              >
                info@muscatdrivingschool.com
              </Typography>
              <img src={email} alt="Email" width={40} height={40} />
            </Box>
          </a>

          <a
            target="_blank"
            href="https://api.whatsapp.com/send?phone=96894085688"
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                columnGap: "8px",
                justifyContent: "center",
              }}
            >
              <Typography
                sx={{
                  fontSize: { md: "20px", xs: "16px" },
                  color: "#800020",
                  fontWeight: "700",
                }}
              >
                {"96894085688+"}
              </Typography>
              <img src={whatsapp} alt="WhatsApp" width={40} height={40} />
            </Box>
          </a>
        </Box>
      </Box>

      <Box sx={{ px: 2, width: { xs: "100%", md: "auto" } }}>
        <NumberTab />
      </Box>
    </Wrapper>
  );
}
