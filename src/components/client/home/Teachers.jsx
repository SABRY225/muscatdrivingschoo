import { Box, TextField, Grid, Paper, Typography , styled , Button } from '@mui/material'
import React from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useTranslation }       from 'react-i18next';
import { useState, useEffect }  from "react";
import Loading                  from "../../Loading";
import { useTeachersRates }          from '../../../hooks/useTeachersRates';
import countries                from "../../../data/countries";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Image = styled("img")({
    width: "300px",
});

export default function Teachers() {
    const navigate                  = useNavigate();
    const lang                      = Cookies.get("i18next") || "en";
    const [searchInput, setSearchInput] = React.useState("");
    const {t}                       = useTranslation();
    const {data , isLoading}        = useTeachersRates();
    const [Teachers, setTeachers]   = useState([]);
    const [counter, setCounter]     = useState(3);
    var settingsTeachers = {};
    settingsTeachers = {
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
            }

            setTeachers(data.data);
            settingsTeachers = {
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
    <Box sx={{padding:"32px 24px",marginY:"30px" , width:"90%" , margin:"auto"}}>
    <div className='contain_title'>
      
    </div>
        <Typography sx={{fontSize:{md:"26px",xs:"22px"},fontWeight:"700",color:"#151313",textAlign:"center",
            marginBottom:"50px"}}>{t('home_teachers')}</Typography>

    <div className="slider-container">
    <Slider {...settingsTeachers}>
        {   Teachers?.length > 0 &&
            Teachers?.map((item,index) =>
            {
                let c;
                c = countries.find((e) => e.code == item?.country);
                return(
                <>
                { ( item.Rates.length > 0 ) ?
        <div key={index}>
            <Paper sx={{  padding: "0px", display: "flex",  flexDirection: "column",  alignItems: "center",  backgroundColor:"#FFF",borderRadius:"20px" }}>
             <a href={`/teacher/${item.id}`} style={{ display: "block" , width:"100%"}}>
             <div style={{maxWidth: "350px" , "margin" : "auto"}}> 
                <div style={{width:"100px", height: "100px" , border: "2px solid rgb(255, 255, 255);" , boxShaow: "rgb(0, 91, 142) -2px 2px;" ,
                            borderRadius:"50%",
                            margin:"auto",
                            marginBottom:"20px",
                            marginTop:"20px",   textAlign:"center"
                        }}>
                        <Image
                        alt={lang==="ar"?item?.titleAR:item?.firstName}
                        src={`${process.env.REACT_APP_API_KEY}images/${item?.image}`}
                        sx={{ width: "100%", height: "100%", objectFit:"cover" , borderRadius:"50%", borderBottom:"1px solid #CCC"}}
                        />
                </div>
                        <h2
                        style={{ width:"90%", display:"block",
                            fontWeight: "500", marginY:    "10px",
                            fontSize:   "16px", minHeight:  "auto",padding:"10px !important",margin:"0px 10px",
                            textAlign:  "center",  color:"#212121", marginBottom:"10px"
                        }}
                        >
                        {item?.firstName} {item?.lastName} 

                        </h2>
                        <table style={{width:"90%"}}>
                            {item?.TeacherLevels.length > 0 ?
                            <tr>
                                <td>{t("level")}</td>
                                <td>
                                <p style={{ fontSize: "12px" , fontWeight:"500", color:"#888", padding:"5px 10px" , backgroundColor : "#f8f8f8" , borderRadius:"15px" , display:"inline-block" , textAlign:"center" , margin:"5px"}}>
                                    {lang==="ar"? item?.TeacherLevels[0]?.Level?.titleAR:item?.TeacherLevels?.Level?.titleEN} 
                                </p>
                                </td>
                            </tr>
                            : ""}

    {item?.TeacherLimits.length > 0 ?
                            <tr>
                                <td>{t("limetype")}</td>
                                <td>
                                
                                    <p style={{fontSize: "12px" , fontWeight:"500" , color:"#888", padding:"5px 10px" , backgroundColor : "#f8f8f8" , borderRadius:"15px" , display:"inline-block" , textAlign:"center" , margin:"5px"}}>
                                    {lang==="ar"? item?.TeacherLimits[0]?.LimeType?.titleAR : item?.TeacherLimits?.LimeType?.titleEN} 
                                    </p>
                                
                                </td>
                            </tr>
    : ""}
{item?.TeacherTypes.length > 0 ?
<tr>
<td>{t("trainingcategorytype")}</td>
    <td>
        <p style={{ fontSize: "12px", fontWeight:"500" , color:"#888", padding:"5px 10px" , backgroundColor : "#f8f8f8" , borderRadius:"15px" , display:"inline-block", textAlign:"center" , margin:"5px"}}>
            {lang==="ar"? item?.TeacherTypes[0]?.TrainingCategoryType.titleAR:item?.TeacherTypes[0]?.TrainingCategoryType.titleEN} 
        </p>
    </td>
</tr>
: ""}
{item?.CurriculumTeachers.length > 0 ?
<tr>
    <td>{t("studyCurriculum")}</td>
    <td>
        <p style={{ fontSize: "12px", fontWeight:"500" , color:"#888", padding:"5px 10px" , backgroundColor : "#f8f8f8" , borderRadius:"15px" , display:"inline-block", textAlign:"center" , margin:"5px"}}>
            {lang==="ar"? item?.CurriculumTeachers[0]?.Curriculum.titleAR:item?.CurriculumTeachers[0]?.Curriculum.titleEN} 
        </p>
    </td>
</tr>
: ""}

<tr>
    <td>{t("country")}</td>
    <td>
    {   <p style={{ fontSize: "12px", fontWeight:"500" , color:"#888", padding:"5px 10px" , backgroundColor : "#f8f8f8" , borderRadius:"15px" , display:"inline-block", textAlign:"center" , margin:"5px"}}>
        {lang==="ar"? c?.name_en : c?.name_ar} 
        </p>
    }
    </td>
</tr>
</table>
</div>
</a>  


                        <Button
                        style={{marginBottom:"20px",backgroundColor:"#800000", color:"#FFF",
                            borderRadius:"15px",
                            marginTop:"20px",
                            width:"90%",
                            fontWeight:"500",fontSize:"12px"
                        }}
                        onClick={() => navigate(`/teacher/${item.id}`)}
                        >
                        {t("contactTeacher")}
                        </Button>
                    </Paper>
                </div>
                : ""
                }
                
                </>
            )}
        )
        }
    </Slider>
    </div>  
    </Box>
    )
}
