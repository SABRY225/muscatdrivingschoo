import { Avatar, Box, Button, Container, Grid, Modal, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import swal from "sweetalert";
import axios from "axios";
import Cookies from "js-cookie";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SchoolIcon from "@mui/icons-material/School";
import AboutTest from "../../../components/client/singleTeacher/AboutTest";
import Navbar from "../../Navbar";
import Loading from "../../Loading";
import { checkStudentSubscription } from "../../../utils/subscriptionService";

export default function SingleTest() {
    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");
    const lang = Cookies.get("i18next") || "en";
    const { id, testId } = useParams();
    const { student } = useSelector((state) => state.student);
    const [teacherData, setTeacherData] = useState(null);
    const [testData, setTestData] = useState(null);
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
                    `${process.env.REACT_APP_API_KEY}api/v1/teacher/test/${testId}`
                );
                console.log(res.data);
                console.log(res2.data.data);

                setTeacherData(res.data);
                setTestData(res2.data.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchTeacher();
    }, [id, testId]);

    const handleCreateMessage = async () => {
        if (!student) {
            swal({ text: t("login_as_student"), icon: "error", button: t("ok") });
            return;
        }
        const addFrind = (async () => {
            await fetch(`${process.env.REACT_APP_API_KEY}api/v1/chat/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user1Id: student?.id, user1Type: "student", user2Id: id, user2Type: "teacher"
                })
            });
        })
        addFrind();
        navigate(`/student/messages`);
    };

    const handleRequestTest = async () => {
        if (!student) {
            swal({ text: t("login_as_student"), icon: "error", button: t("ok") });
            return;
        } else {
            const result = await checkStudentSubscription(student.id, "TestId",testId);
            if (result.isSubscribed) {
                setMessage(lang === "ar" ? result.message.arabic : result.message.english);
                setShowModal(true);
                setTimeout(() => {
                    setShowModal(false);
                    navigate("/student/exam");
                }, 3000);

            } else {
                navigate(`/book-test/${testId}`);
            }
        }

    };
    return (
        <Navbar>
            <Container sx={{ marginBottom: "40px", marginTop: "80px" }}>
                {testData ? <Grid container spacing={3}>
                    <Grid item xs={12} md={12} lg={7}>
                        {testData && <AboutTest testData={testData} />}
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
                                {testId && (
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        sx={{ textTransform: "capitalize", marginBottom: "16px" }}
                                        onClick={handleRequestTest}
                                    >
                                        {t("Request Test")}
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
                </Grid> : <Loading />}

            </Container>
            <Modal open={showModal} onClose={() => setShowModal(false)}>
                <Box
                    sx={{
                        width: 300,
                        margin: "15% auto",
                        backgroundColor: "white",
                        p: 4,
                        borderRadius: 2,
                        textAlign: "center",
                    }}
                >
                    <Typography variant="h6">{message}</Typography>
                    <Typography variant="body2" sx={{ mt: 2, color: "gray" }}>
                        {t("You will be converted within 3 seconds ...")}
                    </Typography>
                </Box>
            </Modal>
        </Navbar>
    );
}
