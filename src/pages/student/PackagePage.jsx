import React from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Button,
  Tab,
  DialogActions,
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import BookedLesson from '../../components/student/BookedLesson';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import VideoCallIcon from "@mui/icons-material/VideoCall";
import StudentLayout from '../../components/student/StudentLayout';
import Cookies from "js-cookie";
import { Link, useNavigate } from 'react-router-dom';
import { useAllLessonsPackage } from '../../hooks/useAllLessonsPackage';
import { useComingLessonsPackage } from '../../hooks/useComingLessonsPackage';
import { usePastLessonsPackage } from '../../hooks/usePastLessonsPackage';

const PackagePage = () => {
      const { t } = useTranslation();
      const [value, setValue] = React.useState("1");
      const handleChange = (event, newValue) => {
        setValue(newValue);
      };
  const navigate = useNavigate();
      
      const { student } = useSelector((state) => state.student);
  const packageData = JSON.parse(localStorage.getItem("package"))
    
      const allLessons = useAllLessonsPackage(student?.id,packageData?.id);
      const comingLessons = useComingLessonsPackage(student?.id,packageData?.id);
      const pastLessons = usePastLessonsPackage(student?.id,packageData?.id);

  const lang = Cookies.get("i18next") || "en";
  const convertDate = (dateString) => new Date(dateString).toISOString().split('T')[0];

  return (
    <StudentLayout>
    <Box sx={{ flexGrow: 1, px: 4}}>
      <Grid container spacing={4}>
        {/* قسم بيانات الباقة */}
        <Grid item xs={12} >
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              { (lang == "ar") ? packageData.titleAR + " " : packageData.titleEN}
            </Typography>
            <Typography variant="body1"><strong>{t("amount")} : </strong> {packageData.price} {t(packageData.currency)}</Typography>
            <Typography variant="body1"><strong>{t("Description")} : </strong> {lang === "ar" ? packageData?.descriptionAr : packageData?.descriptionEn}</Typography>
            <Typography variant="body1"><strong>{t("level")} : </strong> {lang === "ar" ? packageData?.level?.titleAR : packageData?.level?.titleEN}</Typography>
            <Typography variant="body1"><strong>{t("classes")} : </strong> {packageData?.class?(lang === "ar" ? packageData?.class?.titleAR : packageData?.class?.titleEN):""}</Typography>
            {/* <Typography variant="body1"><strong>{t("semester")} : </strong> {t(packageData?.semester)}</Typography> */}
            <Typography variant="body1"><strong>{t("studyCurriculum")} : </strong> {packageData?.curriculums?(lang === "ar" ? packageData?.curriculums?.titleAR : packageData?.curriculums?.titleEN):""}</Typography>
            {packageData?.docs && (<Typography variant="body1"><strong>{t("Package documents")} : </strong> <Button
                    variant="contained"
                    component={Link}
                    to={`${process.env.REACT_APP_API_KEY}images/${packageData?.docs}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("Package documents")}
                  </Button>
            </Typography>)}

            {packageData?.linkPackage && (<Typography variant="body1"><strong>{t("Link Package")} : </strong> 
            <Button
                    variant="contained"
                    component={Link}
                    to={packageData?.linkPackage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("Link Package")}
                  </Button>
            </Typography>)}
            <Typography variant="body1"><strong>{t("sharesCount")} : </strong> {packageData?.numTotalLesson} {t("shares")}</Typography>
            <Typography variant="body1"><strong>{t("sharesCountInWeek")} : </strong> {packageData?.numWeekLesson} {t("shares")}</Typography>
            <Typography variant="body1"><strong>{t("sharePrice")} : </strong> {(packageData?.price)/packageData?.numTotalLesson} </Typography>
            <Typography variant="body1"><strong>{t("sharesTotal")} : </strong> {packageData?.price}</Typography>
            <Typography variant="body1"><strong>{t("package_duration")} : </strong> {packageData?.duration} {t("hour")}</Typography>
            <Typography variant="body1"><strong>{t("startDate")} : </strong> {convertDate(packageData?.startDate)}</Typography>
            <Typography variant="body1"><strong>{t("endDate")} : </strong> {convertDate(packageData?.endDate)} </Typography>
            
            <DialogActions sx={{ justifyContent: "center", mb: 0 }}>
            <Button
              variant="contained"
              sx={{ width: "300px" }}
              onClick={() => navigate("/teacher/" + packageData?.TeacherId)}
            >
              {t("teacher")}
            </Button>
          </DialogActions>
          </Paper>
        </Grid>

        {/* قسم الحصص */}
        <Grid item xs={12}>
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
        </Grid>
      </Grid>
    </Box>
    </StudentLayout>

  );
};

export default PackagePage;
