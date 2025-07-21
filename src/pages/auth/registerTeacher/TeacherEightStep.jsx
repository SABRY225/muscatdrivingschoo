import { Divider, Box, InputLabel, Typography , Paper, Container, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import HeaderSteps from "../../../components/auth/HeaderSteps";
import Navbar from "../../../components/Navbar";
import SelectTimeZone from "../../../components/reusableUi/SelectTimeZone";
import days from "../../../data/days";
import AvailablitlyDay from "../../../components/teacher/AvailablitlyDay";

function TeacherEightStep() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const teacher = JSON.parse(localStorage.getItem("teacher"));
  const [selectedTimes, setSelectedTimes] = useState([]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [selectedTimezone, setSelectedTimezone] = useState(null);
  const [load, setLoad] = useState(false);
  const [errorId, setErrorID] = useState(0);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

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
    if (!selectedTimezone) {
      enqueueSnackbar(t("please_select_timezone"), {
        variant: "warning",
        autoHideDuration: 1500,
      });
      return;
    }

    if (selectedDays.length === 0) {
      enqueueSnackbar(t("please_select_days"), {
        variant: "warning",
        autoHideDuration: 1500,
      });
      return;
    }

    for (let index = 0; index < selectedDays.length; index++) {
      const d = selectedDays[index];
      const hasTime = selectedTimes.some((time) => time.DayId === d);
      if (!hasTime) {
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
      return { ...day, TeacherId: teacher.id };
    });
    try {
      setLoad(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/availability/${teacher.id}`,
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
      navigate("/teacherRegister/step9");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Navbar>
      <Container sx={{ marginTop: "110px", marginBottom: "2rem" }}>
        <HeaderSteps step={8} title={t("Working hours")} steps={9} />
        <Box>
          <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
            {t("timezone")}
          </InputLabel>
          <SelectTimeZone
            selectedTimezone={selectedTimezone}
            setSelectedTimezone={setSelectedTimezone}
          />
          {days.map((day, index) => (
            <React.Fragment key={index}>
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
            </React.Fragment>
          ))}
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={load}
            sx={{ textTransform: "capitalize", marginTop: "1rem" }}
          >
            {load ? t("loading") : t("next") || "التالي"}
          </Button>
        </Box>
      </Container>
    </Navbar>
  );
}

export default TeacherEightStep;
