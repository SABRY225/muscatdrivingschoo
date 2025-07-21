import React , { useEffect, useState }from "react";
import Navbar from "../../components/Navbar";
import {  Box ,  Container,  Paper,  Tab,  Tabs, Typography , styled } from "@mui/material";
import { Table,TableBody,TableCell,TableHead,TableRow , Button } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Link, useParams } from "react-router-dom";
import { useStudent } from "../../hooks/useStudent";
import Loading from "../../components/Loading";
import { useStudentLectures } from "../../hooks/useStudentLectures";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import moment from "moment";
import Moment from "moment";
import BookedLessonStudent from "../../components/parent/BookedLessonStudent";
import { useAllLessons } from "../../hooks/useAllLessons";
import { usePastLessons } from "../../hooks/usePastLessons";
import { useComingLessons } from "../../hooks/useComingLessons";
import { useStudentRefund } from "../../hooks/useStudentRefund";
import { useStudentDiscounts } from "../../hooks/useStudentDiscounts";
import { useStudentHistory } from "../../hooks/useStudentHistory";


import countries from "../../data/countries";
import { useStudentPackages } from "../../hooks/useStudentPackages";
import { useStudentTests } from "../../hooks/useStudentTests";
import { useStudentSessions } from "../../hooks/useStudentSessions";
const Image = styled('img')({
  width:"500px"
})

