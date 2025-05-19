import { Box, TextField, Grid, Paper, Typography , styled , Button } from '@mui/material'
import React from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useTranslation }       from 'react-i18next';
import { useState, useEffect }  from "react";
import Loading                  from "../../Loading";
import { useDiscountsAgree }    from '../../../hooks/useDiscountsAgree';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
const Image = styled("img")({
    width: "300px",
});

export default function Discounts() {
    const navigate                  = useNavigate();
    const lang                      = Cookies.get("i18next") || "en";
    const [searchInput, setSearchInput] = React.useState("");
    const {t}                       = useTranslation();
    const {data , isLoading}        = useDiscountsAgree();
    const [Discounts, setDiscounts] = useState([]);
    const [counter, setCounter]     = useState(1);
    var settingsDiscount = {};
    settingsDiscount = {
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
            setCounter( data?.data.length ); 
          }else if(data?.data.length > 3){
            setCounter( 3 ); 
          }else if( data?.data.length  == "1"){
            setCounter( 1 ); 
          }else if( data?.data.length  == "2" ){
            setCounter( 1 ); 
          }
          setDiscounts(data.data);

          settingsDiscount = {
            dots: true,
            infinite: false,
            speed: 500,
            slidesToShow: counter,
            slidesToScroll: counter,
            initialSlide: 0,
            rtl: false,
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
        }
      }, [data]);
    
      

    return (
        <Box sx={{padding:"32px 24px",marginY:"30px"}}>
          <Typography sx={{fontSize:{md:"26px",xs:"22px"},fontWeight:"700",color:"#151313",textAlign:"center",
                marginBottom:"50px"}}>{t('home_discounts')}</Typography>
        
    <div className='contain_textbox_search'>
      <TextField
          sx={{ m: 1 ,width: "100%", borderRadius:"15px !important" }}
          label={t("search")} variant="outlined" value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
      />
    </div>

<div className="slider-container">
<Slider {...settingsDiscount}>
  { Discounts?.length > 0 &&  Discounts?.map((item,index) =>
    { return(
        <div>
    <a href={`/discount-details/${item.id}`} >
        <Paper sx={{ padding: "0px",display: "flex",flexDirection: "column",alignItems: "center", backgroundColor:"#FFF",borderRadius:"20px",margin:"20px",  textAlign:"right"
        }}
        >
          
       
         <div className='offers'>{item?.percentage} %</div>
            <Image
                        alt={lang==="ar"?item?.titleAR:item?.titleEN}
                        src={`${process.env.REACT_APP_API_KEY}images/${item?.image}`}
                        className='img-discount'
                        sx={{ width: "100px", height: "100px", objectFit:"cover" , borderRadius:"50%" , marginTop:"20px" , border:"1px solid #CCC", padding:"4px"}}
                        />
    <h3  style={{ "text-align" : "center",  width:"90%",
                            display:"block",
                            fontWeight: "600",
                            margin:    "10px auto",
                            fontSize:   "20px",
                            textAlign : "center",
                            padding:"10px !important", color:"#212121"
                        }}
                        >
                        {lang==="ar"?item?.titleAR:item?.titleEN}
                        <br />

    </h3>
    <p className='p_1' >
        { (lang === "ar" ? item.descriptionAR : item.descriptionEN)}
    </p>

    <p class="price">
        <span class="oldPrice">{item.amountBeforeDiscount}
           <b className='txtPrice'> {t("txt_amountBeforeDiscount")} </b>
        </span>
        <span class="newPrice">{item.amountAfterDiscount}
            <b className='txtPrice'> {t("txt_amountAfterDiscount")} </b>
        </span>
    </p>
                        

    <button className="btndetails" onClick={() => navigate(`/discount-details/${item.id}`)}>{t("discount_view")}</button>
   
                    </Paper>
      </a>
    </div>
      )}
    )}
        </Slider>
        </div>
        </Box>
    )
}
