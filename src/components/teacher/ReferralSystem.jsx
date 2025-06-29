import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Button, Card, CardContent, Typography, TextField, Box,
  CircularProgress, Alert, IconButton, Tooltip, Snackbar
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Cookies from "js-cookie";
import { useSnackbar } from 'notistack';
import { convertCurrency } from '../../utils/convertCurrency';
import PointsSystem from './PointsSystem';
import TeacherLayout from './TeacherLayout';

const ReferralSystem = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subscribing, setSubscribing] = useState(false);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [amount, setAmount] = useState(0);

  const { teacher, token } = useSelector((state) => state.teacher);
  const { currency } = useSelector((state) => state.currency);
  const { t } = useTranslation();  
  const lang = Cookies.get("i18next") || "en";
  const { enqueueSnackbar } = useSnackbar();

  const fetchReferralData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_KEY}api/v1/invite/${teacher.id}`);
      setData(res.data.invite);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(t("Failed to load data"));
      }
    } finally {
      setLoading(false);
    }
  }, [teacher.id, t,subscribing]);

  const handleSubscribe = async () => {
    try {
      setSubscribing(true);
      const res = await axios.post(`${process.env.REACT_APP_API_KEY}api/v1/invite/${teacher.id}`);
      setData(res.data);
    } catch (err) {
      setError(t("Subscription failed"));
    } finally {
      setSubscribing(false);
    }
  };

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(data.link);
    setCopySuccess(true);
  }, [data?.link]);
    console.log(data);

  const handleRequestCheckout = useCallback(async () => {
    
    convertCurrency(data?.amountPoints / 50, "OMR", "USD")
        .then((result) => setAmount(result));
    console.log(amount);
    
    if (amount < 100) {
      enqueueSnackbar(
        lang === "en"
          ? "The amount must be at least 100 dollars to request a withdrawal."
          : "يجب أن لا يقل المبلغ عن 100 دولار لطلب السحب.",
        {
          variant: "warning",
          autoHideDuration: 4000,
        }
      );
      return;
    }
  
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/request-checkout/${teacher.id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      const result = await response.json();
      if (response.ok) {
        enqueueSnackbar(lang === "en" ? result.msg.english : result.msg.arabic, {
          variant: "success",
          autoHideDuration: 5000,
        });
        // window.location.reload();
      }
    } catch (err) {
      enqueueSnackbar(err.message, {
        variant: "error",
        autoHideDuration: 2000,
      });
    }
  }, [teacher.id, token, enqueueSnackbar, lang, convertedAmount]);
  

  useEffect(() => {
    fetchReferralData();
  }, [fetchReferralData]);

  useEffect(() => {
    if (data?.amountPoints) {
      convertCurrency(data.amountPoints / 50, "OMR", currency)
        .then((result) => setConvertedAmount(result));
    }
  }, [data, currency]);

  return (
      <TeacherLayout>
        <Box  mt={3}>
        <Box sx={{  width: {md:"60vw",xs:"80vw"}, p: 3, boxShadow: 5 ,m:2}}>
          <CardContent>
            <Typography variant="h5" align="center" gutterBottom>
              {t("Invitation and points system")}
            </Typography>

            {loading ? (
              <Box display="flex" justifyContent="center" mt={2}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : data ? (
              <>
                <Box sx={{ marginBottom: "18px", display: "flex", width: "100%", gap: "16px" }}>
                  <Box sx={{
                    flex:1,
                    background: "#800020", color: "#fff", textAlign: "center",
                    borderRadius: "8px", padding: 4, width: "45%"
                  }}>
                    <Typography variant="h6" fontWeight="bold">{data.amountPoints}</Typography>
                    <Typography>{t("Number of points")}</Typography>
                  </Box>
                  <Box sx={{
                    flex:1,
                    background: "#e5e7e9", color: "#f50000", textAlign: "center",
                    borderRadius: "8px", padding: 4, width: "45%"
                  }}>
                    <Typography variant="h6" fontWeight="bold">
                      {convertedAmount} {t(currency)}
                    </Typography>
                    <Typography>{t("Earned money")}</Typography>
                  </Box>
                </Box>

                <Box mb={3}>
                  <Typography mb={1}>{t("Invitation link")}</Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <TextField
                      fullWidth
                      value={data.link}
                      size="small"
                      InputProps={{ readOnly: true }}
                      dir="ltr"
                    />
                    <Tooltip title={t("Copy link")}>
                      <IconButton color="primary" onClick={handleCopy}>
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>

                <Button
                  variant="outlined"
                  startIcon={<AttachMoneyIcon />}
                  fullWidth
                  onClick={handleRequestCheckout}
                >
                  {t("Withdrawal request")}
                </Button>
              </>
            ) : (
              <Button
                variant="contained"
                fullWidth
                onClick={handleSubscribe}
                disabled={subscribing}
              >
                {subscribing ? t("Subscribing...") : t("Subscribe to the system")}
              </Button>
            )}
          </CardContent>
        </Box>
        <PointsSystem />
      </Box>
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message={t("Invitation link copied")}
      />
      </TeacherLayout>
  );
};

export default ReferralSystem;
