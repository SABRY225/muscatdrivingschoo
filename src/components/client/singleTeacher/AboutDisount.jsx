import { Box, CardMedia, Paper, Typography, Grid } from '@mui/material';
import Cookies from 'js-cookie';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { convertCurrency } from '../../../utils/convertCurrency';
import { useSelector } from 'react-redux';
import currencies from '../../../data/currencies';

export default function AboutDiscount({ data }) {
    const { t } = useTranslation();
    const lang = Cookies.get("i18next") || "en";    
    const { currency } = useSelector(state => state.currency);

    const [convertedAmount, setConvertedAmount] = React.useState(null);
    const [convertedAmount2, setConvertedAmount2] = React.useState(null);

    React.useEffect(() => {
        async function fetchConvertedAmount() {
            const result = await convertCurrency(data.amountBeforeDiscount, data.currency, currency);
            const result2 = await convertCurrency(data.amountAfterDiscount,data.currency,currency);
            setConvertedAmount(result);
            setConvertedAmount2(result2);
        }
        fetchConvertedAmount();
    }, [data.amountAfterDiscount,data.amountBeforeDiscount, currency, data.currency]);
   
    // Find currency info from currencies array
    const currencyInfo = currencies.find(
      curr => curr.title === currency || curr.titleEn === currency || curr.titleAr === currency || curr.code === currency
    );

    return (
        <Paper sx={{ padding: { xs: "16px", sm: "32px 24px" }, marginY: "30px" }}>
            <CardMedia
                component="img"
                height="auto"
                image={data.image ? `${process.env.REACT_APP_API_KEY}images/${data.image}` : "/logo.png"}
                alt="package img"
                sx={{ filter: "brightness(50%)", width: "100%", height: "auto", maxHeight: "400px" }}
            />
            <Typography
                        mt={1}
                variant="h6"
                sx={{
                    marginBottom: "8px",
                    marginTop: "8px",
                    fontWeight: "700",
                    textAlign: "center"
                }}
            >
                {lang === "ar" ? data.titleAR : data.titleEN}
            </Typography>

            <Typography
                        mt={1}
                variant="body1"
                sx={{
                    marginBottom: "15px",
                    fontWeight: "400",
                    textAlign: "center"
                }}
            >
                {lang === "ar" ? data.descriptionArabic : data.descriptionEnglish}
            </Typography>

            {/* استخدام Grid لتوزيع العناصر بشكل مرن */}
            <Grid container spacing={2} justifyContent="space-between" sx={{ marginBottom: "15px" }}>
                <Grid item xs={12} >
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #f8fafc 60%, #d6eaf8 100%)",
                            borderRadius: "1.5rem",
                            boxShadow: "0 2px 12px 0 rgba(52, 152, 219, 0.10)",
                            padding: "1.2rem 1rem 0.7rem 1rem",
                            textAlign: "center",
                            mb: 2,
                            minHeight: "100px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <span style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>{t("Discount Type")}</span>
                        <span style={{ color: "#5dade2", fontWeight: 600, fontSize: "1.1rem" }}>{t(data.discountType)}</span>
                    </Box>
                </Grid>

                <Grid item xs={12} >
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #f8fafc 60%, #d6eaf8 100%)",
                            borderRadius: "1.5rem",
                            boxShadow: "0 2px 12px 0 rgba(52, 152, 219, 0.10)",
                            padding: "1.2rem 1rem 0.7rem 1rem",
                            textAlign: "center",
                            mb: 2,
                            minHeight: "100px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <span style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>{t("classes")}</span>
                        <span style={{ color: "#5dade2", fontWeight: 600, fontSize: "1.1rem" }}>{lang === "ar" ? data?.class?.titleAR : data?.class?.titleEN}</span>
                    </Box>
                </Grid>

                <Grid item xs={12} >
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #f8fafc 60%, #d6eaf8 100%)",
                            borderRadius: "1.5rem",
                            boxShadow: "0 2px 12px 0 rgba(52, 152, 219, 0.10)",
                            padding: "1.2rem 1rem 0.7rem 1rem",
                            textAlign: "center",
                            mb: 2,
                            minHeight: "100px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <span style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>{t("studyCurriculum")}</span>
                        <span style={{ color: "#5dade2", fontWeight: 600, fontSize: "1.1rem" }}>{lang === "ar" ? data?.curriculums?.titleAR : data?.curriculums?.titleEN}</span>
                    </Box>
                </Grid>
            </Grid>

            {/* عرض البيانات الأخرى */}
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item xs={12} >
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #eaf6fb 60%, #d6eaf8 100%)",
                            borderRadius: "1.5rem",
                            boxShadow: "0 2px 12px 0 rgba(52, 152, 219, 0.12)",
                            padding: "1.2rem 1rem 0.7rem 1rem",
                            textAlign: "center",
                            mb: 2,
                            minHeight: "120px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <span style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>{t("Amount Before Discount")}</span>
                        <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>{convertedAmount !== null ? convertedAmount : "Loading..."}</span>
                        {currencyInfo?.code && (
                          <img
                            src={`https://flagcdn.com/w40/${currencyInfo.code.toLowerCase()}.png`}
                            alt={currencyInfo.code}
                            style={{ width: 38, height: 38, borderRadius: "50%", margin: "8px 0" }}
                          />
                        )}
                        <span style={{ color: "#2980b9", fontWeight: 600, fontSize: "1rem" }}>{lang === "ar" ? currencyInfo?.titleAr : currencyInfo?.titleEn || currencyInfo?.title || currency}</span>
                    </Box>
                </Grid>

                <Grid item xs={12} >
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #eaf6fb 60%, #d6eaf8 100%)",
                            borderRadius: "1.5rem",
                            boxShadow: "0 2px 12px 0 rgba(52, 152, 219, 0.12)",
                            padding: "1.2rem 1rem 0.7rem 1rem",
                            textAlign: "center",
                            mb: 2,
                            minHeight: "120px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <span style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>{t("Amount After Discount")}</span>
                        <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>{convertedAmount2 !== null ? convertedAmount2 : "Loading..."}</span>
                        {currencyInfo?.code && (
                          <img
                            src={`https://flagcdn.com/w40/${currencyInfo.code.toLowerCase()}.png`}
                            alt={currencyInfo.code}
                            style={{ width: 38, height: 38, borderRadius: "50%", margin: "8px 0" }}
                          />
                        )}
                        <span style={{ color: "#2980b9", fontWeight: 600, fontSize: "1rem" }}>{lang === "ar" ? currencyInfo?.titleAr : currencyInfo?.titleEn || currencyInfo?.title || currency}</span>
                    </Box>
                </Grid>

                <Grid item xs={12} >
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #f8fafc 60%, #d6eaf8 100%)",
                            borderRadius: "1.5rem",
                            boxShadow: "0 2px 12px 0 rgba(52, 152, 219, 0.10)",
                            padding: "1.2rem 1rem 0.7rem 1rem",
                            textAlign: "center",
                            mb: 2,
                            minHeight: "100px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <span style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>{t("startDate")}</span>
                        <span style={{ color: "#5dade2", fontWeight: 600, fontSize: "1.1rem" }}>{new Date(data.startDate).toLocaleDateString()}</span>
                    </Box>
                </Grid>
            </Grid>

            {/* عرض البيانات المتبقية */}
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item xs={12} >
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #f8fafc 60%, #d6eaf8 100%)",
                            borderRadius: "1.5rem",
                            boxShadow: "0 2px 12px 0 rgba(231, 76, 60, 0.10)",
                            padding: "1.2rem 1rem 0.7rem 1rem",
                            textAlign: "center",
                            mb: 2,
                            minHeight: "100px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <span style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>{t("endDate")}</span>
                        <span style={{ color: "#ec7063", fontWeight: 600, fontSize: "1.1rem" }}>{new Date(data.endDate).toLocaleDateString()}</span>
                    </Box>
                </Grid>

                <Grid item xs={12} >
                    <Box
                        sx={{
                            background: "linear-gradient(135deg, #f8fafc 60%, #d6eaf8 100%)",
                            borderRadius: "1.5rem",
                            boxShadow: "0 2px 12px 0 rgba(52, 152, 219, 0.10)",
                            padding: "1.2rem 1rem 0.7rem 1rem",
                            textAlign: "center",
                            mb: 2,
                            minHeight: "100px",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center"
                        }}
                    >
                        <span style={{ fontWeight: 700, fontSize: "1.1rem", marginBottom: 8 }}>{t("terms And Conditions")}</span>
                        <span style={{ color: "#5dade2", fontWeight: 600, fontSize: "1.1rem" }}>{lang === "ar" ? data.conditionsAR : data.conditionsEN}</span>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    );
}
