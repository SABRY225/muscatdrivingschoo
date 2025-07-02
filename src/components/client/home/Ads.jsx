import { Box, Paper, Typography, styled } from '@mui/material'
import React from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from "react";
import { useAds } from '../../../hooks/useAds';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import currencies from "../../../data/currencies";
const Image = styled("img")({
  width: "300px",
});

export default function Ads({ads}) {
  const navigate = useNavigate();
  const lang = Cookies.get("i18next") || "en";
  const { t } = useTranslation();
  console.log(ads);
  
  var settingsAds = {};
  settingsAds = {
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
  const handleAds =(type,id)=>{
    console.log(type);
    if (type==="teacher") {
     return navigate(`/ads-teacher-details/${id}`)
    }
    else{
     return navigate(`/ads-details/${id}`)
    }
  }
  return (
    <Box sx={{ padding: "32px 24px", marginY: "30px" }}>
      <Typography sx={{ fontSize: { md: "26px", xs: "22px" }, fontWeight: "700", color: "#800020", textAlign: "center", marginBottom: "50px" }}>{t('home_ads')}</Typography>

      <div className="slider-container">
        <Slider {...settingsAds}>
          {ads?.length > 0 &&
            ads?.map((item, index) => {

              return (
                <>
                  <div key={index}>
                      <Paper sx={{ padding: "0px", display: "flex", flexDirection: "column", alignItems: "center", backgroundColor: "#fff", borderRadius: "20px", margin: "20px", textAlign: "right" }}>
                        <Image alt={lang === "ar" ? item?.titleAR : item?.titleEN}
                          src={`${process.env.REACT_APP_API_KEY}images/${item?.image}`}
                          className='img-discount' sx={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "50%", marginTop: "20px", border: "1px solid #CCC", padding: "4px" }}
                        />
                        <h3 style={{
                          width: "90%", display: "block", fontWeight: "700", fontSize: "16px", minHeight: "auto",
                          padding: "10px !important", margin: "0px auto", textAlign: "center",
                          color: "#212121", minHeight: "60px"
                        }}>
                          {lang === "ar" ? item?.titleAR : item?.titleEN}<br />
                        </h3>

                        <ul className="ul_details">
                        </ul>
                        <button className="btndetails" onClick={()=>handleAds(item?.type,item?.id)}>
                          {t("discount_view")}
                        </button>
                      </Paper>
                  </div>
                </>
              )
            }
            )}
        </Slider>
      </div>
      {/* <AdvertisementSection /> */}
    </Box>
  )
}
