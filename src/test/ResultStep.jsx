import React from "react";
import { Button, Box } from "@mui/material";

function ResultStep({ formData, prevStep }) {
  return (
    <>
      <Box>
        <h3>المرحلة الدراسية: {formData.grade}</h3>
        <h3>نظام التعليم: {formData.system}</h3>
        <h3>التخصص: {formData.specialty}</h3>
        <h3>المواضيع: {formData.subjects.join(", ")}</h3>
      </Box>
      <Button variant="contained" color="secondary" onClick={prevStep} sx={{ marginTop: 2 }}>
        السابق
      </Button>
    </>
  );
}

export default ResultStep;
