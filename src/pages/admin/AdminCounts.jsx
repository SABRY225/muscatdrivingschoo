import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';
import {
  Box,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';
import { useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'react-i18next';
function AdminCounts() {
  const [counts, setCounts] = useState({
    teachers: '',
    students: '',
    lessons: '',
    lectures: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { token } = useSelector((state) => state.admin);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_KEY}api/v1/dashboard/counts`);
        setCounts(res.data.data);
      } catch (error) {
        console.error('Error fetching counts:', error);
        toast.error(t('Failed to fetch counts'));
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const handleChange = (field) => (e) => {
    setCounts((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.post(`${process.env.REACT_APP_API_KEY}api/v1/admin/statistics/counts`, counts,{
        headers: {
            "Content-Type": "application/json",
            Authorization: token,
          }
      });
      toast.success(t('Counts updated successfully'));
    } catch (error) {
      toast.error(t('Failed to updated counts'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress />
        </Box>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <Box my={4}>
        <Typography variant="h5" gutterBottom>
          {t("Distinctive settings on the platform")}
        </Typography>
        <Grid container spacing={2}>
          {['teachers', 'students', 'lessons', 'lectures'].map((field) => (
            <Grid item xs={12} sm={6} md={3} key={field}>
              <Paper elevation={3} style={{ padding: '20px', textAlign: 'center' }}>
                <Typography variant="h6" gutterBottom>{t(field.charAt(0) + field.slice(1))}</Typography>
                <TextField
                  fullWidth
                  type="number"
                  value={counts[field]}
                  onChange={handleChange(field)}
                />
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? t('Saving...'): t('Save Changes')}
          </Button>
        </Box>
      </Box>
      {/* Toast container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </AdminLayout>
  );
}

export default AdminCounts;
