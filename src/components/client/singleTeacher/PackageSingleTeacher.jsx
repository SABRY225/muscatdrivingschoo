import { Box, Divider, Grid, Paper, Typography , Avatar , Button } from '@mui/material'
import React from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'

export default function PackageSingleTeacher({teacher}) {
    const navigate = useNavigate();
    const lang = Cookies.get("i18next") || "en";
    const {t} = useTranslation()
    return (
      <Paper sx={{ padding: "32px 24px", marginY: "30px" }}>
  <Typography sx={{ fontSize: "22px", marginBottom: "18px" }}>
    {t("package")}
  </Typography>

  <Grid container spacing={2}>
    {teacher?.Packages?.length > 0 &&
      teacher?.Packages?.map((item, index) => (
        <Grid
          item
          xs={12}
          sm={6}
          md={4}
          lg={4}
          key={item.id + "kmk"}
          sx={{ display: "flex", justifyContent: "center" ,my:2}}
        >
          <a
            href={`/package/${item.TeacherId}/${item.id}`}
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
                height: "100%", // for equal height
                textAlign: "center",
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
                }}
              >
                {lang === "ar" ? item?.descriptionAr : item?.descriptionEn}
              </Typography>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/package/${item.TeacherId}/${item.id}`);
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
</Paper>

    )
}
