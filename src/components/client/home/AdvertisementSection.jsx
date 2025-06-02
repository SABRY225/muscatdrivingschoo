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
  flexWrap: "wrap", 
  marginTop:"2.5rem"
});

export default function AdvertisementSection() {
  const { t } = useTranslation();

  return (
    <Wrapper>
      <Box
        sx={{
          borderRadius: "12px",
          width: "600px",
          display: { xs: "none", md: "block" },
        }}
      >
        <img src="https://server.moalime.com/drive/2.png" alt="Ad" width="100%" height="400px"/>
      </Box>
      <Box sx={{ maxWidth: "500px", textAlign: "center" , marginBottom:{md:6,xs:10},
            marginTop:{md:5,xs:7}}}>
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
            "Muscat Driving School provides a platform for posting and viewing advertisements for driving instruction services in the Sultanate of Oman. Whether you're a professional instructor offering driving lessons or looking for an instructor near you, you can now easily list your services or browse available advertisements. The platform allows instructors to control their time and income, and allows learners to choose the right instructor based on location and skill."
          )}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent:"center",
            gap: 2,
            marginTop: "2rem",
          }}
        >
          <Link to="/advertisement">
            <Box
              sx={{
                minWidth: "120px",
                border: "1px solid",
                borderRadius: "5px",
                padding: "8px 12px",
                color: "#EF0D0D",
                backgroundColor: "#FFFFFF",
                textAlign: "center",
              }}
            >
              {t("Advertisements")}
            </Box>
          </Link>
          <Link to="/guest">
            <Box
              sx={{
                minWidth: "120px",
                border: "1px solid",
                borderRadius: "5px",
                padding: "8px 12px",
                color: "#FFF",
                backgroundColor: "#EF0D0D",
                textAlign: "center",
              }}
            >
              {t("Add Ad Here")}
            </Box>
          </Link>
        </Box>
      </Box>
    </Wrapper>
  );
}
