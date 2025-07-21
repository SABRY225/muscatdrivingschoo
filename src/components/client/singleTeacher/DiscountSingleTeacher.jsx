import { Box, Divider, Grid, Paper, Typography , Avatar , Button } from '@mui/material'
import React from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'

export default function DiscountSingleTeacher({teacher}) {
  console.log(teacher);
  console.log("Row Teacher");
    const navigate = useNavigate();
    const lang = Cookies.get("i18next") || "en";
    const {t} = useTranslation()
    return (
       <Paper sx={{ padding: "32px 24px", marginY: "30px" }}>
  <Typography sx={{ fontSize: "22px", marginBottom: "18px" }}>
    {t("view_discount")}
  </Typography>

  {teacher?.Discounts?.length > 0 ? (
    <Grid container spacing={2}>
      {teacher?.Discounts?.map((item) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={4}
          key={item.id}
          sx={{ display: "flex", justifyContent: "center" }}
        >
          <a
            href={`/discount-details/${item.TeacherId}/${item.id}`}
            style={{ textDecoration: "none", width: "100%" }}
          >
            <Paper
              sx={{
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                backgroundColor: "#f1f1f1",
                borderRadius: "20px",
                height: "300px", // ارتفاع محدد للبطاقة
                textAlign: "center",
                boxShadow: 3,
                transition: "0.3s ease-in-out",
                '&:hover': {
                  boxShadow: 6,
                  transform: "scale(1.05)",
                }
              }}
            >
              <Avatar
                alt={lang === "ar" ? item?.titleAR : item?.titleEN}
                src={`${process.env.REACT_APP_API_KEY}images/${item?.image}`}
                sx={{ width: 105, height: 105, fontSize: 42 }}
              />
              <Typography
                sx={{
                  fontWeight: 500,
                  marginY: "10px",
                  fontSize: "16px",
                  color: "#212121",
                  wordBreak: "break-word",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 2, // عرض النص في سطرين فقط مع نقاط في النهاية
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {lang === "ar" ? item?.titleAR : item?.titleEN}
              </Typography>
              <Typography
                sx={{
                  fontWeight: 500,
                  fontSize: "13px",
                  color: "#888",
                  minHeight: "50px",
                  wordBreak: "break-word",
                  display: "-webkit-box",
                  WebkitBoxOrient: "vertical",
                  WebkitLineClamp: 3, // عرض النص في 3 أسطر فقط مع نقاط في النهاية
                  overflow: "hidden",
                  textOverflow: "ellipsis"
                }}
              >
                {lang === "ar" ? item?.descriptionAR : item?.descriptionEN}
              </Typography>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/discount-details/${item.TeacherId}/${item.id}`);
                }}
                sx={{ marginTop: "auto" }}
              >
                {t("view")}
              </Button>
            </Paper>
          </a>
        </Grid>
      ))}
    </Grid>
  ) : (
    <Typography className="notfound" sx={{ marginTop: "20px", textAlign: "center" }}>
      {t("discount_notfound")}
    </Typography>
  )}
</Paper>


    )
}
