import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step               from "@mui/material/Step";
import StepLabel          from "@mui/material/StepLabel";
import { useTranslation } from "react-i18next";

export default function AdsStepperCareer({ active }) {
  const { t } = useTranslation();

  const steps = [
    t("CareerDepartment"),
    t("CareerDetails"),
    //t("AdsDetails"),
  ];

  return (
    <Box sx={{ width: "90%" , margin : "auto", marginTop: "120px" }}>
      <Stepper activeStep={active} sx={{ flexWrap: "wrap", rowGap: "20px" }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel sx={{ columnGap: "4px" }}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
