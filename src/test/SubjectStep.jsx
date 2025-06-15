import React from "react";
import {
  FormControlLabel,
  Checkbox,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSubjects } from "../hooks/useSubject";

function SubjectStep({ nextStep, prevStep, updateForm, formData }) {
  const { data, isLoading, error } = useSubjects();
  const { t } = useTranslation();

  const toggleSubject = (subjectId) => {
    const subjects = formData.subjects.includes(subjectId)
      ? formData.subjects.filter((s) => s !== subjectId)
      : [...formData.subjects, subjectId];

    updateForm({ subjects });
  };

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return <Typography color="error">فشل تحميل المواضيع.</Typography>;

  const subjects = data?.data || [];

  return (
    <>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        اختر المواضيع
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
        }}
      >
        {subjects.map((subject) => (
          <Box
            key={subject.id}
            sx={{
              borderRadius: 2,
              p: 2,
              minWidth: 150,
              bgcolor: formData.subjects.includes(subject.id)
                ? "#cce5ff"
                : "#f5f5f5",
              border: "1px solid",
              borderColor: formData.subjects.includes(subject.id)
                ? "#2196f3"
                : "#ccc",
              transition: "0.3s",
              cursor: "pointer",
            }}
            onClick={() => toggleSubject(subject.id)}
          >
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.subjects.includes(subject.id)}
                  onChange={() => toggleSubject(subject.id)}
                />
              }
              label={subject.titleAR}
            />
          </Box>
        ))}
      </Box>

      <Box sx={{ marginTop: 3, display: "flex", gap: 5 }}>
        <Button variant="contained" color="secondary" onClick={prevStep}>
          السابق
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={nextStep}
          disabled={formData.subjects.length === 0}
        >
          التالي
        </Button>
      </Box>
    </>
  );
}

export default SubjectStep;
