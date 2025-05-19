import { Box, TextField, Grid, Paper, Typography , styled , Button } from '@mui/material'
import React from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useTranslation }       from 'react-i18next';
import { useState, useEffect }  from "react";
import Loading                  from "../../Loading";
import { useNews }                  from '../../../hooks/useNews';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Margin } from '@mui/icons-material';
const Image = styled("img")({
    width: "300px",
});

export default function HomeNews() {
    const navigate                  = useNavigate();
    const lang                      = Cookies.get("i18next") || "en";
    const [searchInput, setSearchInput] = React.useState("");
    const {t}                          = useTranslation();
    const {data ,    isLoading}        = useNews();
    const [News, setNews]              = useState([]);
    const [counter, setCounter]        = useState(3);
    var settingsNews = {};
    settingsNews = {
      dots: true,
      infinite: false,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      initialSlide: 0,
      rtl: false,
      responsive: [
      {
      breakpoint: 1024,
      settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: false,
      dots: true
      }
      },
      {
      breakpoint: 600,
      settings: {
      slidesToShow: 1,
      slidesToScroll: 1,
      initialSlide: 0
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

    useEffect(() => {
        if (data?.data) {
            if(data?.data.length < 3) { 
            setCounter( data?.data.length ); }
            
            setNews(data.data);

            settingsNews = {
              dots: true,
              infinite: false,
              speed: 500,
              slidesToShow: counter,
              slidesToScroll: counter,
              initialSlide: 0,
              rtl: true,
              responsive: [
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: counter,
                    slidesToScroll: counter,
                    infinite: false,
                    dots: true
                  }
                },
                {
                  breakpoint: 600,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    initialSlide: 0
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
        }
    }, [data]);

    

    return (
        <>
        <Box sx={{padding:"32px 24px",marginY:"30px"}}>
        <div className='contain_title'>
      
      </div>
          <Typography sx={{fontSize:{md:"26px",xs:"22px"},fontWeight:"700",color:"#151313",textAlign:"center",
                marginBottom:"50px"}}>{t('home_news')}</Typography>
        
    <div className='contain_textbox_search'>
      <TextField
          sx={{ m: 1 ,width: "100%", borderRadius:"15px !important" }}
          label={t("search")} variant="outlined" value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
        <div className="slider-container">
        <Slider {...settingsNews}>
        {   News?.length > 0 &&
            News?.map((item,index) =>
            {
                return(
                <>
    <div key={index}>
    <a href={`/news-details/${item?.id}`} >
        <Paper
        sx={{ padding: "10px",display: "flex",flexDirection: "column",alignItems: "center",
        backgroundColor:"#FFF",borderRadius:"20px",margin:"20px",  textAlign:"right" }}>
       
                        <Image
                        alt={lang==="ar"?item?.titleAR:item?.titleEN}
                        src={`${process.env.REACT_APP_API_KEY}images/${item?.image}`}
                        sx={{ width: "100%", height: "200px", objectFit:"cover" , borderRadius:"20px"}}
                        />
                        <h2 className='h2_title'>
                        {lang=="ar"?item?.titleAR:item?.titleEN}
                        </h2>
                        <p style={{width:"90%", fontSize: "14px" , color:"#888" , textAlign:  "center !important" , margin:"auto" , display:"block" , marginBottom:"15px"}}>
                        {lang=="ar"?item?.descriptionAR:item?.descriptionEN}

                        </p>
                        
                        
                        <a className='btndetails'   onClick={() => navigate(`/news-details/${item.id}`)} >
                        {t("view")}
                        </a>
            </Paper>
            </a>
            </div>
            </>
        )}
        )}
    </Slider>
    </div>  
    </Box>
    </>
    )
}
