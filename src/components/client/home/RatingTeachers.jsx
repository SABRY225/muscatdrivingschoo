import { Box, Grid, Paper, Typography , styled  } from '@mui/material'
import React from 'react'
import Cookies                  from 'js-cookie';
import { useNavigate }          from "react-router-dom";
import { useTranslation }       from 'react-i18next';
import { useState, useEffect }  from "react";
import Loading                  from "../../Loading";
import { useRates }             from '../../../hooks/useRates';
import Slider from "react-slick";
/*
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
*/
import { Margin } from '@mui/icons-material';

const Image = styled("img")({
    width: "300px",
});

export default function RatingTeachers() {
    const navigate                  = useNavigate();
    const lang                      = Cookies.get("i18next") || "en";
    const [searchInput, setSearchInput] = React.useState("");
    const {t}                       = useTranslation();
    const {data , isLoading}        = useRates();
    const [Rates, setRates]         = useState([]);
    const [counter, setCounter]     = useState(3);
    var settingsComment = {};
        
var settingsComment = {
  dots: true,
  infinite: false,
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

            setRates(data.data);
        }
      }, [data]);


    return (
       <>
      <div className='contain_title'>
      
      </div>

       <Typography sx={{fontSize:{md:"26px",xs:"22px"},fontWeight:"700",color:"#151313",textAlign:"center",
            marginBottom:"20px"}}>{t('home_rates')}</Typography>
        
       <div className="slider-container" style={{width:"80%"}}>
        <Slider {...settingsComment}>
        {   Rates?.length > 0 &&
            Rates?.map((item,index) =>
            {
              console.log(item);
                let rating  = parseInt(item.rating);
                const renderList = () => {
                    const list_rating = [];
                    for(let x=0; x < rating; x++){
                        list_rating.push(
                            <svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.15316 5.40838C10.4198 3.13613 11.0531 2 12 2C12.9469 2 13.5802 3.13612 14.8468 5.40837L15.1745 5.99623C15.5345 6.64193 15.7144 6.96479 15.9951 7.17781C16.2757 7.39083 16.6251 7.4699 17.3241 7.62805L17.9605 7.77203C20.4201 8.32856 21.65 8.60682 21.9426 9.54773C22.2352 10.4886 21.3968 11.4691 19.7199 13.4299L19.2861 13.9372C18.8096 14.4944 18.5713 14.773 18.4641 15.1177C18.357 15.4624 18.393 15.8341 18.465 16.5776L18.5306 17.2544C18.7841 19.8706 18.9109 21.1787 18.1449 21.7602C17.3788 22.3417 16.2273 21.8115 13.9243 20.7512L13.3285 20.4768C12.6741 20.1755 12.3469 20.0248 12 20.0248C11.6531 20.0248 11.3259 20.1755 10.6715 20.4768L10.0757 20.7512C7.77268 21.8115 6.62118 22.3417 5.85515 21.7602C5.08912 21.1787 5.21588 19.8706 5.4694 17.2544L5.53498 16.5776C5.60703 15.8341 5.64305 15.4624 5.53586 15.1177C5.42868 14.773 5.19043 14.4944 4.71392 13.9372L4.2801 13.4299C2.60325 11.4691 1.76482 10.4886 2.05742 9.54773C2.35002 8.60682 3.57986 8.32856 6.03954 7.77203L6.67589 7.62805C7.37485 7.4699 7.72433 7.39083 8.00494 7.17781C8.28555 6.96479 8.46553 6.64194 8.82547 5.99623L9.15316 5.40838Z" fill="#f09700"/>
                            </svg>
                        );
                    }
                    return list_rating;
                }

                return(
                <>
                <div key={index}>
                <a href={`/teacher/${item?.Teacher?.id}`} >
                <div className='item_comment'>
                    <Paper  sx={{padding: "0px", display: "flex", flexDirection: "column", alignItems: "center",  backgroundColor:"#FFF",  borderRadius:"20px" }}>
                        <Image
                        alt={ item?.Teacher?.firstName }
                        src={`${process.env.REACT_APP_API_KEY}images/${item?.Teacher?.image}`}
                        sx={{ objectFit:"cover" , borderRadius:"20px"}}
                        />
                        <div className='rating-start'>
                        {
                           renderList()
                        }
                        </div>
                        
                        <h2>{item?.Teacher.firstName} {item?.Teacher.lastName}</h2>
                        

                        <p className='p_comments'>{item?.comment}</p>
                        <small className='small_date'>
                          <span class="user">
                        <Image
                        alt={ item?.Student?.name }
                        src={`${process.env.REACT_APP_API_KEY}images/${item?.Student?.image}`}
                        sx={{ objectFit:"cover" , borderRadius:"20px" }}
                        className='item_comment_user_img'
                        />
                        <span> {item?.Student.name} </span> 
                        </span>
                         <span class="date">{item?.createdAt} </span>
                        </small>
                        
                    </Paper>
                </div>
                </a>
                </div>
                </>
            )}
        )}
            
        
        
        </Slider>
        </div>  
      </>
    )
}
