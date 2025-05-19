import { Avatar, Box, Typography, Button, Divider } from "@mui/material";
import React, { useState } from "react";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ApartmentIcon from "@mui/icons-material/Apartment";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

export default function BookedLessonStudent({
  image,
  name,
  date,
  type,
  period,
  isStudent,
  studentAccept,
  teacherAccept,
  sessionId,
  parentTeacher,
  parentStudent,
  startedAt,
  endedAt,
}) {
  const { t } = useTranslation();
  const teacher = useSelector((state) => state.teacher);
  const student = useSelector((state) => state.student);
  const [edited, setEdited] = useState(false);
  const navigate = useNavigate();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const [showAttend, setShowAttend] = useState(
    (isStudent && !studentAccept) || (!isStudent && !teacherAccept)
  );
  async function acceptLesson() {
    try {
      if (isStudent) {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/student/acceptLesson/${student?.student.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: student?.token,
            },
            body: JSON.stringify({ SessionId: sessionId }),
          }
        );
        await addDoc(collection(db, "Notifications"), {
          titleAR: `${parentStudent?.name} قد أكد حضور الحصة التدريبية `,
          titleEn: `${parentStudent?.name} has confirmed the training session attendance`,
          TeacherId: `${parentTeacher?.id}`,
          seen: false,
          date: Date.now(),
        });
      } else {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/teacher/acceptLesson/${teacher?.teacher.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: teacher?.token,
            },
            body: JSON.stringify({ SessionId: sessionId }),
          }
        );
        await addDoc(collection(db, "Notifications"), {
          titleAR: `${parentTeacher?.firstName} ${parentTeacher?.lastName} قد أكد حضور الحصة التدريبية `,
          titleEn: `${parentTeacher?.firstName} ${parentTeacher?.lastName} has confirmed the training session attendance`,
          StudentId: `${parentStudent?.id}`,
          seen: false,
          date: Date.now(),
        });
      }
      window.location.reload();
      setShowAttend(false);
    } catch (err) {
      console.log(err);
    }
  }
  const handleLessonStartAndEnd = async () => {
    try {
      let response;
      if (isStudent) {
        response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/student/startLesson/${student?.student.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: student?.token,
            },
            body: JSON.stringify({ SessionId: sessionId }),
          }
        );
        await addDoc(collection(db, "Notifications"), {
          titleAR: ` قد بدأ الحصة التدريبية ${parentStudent?.name}`,
          titleEn: `${parentStudent?.name} has started the training session`,
          TeacherId: `${parentTeacher?.id}`,
          seen: false,
          date: Date.now(),
        });
      } else {
        response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/teacher/endLesson/${teacher?.teacher.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: teacher?.token,
            },
            body: JSON.stringify({ SessionId: sessionId }),
          }
        );
        await addDoc(collection(db, "Notifications"), {
          titleAR: `${parentTeacher?.firstName} ${parentTeacher?.lastName} قد أنهى الحصة التدريبية `,
          titleEn: `${parentTeacher?.firstName} ${parentTeacher?.lastName} has ended the training session`,
          StudentId: `${parentStudent?.id}`,
          seen: false,
          date: Date.now(),
        });
      }
      if (response.ok) {
        window.location.reload();
        closeSnackbar();
        enqueueSnackbar(t("update_success"), {
          variant: "success",
          autoHideDuration: 1000,
        });
        setEdited(true);
      } else {
        closeSnackbar();
        enqueueSnackbar("something went wrong please try later", {
          variant: "error",
          autoHideDuration: 1000,
        });
      }
    } catch (err) {
      closeSnackbar();
      enqueueSnackbar("something went wrong please try later", {
        variant: "error",
        autoHideDuration: 1000,
      });
      console.log(err);
    }
  };
  const handleCreateMessage = async () => {
    const q = query(
      collection(db, "chats"),
      where("studentId", "==", `${parentStudent?.id}`),
      where("teacherId", "==", `${parentTeacher?.id}`)
    );
    const res = await getDocs(q);
    if (res.empty) {
      const time = Timestamp.now();
      await addDoc(collection(db, "chats"), {
        messages: [],
        teacherId: `${parentTeacher?.id}`,
        studentId: `${parentStudent?.id}`,
        studentName: parentStudent?.name,
        studentImage: parentStudent?.image,
        teacherName: `${parentTeacher?.firstName} ${parentTeacher?.lastName}`,
        teacherImage: parentTeacher?.image,
        lastmessage: time,
      });
    }
    if (isStudent) navigate(`/student/messages`);
    else navigate(`/teacher/messages`);
  };

  return (
    <>
      <Box sx={{ marginY: "15px" }}>
        <Box sx={{ display: "flex", columnGap: "12px" }}>
          <Avatar
            sx={{ width: "85px", height: "85px" }}
            src={`${process.env.REACT_APP_API_KEY}images/${image}`}
          />
          <Box>
            <Typography sx={{ fontWeight: "600" }}>{name}</Typography>
            <Box
              sx={{
                marginY: "8px",
                display: "flex",
                alignItems: "center",
                columnGap: "6px",
              }}
            >
              <DateRangeIcon sx={{ fontSize: "16px", color: "#9D9D9D" }} />
              <Typography sx={{ fontSize: "13px", color: "#9D9D9D" }}>
                {new Date(date).toLocaleString()}
              </Typography>
            </Box>
            <Box
              sx={{
                marginY: "8px",
                display: "flex",
                alignItems: "center",
                columnGap: "6px",
              }}
            >
              <ApartmentIcon sx={{ fontSize: "16px", color: "#9D9D9D" }} />
              <Typography sx={{ fontSize: "13px", color: "#9D9D9D" }}>
                {t(type + "_place")}
              </Typography>
            </Box>
            <Box
              sx={{
                marginY: "8px",
                display: "flex",
                alignItems: "center",
                columnGap: "6px",
              }}
            >
              <AccessTimeIcon sx={{ fontSize: "16px", color: "#9D9D9D" }} />
              <Typography sx={{ fontSize: "13px", color: "#9D9D9D" }}>
                {period} {t("lesson_hour")}
              </Typography>
            </Box>
            
          </Box>
        </Box>
      </Box>
      <Divider />
    </>
  );
}
