import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import LinksFooter from '../../components/client/home/LinksFooter';
import Footer from '../../components/client/home/Footer';
import { Paper, Typography, styled, Container, Grid, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDiscounts } from "../../hooks/useDiscounts";

const Image = styled("img")({
  width: "100px",
  height: "100px",
  objectFit: "cover",
  borderRadius: "50%",
  marginTop: "20px",
  border: "1px solid #CCC",
  padding: "4px",
});

export default function Discounts() {
  const navigate = useNavigate();
  const lang = Cookies.get("i18next") || "en";
  const { t } = useTranslation();
  const { data } = useDiscounts();
  const [Discounts, setDiscounts] = useState([]);

  useEffect(() => {
    if (data?.data) setDiscounts(data.data);
  }, [data]);

  return (
    <Navbar>
      <Container sx={{ marginTop: "120px" }}>
        <Box sx={{ padding: "20px", marginY: "60px" }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              color: "#151313",
              textAlign: "center",
              marginBottom: "50px",
            }}
          >
            {t('home_discounts')}
          </Typography>

          <Grid container spacing={3} justifyContent="center">
            {Discounts?.length > 0 &&
              Discounts.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={4} key={item.id}>
                  <Paper
                    elevation={3}
                    sx={{
                      p: 2,
                      textAlign: "center",
                      borderRadius: 4,
                      backgroundColor: "#f9f9f9",
                      position: "relative",
                      height: "90%",
                      width:"300px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Box
                      sx={{
                        position: "absolute",
                        top: 10,
                        right: 10,
                        backgroundColor: "#d32f2f",
                        color: "white",
                        padding: "5px 10px",
                        borderRadius: "20px",
                        fontWeight: "bold",
                        fontSize: "14px",
                      }}
                    >
                      {item?.percentage}%
                    </Box>

                    <Image
                      alt={lang === "ar" ? item?.titleAR : item?.titleEN}
                      src={`${process.env.REACT_APP_API_KEY}images/${item?.image}`}
                    />

                    <Typography
                      variant="subtitle1"
                      sx={{ fontWeight: 600, marginTop: 2, color: "#212121" }}
                    >
                      {lang === "ar" ? item?.titleAR : item?.titleEN}
                    </Typography>

                    <Typography variant="body2" sx={{ color: "#666", my: 1 }}>
                      {lang === "ar" ? item.descriptionAR : item.descriptionEN}
                    </Typography>

                    <Box sx={{ my: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        <del>{item.amountBeforeDiscount}</del>
                        &nbsp;
                        <Typography variant="caption" component="span">
                          {t("txt_amountBeforeDiscount")}
                        </Typography>
                      </Typography>
                      <Typography variant="h6" color="primary">
                        {item.amountAfterDiscount}
                        &nbsp;
                        <Typography variant="caption" component="span">
                          {t("txt_amountAfterDiscount")}
                        </Typography>
                      </Typography>
                    </Box>

                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={() => navigate(`/discount-details/${item.id}`)}
                    >
                      {t("discount_view")}
                    </Button>
                  </Paper>
                </Grid>
              ))}
          </Grid>
        </Box>
      </Container>
      <LinksFooter />
      <Footer />
    </Navbar>
  );
}
