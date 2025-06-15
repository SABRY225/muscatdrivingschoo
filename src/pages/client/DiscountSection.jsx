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
});

export default function DiscountSection() {
  const { t } = useTranslation();

  return (
    <Wrapper>
            <Box sx={{ maxWidth: "600px", textAlign: "center",marginTop:{md:2,xs:7}}}>
        <Typography
          sx={{
            fontSize: { md: "32px", xs: "20px" },
            fontWeight: "bold",
            color: "#800020",
          }}
        >
          {t("Offers and discounts on the Muscat Driving School platform: Take advantage now!")}
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
            "The Muscat Driving School platform offers you the best deals and discounts on services. Whether you're looking for discounts on training courses or educational tools, you'll find special offers here to help you save money and achieve your educational goals. Don't miss out! Check out the current discounts to start taking advantage!"
          )}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <Link to="/discounts">
            <Box
              sx={{
                minWidth: "150px",
                border: "1px solid",
                borderRadius: "5px",
                padding: "8px 12px",
                color: "#800020",
                backgroundColor: "#FFFFFF",
                textAlign: "center",
              }}
            >
              {t("View discounts")}
            </Box>
          </Link>
        </Box>
      </Box>
      {/* إخفاء الصورة عند الشاشات الصغيرة */}
      <Box
        sx={{
          borderRadius: "12px",
          width: "600px",
          display: { xs: "none", md: "block" },
          marginBottom:{md:6,xs:10},
          marginTop:{md:5,xs:7}
        }}
      >
        <img src="https://server.moalime.com/drive/3.png" alt="Discounts" width="100%" />
      </Box>


    </Wrapper>
  );
}
