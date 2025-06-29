import React from "react";
import {
  Box,
  Typography,
  Button,
  Container,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import EmojiPeopleIcon from "@mui/icons-material/EmojiPeople"; // أيقونة ترحيب

function TeacherWelcome() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const handleLogin =()=>{
  localStorage.clear();
  navigate("/teacher/dashboard")
  }
  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f4f6f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        direction: i18n.language === "ar" ? "rtl" : "ltr",
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: "white",
            borderRadius: 4,
            boxShadow: 3,
            overflow: "hidden",
            textAlign: "center",
            py: { xs: 4, sm: 6 },
            px: { xs: 2, sm: 4 },
          }}
        >
          <EmojiPeopleIcon
            sx={{
              fontSize: isMobile ? 60 : 100,
              color: "#1976d2",
              mb: 2,
            }}
          />

          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
            {t("welcome_title")}
          </Typography>

          <Typography variant="body1" sx={{ fontSize: 18, mb: 2 }}>
            {t("welcome_message")}
          </Typography>

          {/* <Typography variant="body1" sx={{ fontSize: 18, mb: 4 }}>
            {t("welcome_cta")}
          </Typography> */}

          <Button
            variant="contained"
            sx={{ textTransform: "capitalize", px: 4, py: 1.5 }}
            onClick={handleLogin}
          >
            {t("start_now")}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}

export default TeacherWelcome;
