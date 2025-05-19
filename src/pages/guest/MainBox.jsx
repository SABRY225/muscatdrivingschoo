import { Button, styled, Container , Paper} from "@mui/material";
import React, { useState }  from "react";
import Layout               from "../../components/guest/Layout";
import Navbar               from "../../components/Navbar";
import { useTranslation }   from "react-i18next";
import { useSnackbar }      from "notistack";
import { useSelector }      from "react-redux";
import { useNavigate }      from "react-router-dom";
import Cookies from "js-cookie";
export default function MainBox() {
  
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const lang = Cookies.get("i18next") || "en";
  const { t } = useTranslation();
  const { guest, token } = useSelector((s) => s.guest);
  const navigate = useNavigate();
  return (
    <Navbar>
      <Layout active={0} title={t("mainbox")}>
      <Container sx={{ marginTop: "110px" }}>
        <Paper
          sx={{
            width: { md: "450px" },
            padding: "30px 50px",
            margin: "60px auto 60px",
            textAlign : "center"
          }}
        >
         
          <Button
            sx={{
              marginTop: "20px",      marginBottom: "20px",
              marginLeft:"10px",      marginRight:"10px",
              padding : "50px 10px",
              fontSize: "14px",       fontWeight: "700",
              textAlign: "center",
              borderRadius  : "20px",
              cursor  : "pointer",
              width   : "45%",
              display : "inline-flex",
              backgroundColor : "transparent",
              border  :"2px solid #800000",
              color   :"#800000", 
            }}
            variant="contained"
            onClick={() => navigate("create-ads/step1")}
          >
            {t("registerAds")}
          </Button>

          <Button
            sx={{
              marginTop: "20px",      marginBottom: "20px",
              marginLeft:"10px",      marginRight:"10px",
              padding : "50px 10px",
              fontSize: "14px",       fontWeight: "700",
              borderRadius  : "20px",
              textAlign: "center",
              cursor  : "pointer",
              width   : "45%",
              display : "inline-flex",
              backgroundColor : "transparent",
              border  :"2px solid #800000",
              color   :"#800000", 
            }}
            variant="contained"
            onClick={() => navigate("create-career")}
          >
            {t("registerCareer")}
          </Button>

          <br />
          <br />
        </Paper>
      </Container>
      </Layout>
    </Navbar>
  );
}
