import React, { useEffect } from 'react'
import Navbar from '../../components/Navbar'
import LinksFooter from '../../components/client/home/LinksFooter'
import Footer from '../../components/client/home/Footer'
import DownloadApp from '../../components/client/home/DownloadApp'
import { Paper, Typography, Container } from '@mui/material'
import { useTranslation } from 'react-i18next';
import AdjustIcon from '@mui/icons-material/Adjust';
export default function TermsTeacher() {

    const { t } = useTranslation()
    useEffect(() => {
        window.scrollTo({
            behavior: "smooth",
            top: 0
        });
    }, []);

    return (
        <Navbar>
            <Container sx={{ marginTop: "120px" }}>
                <Paper sx={{ padding: "20px", marginY: "60px" }}>
                    <Typography sx={{ fontSize: {md:"24px",xs:"15px"}, marginBottom: "26px", fontWeight: "600" }}>{t('Terms and conditions to agree to before registering as a teacher in Al-Muallem My Teacher :')}</Typography>
                    <Typography sx={{ marginBottom: "6px", fontSize: {md:"19px",xs:"10px"}, fontWeight: "600" }}>
                        {t('Dear teacher, please note that once you submit a request to register as a teacher on the teacher platform, and start filling out the form, this indicates and acknowledges your acknowledgment and commitment to the following terms and conditions during your use of the teacher platform services :')}
                    </Typography>
                    <Typography sx={{ marginBottom: "15px", fontSize: {md:"16px",xs:"8px"} }}>
                        <AdjustIcon sx={{ fontSize: {md:"25px",xs:"8px"} }}></AdjustIcon>
                        {t('I pledge not to use any illegal means to violate the policy and rights of the Mudaribi platform, whether by communicating with parents or students without the team knowledge.')}
                    </Typography>
                    <Typography sx={{ marginBottom: "15px", fontSize: {md:"16px",xs:"8px"}  }}>
                        <AdjustIcon sx={{ fontSize: {md:"25px",xs:"8px"} }}></AdjustIcon>
                        {t('I pledge that all reservations are made through the Mudaribi website or application and not to transfer or request any amount personally.')}
                    </Typography>
                    <Typography sx={{ marginBottom: "15px", fontSize: {md:"16px",xs:"8px"}  }}>
                        <AdjustIcon sx={{ fontSize: {md:"25px",xs:"8px"} }}></AdjustIcon>
                        {t('I pledge to adhere to and comply with the national policies of the Sultanate of Oman, the United Arab Emirates, the State of Kuwait, the State of Saudi Arabia and other countries.')}
                    </Typography>
                    <Typography sx={{ marginBottom: "15px", fontSize: {md:"16px",xs:"8px"}  }}>
                        <AdjustIcon sx={{ fontSize: {md:"25px",xs:"8px"} }}></AdjustIcon>
                        {t('I pledge to adhere to and comply with intellectual property rights and copyrights and not to violate them by any means.')}
                    </Typography>

                    <Typography sx={{ marginBottom: "15px", fontSize: {md:"16px",xs:"8px"}  }}>
                        <AdjustIcon sx={{ fontSize: {md:"25px",xs:"8px"} }}></AdjustIcon>
                        {t('I pledge to adhere to the modernity of electronic content and not to violate national laws and policies.')}
                    </Typography>
                    <Typography sx={{ marginBottom: "15px", fontSize: {md:"16px",xs:"8px"}  }}>
                        <AdjustIcon sx={{ fontSize: {md:"25px",xs:"8px"} }}></AdjustIcon>
                        {t('I pledge to adhere to the commitment that all educational content achieves the principles of educational design.')}
                    </Typography>
                    <Typography sx={{ marginBottom: "15px", fontSize: {md:"16px",xs:"8px"}  }}>
                        <AdjustIcon sx={{ fontSize: {md:"25px",xs:"8px"} }}></AdjustIcon>
                        {t('I pledge to adhere to providing the design, media and fonts used in their different sizes, colors and formats in a way that facilitates reading and reduces stress.')}
                    </Typography>
                    <Typography sx={{ marginBottom: "15px", fontSize: {md:"16px",xs:"8px"}  }}>
                        <AdjustIcon sx={{ fontSize: {md:"25px",xs:"8px"} }}></AdjustIcon>
                        {t('I pledge to adhere to diversity in teaching methods and presenting digital content in multiple forms of texts, audio and visual materials in a manner that suits the needs of learners, and to provide group or individual interactive activities.')}
                    </Typography>
                </Paper>
            </Container>
            <DownloadApp />
            <LinksFooter />
            <Footer />
        </Navbar>
    )
}
