import React, { useEffect, useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import axios from 'axios';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

function AdminBalance() {
  const [revenueData, setRevenueData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_KEY}api/v1/admin/admin-wallet/yearly-revenue`);
        const data = response.data.data;

        setRevenueData(data);

        const total = data.reduce((sum, item) => sum + item.totalAmount, 0);
        setTotalRevenue(total);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };

    fetchRevenue();
  }, []);

  return (
    <AdminLayout>
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h5" gutterBottom>
            {t("Total balance for the current year")}
          </Typography>
          <Typography variant="h6" color="primary">
            {totalRevenue.toLocaleString()} {t("OMR")}
          </Typography>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t("month")}</TableCell>
                <TableCell align="right">{t("Revenue (OMR)")}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {revenueData.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.month}</TableCell>
                  <TableCell align="right">{item.totalAmount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </AdminLayout>
  );
}

export default AdminBalance;
