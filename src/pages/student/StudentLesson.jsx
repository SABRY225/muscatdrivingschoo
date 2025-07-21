import React, { useState, useEffect } from 'react';
import {
  Paper, Typography, Box, Button, Avatar, Divider, Stack
} from '@mui/material';
import StudentLayout from '../../components/student/StudentLayout';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useRequestLession } from '../../hooks/useRequestLession';
import Loading from '../../components/Loading';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useLevels } from '../../hooks/useLevels';
import Cookies from "js-cookie";

const LessonItem = ({ item, t, onPay, onDelete }) => {
  const { data } = useLevels();
    const lang = Cookies.get("i18next") || "en";
  
const [typeLesson, setTypeLesson] = useState(null);

useEffect(() => {
  if (data?.data && item?.typeLesson) {
    const found = data?.data?.find(level => level.id == item.typeLesson);
    setTypeLesson(found);
  }
}, [item?.typeLesson]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#f4d03f';
      case 'approved': return '#2ecc71';
      case 'canceled': return '#e74c3c';
      default: return '#333';
    }
  };
  console.log(item);
function convertTo12Hour(timeStr) {
  const [hourStr, minute] = timeStr.split(':');
  let hour = parseInt(hourStr, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12; // لو 0 خليه 12
  return `${hour}:${minute} ${ampm}`;
}


  return (
    <Box
      sx={{
        border: '1px solid #ddd',
        borderRadius: 2,
        padding: 2,
        mb: 2,
        backgroundColor: '#fff',
        boxShadow: 1,
        transition: '0.3s',
        '&:hover': { boxShadow: 4 }
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center" mb={1}>
        <Avatar
          src={item.teacher?.image ? `${process.env.REACT_APP_API_KEY}images/${item.teacher?.image}` : '/logo.png'}
          sx={{ width: 60, height: 60 }}
        />
        <Typography fontWeight="bold" fontSize="18px">
          {item.teacher?.firstName} {item.teacher?.lastName}
        </Typography>
      </Stack>

      <Divider sx={{ my: 1 }} />

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <Info label={t("day")} value={dayjs(item.date).format('YYYY-MM-DD')} />
        <Info label={t("Time")} value={convertTo12Hour(item?.time)} />
        <Info label={t("lessonType")} value={lang==="ar"?typeLesson?.titleAR:typeLesson?.titleEN} />
        <Info label={t("Place Lesson")} value={
          item?.place === "online"
            ? t("online")
            : item?.place === "teacher"
              ? t("teacher location")
              : item?.place === "student"
                ? t("student location")
                : item?.place
        } />
        {item.place==="teacher"&&<Info
          label={t("city teacher")}
          value={`${t(item?.teacher?.city?.toLowerCase())} / ${t(item?.teacher?.country?.toLowerCase())}`}
        />}
        
        <Info label={t("Session number")} value={item.period} />
        <Info label={t("price")} value={`${item.price} ${t(item.currency)}`} />
        <Info
          label={t("status")}
          value={<span style={{ color: getStatusColor(item.status) }}>{t(item.status)}</span>}
        />
      </Box>

      <Stack direction="row" spacing={2}>
        {item?.status === 'approved' && item?.paymentLink && (
          <Button variant="contained" color="warning" onClick={() => onPay(item.id)}>
            {t("Pay now")}
          </Button>
        )}
        {item?.status === 'approved' && !item?.paymentLink && (
          <Typography color="error" fontWeight="bold">
            {t("Sorry, I was late for the payment. You can book again.")}
          </Typography>
        )}
        <Button variant="outlined" color="error" onClick={() => onDelete(item.id)}>
          {t("delete")}
        </Button>
      </Stack>
    </Box>
  );
};

const Info = ({ label, value }) => (
  <Box sx={{ minWidth: 160 }}>
    <Typography variant="body2" fontWeight="bold">{label}:</Typography>
    <Typography variant="body1">{value}</Typography>
  </Box>
);

export default function StudentLesson() {
  const { t } = useTranslation();
  const { student } = useSelector(state => state.student);
  const { data, isLoading, refetch } = useRequestLession(student?.id);
  const navigate = useNavigate();
  const [lessons, setLessons] = useState([]);

  useEffect(() => {
    if (data?.data) {
      setLessons(data.data);
    }
  }, [data]);

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 3000);
    return () => clearInterval(interval);
  }, [refetch]);

  const handlePayment = (id) => {
    navigate(`/student/PayLesson/${id}`);
  };

  const handleDelete = async (id) => {
    const previousLessons = [...lessons];
    setLessons(prev => prev.filter(item => item.id !== id));
    try {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/lesson/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error(`Error: ${response.status}`);
    } catch (error) {
      console.error("Error deleting lesson:", error);
      setLessons(previousLessons);
    }
  };

  return (
    <StudentLayout>
      <Paper sx={{ padding: "20px" }}>
        <Typography sx={{ fontSize: "24px", fontWeight: "600", marginBottom: "30px" }}>
          {t('Lesson booking requests')}
        </Typography>

        {!isLoading ? (
          lessons.length > 0 ? (
            lessons.map(item => (
              <LessonItem
                key={item.id}
                item={item}
                t={t}
                onPay={handlePayment}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <Typography textAlign="center">{t("No requests were found to book lessons.")}</Typography>
          )
        ) : (
          <Loading />
        )}
      </Paper>
    </StudentLayout>
  );
}
