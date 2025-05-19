import React, { useState, useEffect } from 'react';
import Navbar               from '../../components/Navbar';
import LinksFooter          from '../../components/client/home/LinksFooter';
import Footer               from '../../components/client/home/Footer';
import countries            from "../../data/countries";
import { Paper, Typography, styled , Container , Grid , Button , Box} from '@mui/material'
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useDiscounts } from "../../hooks/useDiscounts";

const Image = styled("img")({
    width: "300px",
});

export default function Discounts() {

    const navigate                  = useNavigate();
    const lang                      = Cookies.get("i18next") || "en";
    const [searchInput, setSearchInput] = React.useState("");
    const {t}                       = useTranslation();
    const {data , isLoading}        = useDiscounts();
    const [Discounts, setDiscounts] = useState([]);
    useEffect(() => {
        if (data?.data) {
            //console.log(data);

            setDiscounts(data.data);
        }
      }, [data]);

    return (
        <Navbar>
            <Container sx={{marginTop:"120px"}}>
                <Box sx={{padding:"20px",marginY:"60px"}}>
                    
          <Typography sx={{fontSize:{md:"26px",xs:"22px"},fontWeight:"700",color:"#151313",textAlign:"center",
                marginBottom:"50px"}}>{t('home_discounts')}</Typography>

        {   Discounts?.length > 0 &&
            Discounts?.map((item,index) =>
            {
            return(
    <Grid  item  xs={12} md={4}  lg={3} sx={{ marginTop:"20px" , display: "inline-block", width : "30%" , marginRight:"20px"}} key={item.id + "kmk"}>
    <a href={`/discount-details/${item.id}`} >
    <Paper sx={{ padding: "0px", display: "flex",    flexDirection: "column", alignItems: "center",
            backgroundColor:"#f1f1f1",  borderRadius:"20px",position:"relative"}}
    >
    <div className='offers'>{item?.percentage} %</div>
    <Image  alt={lang==="ar"?item?.titleAR:item?.titleEN} src={`${process.env.REACT_APP_API_KEY}images/${item?.image}`}
        sx={{ width: "100px", height: "100px", objectFit:"cover" , borderRadius:"50%" , marginTop:"20px" , border:"1px solid #CCC", padding:"4px"}}
    />
    <Typography style={{ width:"100%",   display:"block",    fontWeight: "500", marginY:    "10px",fontSize:   "16px",
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
        { (lang === "ar" ? item.descriptionAR : item.descriptionAR)}
    </p>

    <p class="price">
        <span class="oldPrice">{item.amountBeforeDiscount}
           <b className='txtPrice'> {t("txt_amountBeforeDiscount")} </b>
        </span>
        <span class="newPrice">{item.amountAfterDiscount}
            <b className='txtPrice'> {t("txt_amountBeforeDiscount")} </b>
        </span>
    </p>
                        

                    <button className="btndetails" onClick={() => navigate(`/discount-details/${item.id}`)}>
                        {t("discount_view")}
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
