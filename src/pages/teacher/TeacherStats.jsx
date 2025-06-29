// 📁 src/components/Dashboard/TeacherStats.jsx
import React from "react";
import { Typography, Box, Card } from "@mui/material";
import {
  LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip as RechartsTooltip
} from "recharts";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClassIcon from "@mui/icons-material/Class";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import GroupIcon from "@mui/icons-material/Group";
import StarRateIcon from "@mui/icons-material/StarRate";
import AssessmentIcon from "@mui/icons-material/Assessment";
import { useTranslation } from "react-i18next";
import { stats } from "../../data/statistics";
import TeacherLayout from "../../components/teacher/TeacherLayout";
const StatCard = ({ label, value, icon: Icon }) => (
  <Card sx={{ minWidth: 200, p: 2, textAlign: "center", boxShadow: 3 }}>
    {Icon && <Icon sx={{ fontSize: 30, color: "#1976d2", mb: 1 }} />}
    <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
    <Typography variant="h6" fontWeight="bold">{value}</Typography>
  </Card>
);
const TeacherStats = () => {
  const { t } = useTranslation();
  const data = stats.instructor;

  return (
    <TeacherLayout>
      <Box sx={{mb:3}}>
        <Typography variant="subtitle1" sx={{ mt: 4, mb: 1 }}>
        📅 {t("lessonsOverTime")}
      </Typography>
      <LineChart width={1000} height={500} data={data.lessonsChart}>
        <CartesianGrid stroke="#eee" />
        <XAxis dataKey="date" />
        <YAxis />
        <RechartsTooltip />
        <Line type="monotone" dataKey="lessons" stroke="#00C49F" strokeWidth={3} />
      </LineChart>
      </Box>

      <Typography variant="h5" gutterBottom>
        👨‍🏫 {t("instructorStats")}
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
          <StatCard label="إجمالي الدروس" value={data.totalLessonsTaught} icon={ClassIcon} />
          <StatCard label="طلبات حجز دروس قيد الانتظار" value={data.totalLessonsTaught} icon={ClassIcon} />
          <StatCard label="عدد الطلاب" value={data.totalStudentsTaught} icon={GroupIcon} />
          <StatCard label="المحاضرات المقدمة" value={data.totalLecturesGiven} icon={SchoolIcon} />
          <StatCard label="التقييم العام" value={`${data.averageRating} ⭐`} icon={StarRateIcon} />
          <StatCard label="الاختبارات" value={data.examsSupervised} icon={AssignmentIcon} />
          <StatCard label="الخصومات" value={data.examsSupervised} icon={AssignmentIcon} />
          <StatCard label="عدد النقاط المكتسبة" value={`${100}`} icon={MonetizationOnIcon} />
          <StatCard label="رصيدي" value={`${100} جنيه`} icon={MonetizationOnIcon} />
          <StatCard label="الباقات" value={data.examsSupervised} icon={AssignmentIcon} />
          <StatCard label="دروس هذا الأسبوع" value={data.scheduledThisWeek} icon={AssessmentIcon} />
          <StatCard label="الرسائل الغير مقرؤءه" value={10} icon={AssignmentIcon} />
      </Box>
    </TeacherLayout>
  );
};

export default TeacherStats;
