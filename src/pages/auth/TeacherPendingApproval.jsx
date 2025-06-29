import React from "react";
import {
  Box,
  Typography,
  Container,
  Button,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";

function TeacherPendingApproval() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Navbar>
      <Box
        sx={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          direction: i18n.language === "ar" ? "rtl" : "ltr",
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              backgroundColor: "white",
              padding: { xs: 3, sm: 5 },
              borderRadius: 4,
              textAlign: "center",
              boxShadow: 3,
            }}
          >
            <HourglassEmptyIcon
              sx={{ fontSize: isMobile ? 60 : 100, color: "#ffa726", mb: 2 }}
            />

            <Typography variant="h5" fontWeight="bold" gutterBottom>
              {t("pending_title") || "جاري مراجعة حسابك"}
            </Typography>

            <Typography variant="body1" fontSize={18} gutterBottom>
              {t("pending_message") ||
                "نشكرك على تسجيلك كمدرب في منصة مسقط لتعليم قيادة السيارات."}
            </Typography>

            <Typography variant="body1" fontSize={18} mb={4}>
              {t("pending_duration") ||
                "سيقوم أحد المسئولين بمراجعة بياناتك خلال فترة تتراوح من 24 إلى 48 ساعة."}
            </Typography>

            <Button
              variant="contained"
              color="primary"
              sx={{ textTransform: "capitalize", px: 4, py: 1 }}
              onClick={() => navigate("/")}
            >
              {t("go_home") || "العودة إلى الصفحة الرئيسية"}
            </Button>
          </Box>
        </Container>
      </Box>
    </Navbar>
  );
}

export default TeacherPendingApproval;
