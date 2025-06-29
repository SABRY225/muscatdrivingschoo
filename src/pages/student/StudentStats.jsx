// 📁 src/components/Dashboard/StudentStats.jsx
import React from "react";
import {
  Typography,
  Box,
  Card,
  CardContent
} from "@mui/material";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  LineChart, Line, CartesianGrid, Tooltip as RechartsTooltip
} from "recharts";
import SchoolIcon from "@mui/icons-material/School";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ClassIcon from "@mui/icons-material/Class";
import AssignmentIcon from "@mui/icons-material/Assignment";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { useTranslation } from "react-i18next";
import { stats } from "../../data/statistics";
import StudentLayout from "../../components/student/StudentLayout";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC"];
const StatCard = ({ label, value, icon: Icon }) => (
  <Card sx={{ minWidth: 200, p: 2, textAlign: "center", boxShadow: 3 }}>
    {Icon && <Icon sx={{ fontSize: 30, color: "#1976d2", mb: 1 }} />}
    <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
    <Typography variant="h6" fontWeight="bold">{value}</Typography>
  </Card>
);

const StudentStats = () => {
  const { t } = useTranslation();
  const data = stats.student;

  return (
    <StudentLayout>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
           <StatCard label="الدروس المحجوزة" value={data.lessons} icon={ClassIcon} />
          <StatCard label="الدروس المكتملة" value={data.completedLessons} icon={CheckCircleIcon} />
          <StatCard label="المحاضرات التي حضرها" value={data.lecturesAttended} icon={SchoolIcon} />
          <StatCard label="الباقات المحجوزة" value={data.lessons} icon={ClassIcon} />
          <StatCard label="الاختبارات" value={data.examsTaken} icon={AssignmentIcon} />
          <StatCard label="نسبة التقدم" value={`${data.progress}%`} icon={TrendingUpIcon} />
          <StatCard label="المبلغ المدفوع" value={`${data.totalPayments} جنيه`} icon={MonetizationOnIcon} />
          <StatCard label="عدد النقاط المكتسبة" value={`${data.totalPayments}`} icon={MonetizationOnIcon} />
          <StatCard label="رصيدي" value={`${data.totalPayments} جنيه`} icon={MonetizationOnIcon} />
          <StatCard label="طلبات حجز الدروس" value={data.discountsUsed} icon={LocalOfferIcon} />
          <StatCard label="الخصومات المحجوزة" value={data.discountsUsed} icon={LocalOfferIcon} />
          <StatCard label="الرسائل الغير مقرؤءه" value={10} icon={AssignmentIcon} />
      </Box>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        <Box sx={{ flex: "1 1 45%" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>{t("lessonsTimeline")}</Typography>
          <LineChart width={1000} height={300} data={data.lessonsChart}>
            <CartesianGrid stroke="#eee" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip />
            <Line type="monotone" dataKey="lessons" stroke="#8884d8" strokeWidth={2} />
          </LineChart>
        </Box>

        <Box sx={{ flex: "1 1 45%" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>{t("progressOverTime")}</Typography>
          <LineChart width={1000} height={300} data={data.progressHistory}>
            <CartesianGrid stroke="#ccc" />
            <XAxis dataKey="date" />
            <YAxis />
            <RechartsTooltip />
            <Line type="monotone" dataKey="progress" stroke="#ff7300" />
          </LineChart>
        </Box>

        <Box sx={{ flex: "1 1 45%" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>{t("lessonsByInstructor")}</Typography>
          <BarChart width={450} height={300} data={data.lessonsByInstructor}>
            <XAxis dataKey="name" />
            <YAxis />
            <RechartsTooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </Box>

        <Box sx={{ flex: "1 1 45%" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>{t("bookingTypes")}</Typography>
          <PieChart width={450} height={300}>
            <Pie
              data={data.bookingsByType}
              cx="50%" cy="50%" outerRadius={100}
              dataKey="value" nameKey="name"
              label
            >
              {data.bookingsByType.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartsTooltip />
          </PieChart>
        </Box>
      </Box>
    </StudentLayout>
  );
};

export default StudentStats;