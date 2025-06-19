import { Box, Paper, Typography, styled } from '@mui/material'
import React from 'react'
import Cookies from 'js-cookie';
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const Image = styled("img")({
  width: "300px",
});

export default function HomeExam({ exams }) {
  const navigate = useNavigate();
  const lang = Cookies.get("i18next") || "en";
  const { t } = useTranslation();

  const slideCount = exams.length;

  const settings = {
    dots: true,
    infinite: slideCount > 3,
    speed: 500,
    slidesToShow: slideCount >= 3 ? 3 : slideCount,
    slidesToScroll: slideCount >= 3 ? 3 : slideCount,
    initialSlide: 0,
    rtl: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: slideCount >= 3 ? 3 : slideCount,
          slidesToScroll: slideCount >= 3 ? 3 : slideCount,
          infinite: slideCount > 3,
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
        }}>{t('view_teacher_test')}</Typography>

        <div className="slider-container">
          <Slider {...settings}>
            {exams?.length > 0 &&
              exams?.map((item, index) => {
                return (
                  <>
                    <div key={index}>
                      <a href={`/test/${item.id}`}>
                        <Paper sx={{
                          padding: "0px",
                          maxWidth: "320px",
                          margin: "0 auto",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          backgroundColor: "#FFF",
                          borderRadius: "20px",
                          textAlign: "right",
                          marginBottom: "1rem"
                        }}>
                          <Image
                            alt={lang === "ar" ? item?.titleAR : item?.titleEN}
                            src={item?.image ? `${process.env.REACT_APP_API_KEY}images/${item?.image}` : "logo.png"}
                            sx={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "20px", marginBottom: "1rem" }}
                          />

                          <Link className='btndetails'
                            to={`/test/${item.TeacherId}/${item.id}`}
                          >
                            {t("view")}
                          </Link>
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
