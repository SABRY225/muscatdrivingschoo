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

export default function RescourceSection() {
  const { t } = useTranslation();

  return (
    <Wrapper>


      {/* إخفاء الصورة عند الشاشات الصغيرة */}
      <Box
        sx={{
          borderRadius: "12px",
          width: "500px",
          display: { xs: "none", md: "block" },
        }}
      >
        <img src="https://server.moalime.com/drive/4.png" alt="Resources" width="100%" />
      </Box>
      <Box sx={{ maxWidth: "650px", textAlign: "center" , marginBottom:{md:6,xs:10},
          marginTop:{md:5,xs:7}}}>
        <Typography
          sx={{
            fontSize: { md: "32px", xs: "22px" },
            fontWeight: "bold",
            color: "#D10909",
          }}
        >
          {t("Valuable educational resources on the Muscat Driving School platform: Your tools for success.")}
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
            "The Muscat Driving School Platform offers a variety of educational resources to help you enhance your learning experience. From study materials and interactive tools to specialized lessons and e-books, you'll find everything you need to support your learning and professional development. Enjoy access to high-quality resources and leverage them to achieve optimal educational outcomes."
          )}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <Link to="/resource">
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
              {t("View Resources")}
            </Box>
          </Link>
        </Box>
      </Box>
    </Wrapper>
  );
}
