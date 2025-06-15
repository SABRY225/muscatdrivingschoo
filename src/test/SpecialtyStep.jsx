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
import { useLevels } from "../hooks/useLevels";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
function SpecialtyStep({ nextStep, prevStep, updateForm, formData }) {
  const { data, isLoading, error } = useLevels();
  const lang = Cookies.get("i18next") || "en";
  const { t } = useTranslation();
  const specialties = data?.data || [];

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return <Typography color="error">فشل تحميل التخصصات.</Typography>;

  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend" sx={{ marginBottom: 2 }}>
         {t("Choose a major")}
      </FormLabel>

      <RadioGroup row value={formData.specialty} sx={{
         display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
      }}>
        {specialties.map((specialty) => (
          <Box
            key={specialty.id}
            sx={{
              bgcolor: formData.specialty === specialty.id ? "#d1e7dd" : "#f5f5f5",
              border: "1px solid",
              borderColor:
                formData.specialty === specialty.id ? "#0f5132" : "#ccc",
              p: 2,
              borderRadius: 2,
              minWidth: 150,
              textAlign: "center",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onClick={() => updateForm({ specialty: specialty.id })}
          >
            <FormControlLabel
              value={specialty.id}
              control={
                <Radio checked={formData.specialty === specialty.id} />
              }
              label={lang=="ar"?specialty.titleAR:specialty.titleEN}
              sx={{ m: 0 }}
            />
          </Box>
        ))}
      </RadioGroup>

      <Box sx={{ marginTop: 3, display: "flex", gap: 5 }}>
        <Button variant="contained" color="secondary" onClick={prevStep}>
         {t("prev")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={nextStep}
          disabled={!formData.specialty}
        >
          {t("Next")}
        </Button>
      </Box>
    </FormControl>
  );
}

export default SpecialtyStep;
