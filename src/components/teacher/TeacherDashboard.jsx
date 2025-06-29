import { Box, Grid, Typography, Card, CardContent, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // ✅ استدعاء framer motion
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ImageIcon from '@mui/icons-material/Image';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import WalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ListAltIcon from '@mui/icons-material/ListAlt';
import Navbar from '../Navbar';
import TeacherLayout from './TeacherLayout';
import { t } from 'i18next';
import { AccessTime, Lock, MenuBook, ReceiptLong, Replay, Star, Videocam, WorkspacePremium } from '@mui/icons-material';
import Groups2Icon from "@mui/icons-material/Groups2";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

function TeacherDashboard() {
  const navigate = useNavigate();
const [lessonRequestCount, setLessonRequestCount] = useState(0);
  const { teacher, token } = useSelector((s) => s.teacher);

useEffect(() => {
  async function fetchCount() {
    try {
      const res = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/lesson/pending/count/${teacher.id}`);
      const data = await res.json();
      setLessonRequestCount(data.count);
    } catch (err) {
      console.error("Failed to fetch lesson request count", err);
    }
  }

  fetchCount();
}, []);
const requestCardColor = lessonRequestCount > 0 ? '#ffcdd2' : '#fff'; // أحمر فاتح إذا في طلبات، أبيض إن لم يكن

  const profileItems = [
    { title: t("About me"), icon: <AccountCircleIcon />, path: '/teacher/about' },
    { title: t("profile_photo"), icon: <ImageIcon />, path: '/teacher/photo' },
    { title: t("additionalInformation"), icon: <InfoIcon />, path: '/teacher/additionalInformation' },
    { title: t("description"), icon: <DescriptionIcon />, path: '/teacher/description' },
    { title: t("subjects"), icon: <MenuBook />, path: '/teacher/subjects' },
    { title: t("availability"), icon: <AccessTime />, path: '/teacher/availability' },
    { title: t("certification"), icon: <WorkspacePremium />, path: '/teacher/certificates' },
    { title: t("Video presentation"), icon: <Videocam />, path: '/teacher/Video' },
    { title: t("setting_changepassword"), icon: <Lock />, path: '/teacher/changepassword' },
    { title: t("my_students"), icon: <Groups2Icon />, path: '/teacher/students' },

  ];

  const financeItems = [
    { title: t("credit"), icon: <WalletIcon />, path: '/teacher/credit' },
    { title: t("Points earned"), icon: <Star />, path: '/teacher/pointsearned' },
    { title: t("My bills"), icon: <ReceiptLong />, path: '/teacher/mybills' },
    { title: t("refunds"), icon: <Replay />, path: '/teacher/refunds' },
  ];

const requestItems = [
  {
    title: `${t("Lesson booking requests")} (${lessonRequestCount})`,
    icon: <ListAltIcon />,
    path: '/teacher/request-lesson'
  }
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
      <Typography sx={{ mb: 2, fontWeight: 'bold',fontSize:"17px" }}>{title}</Typography>
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
    backgroundColor:
      item.title.includes(t("Lesson booking requests")) ? requestCardColor : '#fff',
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
        <TeacherLayout>
    <Box sx={{ p: 1}}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
      </motion.div>
      {renderSection(t("Orders"), requestItems)}
      {renderSection(t("Finance"), financeItems)}
      {renderSection(t("profile"), profileItems)}
    </Box>
        </TeacherLayout>
  );
}

export default TeacherDashboard;
