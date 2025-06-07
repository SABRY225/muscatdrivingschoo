import React from "react";
import Navbar from "../../components/Navbar";
import { Box, Button, Container, Paper } from "@mui/material";
import BookedLesson from "../../components/student/BookedLesson";
import { useTeacherSessions } from "../../hooks/useTeacherSessions";
import Loading from "../../components/Loading";
import { useSelector } from "react-redux";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { useTranslation } from "react-i18next";
import TeacherLayout from "../../components/teacher/TeacherLayout";

export default function TeacherSessions() {
  const { teacher, token }    = useSelector((state) => state.teacher);
  const { data, isLoading }   = useTeacherSessions(teacher.id, token);
  const { t } = useTranslation();
  return (
    <Navbar>
      <TeacherLayout>
      <Box sx={{ marginTop: "80px", marginBottom: "80px" }}>
        <Button
          href="http://meet.google.com/new"
          target="_blank"
          variant="contained"
          color="success"
          size="medium"
          endIcon={
            <VideoCallIcon sx={{ marginRight: "16px", fontSize: "large" }} />
          }
        >
          {t("start_lesson_meet")}
        </Button>
        {!isLoading ? (
          <Paper sx={{ marginY: "20px", padding: "40px 20px 20px" }}>
            {data?.data?.length > 0 &&
              data.data.map((lesson, index) => {
                return (
                  <BookedLesson
                    image={lesson?.Student?.image}
                    name={lesson?.Student.name}
                    parentTeacher={teacher}
                    parentStudent={lesson?.Student}
                    date={lesson?.date}
                    type={lesson?.type}
                    period={lesson?.period}
                    isStudent={false}
                    studentAccept={lesson?.studentAccept}
                    teacherAccept={lesson?.teacherAccept}
                    sessionId={lesson?.id}
                    startedAt={lesson?.startedAt}
                    endedAt={lesson?.endedAt}
                    key={index + "zw3"}
                  />
                );
              })}
          </Paper>
        ) : (
          <Loading />
        )}
      </Box>
      </TeacherLayout>

    </Navbar>
  );
}
