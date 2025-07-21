import { Box, Grid, Typography, Card, CardContent, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // ✅ استدعاء framer motion
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ImageIcon from '@mui/icons-material/Image';
// import InfoIcon from '@mui/icons-material/Info';
// import DescriptionIcon from '@mui/icons-material/Description';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ListAltIcon from '@mui/icons-material/ListAlt';
import StudentLayout from './StudentLayout';
import { t } from 'i18next';
import PaymentIcon from "@mui/icons-material/Payment";
import {  Lock, ReceiptLong, Star } from '@mui/icons-material';
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import SchoolIcon from "@mui/icons-material/School";

function StudentDashboard() {
  const navigate = useNavigate();

  const profileItems = [
    { title: t("About me"), icon: <AccountCircleIcon />, path: '/student/profile' },
    { title: t("profile_photo"), icon: <ImageIcon />, path: '/student/profile_photo' },
    { title: t("parent"), icon: <EscalatorWarningIcon />, path: '/student/parents' },
    { title: t("setting_changepassword"), icon: <Lock />, path: '/student/changepassword' },
    { title: t("my_teachers"), icon: <SchoolIcon />, path: '/student/teachers' },

  ];

  const financeItems = [
    { title: t("credit"), icon: <WalletIcon />, path: '/student/credit' },
    { title: t("Points earned"), icon: <Star />, path: '/student/referral-system' },
    { title: t("My bills"), icon: <ReceiptLong />, path: '/student/mybills' },
    { title: t("paymentOperations"), icon: <PaymentIcon />, path: '/student/financial-records' },
  ];

  const requestItems = [
    { title: t("Lesson booking requests"), icon: <ListAltIcon />, path: '/student/request-lesson' }
  ];

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 30 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.4,
        type: "spring"
      }
    }),
  };

  const renderSection = (title, items) => (
    <Box sx={{ mb: 5 }}>
      <Typography  sx={{ mb: 2, fontWeight: 'bold' ,fontSize:"17px"}}>{title}</Typography>
      <Grid container spacing={2}>
        {items.map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <motion.div
              custom={index}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
            >
              <Card
                sx={{
                  cursor: 'pointer',
                  textAlign: 'center',
                  p: 2,
                  transition: '0.3s',
                  "&:hover": { boxShadow: 6, transform: 'translateY(-4px)' },
                }}
                onClick={() => navigate(item.path)}
              >
                <CardContent>
                  <IconButton sx={{ fontSize: 40, color: '#1976d2' }}>
                    {item.icon}
                  </IconButton>
                  <Typography variant="subtitle1">{item.title}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  return (
        <StudentLayout>
    <Box >
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* <Typography  sx={{ mb: 4, fontWeight: 'bold',fontSize:"25px" }}>
          {t("controlBoard")}
        </Typography> */}
      </motion.div>
      {/* {renderSection(t("Orders"), requestItems)} */}
      {renderSection(t("Finance"), financeItems)}
      {renderSection(t("profile"), profileItems)}
    </Box>
        </StudentLayout>
  );
}

export default StudentDashboard;
