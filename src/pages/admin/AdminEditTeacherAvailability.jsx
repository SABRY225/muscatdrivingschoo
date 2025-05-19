import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../components/admin/AdminLayout";
import TeacherLayout from "../../components/admin/TeacherLayout";
import { Box, Button, Divider, InputLabel, Typography ,Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { useTeacher } from "../../hooks/useTeacher";
import SelectTimeZone from "../../components/reusableUi/SelectTimeZone";
import AvailablitlyDay from "../../components/teacher/AvailablitlyDay";
import StepperButtons from "../../components/reusableUi/StepperButtons";
import days from "../../data/days";

const AdminEditTeacherAvailability = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const { token } = useSelector((state) => state.admin);

  const { data, isLoading } = useTeacher(teacherId);
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  const [load, setLoad] = useState(false);
  const [errorId, setErrorID] = useState(0);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isLoading) {
      setSelectedTimezone(data.data?.timeZone);
      setSelectedTimes(data?.data?.TeacherDays);
      for (const day of data?.data?.TeacherDays) {
        setSelectedDays((back) => [...back, day.DayId]);
      }
      setSelectedDays((back) => [...new Set(back)]);
    }
  }, [data]);

  const handleToggle = (value) => () => {
    const currentIndex = selectedDays.findIndex(
      (selectedDay) => value.id === selectedDay
    );
    const newChecked = [...selectedDays];

    if (currentIndex === -1) {
      newChecked.push(value.id);
    } else {
      newChecked.splice(currentIndex, 1);
      const newSelectedTimes = selectedTimes.filter(
        (time) => time.DayId !== value.id
      );
      setSelectedTimes(newSelectedTimes);
    }
    setSelectedDays(newChecked);
  };

  async function onSubmit() {
    let i = 0;
    for (let index = 0; index < selectedDays.length; index++) {
      const d = selectedDays[index];
      for (i = 0; i < selectedTimes.length; i++) {
        if (d === selectedTimes[i].DayId) break;
      }
      if (i >= selectedTimes.length) {
        setErrorID(d);
        closeSnackbar();
        enqueueSnackbar(t("add_time_to_proceed"), {
          variant: "error",
          autoHideDuration: 1500,
        });
        return;
      }
    }
    setErrorID(0);
    const days = selectedTimes.map((day) => {
      return { ...day, TeacherId: teacherId };
    });
    try {
      setLoad(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/edit/teacher/availability/${teacherId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            teacherDayes: days,
            timeZone: selectedTimezone,
          }),
        }
      );
      const data = await response.json();
      closeSnackbar();
      enqueueSnackbar(t("update_success"), {
        variant: "success",
        autoHideDuration: 1000,
      });
      navigate("/admin/edit/teacher/description/" + teacherId);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AdminLayout>
      <Box sx={{marginTop:"-100px"}}>
      <TeacherLayout active={5} title={t("availability")}>
      <Paper sx={{ width: "100%", padding: "20px" }}>
        <Box>
          <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
            {t("timezone")}
          </InputLabel>
          <SelectTimeZone
            selectedTimezone={selectedTimezone}
            setSelectedTimezone={setSelectedTimezone}
          />
          {days.map((day, index) => {
            return (
              <Box key={index + "1a"}>
                <AvailablitlyDay
                  day={day}
                  setSelectedDays={setSelectedDays}
                  selectedDays={selectedDays}
                  handleToggle={handleToggle}
                  setSelectedTimes={setSelectedTimes}
                  selectedTimes={selectedTimes}
                />
                {day.id === errorId && (
                  <Typography
                    color="error"
                    role="alert"
                    sx={{
                      fontSize: "13px",
                      marginTop: "-15px",
                      marginBottom: "15px",
                      marginX: "15px",
                    }}
                  >
                    {t("add_time_to_proceed")}
                  </Typography>
                )}
                <Divider />
              </Box>
            );
          })}

          <Box sx={{ display: "flex", gap: "12px" }}>
            <StepperButtons
              onSubmit={onSubmit}
              load={load}
              skipLink="description"
            />
            <Button
              sx={{ textTransform: "capitalize", marginTop: "40px" }}
              variant="outlined"
              onClick={() =>
                navigate("/admin/edit/teacher/description/" + teacherId)
              }
            >
              {t("skip")}
            </Button>
          </Box>
        </Box>
        </Paper>
      </TeacherLayout>
      </Box>
    </AdminLayout>
  );
};

export default AdminEditTeacherAvailability;
