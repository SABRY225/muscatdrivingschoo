import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import LinksFooter from '../../components/client/home/LinksFooter'
import Footer from '../../components/client/home/Footer'
import DownloadApp from '../../components/client/home/DownloadApp'
import { Paper, Typography,Container } from '@mui/material'
import { useTranslation } from 'react-i18next';

export default function AboutUs() {

    const {t} = useTranslation()
    useEffect(()=>{
        window.scrollTo({
            behavior:"smooth",
            top:0
        });
    },[]);

    return (
        <Navbar>
            <Container sx={{marginTop:"120px"}}>
                <Paper sx={{padding:"20px",marginY:"60px"}}>
                    <Typography sx={{fontSize:"24px",marginBottom:"20px",fontWeight:"600"}}>{t('aboutUs')}</Typography>
                    <Typography sx={{marginBottom:"24px"}}>
                        {t('aboutus_desc')}
                    </Typography>
                </Paper>
            </Container>
            <DownloadApp/>
            <LinksFooter/>
            <Footer/>
        </Navbar>
    )
}
