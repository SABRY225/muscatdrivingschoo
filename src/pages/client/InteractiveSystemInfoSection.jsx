import { Box, Typography, styled } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Wrapper = styled(Box)({
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundSize: "cover",
    color: "white",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    textAlign: "center",
    flexWrap: "wrap",  // جعل التصميم متجاوبًا
});

export default function InteractiveSystemInfoSection() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      {/* إخفاء الصورة عند الشاشات الصغيرة */}
      <Box
        sx={{
          borderRadius: "12px",
          width: "600px",
          display: { xs: "none", md: "block" },
          marginBottom:{md:6,xs:10},
          marginTop:{md:2,xs:7}
        }}
      >
        <img src="https://server.moalime.com/drive/6.png" alt="Job" style={{borderRadius:"1.5rem",width:"90%"}} />
      </Box>

      <Box sx={{ maxWidth: "600px", textAlign: "center" }}>
        <Typography
          sx={{
            marginTop: "10px",
            fontSize: { md: "32px", xs: "22px" },
            fontWeight: "bold",
            color: "#D10909",
          }}
        >
          {t("Points and rewards system on the Muscat Driving School platform")}
        </Typography>
        <Typography
          sx={{
            fontSize: { lg: "18px", md: "18px", xs: "14px" },
            fontWeight: "400",
            margin: "1.5rem 0",
            paddingX: "10px",
            color: "#000000",
          }}
        >
          {t(
            "A system that motivates students and teachers to interact by collecting points for various activities within the platform, which they can later use as rewards."
          )}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <Link to="/ractiveSystemInfo">
            <Box
              sx={{
                minWidth: "150px",
                border: "1px solid",
                borderRadius: "5px",
                padding: "8px 12px",
                color: "#D10909",
                backgroundColor: "#FFFFFF",
                textAlign: "center",
              }}
            >
              {t("Learn more about the system")}
            </Box>
          </Link>
        </Box>
      </Box>
    </Wrapper>
  );
}
