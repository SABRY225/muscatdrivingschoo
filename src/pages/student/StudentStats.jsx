// 📁 src/components/Dashboard/StudentStats.jsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardContent,
  CardActionArea
} from "@mui/material";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  LineChart, Line, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer
} from "recharts";
import ClassIcon from "@mui/icons-material/Class"; // Booked Lessons, Packages
import HourglassTopIcon from "@mui/icons-material/HourglassTop"; // Pending
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline"; // Approved
import CancelIcon from "@mui/icons-material/Cancel"; // Canceled
import DoneAllIcon from "@mui/icons-material/DoneAll"; // Completed
import EventAvailableIcon from "@mui/icons-material/EventAvailable"; // Lessons This Week
import SchoolIcon from "@mui/icons-material/School"; // Lectures
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard"; // Packages
import LocalOfferIcon from "@mui/icons-material/LocalOffer"; // Discounts
import QuizIcon from "@mui/icons-material/Quiz"; // Tests
import PeopleIcon from "@mui/icons-material/People"; // Instructors
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"; // Wallet
import { useTranslation } from "react-i18next";
import StudentLayout from "../../components/student/StudentLayout";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useStatsStudent } from "../../hooks/useStatsStudent";
import { convertCurrency } from "../../utils/convertCurrency";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC"];

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

const StudentStats = () => {
  const { t, i18n } = useTranslation();
  const { student } = useSelector((state) => state.student);
  const { data } = useStatsStudent(student.id);
  const [stats, setStats] = useState(null);
    const {currency} = useSelector((state)=>state.currency)

  useEffect(() => {
    if (data) setStats(data);
  }, [data]);
    const [convertedAmount, setConvertedAmount] = React.useState(null);
  
 React.useEffect(() => {
    const fetchCurrency=async()=>{
          const result = await convertCurrency(data?.data?.wallet,"OMR",currency);
          setConvertedAmount(result)
    }
    fetchCurrency();
 },[currency])
  return (
    <StudentLayout>
      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        <Box sx={{ flex: "1 1 100%" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>{t("lessonsTimeline")}</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats?.lessonsChart}>
              <CartesianGrid stroke="#eee" />
              <XAxis dataKey="month" style={{ fontSize: 13 }} />
              <YAxis />
              <RechartsTooltip />
              <Line type="monotone" dataKey="Lessons" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ flex: "1 1 100%" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>{t("lessonsByInstructor")}</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.lessonsByInstructor}>
              <XAxis dataKey="firstName" style={{ fontSize: 13 }} />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="sessionsCount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ flex: "1 1 100%" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>{t("bookingTypes")}</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats?.bookingsByType}
                cx="50%" cy="50%" outerRadius={100}
                dataKey="value" nameKey="name"
                label
              >
                {stats?.bookingsByType.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>

<Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 4, justifyContent: "center" }}>
  <StatCard label={t("Total Lessons")} value={stats?.sessionsNumber} icon={ClassIcon} to="/student/lessons" />
  <StatCard label={t("Pending Lesson Requests")} value={stats?.lessonWaiting} icon={HourglassTopIcon} isWarning to="/student/request-lesson" />
  <StatCard label={t("Approved Lesson Requests")} value={stats?.lessonOnline} icon={CheckCircleOutlineIcon} to="/student/request-lesson" />
  <StatCard label={t("Canceled Lesson Requests")} value={stats?.lessonCanceled} icon={CancelIcon} to="/student/request-lesson" />
  <StatCard label={t("Completed Lessons")} value={stats?.completedLessons} icon={DoneAllIcon} to="/student/lessons" />
  <StatCard label={t("Lessons This Week")} value={stats?.sessionsThisWeek} icon={EventAvailableIcon} isWarning to="/student/lessons" />
  <StatCard label={t("Lectures Attended")} value={stats?.lecturePay} icon={SchoolIcon} to="/student/lectures" />
  <StatCard label={t("Booked Packages")} value={stats?.packagePay} icon={CardGiftcardIcon} to="/student/package" />
  <StatCard label={t("Discounts")} value={stats?.discountPay} icon={LocalOfferIcon} to="/student/discount" />
  <StatCard label={t("Tests")} value={stats?.testPay} icon={QuizIcon} to="/student/exam" />
  {/* <StatCard label={t("My Instructors")} value={stats?.teachers} icon={PeopleIcon} to="/student/teachers" /> */}
  <StatCard label={t("My Wallet")} value={`${convertedAmount} ${t(currency)}`} icon={AccountBalanceWalletIcon} to="/student/credit" />
</Box>

      </Box>
    </StudentLayout>
  );
};

export default StudentStats;
