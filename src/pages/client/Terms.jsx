import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import LinksFooter from '../../components/client/home/LinksFooter'
import Footer from '../../components/client/home/Footer'
import DownloadApp from '../../components/client/home/DownloadApp'
import { Paper, Typography,Container } from '@mui/material'
import { useTranslation } from 'react-i18next';

export default function Terms() {

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
                    <Typography sx={{fontSize:"24px",marginBottom:"26px",fontWeight:"600"}}>{t('TermsAndConditions')}</Typography>
                    <Typography sx={{marginBottom:"6px",fontSize:"18px",fontWeight:"600"}}>
                        {t('terms_use')}
                    </Typography>
                    <Typography sx={{marginBottom:"32px",fontSize:"16px"}}>
                        {t('terms_use_desc')}
                    </Typography>
                    <Typography sx={{marginBottom:"6px",fontSize:"18px",fontWeight:"600"}}>
                        {t('terms_service')}
                    </Typography>
                    <Typography sx={{marginBottom:"12px",fontSize:"16px"}}>
                        {t('terms_service_desc')}
                    </Typography>
                    <Typography sx={{marginBottom:"20px",fontSize:"16px"}}>
                        {t('terms_service_desc2')}
                    </Typography>
                </Paper>
            </Container>
            <DownloadApp/>
            <LinksFooter/>
            <Footer/>
        </Navbar>
    )
}
