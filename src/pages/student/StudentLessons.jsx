import { Box, Button, Paper, Tab } from "@mui/material";
import React from "react";
import StudentLayout from "../../components/student/StudentLayout";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { useTranslation } from "react-i18next";
import BookedLesson from "../../components/student/BookedLesson";
import { useAllLessons } from "../../hooks/useAllLessons";
import { usePastLessons } from "../../hooks/usePastLessons";
import { useComingLessons } from "../../hooks/useComingLessons";
import { useSelector } from "react-redux";
import VideoCallIcon from "@mui/icons-material/VideoCall";

export default function StudentLessons() {
  const { t } = useTranslation();
  const [value, setValue] = React.useState("1");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  
  const { student } = useSelector((state) => state.student);

  const allLessons = useAllLessons(student?.id);
  const comingLessons = useComingLessons(student?.id);
  const pastLessons = usePastLessons(student?.id);

  return (
<StudentLayout>
  <Paper sx={{ padding: "20px" }}>
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
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label={t("alllessons")} value="1" />
              <Tab label={t("pastlessons")} value="2" />
              <Tab label={t("cominglessons")} value="3" />
            </TabList>
          </Box>
          <TabPanel value="1">
            {!allLessons.isLoading &&
              allLessons.data?.data.length > 0 &&
              allLessons.data.data.map((lesson, index) => {
                return (
                  <BookedLesson
                    image={lesson.Teacher?.image}
                    name={
                      lesson?.Teacher?.firstName +
                      " " +
                      lesson?.Teacher?.lastName
                    }
                    parentTeacher={lesson?.Teacher}
                    parentStudent={student}
                    date={lesson?.date}
                    type={lesson?.type}
                    period={lesson?.period}
                    isStudent={true}
                    studentAccept={lesson?.studentAccept}
                    teacherAccept={lesson?.teacherAccept}
                    sessionId={lesson?.id}
                    startedAt={lesson?.startedAt}
                    endedAt={lesson?.endedAt}
                    key={index + "zw1"}
                  />
                );
              })}
          </TabPanel>
          <TabPanel value="2">
            {!pastLessons.isLoading &&
              pastLessons.data?.data.length > 0 &&
              pastLessons.data.data.map((lesson, index) => {
                return (
                  <BookedLesson
                    image={lesson.Teacher?.image}
                    name={
                      lesson?.Teacher?.firstName +
                      " " +
                      lesson?.Teacher?.lastName
                    }
                    date={lesson?.date}
                    type={lesson?.type}
                    period={lesson?.period}
                    isStudent={true}
                    studentAccept={lesson?.studentAccept}
                    teacherAccept={lesson?.teacherAccept}
                    sessionId={lesson?.id}
                    startedAt={lesson?.startedAt}
                    endedAt={lesson?.endedAt}
                    key={index + "zw12"}
                  />
                );
              })}
          </TabPanel>
          <TabPanel value="3">
            {!comingLessons.isLoading &&
              comingLessons.data?.data.length > 0 &&
              comingLessons.data.data.map((lesson, index) => {
                return (
                  <BookedLesson
                    image={lesson.Teacher?.image}
                    name={
                      lesson?.Teacher?.firstName +
                      " " +
                      lesson?.Teacher?.lastName
                    }
                    date={lesson?.date}
                    type={lesson?.type}
                    period={lesson?.period}
                    isStudent={true}
                    studentAccept={lesson?.studentAccept}
                    teacherAccept={lesson?.teacherAccept}
                    sessionId={lesson?.id}
                    startedAt={lesson?.startedAt}
                    endedAt={lesson?.endedAt}
                    key={index + "zw13"}
                  />
                );
              })}
          </TabPanel>
        </TabContext>
  </Paper>
</StudentLayout>
  );
}
