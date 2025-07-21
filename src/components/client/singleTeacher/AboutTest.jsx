import { Box, CardMedia, Paper, Typography, useMediaQuery, useTheme } from '@mui/material';
import Cookies from 'js-cookie';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { convertCurrency } from '../../../utils/convertCurrency';
import { useSelector } from 'react-redux';
import currencies from '../../../data/currencies';

export default function AboutTest({ testData }) {
    const { t } = useTranslation();
    const lang = Cookies.get("i18next") || "en";
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // sm = 600px
    const { currency } = useSelector(state => state.currency);

    const [convertedAmount, setConvertedAmount] = React.useState(null);

    React.useEffect(() => {
        async function fetchConvertedAmount() {
            const result = await convertCurrency(testData.price, testData.currency, currency);
            setConvertedAmount(result);
        }
        fetchConvertedAmount();
    }, [testData.price, currency, testData.currency]);

    // Find currency info from currencies array
    const currencyInfo = currencies.find(
      curr => curr.title === currency || curr.titleEn === currency || curr.titleAr === currency || curr.code === currency
    );

    return (
        <Paper sx={{ padding: 1, borderRadius: 2, boxShadow: 3 ,mt:4}}>
            {/* صورة الاختبار */}
            <CardMedia
                component="img"
                height={isMobile ? "200px" : "400px"}
                image={testData?.image ? `${process.env.REACT_APP_API_KEY}images/${testData?.image}` : "/logo.png"}
                alt="test img"
                sx={{
                    filter: "brightness(50%)",
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: 2,
                    marginBottom: 3,
                }}
            />

            {/* العنوان */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography variant={isMobile ? "h6" : "h4"} fontWeight="bold">
                    {lang === "ar" ? testData?.titleArabic : testData?.titleEnglish}
                </Typography>
            </Box>

            {/* بيانات الاختبار */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {[
                    { label: t("studycurriculums"), value: lang === "ar" ? testData?.curriculums?.titleAR : testData?.curriculums?.titleEN },
                    { label: t("subject"), value: lang === "ar" ? testData?.subject?.titleAR : testData?.subject?.titleEN },
                    { label: t("classes"), value: lang === "ar" ? testData?.class?.titleAR : testData?.class?.titleEN },
                    // { label: t("semester"), value: t(testData?.semester) },
                    {
                      label: t("price"),
                      value: convertedAmount !== null ? (
                        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                          <span>{convertedAmount}</span>
                          {currencyInfo?.code && (
                            <img
                              src={`https://flagcdn.com/w40/${currencyInfo.code.toLowerCase()}.png`}
                              alt={currencyInfo.code}
                              style={{ width: 28, height: 20, borderRadius: 4, marginLeft: 4 }}
                            />
                          )}
                          <span>{lang === "ar" ? currencyInfo?.titleAr : currencyInfo?.titleEn || currencyInfo?.title || currency}</span>
                        </Box>
                      ) : "..."
                    },
                ].map((item, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: "flex",
                            flexDirection: isMobile ? "column" : "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: 2,
                            flexWrap: "wrap"
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                background: "#f2f3f4",
                                borderRadius: "1rem",
                                padding: "0.8rem 2rem",
                                minWidth: "140px",
                                textAlign: "center",
                                flex: 1,
                            }}
                        >
                            {item.label}
                        </Typography>
                        <Typography
                            sx={{
                                fontWeight: "400",
                                background: "#f2f3f4",
                                borderRadius: "1rem",
                                padding: "0.8rem 2rem",
                                textAlign: "center",
                                flex: 1,
                                color: "#5dade2",
                                minWidth: "140px",
                            }}
                        >
                            {item.value}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
}
