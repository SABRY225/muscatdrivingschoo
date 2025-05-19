import { Box, Divider, Grid, Paper, Typography , Avatar , Button } from '@mui/material'
import React from 'react'
import Cookies from 'js-cookie';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next'

export default function DiscountSingleTeacher({teacher}) {
  console.log(teacher);
  console.log("Row Teacher");
    const navigate = useNavigate();
    const lang = Cookies.get("i18next") || "en";
    const {t} = useTranslation()
    return (
        <Paper sx={{padding:"32px 24px",marginY:"30px"}}>
          <Typography sx={{fontSize:"22px",marginBottom:"18px"}}>{t('view_discount')}</Typography>
            {
                  
            teacher?.Discounts?.length>0 ?
            teacher?.Discounts?.map((item,index)=>
            {

            return(
            <>
            <Grid  item  xs={12} md={4}  lg={3} sx={{ marginTop:"20px" , display: "inline-block", width : "30%" , marginRight:"20px"}} key={item.id + "kmk"}>
            <a href={`/discount-details/${item.id}`}>
            <Paper
                    sx={{
                      padding: "10px 6px",  display: "flex",  flexDirection: "column",
                      alignItems: "center", backgroundColor:"#f1f1f1",  borderRadius:"20px"
                    }}>
                    <Avatar
                      alt={lang==="ar"?item?.titleAR:item?.titleEN}
                      src={`${process.env.REACT_APP_API_KEY}images/${item?.image}`}
                      sx={{ width: "105px", height: "105px", fontSize: "42px" }}
                    />
                    <Typography
                      sx={{
                        fontWeight: "500",
                        marginY:    "10px",
                        fontSize:   "16px",
                        minHeight:  "auto",
                        textAlign:  "center",
                        color:"#212121"
                      }}
                    >
                      {lang==="ar"?item?.titleAR:item?.titleEN}
                      <br />

                    </Typography>
                    <Typography
                      sx={{
                        fontWeight: "500",
                        marginY:    "0px",
                        fontSize:   "13px",
                        minHeight:  "50px",
                        textAlign:  "center",
                        color:"#888"
                      }}
                    >
                      {lang==="ar"?item?.descriptionAR:item?.descriptionEN}

                    </Typography>
                    <Button
                      onClick={() => navigate(`/discount-details/${item.id}`)}
                    >
                      {t("view")}
                    </Button>
            </Paper>
            </a>
            </Grid>
            </>
            )
            })
            : <p className='notfound'>{t("discount_notfound")}</p>
        }
        </Paper>
    )
}
