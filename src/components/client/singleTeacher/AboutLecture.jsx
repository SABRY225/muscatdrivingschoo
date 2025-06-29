import { Box, CardMedia, Paper, Typography, useMediaQuery, Grid } from '@mui/material';
import Cookies from 'js-cookie';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { convertCurrency } from '../../../utils/convertCurrency';
import { useSelector } from 'react-redux';

export default function AboutLecture({ lectureData }) {
    const { t } = useTranslation();
    const lang = Cookies.get("i18next") || "en";
    const isMobile = useMediaQuery("(max-width:600px)");
    const { currency } = useSelector(state => state.currency);

    const [convertedAmount, setConvertedAmount] = React.useState(null);

    React.useEffect(() => {
        async function fetchConvertedAmount() {
            const result = await convertCurrency(lectureData.price, lectureData.currency, currency);
            setConvertedAmount(result);
        }
        fetchConvertedAmount();
    }, [lectureData.price, currency, lectureData.currency]);

    const infoItems = [
        { label: t("description"), value: lang === "ar" ? lectureData.descriptionAr : lectureData.descriptionEn },
        { label: t("studycurriculums"), value: lang === "ar" ? lectureData?.curriculums?.titleAR : lectureData?.curriculums?.titleEN },
        { label: t("subject"), value: lang === "ar" ? lectureData?.subject?.titleAR : lectureData?.subject?.titleEN },
        { label: t("classes"), value: lang === "ar" ? lectureData?.class?.titleAR : lectureData?.class?.titleEN },
        { label: t("semester"), value: t(lectureData?.semester) },
        { label: t("price"), value: convertedAmount },
        { label: t("currency"), value: t(currency) },
    ];

    return (
        <Paper sx={{ padding:"30px 24px 70px", marginY: "30px" }}>
            <CardMedia
                component="img"
                image={lectureData.image ? `${process.env.REACT_APP_API_KEY}images/${lectureData.image}` : "/logo.png"}
                alt="lecture img"
                sx={{
                    height: { xs: "250px", sm: "400px" },
                    width: "100%",
                    objectFit: "cover",
                    filter: "brightness(50%)",
                }}
            />

            <Box sx={{ textAlign: "center", mt: 2, mb: 4 }}>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: 700 }}>
                    {lang === "ar" ? lectureData?.titleAR : lectureData?.titleEN}
                </Typography>
            </Box>

            <Grid container spacing={2}>
                {infoItems.map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                        <Box
                            sx={{
                                background: "#f2f3f4",
                                margin:"1rem 0",
                                borderRadius: "1rem",
                                // padding: "1rem",
                                textAlign: "center",
                                display: "flex",
                                flexDirection: "column",
                                height: "100%",
                                justifyContent: "center",
                            }}
                        >
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                {item.label}
                            </Typography>
                            <Typography variant="body2" sx={{ mt: 1, color: "#5dade2", wordBreak: "break-word" }}>
                                {item.value || "-"}
                            </Typography>
                        </Box>
                    </Grid>
                ))}
            </Grid>
        </Paper>
    );
}
