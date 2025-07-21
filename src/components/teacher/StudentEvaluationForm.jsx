import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,

  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import TeacherLayout from "./TeacherLayout";
import { useNavigate, useParams } from "react-router-dom";
import { useLevels } from "../../hooks/useLevels";
import Cookies from "js-cookie";
import { toast, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

const StudentEvaluationForm = () => {
  const { t } = useTranslation();
  const {studentName,StudentId}=useParams();
    const { teacher } = useSelector((state) => state.teacher);
    const navigate = useNavigate();
  
  const lang = Cookies.get("i18next") || "en";
  const { data, isLoading } = useLevels();
  const [levels, setLevels] = useState([]);
  const [formData, setFormData] = useState({
    studentName: studentName,
    StudentId:StudentId,
    TeacherId:teacher.id,
    certificateDate: new Date().toISOString().split('T')[0],
    trainingStage: "",
    teacherSignature: "",
  });
useEffect(() => {
    if (data) {
      setLevels(data?.data);
    }
  }, [data]);

  const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
  };


const handleSubmit = async (e) => {
  e.preventDefault();
  const form = new FormData();
  form.append("StudentName", formData.studentName);
  form.append("certificateDate", formData.certificateDate);
  form.append("trainingStage", formData.trainingStage);
  form.append("teacherSignature", formData.teacherSignature);
  form.append("StudentId", formData.StudentId);
  form.append("TeacherId", formData.TeacherId);
  form.append("language", lang);

  try {
    const res = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/evaluations`, {
      method: "POST",
      body: form,
    });

    const result = await res.json();
   console.log(result);
   
    if (res.ok) {
      toast.success(lang==="ar"?result?.msg?.arabic:result?.msg?.english);
      setTimeout(() => {
        navigate('/teacher/students')
      }, 5000);
    } else {
      toast.error("❌ حدث خطأ أثناء الإرسال: " + (result.msg || "خطأ غير معروف"));
    }
  } catch (err) {
    console.error("❌ Error submitting:", err);
    toast.error("❌ حدث خطأ أثناء الاتصال بالسيرفر");
  }
};

  return (
          <TeacherLayout>
             <ToastContainer position="top-center" />
    <Box
      maxWidth="500px"
      mx="auto"
      p={3}
      mt={5}
      bgcolor="#fafafa"
      borderRadius={2}
      boxShadow={2}
      component="form"
      onSubmit={handleSubmit}
    >
      <Typography variant="h5" mb={3} textAlign="center">
        {t("Student Evaluation Request Form")}
      </Typography>

      <Stack spacing={2}>
        <TextField
          name="studentName"
          label={t("Student Name (English)")}
          value={formData.studentName}
          onChange={handleChange}
          required
        />

        <TextField
          name="certificateDate"
          label={t("certificateDate")}
          type="date"
          InputLabelProps={{ shrink: true }}
          value={formData.certificateDate}
          onChange={handleChange}
          required
        />

        <FormControl fullWidth required>
  <InputLabel>{t("trainingStage")}</InputLabel>
  <Select
    name="trainingStage"
    value={formData.trainingStage}
    label={t("trainingStage")}
    onChange={handleChange}
  >
    {levels.map((level) => (
      <MenuItem key={level.id} value={level.titleEN}>
        {lang==="ar"?level.titleAR:level.titleEN}
      </MenuItem>
    ))}
  </Select>
</FormControl>


<TextField
          name="teacherSignature"
          label={t("Teacher Signature (English)")}
          value={formData.teacherSignature}
          onChange={handleChange}
          required
        />
        <Button type="submit" variant="contained" color="primary">
          {t("submit")}
        </Button>
      </Stack>
    </Box>
          </TeacherLayout>


  );
};

export default StudentEvaluationForm;
