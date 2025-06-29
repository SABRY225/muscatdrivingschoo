// 📁 src/components/Dashboard/AdminStats.jsx
import React from "react";
import { Typography, Box, Card } from "@mui/material";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip
} from "recharts";
import SchoolIcon from "@mui/icons-material/School";
import ClassIcon from "@mui/icons-material/Class";
import AssignmentIcon from "@mui/icons-material/Assignment";
import GroupIcon from "@mui/icons-material/Group";
import { useTranslation } from "react-i18next";
import { stats } from "../../data/statistics";
import AdminLayout from "../../components/admin/AdminLayout";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA66CC"];

const StatCard = ({ label, value, icon: Icon }) => (
  <Card sx={{ minWidth: 230, p: 2, textAlign: "center", boxShadow: 3 }}>
    {Icon && <Icon sx={{ fontSize: 30, color: "#1976d2", mb: 1 }} />}
    <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
    <Typography variant="h6" fontWeight="bold">{value}</Typography>
  </Card>
);

const AdminStats = () => {
  const { t } = useTranslation();
  const data = stats.admin;

  return (
    <AdminLayout>
     <Box sx={{ display: "flex", gap: 4, flexWrap: "wrap", alignItems: "center" , mb: 4 }}>
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 1 }}>{t("bookingTypes")}</Typography>
          <PieChart width={400} height={300}>
            <Pie
              data={data.bookingsByType}
              cx="50%" cy="50%" outerRadius={100}
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
          <Typography variant="subtitle1" sx={{ mb: 1 }}>{t("monthlyRevenue")}</Typography>
          <BarChart width={750} height={300} data={data.revenuePerMonth}>
            <XAxis dataKey="month" />
            <YAxis />
            <RechartsTooltip />
            <Bar dataKey="revenue" fill="#00C49F" />
          </BarChart>
        </Box>
      </Box>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap"}}>
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
    </AdminLayout>
  );
};

export default AdminStats;