export default function StudentProfile() {
  const lang = Cookies.get("i18next") || "en";
  const { id }              = useParams();
  const { data, isLoading } = useStudent(id);
  const [ objStudent, setStudent ] = useState("");
  const { t } = useTranslation();
  const [value, setValue] = React.useState("1");
  const [nationalityValue, setNationalityValue] = useState("");
  const [countryValue, setCountryValue] = useState("");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
    if (data) {
      console.log("Data of Student");
      console.log(data);
      const user = data?.data;
      setStudent(user);
      console.log(user);

      const c = countries.find((e) => e.code == user.nationality);
      setNationalityValue(lang === "en" ? c.name_en : c.name_ar);

      const loc = countries.find((e) => e.code == user.location);
      setCountryValue(lang === "en" ? loc.name_en : loc.name_ar);
    }
  }, [data]);

  const { data:dataLecture, isLoadingLectures } = useStudentLectures(id);
  const { data:dataPackage, isLoadingPackages } = useStudentPackages(id);
  const { data:dataTest, isLoadingTests } = useStudentTests(id);
  const { data:dataSessions, isLoadingSessions} = useStudentSessions(id);
  // const { data:dataStudentRefund, isLoadingStudentRefund } = useStudentRefund(id,objStudent.token);
  const { data:dataDiscounts, isLoadingDiscounts }   = useStudentDiscounts(id);
  // const { data:dataHistory, isLoadingHistory } = useStudentHistory(id);
  const allLessons = useAllLessons(objStudent?.id);
  const comingLessons = useComingLessons(objStudent?.id);
  const pastLessons = usePastLessons(objStudent?.id);

  
  return (
    <Navbar>
      <Container sx={{ marginTop: "120px" }}>
        <Typography
          sx={{
            color: "#000000",
            fontWeight: "700",
            fontSize: "24px",
            marginBottom: "8px",
          }}
        >
          {t("parent_welcome")}
        </Typography>
        <Typography
          sx={{
            color: "#000000",
            fontWeight: "500",
            fontSize: "18px",
            marginBottom: "32px",
          }}
        >
          {t("parent_desc")}
        </Typography>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Link to={"/parent"}>
            <Tabs value="1">
              <Tab label={t("view_data_student")} value="1" />
            </Tabs>
          </Link>
        </Box>
        <Container>
          {!isLoading ? (
            <Paper sx={{ marginY: "20px", padding: "40px 20px 20px" }}>
              <table className="table_student">
                <tr>
                  <td>{t("p_image")}</td>
                  <td> 
                    <Image
                      src={`${process.env.REACT_APP_API_KEY}images/${objStudent?.image}`}
                      className="img-profile"
                    />
                  </td>
                </tr>
                <tr>
                  <td>{t("p_student_name")}</td>
                  <td> {objStudent?.name}</td>
                </tr>

                <tr>
                  <td>{t("p_student_phone")}</td>
                  <td> {objStudent?.phoneNumber}</td>
                </tr>

                <tr>
                  <td>{t("p_student_gender")}</td>
                  <td> {objStudent?.gender == "male" ? "ذكر" : "انثي"}</td>
                </tr>

                <tr>
                  <td>{t("p_student_regionTime")}</td>
                  <td> {objStudent?.regionTime }</td>
                </tr>

                <tr>
                  <td>{t("p_student_city")}</td>
                  <td> {objStudent?.city}</td>
                </tr>
                <tr>
                  <td>{t("p_student_email")}</td>
                  <td> {objStudent?.email}</td>
                </tr>
                

        <tr>
          <td>{t("p_student_dateOfBirthl")}</td>
          <td> {objStudent?.dateOfBirth}</td>
        </tr>

        <tr>
          <td>{t("p_student_location")}</td>
          <td> {countryValue}</td>
        </tr>
          
        <tr>
          <td>{t("p_student_nationality")}</td>
          <td> {nationalityValue}</td>
        </tr>

                <tr>
                  <td>{t("studylevel")}</td>
                  <td> { (lang=="ar") ? objStudent?.Level?.titleAR : objStudent?.Level?.titleEN}</td>
                </tr>
                <tr>
                  <td>{t("studyCurriculum")}</td>
                  <td> { (lang=="ar") ?  objStudent?.Curriculum?.titleAR : objStudent?.Curriculum?.titleEN}</td>
                </tr>

                <tr>
                  <td>{t("studyYear")}</td>
                  <td> { (lang=="ar") ?  objStudent?.Class?.titleAR : objStudent?.Class?.titleEN}</td>
                </tr>
               
                
              </table>
              
            </Paper>
          ) : (
            <Loading />
          )}
        </Container>

      <Paper sx={{ padding: "20px" }}>
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
                  <BookedLessonStudent
                    image={lesson.Teacher?.image}
                    name={
                      lesson?.Teacher?.firstName +
                      " " +
                      lesson?.Teacher?.lastName
                    }
                    parentTeacher={lesson?.Teacher}
                    parentStudent={objStudent}
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
                  <BookedLessonStudent
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
                  <BookedLessonStudent
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

      {!isLoadingLectures ? (
        <Paper sx={{ padding: "20px", marginBottom: "40px" , marginTop:"40px" }}>
          <Typography
            sx={{
              fontSize: "24px",
              marginTop: "12px",
              fontWeight: "600",
              marginBottom: "30px",
            }}
          >
            {t("Lectures")}
          </Typography>
          <Box sx={{ overflow: "auto" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("lecture")}
                  </TableCell>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("amount")}
                  </TableCell>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("currency")}
                  </TableCell>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("status")}
                  </TableCell>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("history")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {dataLecture?.data.length > 0 ?
                  dataLecture?.data.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        { (lang=="ar") ? row.TeacherLecture?.titleAR + " " : row.TeacherLecture?.titleEN}
                      </TableCell>
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {row.price}
                      </TableCell>
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {t(row.currency)}
                      </TableCell>
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {t(row.type)}
                      </TableCell>
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {moment(row.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                  :
                <TableRow>
                  <TableCell colSpan={5}><p className="notfound">{t("student_lectures_notfound")}</p> </TableCell>
                </TableRow>
                  }
              </TableBody>
            </Table>
          </Box>
        </Paper>
      ) : (
        <Loading />
      )}

      {!isLoadingDiscounts ? (
              <Paper sx={{ padding: "20px", marginBottom: "40px" }}>
                <Typography
                  sx={{
                    fontSize: "24px",
                    marginTop: "12px",
                    fontWeight: "600",
                    marginBottom: "30px",
                  }}
                >
                  {t("view_discount")}
                </Typography>
                <Box sx={{ overflow: "auto" }}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("discount")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("amount")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("currency")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("status")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("history")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataDiscounts?.data.length > 0 ?
                        dataDiscounts?.data.map((row, index) => (
                          <TableRow
                            key={index}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                          >
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              { (lang == "ar") ? row.Discount?.titleAR + " " : row.Discount?.titleEN}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {row.price}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {t(row.currency)}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {t(row.type)}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {moment(row.createdAt).format(
                                "MMMM Do YYYY, h:mm:ss a"
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                        :
                      <TableRow>
                        <TableCell colSpan={5}><p className="notfound">{t("student_discounts_notfound")}</p> </TableCell>
                      </TableRow>
                      }
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
      ) : (
      <Loading />
      )}

      {!isLoadingPackages ? (
              <Paper sx={{ padding: "20px", marginBottom: "40px" }}>
                <Typography
                  sx={{
                    fontSize: "24px",
                    marginTop: "12px",
                    fontWeight: "600",
                    marginBottom: "30px",
                  }}
                >
                  {t("package")}
                </Typography>
                <Box sx={{ overflow: "auto" }}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("title")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("amount")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("currency")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("Description")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("history")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataPackage?.data.length > 0 ?
                        dataPackage?.data.map((row, index) => (
                          <TableRow
                            key={index}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                          >
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              { (lang == "ar") ? row?.titleAR + " " : row?.titleEN}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {row.price}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {row.currency}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              { (lang == "ar") ? row?.descriptionAr + " " : row?.descriptionAn}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {moment(row.createdAt).format(
                                "MMMM Do YYYY, h:mm:ss a"
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                        :
                      <TableRow>
                        <TableCell colSpan={5}><p className="notfound">{t("student_discounts_notfound")}</p> </TableCell>
                      </TableRow>
                      }
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
      ) : (
      <Loading />
      )}

      {!isLoadingTests ? (
              <Paper sx={{ padding: "20px", marginBottom: "40px" }}>
                <Typography
                  sx={{
                    fontSize: "24px",
                    marginTop: "12px",
                    fontWeight: "600",
                    marginBottom: "30px",
                  }}
                >
                  {t("tests")}
                </Typography>
                <Box sx={{ overflow: "auto" }}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("title")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("amount")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("currency")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("status")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("history")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataTest?.data.length > 0 ?
                        dataTest?.data.map((row, index) => (
                          <TableRow
                            key={index}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                          >
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              { (lang == "ar") ? row.Test?.Level?.titleAR + " " : row.Test?.Level?.titleEN}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {row.price}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {t(row.currency)}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {t(row.type)}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {moment(row.createdAt).format(
                                "MMMM Do YYYY, h:mm:ss a"
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                        :
                      <TableRow>
                        <TableCell colSpan={5}><p className="notfound">{t("student_discounts_notfound")}</p> </TableCell>
                      </TableRow>
                      }
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
      ) : (
      <Loading />
      )}
  {/*  */}
      {!isLoadingSessions ? (
              <Paper sx={{ padding: "20px", marginBottom: "40px" }}>
                <Typography
                  sx={{
                    fontSize: "24px",
                    marginTop: "12px",
                    fontWeight: "600",
                    marginBottom: "30px",
                  }}
                >
                  {t("Billing Report")}
                </Typography>
                <Box sx={{ overflow: "auto" }}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("title")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("amount")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("currency")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("status")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("history")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataSessions?.data.length > 0 ?
                        dataSessions?.data.map((row, index) => (
                          <TableRow
                            key={index}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                          >
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {t(row?.type)}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {row.price}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {t(row.currency)}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {row.isPaid?t("paid"):t("unpaid")}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {moment(row.createdAt).format(
                                "MMMM Do YYYY, h:mm:ss a"
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                        :
                      <TableRow>
                        <TableCell colSpan={5}><p className="notfound">{t("student_discounts_notfound")}</p> </TableCell>
                      </TableRow>
                      }
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
      ) : (
      <Loading />
      )}

       {/* {!isLoadingHistory ? (
              <Paper sx={{ padding: "20px", marginBottom: "40px" }}>
                <Typography
                  sx={{
                    fontSize: "24px",
                    marginTop: "12px",
                    fontWeight: "600",
                    marginBottom: "30px",
                  }}
                >
                  {t("payment_history")}
                </Typography>
                <Box sx={{ overflow: "auto" }}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="right" sx={{ color: "#005B8E" }}>
                          {t("history")}
                        </TableCell>
                        <TableCell align="right" sx={{ color: "#005B8E" }}>
                          {t("currency")}
                        </TableCell>
                        <TableCell align="right" sx={{ color: "#005B8E" }}>
                          {t("amount")}
                        </TableCell>
                        <TableCell align="right" sx={{ color: "#005B8E" }}>
                          {t("status")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataHistory?.data.length > 0 ?
                        dataHistory?.data.map((row) => (
                          <TableRow
                            key={row.name}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                          >
                            <TableCell align="right">
                              {Moment(row.createdAt).format(
                                "MMMM Do YYYY, h:mm:ss a"
                              )}
                            </TableCell>
                            <TableCell align="right">{row.currency}</TableCell>
                            <TableCell align="right">{row.price}</TableCell>
                            <TableCell align="right">
                              {lang === "ar" ? row.typeAr : row.typeEn}
                            </TableCell>
                          </TableRow>
                        )) :
                    <TableRow>
                      <TableCell colSpan={4}><p className="notfound">{t("student_history_notfound")}</p> </TableCell>
                    </TableRow>
                      }
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
            ) : (
              <Loading />
            )}

      {!isLoadingStudentRefund ? (
              <Paper sx={{ padding: "20px", marginBottom: "40px" }}>
                <Typography
                  sx={{
                    fontSize: "24px",
                    marginTop: "12px",
                    fontWeight: "600",
                    marginBottom: "30px",
                  }}
                >
                  {t("refunds")}
                </Typography>
                <Box sx={{ overflow: "auto" }}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("reasons")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("amount")}
                        </TableCell>
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("currency")}
                        </TableCell>
                        
                        <TableCell
                          align={lang === "en" ? "right" : "left"}
                          sx={{ color: "#005B8E" }}
                        >
                          {t("history")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {dataStudentRefund?.data.length > 0 ?
                        dataStudentRefund?.data.map((row, index) => (
                          <TableRow
                            key={index}
                            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                          >
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {row.reasonEN + " " + row.reasonAR}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {row.amount}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {row.currency}
                            </TableCell>
                            <TableCell align={lang === "en" ? "right" : "left"}>
                              {moment(row.createdAt).format(
                                "MMMM Do YYYY, h:mm:ss a"
                              )}
                            </TableCell>
                          </TableRow>
                        ))
                          :<TableRow>
                            <TableCell colSpan={4}>
                              <p className="notfound">{t("student_refunds_notfound")}</p>
                            </TableCell>
                          </TableRow>
                        }
                    </TableBody>
                  </Table>
                </Box>
              </Paper>
      ) : (
        <Loading />
      )} */}
      </Container>


     
    </Navbar>
  );
}
