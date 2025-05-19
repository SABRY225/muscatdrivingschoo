import React, { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'
import LinksFooter from '../../components/client/home/LinksFooter'
import Footer from '../../components/client/home/Footer'
import countries from "../../data/countries";
import { Paper, Typography, styled , Container , Grid , Button , Box} from '@mui/material'
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDrivingLicenses } from "../../hooks/useDrivingLicenses";
import styles from "../../App.css";

const Image = styled("img")({
    width: "300px",
});

export default function DrivingLicenses() {

    const navigate                  = useNavigate();
    const lang                      = Cookies.get("i18next") || "en";
    const [searchInput, setSearchInput] = React.useState("");
    const {t}                       = useTranslation();
    const {data , isLoading}        = useDrivingLicenses();
    const [DrivingLicenses, setDrivingLicenses]   = useState([]);
    useEffect(() => {
        if (data?.data) {
            //console.log(data);

            setDrivingLicenses(data.data);
        }
      }, [data]);

    return (
        <Navbar>
            <Container sx={{marginTop:"120px"}}>
                <Box sx={{padding:"20px",marginY:"60px"}}>
                    
          <Typography sx={{fontSize:{md:"26px",xs:"22px"},fontWeight:"700",color:"#151313",textAlign:"center",
                marginBottom:"50px"}}>{t('home_driving_licenses')}</Typography>

        {   DrivingLicenses?.length > 0 &&
            DrivingLicenses?.map((item,index) =>
            {
                let c;
                c = countries.find((e) => e.code == item?.country);
            return(
                <Grid  item  xs={12} md={4}  lg={3} sx={{ marginTop:"20px" , display: "inline-block", width : "30%" , marginRight:"20px"}} key={item.id + "kmk"}>
                    <a href={`/driving-details/${item.id}`}>
                    <Paper
                        sx={{
                        padding: "0px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor:"#f1f1f1",
                        borderRadius:"20px"
                        }}
                    >
                        <Image
                        alt={lang==="ar"?item?.titleAR:item?.titleEN}
                        src={`${process.env.REACT_APP_API_KEY}images/${item?.image}`}
                        sx={{ width: "100px", height: "100px", objectFit:"cover" , borderRadius:"50%" , marginTop:"20px" , border:"1px solid #CCC", padding:"4px"}}
                        />
                        <Typography
                        sx={{
                            width:"100%",
                            display:"block",
                            fontWeight: "500",
                            marginY:    "10px",
                            fontSize:   "16px",
                            minHeight:  "auto",
                            padding:"10px !important",
                            margin:"0px 10px",
                            textAlign:  "center !important",
                            color:"#212121"
                        }}
                        >
                        {lang==="ar"?item?.titleAR:item?.titleEN}
                        <br />

                        </Typography>
                        <p className='p_1' >
                        {
                            (lang === "en" ? c.name_en : c.name_ar)
                        }
                        </p>
                        

                        <button className="btndetails"
                        onClick={() => navigate(`/driving-details/${item.id}`)}
                        >
                        {t("driving_view")}
                        </button>
                    </Paper>
                    </a>
                </Grid>
            )}
        )}
            </Box>
            </Container>
            <LinksFooter/>
            <Footer/>
        </Navbar>
        
    )
}
