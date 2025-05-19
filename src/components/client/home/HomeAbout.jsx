import { Box, Container, Typography } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';
import bg  from "../../../images/wheel-image-1.png";

export default function HomeAbout() {
    const {t} = useTranslation()
    return (
        <Box sx={{backgroundColor:"#d9d9d952",marginY:"60px",
            backgroundImage:`url(${bg})`,backgroundPosition: "center", backgroundRepeat : "no-repeat",
            backgroundSize : "cover"
        }} >
            <Container sx={{paddingY:"60px"}}>
            <div className='contain_title'>
      
      </div>
      
                <Typography sx={{fontSize:{md:"26px",xs:"22px"},fontWeight:"700",color:"#151313",textAlign:"center",
                marginBottom:"30px"}}>{t('about_title')}</Typography>
                <Typography sx={{textAlign:"center",color:"#6D6D6D",fontSize:{md:"18px",xs:"15px"}}}>
                {t('about_desc')}
                </Typography>
            </Container>
        </Box>
    )
}