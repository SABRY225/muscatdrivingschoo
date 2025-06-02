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

export default function ExamSection() {
  const { t } = useTranslation();

  return (
    <Wrapper>


      <Box sx={{ maxWidth: "650px", textAlign: "center" }}>
        <Typography
          sx={{
            marginTop: "-10px",
            fontSize: { md: "32px", xs: "22px" },
            fontWeight: "bold",
            color: "#D10909",
          }}
        >
          {t("Educational tests on the Muscat Driving School platform. Evaluate your progress and develop your skills.")}
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
            "The Muscat Driving School platform offers a variety of educational tests to help you measure your knowledge and achieve tangible progress in your field of study. Whether you're a student seeking to evaluate your performance or a teacher wanting to test your students' skills, you'll find carefully designed tests to suit all needs. Use these tests as a powerful tool to develop your skills and achieve excellence!"
          )}
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            marginTop: "2rem",
          }}
        >
          <Link to="/exames">
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
              {t("View exams")}
            </Box>
          </Link>
        </Box>
      </Box>
            {/* إخفاء الصورة في الشاشات الصغيرة */}
            <Box
        sx={{
          borderRadius: "12px",
          width: "500px",
          display: { xs: "none", md: "block" },
          marginBottom:{md:6,xs:10},
          marginTop:{md:5,xs:7}
        }}
      >
        <img src="https://server.moalime.com/drive/5.png" alt="Exams" width="100%" />
      </Box>
    </Wrapper>
  );
}
