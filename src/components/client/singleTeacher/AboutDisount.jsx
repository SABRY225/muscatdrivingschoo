import { Box, CardMedia, Paper, Typography, Grid } from '@mui/material';
import Cookies from 'js-cookie';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { convertCurrency } from '../../../utils/convertCurrency';
import { useSelector } from 'react-redux';

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
                <Grid item xs={12} sm={6} md={4}>
                    <Typography
                        mt={1}
                        variant="body1"
                        sx={{
                            fontWeight: "700",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: "1rem",
                            textAlign: "center"
                        }}
                    >
                        {t("Discount Type")}
                    </Typography>
                    <Typography
                        mt={1}
                        variant="body1"
                        sx={{
                            fontWeight: "400",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: "1rem",
                            textAlign: "center",
                            color: "#5dade2"
                        }}
                    >
                        {t(data.discountType)}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Typography
                        mt={1}
                        variant="body1"
                        sx={{
                            fontWeight: "700",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: "1rem",
                            textAlign: "center"
                        }}
                    >
                        {t("classes")}
                    </Typography>
                    <Typography
                        mt={1}
                        variant="body1"
                        sx={{
                            fontWeight: "400",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: "1rem",
                            textAlign: "center",
                            color: "#5dade2"
                        }}
                    >
                        {lang === "ar" ? data?.class?.titleAR : data?.class?.titleEN}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Typography
                        mt={1}
                        variant="body1"
                        sx={{
                            fontWeight: "700",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: "1rem",
                            textAlign: "center"
                        }}
                    >
                        {t("studyCurriculum")}
                    </Typography>
                    <Typography
                        mt={1}
                        variant="body1"
                        sx={{
                            fontWeight: "400",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: "1rem",
                            textAlign: "center",
                            color: "#5dade2"
                        }}
                    >
                        {lang === "ar" ? data?.curriculums?.titleAR : data?.curriculums?.titleEN}
                    </Typography>
                </Grid>
            </Grid>

            {/* عرض البيانات الأخرى */}
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item xs={12} sm={6} md={4}>
                    <Typography
                        mt={1}
                        variant="body1"
                        sx={{
                            fontWeight: "700",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: "1rem",
                            textAlign: "center"
                        }}
                    >
                        {t("Amount Before Discount")}
                    </Typography>
                    <Typography
                        mt={1}
                        variant="body1"
                        sx={{
                            fontWeight: "400",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: "1rem",
                            textAlign: "center",
                            color: "#5dade2"
                        }}
                    >
                        {convertedAmount !== null ? convertedAmount : "Loading..."} {t(currency)}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Typography
                        mt={1}
                        variant="body1"
                        sx={{
                            fontWeight: "700",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: "1rem",
                            textAlign: "center"
                        }}
                    >
                        {t("Amount After Discount")}
                    </Typography>
                    <Typography
                        mt={1}
                        variant="body1"
                        sx={{
                            fontWeight: "400",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: "1rem",
                            textAlign: "center",
                            color: "#5dade2"
                        }}
                    >
                        {convertedAmount2 !== null ? convertedAmount2 : "Loading..."} {t(currency)}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Typography
                        mt={1}
                        variant="body1"
                        sx={{
                            fontWeight: "700",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: "1rem",
                            textAlign: "center"
                        }}
                    >
                        {t("startDate")}
                    </Typography>
                    <Typography
                        mt={1}
                        variant="body1"
                        sx={{
                            fontWeight: "400",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: "1rem",
                            textAlign: "center",
                            color: "#5dade2"
                        }}
                    >
                        {new Date(data.startDate).toDateString()}
                    </Typography>
                </Grid>
            </Grid>

            {/* عرض البيانات المتبقية */}
            <Grid container spacing={2} justifyContent="space-between">
                <Grid item xs={12} sm={6} md={4}>
                    <Typography
                        mt={1}
                        variant="body1"
                        sx={{
                            fontWeight: "700",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: "1rem",
                            textAlign: "center"
                        }}
                    >
                        {t("endDate")}
                    </Typography>
                    <Typography
                        mt={1}
                        variant="body1"
                        sx={{
                            fontWeight: "400",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: "1rem",
                            textAlign: "center",
                            color: "#ec7063"
                        }}
                    >
                        {new Date(data.endDate).toDateString()}
                    </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Typography
                        mt={1}
                        variant="body1"
                        sx={{
                            fontWeight: "700",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: "1rem",
                            textAlign: "center"
                        }}
                    >
                        {t("terms And Conditions")}
                    </Typography>
                    <Typography
                        variant="body1"
                        mt={1}
                        sx={{
                            fontWeight: "400",
                            background: "#f2f3f4",
                            borderRadius: "1rem",
                            padding: "1rem",
                            textAlign: "center",
                            color: "#5dade2"
                        }}
                    >
                        {lang === "ar" ? data.conditionsAR : data.conditionsEN}
                    </Typography>
                </Grid>
            </Grid>
        </Paper>
    );
}
