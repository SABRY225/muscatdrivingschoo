import { Box, styled, Typography , Paper} from "@mui/material";
import React from "react";
import cover              from "../../../images/2";
import { useTranslation } from "react-i18next";
import { useState, useEffect }  from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import bannerOne          from "../../../images/banner_1.png";
import bannerTwo          from "../../../images/banner_2.png";
import bannerThree        from "../../../images/banner_3.png";

const Wrapper = styled(Box)({
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  backgroundSize: "cover",
  color: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
  height: "80vh",
});

const Image = styled("img")({
  width: "100%",
  height: "auto",
});

export default function HomeBanner() {
  const { t } = useTranslation();
  const [Images, setImages]   = useState([bannerOne , bannerTwo , bannerThree]);

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    rtl: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
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
    <Wrapper sx={{ backgroundImage: `url(${cover})` , display:"none !important;"}} className="overlay" >
      <Typography
        sx={{marginBottom: "8px", fontSize: { md: "32px", xs: "22px" }, position: "relative", fontWeight: "bold",}}
        color="secondary"
      >
        {t("website_name")}
      </Typography>
      <Typography
        sx={{
          marginBottom: "8px",
          fontSize: { md: "32px", xs: "22px" },
          position: "relative",
          fontWeight: "bold",
        }}
        color="secondary"
      >
        {t("bannerTitle")}
      </Typography>
      <Typography
        sx={{
          fontSize: { lg: "18px", md: "18px", xs: "14px" },
          fontWeight: "600",
          position: "relative",
          maxWidth: "480px",
          paddingX: "10px",
        }}
      >
        {t("bannerDesc")}
      </Typography>
    </Wrapper>


    <Paper>
      <div className="slider-box">
      <Slider {...settings}>
      {   Images?.length > 0 &&
            Images?.map((item,index) =>{ 
              return(
        <>
        <Wrapper sx={{ backgroundImage: `url(${item})` }} className="overlay">
        <Image src={item} />
        <div className="box_slider">
        <Typography
          sx={{width:"100%", marginBottom: "8px" ,textAlign:"center", fontSize: { md: "32px", xs: "22px" }, position: "relative", fontWeight: "bold",}}
          color="secondary">
          {t("website_name")}
        </Typography>
        <Typography
          sx={{
            width:"100%",
            marginBottom: "8px",
            fontSize: { md: "32px", xs: "22px" },
            position: "relative", fontWeight: "bold", textAlign:"center"
          }}
          color="secondary"
        >
          {t("bannerTitle")}
        </Typography>
        <Typography
          sx={{
            width:"100%",display:"block",
            fontSize: { lg: "18px", md: "18px", xs: "14px" },
            fontWeight: "600",textAlign:"center",
            position: "relative", maxWidth: "480px",  paddingX: "10px",
          }}
        >
          {t("bannerDesc")}
        </Typography>
        </div>
        </Wrapper>
        </>
              )
        })
      }
      </Slider>
    </div>
    </Paper>
    </>
  );
}
