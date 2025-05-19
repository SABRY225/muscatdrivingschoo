import React, { useEffect } from "react";
import Navbar from "../../components/Navbar";
import LinksFooter from "../../components/client/home/LinksFooter";
import Footer from "../../components/client/home/Footer";
import DownloadApp from "../../components/client/home/DownloadApp";
import { Paper, Typography, Container } from "@mui/material";
import { useTranslation } from "react-i18next";

export default function Privacy() {
  const { t } = useTranslation();

  useEffect(() => {
    window.scrollTo({
      behavior: "smooth",
      top: 0,
    });
  }, []);

  return (
    <Navbar>
      <Container sx={{ marginTop: "120px" }}>
        <Paper sx={{ padding: "20px", marginY: "60px" }}>
          <Typography
            sx={{ fontSize: "24px", marginBottom: "20px", fontWeight: "600" }}
          >
            {t("PrivacyPolicy")}
          </Typography>
          <Typography sx={{ marginBottom: "24px" }}>
            {t("privacy_desc")}
          </Typography>
          <Typography
            sx={{ fontSize: "24px", marginBottom: "20px", fontWeight: "600" }}
          >
            {t("info_privacy")}
          </Typography>
          <Typography sx={{ marginBottom: "24px" }}>
            {t("info_privacy_content")}
          </Typography>
          <Typography sx={{ marginBottom: "24px", padding: "30px" }}>
            <ul>
              {t("info_privacy_list", { returnObjects: true }).map(
                (item, index) => (
                  <li style={{ marginBottom: 10 }} key={index}>
                    {item}
                  </li>
                )
              )}
            </ul>
          </Typography>

          <Typography
            sx={{ fontSize: "24px", marginBottom: "20px", fontWeight: "600" }}
          >
            {t("security_privacy")}
          </Typography>
          <Typography sx={{ marginBottom: "24px" }}>
            {t("security_privacy_content")}
          </Typography>

          <Typography sx={{ marginBottom: "24px", padding: "30px" }}>
            <ol type="1">
              {t("security_privacy_list", { returnObjects: true }).map(
                (item, index) => (
                  <li style={{ marginBottom: 10 }} key={index}>
                    {item}
                  </li>
                )
              )}
            </ol>
          </Typography>

          <Typography
            sx={{ fontSize: "24px", marginBottom: "20px", fontWeight: "600" }}
          >
            {t("privacy_edit")}
          </Typography>

          <Typography sx={{ marginBottom: "24px" }}>
            {t("privacy_edit_content")}
          </Typography>

          <Typography
            sx={{ fontSize: "24px", marginBottom: "20px", fontWeight: "600" }}
          >
            {t("privacy_contact")}
          </Typography>

          <Typography sx={{ marginBottom: "24px" }}>
            {t("privacy_contact_content")}
          </Typography>
        </Paper>
      </Container>
      <DownloadApp />
      <LinksFooter />
      <Footer />
    </Navbar>
  );
}
