import { Box, CardMedia, Paper, Typography, useMediaQuery } from '@mui/material';
import Cookies from 'js-cookie';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { convertCurrency } from '../../../utils/convertCurrency';
import { useSelector } from 'react-redux';

export default function AboutTest({ testData }) {
    const { t } = useTranslation();
    const lang = Cookies.get("i18next") || "en";
    const isMobile = useMediaQuery("(max-width:600px)");
    const { currency } = useSelector(state => state.currency);

    function convertDate(dateString) {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // yyyy-mm-dd
    }

    const [convertedAmount, setConvertedAmount] = React.useState(null);

    React.useEffect(() => {
        async function fetchConvertedAmount() {
            const result = await convertCurrency(testData.price, testData.currency, currency);
            setConvertedAmount(result);
        }
        fetchConvertedAmount();
    }, [testData.price, currency, testData.currency]);

    return (
        <Paper sx={{ padding: "32px 24px", borderRadius: 2, boxShadow: 3 }}>
            {/* صورة المحاضرة */}
            <CardMedia
                component="img"
                height={isMobile ? "250px" : "400px"}
                image={testData.image ? `${process.env.REACT_APP_API_KEY}images/${testData.image}` : "/logo.png"}
                alt="package img"
                sx={{ filter: "brightness(50%)", width: "100%", objectFit: "cover", borderRadius: 2 }}
            />
            
            <Box sx={{ textAlign: "center", marginY: "8px", marginBottom: "2rem" }}>
                <Typography variant={isMobile ? "h5" : "h4"} sx={{ fontWeight: "700" }}>
                    {lang === "ar" ? testData.titleArabic : testData.titleEnglish}
                </Typography>
            </Box>

            {/* معلومات المحاضرة */}
            {[ 
                { label: t("studycurriculums"), value: lang === "ar" ? testData?.curriculums?.titleAR : testData?.curriculums?.titleEN },
                { label: t("subject"), value: lang === "ar" ? testData.subject.titleAR : testData.subject.titleEN },
                { label: t("classes"), value: lang === "ar" ? testData?.class?.titleAR : testData?.class?.titleEN },
                { label: t("semester"), value: t(testData?.semester) },
                { label: t("price"), value: convertedAmount },
                { label: t("currency"), value: t(currency) },
            ].map((item, index) => (
                <Box
                    key={index}
                    sx={{
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: "10px",
                        gap: isMobile ? "8px" : "0",
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: "700",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: isMobile ? "0.8rem 2rem" : "1rem 5rem",
                            width: isMobile ? "100%" : "300px",
                            textAlign: "center"
                        }}
                    >
                        {item.label}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            fontWeight: "400",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: isMobile ? "0.8rem 2rem" : "1rem 5rem",
                            width: isMobile ? "100%" : "300px",
                            textAlign: "center",
                            color: "#5dade2"
                        }}
                    >
                        {item.value}
                    </Typography>
                </Box>
            ))}
        </Paper>
    );
}
