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
import { useCurriculums } from "../hooks/useCurriculums";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

function SystemStep({ nextStep, prevStep, updateForm, formData }) {
  const { data, isLoading, error } = useCurriculums();
  const lang = Cookies.get("i18next") || "en";
  const { t } = useTranslation();

  const systems = data?.data || [];

  if (isLoading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );

  if (error)
    return <Typography color="error">فشل تحميل أنظمة التعليم.</Typography>;

  return (
    <FormControl component="fieldset" fullWidth>
      <FormLabel component="legend" sx={{ marginBottom: 2 }}>
        {t("Choose a training method")}
      </FormLabel>

      <RadioGroup row value={formData.system} sx={{
         display: "flex",
          flexWrap: "wrap",
          gap: 2,
          justifyContent: "center",
      }}>
        {systems.map((system) => (
          <Box
            key={system.id}
            sx={{
              bgcolor: formData.system === system.id ? "#d1e7dd" : "#f5f5f5",
              border: "1px solid",
              borderColor: formData.system === system.id ? "#0f5132" : "#ccc",
              p: 2,
              borderRadius: 2,
              minWidth: 150,
              textAlign: "center",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onClick={() => updateForm({ system: system.id })}
          >
            <FormControlLabel
              value={system.id}
              control={<Radio checked={formData.system === system.id} />}
              label={lang=="ar"?system.titleAR:system.titleEN}
              sx={{ m: 0 }}
            />
          </Box>
        ))}
      </RadioGroup>

      <Box sx={{ marginTop: 3, display: "flex", gap: 3 }}>
        <Button variant="contained" color="secondary" onClick={prevStep}>
          {t("prev")}
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={nextStep}
          disabled={!formData.system}
        >
          {t("Next")}
        </Button>
      </Box>
    </FormControl>
  );
}

export default SystemStep;
