import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import AdminLayout from "../../components/admin/AdminLayout";
import TeacherLayout from "../../components/admin/TeacherLayout";
import { Box, Button, Divider, Typography , Paper } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useTeacher } from "../../hooks/useTeacher";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import EducationDegrees from "../../components/teacher/EducationDegrees";
import ProfessionalCertificates from "../../components/teacher/ProfessionalCertificates";
import StepperButtons from "../../components/reusableUi/StepperButtons";
import WorkExperience from "../../components/teacher/WorkExperience";
const AdminEditTeacherResume = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { teacherId } = useParams();
  const { token } = useSelector((state) => state.admin);
  const { isLoading, data } = useTeacher(teacherId);

  const [certificates, setCertificates] = useState([]);
  const [Experience, setExperience] = useState([]);
  const childComponentRef = useRef(null);
  const childComponentRefTwo = useRef(null);
  const childComponentRefThree = useRef(null);

  const [degrees, setDegrees] = useState([]);
  const [load, setLoad] = useState(false);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!isLoading && data) {
      setDegrees(data?.data.EducationDegrees);
      setExperience(data?.data.Experiences);
      setCertificates(data?.data.Certificates);
    }
  }, [data, isLoading]);

  async function onSubmit() {
    setLoad(true);
    const newCertificates = childComponentRefTwo.current.r.map((cert) => {
      return {
        TeacherId: teacherId,
        from: cert.from,
        to: cert.to,
        subject: cert.subject,
        name: cert.name,
      };
    });

    const newExperiences = childComponentRef.current.r.map((exp) => {
      return {
        TeacherId: teacherId,
        from: exp.from,
        to: exp.to,
        companyName: exp.companyName,
        jobTitle: exp.jobTitle,
      };
    });

    const newDegress = childComponentRefThree.current.r.map((deg) => {
      return {
        TeacherId: teacherId,
        from: deg.from,
        to: deg.to,
        UniversityName: deg.UniversityName,
        degree: deg.degree,
      };
    });

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/edit/teacher/resume/${teacherId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            certificates: newCertificates,
            experiences: newExperiences,
            educationDegrees: newDegress,
          }),
        }
      );
      setLoad(false);
      closeSnackbar();
      enqueueSnackbar(t("update_success"), {
        variant: "success",
        autoHideDuration: 1000,
      });
      navigate("/admin/edit/teacher/availability/" + teacherId);
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AdminLayout>
      <TeacherLayout active={4} title={t("resume")}>
      <Paper sx={{ width: "100%", padding: "20px" }}>
        <Box sx={{ marginY: "30px" }}>
          <Typography sx={{ fontSize: "20px", marginBottom: "10px" }}>
            {t("workExper")}
          </Typography>
          <WorkExperience
            Experience={Experience}
            setExperience={setExperience}
            ref={childComponentRef}
          />
        </Box>
        <Divider />
        <Box sx={{ marginY: "30px" }}>
          <Typography sx={{ fontSize: "20px", marginBottom: "10px" }}>
            {t("professionalCertificates")}
          </Typography>
          <ProfessionalCertificates
            certificates={certificates}
            setCertificates={setCertificates}
            ref={childComponentRefTwo}
          />
        </Box>
        <Divider />
        <Box sx={{ marginY: "30px" }}>
          <Typography sx={{ fontSize: "20px", marginBottom: "10px" }}>
            {t("degrees")}
          </Typography>
          <EducationDegrees
            degrees={degrees}
            setDegrees={setDegrees}
            ref={childComponentRefThree}
          />
        </Box>
        <Box sx={{ display: "flex", gap: "12px" }}>
          <StepperButtons
            skipLink="availability"
            load={load}
            onSubmit={onSubmit}
          />
          <Button
            sx={{ textTransform: "capitalize", marginTop: "40px" }}
            variant="outlined"
            onClick={() =>
              navigate("/admin/edit/teacher/availability/" + teacherId)
            }
          >
            {t("skip")}
          </Button>
        </Box>
        </Paper>
      </TeacherLayout>
    </AdminLayout>
  );
};

export default AdminEditTeacherResume;
