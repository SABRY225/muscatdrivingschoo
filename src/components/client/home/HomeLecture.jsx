import { Box, TextField, Grid, Paper, Typography , styled , Button } from '@mui/material'
import React from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useTranslation }       from 'react-i18next';
import { useState, useEffect }  from "react";
import Loading                  from "../../Loading";
import { useLectures }          from '../../../hooks/useLectures';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Image = styled("img")({
    width: "300px",
});

export default function HomeLecture() {
    const navigate                  = useNavigate();
    const lang                      = Cookies.get("i18next") || "en";
    const [searchInput, setSearchInput] = React.useState("");
    const {t}                       = useTranslation();
    const {data , isLoading}        = useLectures();
    const [Lectures, setLectures]   = useState([]);
    useEffect(() => {
        if (data?.data) {

            setLectures(data.data);
        }
      }, [data]);

    var settings = {
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
  <Box sx={{padding:"32px 24px",marginY:"30px"}}>
  <div className='contain_title'>
      
      </div>
          <Typography sx={{fontSize:{md:"26px",xs:"22px"},fontWeight:"700",color:"#151313",textAlign:"center",
                marginBottom:"10px"}}>{t('home_lectures')}</Typography>
    <div className='contain_textbox_search'>
      <TextField
          sx={{ m: 1 ,width: "100%", borderRadius:"15px !important" }}
          label={t("search")} variant="outlined" value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
    <div className="slider-container">
      <Slider {...settings}>
        {   Lectures?.length > 0 &&
            Lectures?.map((item,index) =>
            {
                return(
                <>
                <Paper
                        sx={{
                        padding: "0px", display: "flex",    flexDirection: "column",
                        alignItems: "center",   backgroundColor:"#f1f1f1",  borderRadius:"20px",
                        margin:"20px",
                        }}
                    >
          <a href={`/course/${item.id}`} sx={{ display: "block" }}>
                        <Image
                        alt={lang==="ar"?item?.titleAR:item?.titleEN}
                        src={`${process.env.REACT_APP_API_KEY}images/${item?.image}`}
                        sx={{ width: "100%", height: "200px", objectFit:"cover" , borderRadius:"20px"}}
                        />
                        <Typography sx={{
                            width:"90%",display:"block",fontWeight: "700", fontSize:   "16px",minHeight:  "auto",
                            margin:"20px auto 10px", textAlign:  "left !important",color:"#212121"
                        }}
                        >
                        {lang==="ar"?item?.titleAR:item?.titleEN}
                        <br />

                        </Typography>
                        <p style={{ minHeight:"85px" , width:"90%", fontSize: "14px" , color:"#888" , textAlign:  "center" , margin:"auto"}}>
                        {lang==="ar"?item?.descriptionAr:item?.descriptionEn}

                        </p>
                        </a>
                        <a className='btndetails'
                        onClick={() => navigate(`/course/${item.id}`)}
                        >
                        {t("view")}
                        </a>
                    </Paper>
                </>
            )}
        )
    }
      </Slider>
    </div>
        </Box>
        </>
    )
}
