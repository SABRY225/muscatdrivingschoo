// 📁 src/components/Dashboard/AdminStats.jsx
import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Card,
  CardActionArea
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer
} from "recharts";
import GroupIcon from "@mui/icons-material/Group";
import SchoolIcon from "@mui/icons-material/School";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import QuizIcon from "@mui/icons-material/Quiz";
import HourglassEmptyIcon from "@mui/icons-material/HourglassEmpty";
import RecordVoiceOverIcon from "@mui/icons-material/RecordVoiceOver";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import FeedbackIcon from "@mui/icons-material/Feedback";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useTranslation } from "react-i18next";
import { useStatsAdmins } from "../../hooks/useAdminStats";
import AdminLayout from "../../components/admin/AdminLayout";
import { Link } from "react-router-dom";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC"];

const StatCard = ({ label, value, icon: Icon, to = "#", isWarning = false }) => (
  <Card
    component={Link}
    to={to}
    sx={{
      minWidth: 250,
      flex: "1 1 250px",
      boxShadow: 3,
      textDecoration: "none",
      transition: "transform 0.3s ease, box-shadow 0.3s ease",
      "&:hover": {
        transform: "scale(1.03)",
        boxShadow: 6,
      },
    }}
  >
    <CardActionArea sx={{ p: 2, textAlign: "center" }}>
      {Icon && <Icon sx={{ fontSize: 30, color: isWarning ? "#d32f2f" : "#1976d2", mb: 1 }} />}
      <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
      <Typography
        variant="h6"
        fontWeight="bold"
        sx={{ color: isWarning ? "#d32f2f" : "inherit" }}
      >
        {value}
      </Typography>
    </CardActionArea>
  </Card>
);
const warningKeys = [
  "studentExchangeNumWaiting",
  "teacherExchangeNumWaiting",
  "totalStudentsRequests",
  "adsNumWaiting",
  "packageWaiting",
  "teacherLectureWaiting",
  "discountsNumWaiting",
  "careerNumWaiting",
  "testsWaiting",
  "lessonWaiting",
  "parentStudent",
  "plaintesWaiting"
];


const AdminStats = () => {
  const { t } = useTranslation();
  const { data } = useStatsAdmins();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    if (data) setStats(data);
  }, [data]);

  const statItems = [
  { key: "totalUsers", icon: GroupIcon },
  { key: "totalStudents", icon: SchoolIcon, to: "/admin/students" },
  { key: "studentOnline", icon: PersonOutlineIcon, to: "/admin/students" },
  { key: "studentExchangeNumWaiting", icon: SwapHorizIcon, to: "/admin/exchange-requests" },
  { key: "totalInstructors", icon: SupervisorAccountIcon, to: "/admin/teachers" },
  { key: "Parentstructors", icon: SupervisorAccountIcon, },
  { key: "teacherOnline", icon: PersonOutlineIcon, to: "/admin/teachers" },
  { key: "teacherExchangeNumWaiting", icon: SwapHorizIcon, to: "/admin/exchange-requests" },
  { key: "totalStudentsRequests", icon: PendingActionsIcon, to: "/admin/teachers_approve" },
  { key: "sessionsNumber", icon: AssignmentTurnedInIcon, to: "/admin/booked-lessons" },
  { key: "adsNumWaiting", icon: PendingActionsIcon, to: "/admin/ads?status=pending" },
  { key: "adsNum", icon: PlaylistAddCheckIcon, to: "/admin/ads" },
  { key: "packageOnline", icon: CardGiftcardIcon, to: "/admin/package" },
  { key: "packageWaiting", icon: PendingActionsIcon, to: "/admin/package" },
  { key: "lectureOline", icon: SchoolIcon, to: "/admin/lectures" },
  { key: "teacherLectureWaiting", icon: PendingActionsIcon, to: "/admin/lectures" },
  { key: "discountsOnline", icon: LocalOfferIcon, to: "/admin/discounts" },
  { key: "discountsNumWaiting", icon: PendingActionsIcon, to: "/admin/discounts" },
  { key: "careerNumWaiting", icon: PendingActionsIcon, to: "/admin/career" },
  { key: "careerOnline", icon: WorkOutlineIcon, to: "/admin/career" },
  { key: "testsOnline", icon: QuizIcon, to: "/admin/tests" },
  { key: "testsWaiting", icon: HourglassEmptyIcon, to: "/admin/tests" },
  { key: "lessonWaiting", icon: HourglassEmptyIcon, to: "/admin/request-lesson" },
  { key: "lessonOnline", icon: AssignmentTurnedInIcon, to: "/admin/request-lesson" },
  { key: "parentStudent", icon: RecordVoiceOverIcon, to: "/admin/parent-student" },
  { key: "plaintesWaiting", icon: ReportProblemIcon, to: "/admin/complaints" },
  { key: "plaintes", icon: FeedbackIcon, to: "/admin/complaints" },
  { key: "lecturePay", icon: SchoolIcon },
  { key: "packagePay", icon: CardGiftcardIcon },
  { key: "testPay", icon: QuizIcon },
  { key: "discountPay", icon: LocalOfferIcon }
];

  return (
    <AdminLayout>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          justifyContent: "center",
          alignItems: "flex-start",
          mb: 4
        }}
      >
        <Box sx={{ width: "100%", maxWidth: "500px", flex: "1 1 400px" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>{t("bookingTypes")}</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats?.bookingsByType}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {stats?.bookingsByType?.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <RechartsTooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ width: "100%", flex: "1 1 600px" }}>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>{t("monthlyRevenue")}</Typography>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats?.revenuePerMonth}>
              <XAxis dataKey="month" />
              <YAxis />
              <RechartsTooltip />
              <Bar dataKey="totalAmount" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </Box>

  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
  {statItems.map((item) => {
    const value = stats?.[item.key] || 0;
    const isWarning = warningKeys.includes(item.key) && value > 0;

    return (
      <StatCard
        key={item.key}
        label={t(item.key)}
        value={value}
        icon={item.icon}
        to={item.to || "#"}
        isWarning={isWarning}
      />
    );
  })}
  </Box>

    </AdminLayout>
  );
};

export default AdminStats;
