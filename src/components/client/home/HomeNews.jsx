import { Box, Paper, Typography, styled } from '@mui/material'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Image = styled("img")({
  width: "300px",
});

export default function HomeNews({ news }) {
  const navigate = useNavigate();
  const lang = Cookies.get("i18next") || "en";
  const { t } = useTranslation();
  var settingsNews = {};
  settingsNews = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    rtl: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  return (
    <>
      <Box sx={{ padding: "32px 24px", marginY: "30px" }}>
        <div className='contain_title'>

        </div>
        <Typography sx={{
          fontSize: { md: "26px", xs: "22px" }, fontWeight: "700", color: "#800020", textAlign: "center",
          marginBottom: "50px"
        }}>{t('home_news')}</Typography>
        <div className="slider-container">
          <Slider {...settingsNews}>
            {news?.length > 0 &&
              news?.map((item, index) => {
                return (
                  <>
                    <div key={index}>
                      <a href={`/news-details/${item?.id}`} >
                        <Paper
                          sx={{
                            padding: "10px", display: "flex", flexDirection: "column", alignItems: "center",
                            backgroundColor: "#FFF", borderRadius: "20px", margin: "20px", textAlign: "right"
                          }}>

                          <Image
                            alt={lang === "ar" ? item?.titleAR : item?.titleEN}
                            src={`${process.env.REACT_APP_API_KEY}images/${item?.image}`}
                            sx={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "20px" }}
                          />
                          <h2 className='h2_title'>
                            {lang == "ar" ? item?.titleAR : item?.titleEN}
                          </h2>
                          <a className='btndetails' onClick={() => navigate(`/news-details/${item.id}`)} >
                            {t("view")}
                          </a>
                        </Paper>
                      </a>
                    </div>
                  </>
                )
              }
              )}
          </Slider>
        </div>
      </Box>
    </>
  )
}
