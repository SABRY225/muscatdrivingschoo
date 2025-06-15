import React, { useState } from "react";
import {
  Stepper,
  Step,
  StepButton,
  Box,
  Typography
} from "@mui/material";
import GradeStep from "./GradeStep";
import SystemStep from "./SystemStep";
import SpecialtyStep from "./SpecialtyStep";
import Navbar from "../components/Navbar";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function SearchTest() {
  const { t } = useTranslation();
  const navigate = useNavigate();
const { i18n } = useTranslation();
const isRTL = i18n.dir() === "rtl";
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    grade: "",
    system: "",
    specialty: "",
    subjects: [],
  });

  const steps = ["categories", "studyCurriculum", "Specialization"];

  const nextStep = () => setActiveStep((prev) => prev + 1);
  const prevStep = () => setActiveStep((prev) => prev - 1);

  const updateForm = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  const handleStepClick = (index) => {
    setActiveStep(index);
  };

  const handleFinalStepNext = () => {
    console.log(formData);
    
    navigate(`/teachers/search?level=${formData.specialty}&subjects=${formData.grade}`);
  };

  return (
    <Navbar>
      <Box sx={{ width: "100%", marginTop: "10rem" }}>
        <Typography sx={{ mx: 5, my: 2, fontSize: "25px", fontWeight: "700" }}>
          {t("Let's start looking for a coach.")}
        </Typography>

<Box sx={{ direction:"ltr"}}>
  <Stepper activeStep={activeStep} alternativeLabel>
    {steps.map((label, index) => (
      <Step key={label}>
        <StepButton onClick={() => handleStepClick(index)}>
          {t(label)}
        </StepButton>
      </Step>
    ))}
  </Stepper>
</Box>

        <Box sx={{ padding: 2 }}>
          {activeStep === 0 && (
            <GradeStep
              nextStep={nextStep}
              updateForm={updateForm}
              formData={formData}
            />
          )}
          {activeStep === 1 && (
            <SystemStep
              nextStep={nextStep}
              prevStep={prevStep}
              updateForm={updateForm}
              formData={formData}
            />
          )}
          {activeStep === 2 && (
            <SpecialtyStep
              nextStep={handleFinalStepNext}
              prevStep={prevStep}
              updateForm={updateForm}
              formData={formData}
            />
          )}
        </Box>
      </Box>
    </Navbar>
  );
}

export default SearchTest;
