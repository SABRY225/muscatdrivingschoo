import { Box, TextField, Grid, Paper, Typography , styled , Button } from '@mui/material'
import React from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useTranslation }       from 'react-i18next';
import { useState, useEffect }  from "react";
import Loading                  from "../../Loading";
import currencies               from "../../../data/currencies";
import { usePackagesAccept }    from '../../../hooks/usePackageAccept';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";


const Image = styled("img")({
    width: "300px",
});

export default function HomePackage() {
    const navigate                  = useNavigate();
    const lang                      = Cookies.get("i18next") || "en";
    const [searchInput, setSearchInput] = React.useState("");
    const {t}                       = useTranslation();
    const {data , isLoading}        = usePackagesAccept();
    const [Packages, setPackages]   = useState([]);
    useEffect(() => {
        if (data?.data) {
            setPackages(data.data);
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
    <Box sx={{padding:"32px 24px",marginY:"30px"}}>
    <div className='contain_title'>
      
      </div>
          <Typography sx={{fontSize:{md:"26px",xs:"22px"},fontWeight:"700",color:"#151313",textAlign:"center",
                marginBottom:"50px"}}>{t('home_package')}</Typography>
        
    <div className='contain_textbox_search'>
      <TextField
          sx={{ m: 1 ,width: "100%", borderRadius:"15px !important" }}
          label={t("search")} variant="outlined" value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>
        <div className="slider-container">
        <Slider {...settings}>
        {   Packages?.length > 0 &&
            Packages?.map((item,index) =>
            {
                let current_currency;
                current_currency = currencies.find((e) => e.title == item?.currency);
                let gender_txt = "";
                if(item?.gender == "male"){
                    gender_txt = t("male") ;
                  }else if(item?.gender == "female"){
                    gender_txt = t("female") ;
                  }else{
                    gender_txt = t("male&female") ;
                  }

                return(
                <>
               <div key={index}>
               <a href={`/package/${item.id}`}>
                <Paper sx={{
                        padding: "0px",display: "flex",flexDirection: "column",alignItems: "center",
                        backgroundColor:"#FFF",borderRadius:"20px",margin:"20px",  textAlign:"right"
                  }}>
                  
                      
                        <Image
                        alt={lang==="ar"?item?.titleAR:item?.titleEN}
                        src={`${process.env.REACT_APP_API_KEY}images/${item?.image}`}
                        sx={{ width: "100%", height: "200px", objectFit:"cover" , borderRadius:"20px"}}
                        />
                        <h2 className='h2_title' >
                        {lang==="ar"?item?.titleAR:item?.titleEN}
                        </h2>
                        <p style={{width:"90%", fontSize: "14px" , color:"#888" , textAlign:  "right !important"}}>
                        {lang==="ar"?item?.descriptionAr:item?.descriptionEn}

                        </p>
                        <ul className="ul_details">
                        <li style={{fontWeight:"400" , fontSize:"13px"}}><b style={{fontWeight:"400" , fontSize:"13px" , color:"#888" , textAlign:  "right !important" }}> {t('package_price')}</b> {item.price == "0" ? t("price_free") : item.price }</li>
                            <li style={{fontWeight:"400" , fontSize:"13px"}}><b style={{fontWeight:"400" , fontSize:"13px" , color:"#888" , textAlign:  "right !important"}}> {t('package_numTotalLesson')}</b> {item.numTotalLesson}</li>
                            <li style={{fontWeight:"400" , fontSize:"13px"}}><b style={{fontWeight:"400" , fontSize:"13px" , color:"#888" , textAlign:  "right !important"}}> {t('package_numWeekLesson')}</b> {item.numWeekLesson}</li>
                            <li style={{fontWeight:"400" , fontSize:"13px"}}><b style={{fontWeight:"400" , fontSize:"13px" , color:"#888" , textAlign:  "right !important"}}> {t('package_gender')}</b> {
                                gender_txt}</li>
                            <li style={{fontWeight:"400" , fontSize:"13px"}}><b style={{fontWeight:"400" , fontSize:"13px" , color:"#888" , textAlign:  "right !important"}}> {t('package_duration')}</b> {item.duration}</li>
                            <li style={{fontWeight:"400" , fontSize:"13px"}}><b style={{fontWeight:"400" , fontSize:"13px" , color:"#888" , textAlign:  "right !important"}}> {t('package_trainingtype')}</b> {lang==="ar"?item?.TrainingCategoryType?.titleAR:item?.TrainingCategoryType?.titleEN} </li>
                            <li style={{fontWeight:"400" , fontSize:"13px"}}><b style={{fontWeight:"400" , fontSize:"13px" , color:"#888" , textAlign:  "right !important"}}> {t('package_limittype')}</b> {lang==="ar"?item?.LimeType?.titleAR:item?.LimeType?.titleEN} </li>
                            <li style={{fontWeight:"400" , fontSize:"13px"}}><b style={{fontWeight:"400" , fontSize:"13px" , color:"#888" , textAlign:  "right !important"}}> {t('package_level')}</b> {lang==="ar"?item?.Level?.titleAR:item?.Level?.titleEN} </li>
                        </ul>
                        <h4 className='h4_price'>
                         {  item.price == "0" ? t("price_free") : ( item?.price ) }
                         { (item.price != "0" ? ( lang == "ar" ) ? current_currency?.titleAr : current_currency?.titleEn : "") }
                        </h4>
                        
                        <a className='btndetails'
                        onClick={() => navigate(`/package/${item.id}`)}
                        >
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
