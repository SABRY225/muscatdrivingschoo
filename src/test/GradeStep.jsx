import React from "react";
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Button,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { useSubjectCategoreis } from "../hooks/useSubjectCategoreis";

function GradeStep({ nextStep, updateForm, formData }) {
  const { data, isLoading, error } = useSubjectCategoreis();
  const lang = Cookies.get("i18next") || "en";

  const grades = data?.data || []; // ما دام الـ API ترجع مصفوفة مباشرة
  const { t } = useTranslation();

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Typography color="error">حدث خطأ أثناء تحميل البيانات.</Typography>
    );

  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend" sx={{ marginBottom: 2 }}>
        {t("Choose the type of training")}
      </FormLabel>

      <RadioGroup row value={formData.grade} sx={{
         display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
      }}>
        {grades.map((grade) => (
          <Box
            key={grade.id}
            sx={{
              bgcolor: formData.grade === grade.id ? "#d1e7dd" : "#f5f5f5",
              border: "1px solid",
              borderColor: formData.grade === grade.id ? "#0f5132" : "#ccc",
              p: 2,
              borderRadius: 2,
              minWidth: 180,
              textAlign: "center",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onClick={() => updateForm({ grade: grade.id })}
          >
            <FormControlLabel
              value={grade.id}
              control={<Radio checked={formData.grade === grade.id} />}
              label={
                <>
                  <Typography fontWeight="bold">{lang=="ar"?grade.titleAR:grade.titleEN}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {lang=="ar"?grade.Level?.titleAR:grade.Level?.titleEN}
                  </Typography>
                </>
              }
              sx={{ m: 0 }}
            />
          </Box>
        ))}
      </RadioGroup>

      <Button
        variant="contained"
        color="primary"
        onClick={nextStep}
        disabled={!formData.grade}
        sx={{ marginTop: 3 }}
      >
        {t("Next")}
      </Button>
    </FormControl>
  );
}

export default GradeStep;
