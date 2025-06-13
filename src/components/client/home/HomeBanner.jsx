import { Box, Button, styled, Typography } from "@mui/material";
import React from "react";
import cover from "../../../images/Rectangle7.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import NumberTab from "./NumberTab";
import whatsapp from "../../../images/whatsapp.png";
import email from "../../../images/email.png";

const Wrapper = styled(Box)(({ theme }) => ({
  backgroundImage: `
    linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url('https://www.shutterstock.com/image-photo/waving-oman-flag-against-sunrise-600nw-2514550935.jpg')
  `,
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
    gap: "20px",
  },
}));


export default function HomeBanner() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Box sx={{ mt: { md: "5rem", xs: "5rem" }, textAlign: "center" }}>
        <Typography
          sx={{
            marginBottom: "8px",
            fontSize: { md: "30px", xs: "22px" },
            fontWeight: "bold",
            width:"510px",
            color: "#fff",
          }}
        >
          {t("bannerTitle")}
        </Typography>
        <Typography
          sx={{
            fontSize: { lg: "18px", md: "16px", xs: "14px" },
            fontWeight: "400",
            maxWidth: "480px",
            paddingX: "10px",
            color: "#fff",
          }}
        >
          {t("bannerDesc")}
        </Typography>

        <Box
          sx={{
            fontSize: { lg: "18px", md: "16px", xs: "14px" },
            fontWeight: "300",
            maxWidth: "480px",
            marginTop: "2rem",
            paddingX: "10px",
            color: "#fff",
            display: "flex",
            flexDirection: { xs: "row", sm: "row" }, // ترتيب عمودي في الهواتف
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
                  color: "#fff",
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
                  color: "#fff",
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

      <Box>
        <NumberTab />
      </Box>
    </Wrapper>
  );
}
