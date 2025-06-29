import { Avatar, Box, Button, Container, Grid, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import swal from "sweetalert";
import axios from "axios";
import Cookies from "js-cookie";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import AboutLecture from "../../components/client/singleTeacher/AboutLecture";
import Loading from "../../components/Loading";

export default function SingleCourse() {
    const lang = Cookies.get("i18next") || "en";
    const { id, lectureId } = useParams();
    const { student } = useSelector((state) => state.student);
    const [teacherData, setTeacherData] = useState(null);
    const [lectureData, setLecturData] = useState([]);
    const { t } = useTranslation();
    const navigate = useNavigate();
   
    
    useEffect(() => {
        const fetchTeacher = async () => {
            try {
                const res = await axios.get(
                    `${process.env.REACT_APP_API_KEY}api/v1/teacher/getSingleTeacher/${id}`,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    }
                );
                const res2 = await axios.get(
                    `${process.env.REACT_APP_API_KEY}api/v1/teacher/lecture/${lectureId}`
                );
                console.log(res2.data);
                
                setTeacherData(res.data);
                setLecturData(res2.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchTeacher();
    }, [id, lectureId]);

    const handleCreateMessage = () => {
        if (!student) {
            swal({ text: t("login_as_student"), icon: "error", button: t("ok") });
            return;
        }
        navigate(`/student/messages`);
    };

    const handleRequestPackage = () => {
        if (!student) {
            swal({ text: t("login_as_student"), icon: "error", button: t("ok") });
            return;
        }
        navigate(`/book-lecture/${lectureId}`);
    };

    return (
        <Navbar>
            <Container sx={{ marginBottom: "40px", marginTop: "80px" }}>
                {lectureData?<Grid container spacing={3}>
                    <Grid item sm={12} md={12} lg={7}>
                        {lectureData && <AboutLecture lectureData={lectureData} />}
                    </Grid>
                    <Grid item sm={12} md={12} lg={5}>
                        <Grid item md={12}>
                            <Paper sx={{ padding: "24px 12px", marginY: "30px" }}>
                                <Box sx={{ display: "flex", columnGap: "20px" }}>
                                    <Avatar
                                        src={`${process.env.REACT_APP_API_KEY}images/${teacherData?.data?.image}`}
                                        sx={{ width: "141px", height: "141px" }}
                                    />
                                    <Box>
                                        <Typography
                                            sx={{ fontSize: "20px", marginBottom: "8px", fontWeight: "700" }}
                                        >
                                            {teacherData?.data?.firstName} {teacherData?.data?.lastName}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                columnGap: "4px",
                                                alignItems: "center",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            <SpeakerNotesIcon sx={{ fontSize: "16px", color: "#d5d5d5" }} />
                                            <Typography
                                                sx={{ color: "#4f4f51", fontSize: "14px", fontWeight: "bold" }}
                                            >
                                                {t("speaks")}: {t("English Arabic")}
                                            </Typography>
                                            <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                                                {lang === "ar"
                                                    ? teacherData?.data?.LangTeachStds?.map(
                                                          (item) => item?.Language?.titleAR + " "
                                                      )
                                                    : teacherData?.data?.LangTeachStds?.map(
                                                          (item) => item?.Language?.titleEN + " "
                                                      )}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                columnGap: "4px",
                                                alignItems: "center",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            <SpeakerNotesIcon sx={{ fontSize: "16px", color: "#d5d5d5" }} />
                                            <Typography
                                                sx={{ color: "#4f4f51", fontSize: "14px", fontWeight: "bold" }}
                                            >
                                                {t("certifiedTeacher")}:{" "}
                                            </Typography>
                                            <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                                                {teacherData?.data?.experienceYears} {t("yearsofexperience")}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                columnGap: "4px",
                                                alignItems: "center",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            <LocationOnIcon sx={{ fontSize: "16px", color: "#d5d5d5" }} />
                                            <Typography
                                                sx={{ color: "#4f4f51", fontSize: "14px", fontWeight: "bold" }}
                                            >
                                                {t("location")}:{" "}
                                            </Typography>
                                            <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                                                {teacherData?.data?.city}, {teacherData?.data?.country}
                                            </Typography>
                                        </Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                columnGap: "4px",
                                                alignItems: "center",
                                                marginBottom: "8px",
                                            }}
                                        >
                                            <SchoolIcon sx={{ fontSize: "16px", color: "#d5d5d5" }} />
                                            <Typography
                                                sx={{ color: "#4f4f51", fontSize: "14px", fontWeight: "bold" }}
                                            >
                                                {t("subjects")}:{" "}
                                            </Typography>
                                            <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                                                {lang === "ar"
                                                    ? teacherData?.data?.TeacherSubjects?.map(
                                                          (item) => item?.Subject?.titleAR + " "
                                                      )
                                                    : teacherData?.data?.TeacherSubjects?.map(
                                                          (item) => item?.Subject?.titleEN + " "
                                                      )}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Paper>
                        </Grid>
                        <Grid item md={12}>
                            <Paper sx={{ padding: "24px 12px", marginY: "30px" }}>
                                {lectureId && (
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{ textTransform: "capitalize", marginBottom: "16px" }}
                                        onClick={handleRequestPackage}
                                    >
                                        {t("Request Lecture")}
                                    </Button>
                                )}
                                <Button
                                    variant="outlined"
                                    fullWidth
                                    sx={{ textTransform: "capitalize" }}
                                    onClick={handleCreateMessage}
                                >
                                    {t("contactTeacher")}
                                </Button>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>:<Loading />}
                
            </Container>
        </Navbar>
    );
}
