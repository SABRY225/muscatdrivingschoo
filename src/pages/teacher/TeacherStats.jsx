import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  useTheme,
  useMediaQuery,
  CardActionArea
} from "@mui/material";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from "recharts";

import {
  School as SchoolIcon,
  Assignment as AssignmentIcon,
  MonetizationOn as MonetizationOnIcon,
  StarRate as StarRateIcon,
  Assessment as AssessmentIcon,
} from "@mui/icons-material";

import { useTranslation } from "react-i18next";
import TeacherLayout from "../../components/teacher/TeacherLayout";
import { useStatsTeacher } from "../../hooks/useTeacherStats";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import ClassIcon from '@mui/icons-material/Class';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import TodayIcon from '@mui/icons-material/Today';
import GroupIcon from '@mui/icons-material/Group';
import QuizIcon from '@mui/icons-material/Quiz';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import WorkIcon from '@mui/icons-material/Work';
import CampaignIcon from '@mui/icons-material/Campaign';
// ✅ الكرت مع دعم الربط واللون الأحمر إذا في حالة انتظار
const StatCard = ({ label, value, icon: Icon, isWarning = false, to = "#" }) => (
  <Card
    component={Link}
    to={to}
    sx={{
      minWidth: 200,
      flex: "1 1 220px",
      textDecoration: "none",
      boxShadow: 3,
      color: isWarning && value > 0 ? "#D32F2F" : "inherit",
      border: isWarning && value > 0 ? "1px solid #D32F2F" : undefined,
      transition: "all 0.3s ease",
      "&:hover": {
        transform: "scale(1.03)",
        boxShadow: 6,
      },
    }}
  >
    <CardActionArea sx={{ p: 2, textAlign: "center" }}>
      {Icon && (
        <Icon
          sx={{
            fontSize: 30,
            color: isWarning && value > 0 ? "#D32F2F" : "#1976d2",
            mb: 1,
          }}
        />
      )}
      <Typography variant="subtitle2" color="text.secondary">
        {label}
      </Typography>
      <Typography variant="h6" fontWeight="bold">
        {value}
      </Typography>
    </CardActionArea>
  </Card>
);

const TeacherStats = () => {
  const { t, i18n } = useTranslation();
  const { teacher } = useSelector((state) => state.teacher);
  const { data } = useStatsTeacher(teacher.id);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (data) setStats(data);
  }, [data]);


  return (
    <TeacherLayout>
      <Box sx={{pb:5}}>
        <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" sx={{ mt: 4, mb: 2 }}>
          📈 {t("lessonsOverTime")}
        </Typography>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data?.lessonsChart || []}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="month" tick={{
    fontSize: 14, // حجم الخط
    fontWeight: 500, // وزن الخط (اختياري)
    fill: "#333", // لون الخط (اختياري)
  }} />
            <YAxis />
            <RechartsTooltip />
            <Line
              type="monotone"
              dataKey="Lessons"
              stroke="#00C49F"
              strokeWidth={3}
            />
          </LineChart>
        </ResponsiveContainer>
      </Box>

      <Typography variant="h5" gutterBottom sx={{mb:2}}>
        👨‍🏫 {t("instructorStats")}
      </Typography>

<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 9, justifyContent: "center" }}>
  <StatCard label={t("Total Lessons")} value={data?.sessionsNumber} icon={ClassIcon} to="/teacher/sessions" />
  <StatCard label={t("Approved Lesson Requests")} value={data?.lessonOnline} icon={CheckCircleIcon} to="/teacher/request-lesson" />
  <StatCard label={t("Pending Lesson Requests")} value={data?.lessonWaiting} icon={HourglassTopIcon} isWarning to="/teacher/request-lesson" />
  <StatCard label={t("Scheduled This Week")} value={data?.sessionsThisWeek} icon={TodayIcon} isWarning to="/teacher/sessions" />
  {/* <StatCard label={t("Total Students")} value={data?.students} icon={GroupIcon} to="/teacher/students" /> */}
  <StatCard label={t("Tests")} value={data?.testsOnline} icon={QuizIcon} to="/teacher/tests" />
  <StatCard label={t("Pending Tests")} value={data?.testsWaiting} icon={HourglassTopIcon} isWarning to="/teacher/tests" />
  <StatCard label={t("Discounts")} value={data?.discountsOnline} icon={LocalOfferIcon} to="/teacher/discounts" />
  <StatCard label={t("Pending Discounts")} value={data?.discountsNumWaiting} icon={HourglassTopIcon} isWarning to="/teacher/discounts" />
  <StatCard label={t("Packages")} value={data?.packageOnline} icon={InventoryIcon} to="/teacher/package" />
  <StatCard label={t("Pending Packages")} value={data?.packageWaiting} icon={HourglassTopIcon} isWarning to="/teacher/package" />
  <StatCard label={t("Lectures")} value={data?.lectureOline} icon={VideoLibraryIcon} to="/teacher/lectures" />
  <StatCard label={t("Pending Lectures")} value={data?.teacherLectureWaiting} icon={HourglassTopIcon} isWarning to="/teacher/lectures" />
  <StatCard label={t("Jobs")} value={data?.careerOnline} icon={WorkIcon} to="/teacher/careers" />
  <StatCard label={t("Pending Jobs")} value={data?.careerNumWaiting} icon={HourglassTopIcon} isWarning to="/teacher/careers" />
  <StatCard label={t("Ads")} value={data?.adsNumTeacher} icon={CampaignIcon} to="/teacher/ads" />
  <StatCard label={t("Pending Ads")} value={data?.adsNumTeacherWaiting} icon={HourglassTopIcon} isWarning to="/teacher/ads" />
</Box>
      </Box>
    </TeacherLayout>
  );
};

export default TeacherStats;
