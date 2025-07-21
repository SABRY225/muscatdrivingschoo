import { Container, Grid, Paper  , Typography} from "@mui/material";
import { useState , useEffect }    from "react";
import Navbar                         from "../../components/Navbar";
import LinksFooter                    from '../../components/client/home/LinksFooter';
import Footer                         from '../../components/client/home/Footer';
import {useParams }     from "react-router-dom";
import { useTranslation }             from "react-i18next";
import { useNews }                    from "../../hooks/useNews";
import Loading                        from "../../components/Loading";
import Cookies                        from 'js-cookie';



export default function SingleCareer() {
  const { id }                  = useParams();
  const { data, isLoading }     = useNews();
  const [currentObject, setCurrentObject]       = useState([]);
  const [ country, setCountry ] = useState([]);
  const lang                  = Cookies.get("i18next") || "en";
  const { t }               = useTranslation();


useEffect(() => {
  if (Array.isArray(data?.data)) {
    const current = data.data.find((e) => e.id === Number(id));
    setCurrentObject(current);
  }
}, [data, id]);


  return (
   <Navbar>
  {isLoading ? (
    <Loading />
  ) : (
    <>
      <div className="breadcrumb">
    <ul>
      <li><a href="/">{t("lnk_home")}</a></li>
      <li><a href="/">{t("news")}</a></li>
      <li><span>{lang === "ar" ? currentObject?.titleAR : currentObject?.titleEN}</span></li>
    </ul>
  </div>
      <Container sx={{ my: 5 }}>
      <Grid container spacing={4} justifyContent="center">
        <Grid item xs={12} md={10} lg={8}>
          <Paper
            elevation={3}
            sx={{
              p: { xs: 2, sm: 3 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderRadius: 3,
              textAlign: lang === "ar" ? "right" : "left",
            }}
          >
            <img
              src={`${process.env.REACT_APP_API_KEY}images/${currentObject?.image}`}
              alt={lang === "ar" ? currentObject?.titleAR : currentObject?.titleEN}
              style={{
                width: "100%",
                maxHeight: "400px",
                objectFit: "cover",
                borderRadius: "12px",
              }}
            />

            <Typography
              variant="h6"
              component="h1"
              sx={{
                fontWeight: 600,
                mt: 3,
                mb: 1,
                // width: "100%",
                // whiteSpace: "nowrap",
                // overflow: "hidden",
                // textOverflow: "ellipsis",
              }}
            >
              {lang === "ar" ? currentObject?.titleAR : currentObject?.titleEN}
            </Typography>

            <Typography
              variant="body1"
              sx={{
                color: "#666",
                mb: 2,
                // width: "100%",
                // display: "-webkit-box",
                // WebkitLineClamp: 5,
                // WebkitBoxOrient: "vertical",
                // overflow: "hidden",
                // textOverflow: "ellipsis",
              }}
            >
              {lang === "ar" ? currentObject?.descriptionAR : currentObject?.descriptionEN}
            </Typography>

            {country?.name_ar && (
              <Typography
                variant="body2"
                sx={{ color: "text.secondary", fontWeight: 500 }}
              >
                {lang === "en" ? country?.name_en : country?.name_ar}
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
    </>

  )}
  <LinksFooter />
  <Footer />
</Navbar>

  );
}
