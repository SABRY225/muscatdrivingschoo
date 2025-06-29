// src/components/Dashboard.js
import React, { useState } from "react";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  LineChart, Line, CartesianGrid, Tooltip as RechartsTooltip
} from "recharts";
import { stats } from "./data/statistics";
import { Button, ButtonGroup, Card, CardContent, Typography, Box } from "@mui/material";
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


const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC"];

const StatCard = ({ label, value, icon: Icon }) => (
  <Card sx={{ minWidth: 200, p: 2, textAlign: "center", boxShadow: 3 }}>
    {Icon && <Icon sx={{ fontSize: 30, color: "#1976d2", mb: 1 }} />}
    <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
    <Typography variant="h6" fontWeight="bold">{value}</Typography>
  </Card>
);

const TestNow = () => {
  const [userType, setUserType] = useState("student");
  const { t } = useTranslation();

  const renderStudentStats = () => {
    const data = stats.student;
    return (
      <>
        <Typography variant="h5" gutterBottom>📘 إحصائيات الطالب</Typography>

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
  {/* المجموعة الأولى */}
  <Box sx={{ flex: "1 1 45%" }}>
    <Typography variant="subtitle1" sx={{ mb: 1 }}>📅 خط زمني لحجوزات الدروس</Typography>
    <LineChart width={500} height={300} data={data.lessonsChart}>
      <CartesianGrid stroke="#eee" />
      <XAxis dataKey="date" />
      <YAxis />
      <RechartsTooltip />
      <Line type="monotone" dataKey="lessons" stroke="#8884d8" strokeWidth={2} />
    </LineChart>
  </Box>

  <Box sx={{ flex: "1 1 45%" }}>
    <Typography variant="subtitle1" sx={{ mb: 1 }}>📈 تقدم الطالب عبر الوقت</Typography>
    <LineChart width={500} height={300} data={data.progressHistory}>
      <CartesianGrid stroke="#ccc" />
      <XAxis dataKey="date" />
      <YAxis />
      <RechartsTooltip />
      <Line type="monotone" dataKey="progress" stroke="#ff7300" />
    </LineChart>
  </Box>

  {/* المجموعة الثانية */}
  <Box sx={{ flex: "1 1 45%" }}>
    <Typography variant="subtitle1" sx={{ mb: 1 }}>👨‍🏫 عدد الدروس لكل مدرب</Typography>
    <BarChart width={500} height={300} data={data.lessonsByInstructor}>
      <XAxis dataKey="name" />
      <YAxis />
      <RechartsTooltip />
      <Bar dataKey="value" fill="#8884d8" />
    </BarChart>
  </Box>

  <Box sx={{ flex: "1 1 45%" }}>
    <Typography variant="subtitle1" sx={{ mb: 1 }}>📌 أنواع الحجوزات</Typography>
    <PieChart width={500} height={300}>
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

      </>
    );
  };

  const renderInstructorStats = () => {
    const data = stats.instructor;
    return (
      <>
      
        <Typography variant="subtitle1" sx={{ mt: 4, mb: 1 }}>📅 عدد الدروس عبر الوقت</Typography>
        <LineChart width={1000} height={500} data={data.lessonsChart}>
          <CartesianGrid stroke="#eee" />
          <XAxis dataKey="date" />
          <YAxis />
          <RechartsTooltip />
          <Line type="monotone" dataKey="lessons" stroke="#00C49F" strokeWidth={3} />
        </LineChart>
        
        <Typography variant="h5" gutterBottom>👨‍🏫 إحصائيات المدرب</Typography>

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
      </>
    );
  };

  const renderAdminStats = () => {
    const data = stats.admin;
    return (
      <>
        <Typography variant="h5" gutterBottom>👨‍💼 إحصائيات المسئول</Typography>

         <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4 }}>
          <StatCard label="إجمالي المستخدمين" value={data.totalUsers} icon={GroupIcon} />
          <StatCard label="عدد الطلاب" value={data.totalStudents} icon={SchoolIcon} />
          <StatCard label="طلاب حالين" value={data.totalStudents} icon={SchoolIcon} />
          <StatCard label="طلبات صرف الطلاب قيد المراجعة" value={data.totalStudents} icon={SchoolIcon} />
          <StatCard label="عدد المدربين" value={data.totalInstructors} icon={ClassIcon} />
          <StatCard label="مدربين حالين" value={data.totalInstructors} icon={ClassIcon} />
          <StatCard label="طلبات صرف مدربين قيد المراجعة" value={data.totalStudents} icon={SchoolIcon} />
          <StatCard label="طلبات قبول المدربين" value={data.totalStudents} icon={SchoolIcon} />
          <StatCard label="الحصص المسجلة" value={data.totalBookings} icon={AssignmentIcon} />
          <StatCard label="اعلانات" value={data.totalBookings} icon={AssignmentIcon} />
          <StatCard label="باقات" value={data.totalBookings} icon={AssignmentIcon} />
          <StatCard label="باقات قيد المراجعة" value={data.totalBookings} icon={AssignmentIcon} />
          <StatCard label="محاضرات" value={data.totalBookings} icon={AssignmentIcon} />
          <StatCard label="محاضرات قيد المراجعة" value={data.totalBookings} icon={AssignmentIcon} />
          <StatCard label="خصومات" value={data.totalBookings} icon={AssignmentIcon} />
          <StatCard label="خصومات قيد المراجعة" value={data.totalBookings} icon={AssignmentIcon} />
          <StatCard label="وظائف قيد المراجعة" value={data.totalBookings} icon={AssignmentIcon} />
          <StatCard label="اختبارات" value={data.totalBookings} icon={AssignmentIcon} />
          <StatCard label="اختبارات قيد المراجعة" value={data.totalBookings} icon={AssignmentIcon} />
          <StatCard label="طلبات حجز دروس قيد المراجعة" value={data.totalBookings} icon={AssignmentIcon} />
          <StatCard label="طلبات  الاباء للابناء قيد المراجعة" value={data.totalBookings} icon={AssignmentIcon} />
          <StatCard label="الشكاوي" value={data.totalBookings} icon={AssignmentIcon} />
          <StatCard label="الرسائل الغير مقرؤءه" value={data.totalBookings} icon={AssignmentIcon} />


        </Box>

        <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" }}>
          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>📌 أنواع الحجوزات</Typography>
            <PieChart width={300} height={250}>
              <Pie
                data={data.bookingsByType}
                cx="50%" cy="50%" outerRadius={80}
                dataKey="value" nameKey="name" label
              >
                {data.bookingsByType.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </Box>

          <Box>
            <Typography variant="subtitle1" sx={{ mb: 1 }}>💰 الإيرادات الشهرية</Typography>
            <BarChart width={400} height={250} data={data.revenuePerMonth}>
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="revenue" fill="#00C49F" />
            </BarChart>
          </Box>
        </Box>
      </>
    );
  };

  return (
    <Box sx={{ padding: 4 }}>
      <Typography variant="h4" gutterBottom>📊 لوحة الإحصائيات</Typography>

      <ButtonGroup variant="contained" sx={{ mb: 4 }}>
        <Button
          color={userType === "student" ? "primary" : "inherit"}
          onClick={() => setUserType("student")}
        >
          👨‍🎓 الطالب
        </Button>
        <Button
          color={userType === "instructor" ? "primary" : "inherit"}
          onClick={() => setUserType("instructor")}
        >
          👨‍🏫 المدرب
        </Button>
        <Button
          color={userType === "admin" ? "primary" : "inherit"}
          onClick={() => setUserType("admin")}
        >
          👨‍💼 المسئول
        </Button>
      </ButtonGroup>

      <Box>
        {userType === "student" && renderStudentStats()}
        {userType === "instructor" && renderInstructorStats()}
        {userType === "admin" && renderAdminStats()}
      </Box>
    </Box>
  );
};

export default TestNow;
