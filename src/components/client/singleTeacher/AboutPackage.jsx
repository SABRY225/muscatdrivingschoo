import { Box, CardMedia, Paper, Stack, Typography } from '@mui/material';
import Cookies from 'js-cookie';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { convertCurrency } from '../../../utils/convertCurrency';

export default function AboutPackage({ packageData }) {
  const { currency } = useSelector(state => state.currency);
  const { t } = useTranslation();
  const lang = Cookies.get("i18next") || "en";
  const [convertedAmount, setConvertedAmount] = React.useState(null);

  React.useEffect(() => {
    async function fetchConvertedAmount() {
      const result = await convertCurrency(packageData?.price, packageData?.currency, currency);
      setConvertedAmount(result);
    }

    fetchConvertedAmount();
  }, [packageData?.price, currency, packageData?.currency]);

  const ResponsiveRow = ({ label, value, color = "inherit" }) => (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      justifyContent="space-between"
      alignItems="center"
      sx={{ marginBottom: "16px" }}
    >
      <Typography
        variant="body1"
        sx={{
          width: { xs: "100%", sm: "45%", md: "300px" },
          textAlign: "center",
          padding: "1rem",
          background: "#f2f3f4",
          borderRadius: "1rem",
          fontWeight: "700"
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          width: { xs: "100%", sm: "45%", md: "300px" },
          textAlign: "center",
          padding: "1rem",
          background: "#f2f3f4",
          borderRadius: "1rem",
          fontWeight: "400",
          color
        }}
      >
        {value}
      </Typography>
    </Stack>
  );

  return (
    <Paper sx={{ padding: { xs: "20px", md: "32px 24px" }, marginY: "30px" }}>
      <CardMedia
        component="img"
        image={packageData?.image ? `${process.env.REACT_APP_API_KEY}images/${packageData?.image}` : "/logo.png"}
        alt="package img"
        sx={{
          filter: "brightness(60%)",
          height: { xs: "180px", sm: "260px", md: "400px" },
          width: "100%",
          objectFit: "cover",
          borderRadius: "8px",
          marginBottom: "20px"
        }}
      />

      <Typography
        variant="h5"
        sx={{
          marginBottom: "10px",
          fontWeight: "700",
          textAlign: "center",
        }}
      >
        {lang === "ar" ? packageData?.titleAR : packageData?.titleEN}
      </Typography>

      <Typography
        variant="body1"
        sx={{
          marginBottom: "25px",
          textAlign: "center",
          color: "#666"
        }}
      >
        {lang === "ar" ? packageData?.descriptionAr : packageData?.descriptionEn}
      </Typography>

      {/* معلومات الباقة */}
      <ResponsiveRow
        label={t("level")}
        value={lang === "ar" ? packageData?.Level?.titleAR : packageData?.Level?.titleEN}
        color="#5dade2"
      />
      <ResponsiveRow
        label={t("classes")}
        value={lang === "ar" ? packageData?.class?.titleAR : packageData?.class?.titleEN}
        color="#5dade2"
      />
      <ResponsiveRow
        label={t("studyCurriculum")}
        value={lang === "ar" ? packageData?.curriculums?.titleAR : packageData?.curriculums?.titleEN}
        color="#5dade2"
      />
      {/* <ResponsiveRow
        label={t("semester")}
        value={t(packageData?.semester)}
        color="#5dade2"
      /> */}
      <ResponsiveRow
        label={t("limetype")}
        value={lang === "ar" ? packageData?.LimeType?.titleAR : packageData?.LimeType?.titleEN}
        color="#5dade2"
      />
      <ResponsiveRow
        label={t("Price Package")}
        value={
          convertedAmount !== null ? `${convertedAmount} ${t(currency)}` : "..."
        }
        color="#5dade2"
      />
      <ResponsiveRow
        label={t("startDate")}
        value={new Date(packageData?.startDate).toLocaleDateString(lang)}
        color="#5dade2"
      />
      <ResponsiveRow
        label={t("endDate")}
        value={new Date(packageData?.endDate).toLocaleDateString(lang)}
        color="#ec7063"
      />
      <ResponsiveRow
        label={t("sharesCount")}
        value={packageData?.numTotalLesson}
        color="#5dade2"
      />
      <ResponsiveRow
        label={t("sharesCountInWeek")}
        value={packageData?.numWeekLesson}
        color="#5dade2"
      />
    </Paper>
  );
}
