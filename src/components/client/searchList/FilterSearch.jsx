import {  Box,  Button,   Divider,    InputLabel,   MenuItem,   Paper,    Select,   Switch,     Typography, } from "@mui/material";
import React from "react";
import { useCurriculums } from "../../../hooks/useCurriculums";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

const label = { inputProps: { "aria-label": "Switch demo" } };

export default function FilterSearch({
  gender, setGender,  curriculum,   setCurriculum,      spackArabic,
  setSpeakArabic,     isVideo,      setIsVideo,         onSearch,}) 
{
  const { data, isLoading } = useCurriculums();
  const { t } = useTranslation();
  const lang = Cookies.get("i18next") || "en";

  return (
    <Paper sx={{ paddingY: "16px" }}>
      <Typography
        sx={{ paddingX: "10px", fontSize: "16px", fontWeight: "bold" }}
      >
        {t("searchFilter")}
      </Typography>
      <Divider sx={{ marginTop: "12px" }} />
      <Box sx={{ padding: "10px" }}>
        <Box sx={{ marginY: "16px" }}>
          <InputLabel
            sx={{
              marginBottom: "6px",
              fontSize: "13px",
              fontWeight: "bold",
              color: "#151313",
            }}
          >
            {t("studyCurriculum")}
          </InputLabel>
          <Select
            size="small"
            fullWidth
            onChange={(e) => setCurriculum(e.target.value)}
            value={curriculum}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            MenuProps={{
              elevation: 0.3,
              PaperProps: {
                style: {
                  maxHeight: 48 * 3 + 8,
                  width: 160,
                },
              },
            }}
          >
            <MenuItem value={"all"}>{t("all")}</MenuItem>
            {!isLoading &&
              data?.data.length > 0 &&
              data.data.map((item, index) => {
                return (
                  <MenuItem key={index + "z1"} value={item.id}>
                    {lang === "ar" ? item.titleAR : item.titleEN}
                  </MenuItem>
                );
              })}
          </Select>
        </Box>
        <Box sx={{ marginY: "16px" }}>
          <InputLabel
            sx={{
              marginBottom: "6px",
              fontSize: "13px",
              fontWeight: "bold",
              color: "#151313",
            }}
          >
            {t("gender")}
          </InputLabel>
          <Select
            size="small"
            fullWidth
            onChange={(e) => setGender(e.target.value)}
            value={gender}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
          >
            <MenuItem value={"all"}>{t("all")}</MenuItem>
            <MenuItem value={"male"}>{t("male")}</MenuItem>
            <MenuItem value={"female"}>{t("female")}</MenuItem>
          </Select>
        </Box>
        <Box sx={{ marginY: "16px" }}>
          <InputLabel
            sx={{
              marginBottom: "6px",
              fontSize: "13px",
              fontWeight: "bold",
              color: "#151313",
            }}
          >
            {t("isSpeak")}
          </InputLabel>
          <Switch
            {...label}
            checked={spackArabic}
            onChange={() => setSpeakArabic((back) => !back)}
          />
        </Box>
        <Box sx={{ marginY: "16px" }}>
          <InputLabel
            sx={{
              marginBottom: "6px",
              fontSize: "13px",
              fontWeight: "bold",
              color: "#151313",
            }}
          >
            {t("isVideo")}
          </InputLabel>
          <Switch
            {...label}
            checked={isVideo}
            onChange={() => setIsVideo((back) => !back)}
          />
        </Box>
        <Button
          variant="contained"
          fullWidth
          onClick={onSearch}
          sx={{ textTransform: "capitalize" }}
        >
          {t("applyAll")}
        </Button>
      </Box>
    </Paper>
  );
}
