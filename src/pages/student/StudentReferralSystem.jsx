import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Button, Card, CardContent, Typography, TextField, Box,
  CircularProgress, Alert, IconButton, Tooltip, Snackbar
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import Navbar from '../../components/Navbar';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Cookies from "js-cookie";
import { convertCurrency } from '../../utils/convertCurrency';
import { useSnackbar } from 'notistack';
import StudentLayout from '../../components/student/StudentLayout';
import PointsSystem from '../../components/teacher/PointsSystem';

const StudentReferralSystem = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const { student, token } = useSelector((state) => state.student);
  const { currency } = useSelector((state) => state.currency);
  const { t } = useTranslation();  
  // const lang = Cookies.get("i18next") || "en";
  // const { enqueueSnackbar } = useSnackbar();

  const fetchReferralData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_API_KEY}api/v1/invite/${student.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      
      setData(res.data.invite);
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(t("Failed to load data"));
      } else {
        setData({ amountPoints: 0 });
      }
    } finally {
      setLoading(false);
    }
  }, [student.id, t, token]);

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
    <StudentLayout>
      {loading && (
        <Box display="flex" justifyContent="center" mt={4} mb={16}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Box mt={2}>
          <Alert severity="error">{error}</Alert>
        </Box>
      )}

      {!loading && !error && (
        <Box display="flex" justifyContent="center">
          <Card sx={{ maxWidth: 800, width: '100%', p: 3, boxShadow: 5 ,marginBottom:"3rem"}}>
            <CardContent>
              <Typography variant="h5" align="center" gutterBottom mb={5}>
                {t("Invitation and points system")}
              </Typography>

              <Box
  display="flex"
  flexDirection={{ xs: 'column', md: 'row' }}
  justifyContent="space-between"
  alignItems="center"
  gap={2}
>
  <Box
    sx={{
      background: "#3B82F6ED",
      color: "#fff",
      textAlign: "center",
      borderRadius: "8px",
      padding: 4,
      width: { xs: "100%", md: "45%" },
    }}
  >
    <Typography variant="h6" fontWeight="bold">
      {data?.amountPoints ?? 0}
    </Typography>
    <Typography>{t("Number of points")}</Typography>
  </Box>

  <Box
    sx={{
      background: "#e5e7e9",
      color: "#3B82F6ED",
      textAlign: "center",
      borderRadius: "8px",
      padding: 4,
      width: { xs: "100%", md: "45%" },
    }}
  >
    <Typography variant="h6" fontWeight="bold">
      {convertedAmount} {t(currency)}
    </Typography>
    <Typography>{t("Earned money")}</Typography>
  </Box>
</Box>

            </CardContent>
          </Card>
        </Box>
      )}
       <PointsSystem />
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message={t("Invitation link copied")}
      />
    </StudentLayout>
  );
};

export default StudentReferralSystem;
