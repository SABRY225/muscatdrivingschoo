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
  return (
    <Box sx={{ padding: "32px 24px", marginY: "30px" }}>
      <Typography sx={{ fontSize: { md: "26px", xs: "22px" }, fontWeight: "700", color: "#800020", textAlign: "center", marginBottom: "50px" }}>{t('home_ads')}</Typography>

      <div className="slider-container">
        <Slider {...settingsAds}>
          {ads?.length > 0 &&
            ads?.map((item, index) => {
              let current_currency = "";
              current_currency = currencies.find((e) => e.title == item?.currency);

              function __short(txt, len = 200) {
                // get the first space after 200 charter
                let new_txt = txt;
                if (txt.length > len) {
                  let ind = txt.indexOf(" ", len);
                  new_txt = txt.slice(0, ind) + " ... ";
                }
                return new_txt;
              }
              let desc = (lang === "ar") ? item.descriptionAR : item.descriptionEN;
              let new_desc = __short(desc, 80);

              return (
                <>
                  <div key={index}>
                    <a href={`/ads-details/${item?.id}`} >
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

                        {/* <p className='p_1' > { new_desc }  </p> */}

                        <ul className="ul_details">
                          {/* <li style={{fontWeight:"400" , fontSize:"13px"}}><b style={{fontWeight:"400" , fontSize:"13px" , color:"#888" , textAlign:  "right !important" }}> {t('carModel')}</b> <p>{item.carModel == "" ? t("carModel_notfound") : item.carModel } </p></li> */}
                          {/* <li style={{fontWeight:"400" , fontSize:"13px"}}><b style={{fontWeight:"400" , fontSize:"13px" , color:"#888" , textAlign:  "right !important" }}> {t('yearManufacture')}</b> <p>{item.yearManufacture == "" ? t("yearManufacture_notfound") : item.yearManufacture } </p></li> */}
                          {/* <li style={{fontWeight:"400" , fontSize:"13px"}}><b style={{fontWeight:"400" , fontSize:"13px" , color:"#888" , textAlign:  "right !important" }}> {t('price')}</b> <p>{item.carPrice == "0" ? t("price_notfound") : item.carPrice }  */}
                          {/* { (item.carPrice != "0") ? ( lang == "ar" ) ? current_currency?.titleAr : current_currency?.titleEn  : ""}   */}
                          {/* </p> */}
                          {/* </li> */}
                        </ul>
                        <button className="btndetails" onClick={() => navigate(`/ads-details/${item.id}`)}>
                          {t("discount_view")}
                        </button>
                      </Paper>
                    </a>
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
