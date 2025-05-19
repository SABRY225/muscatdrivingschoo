import {
  Paper,
  Grid,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useLevels } from "../../../hooks/useLevels";
import { useSubjectCategoreis } from "../../../hooks/useSubjectCategoreis";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
export default function HeaderSearchList({
  level,
  setLevel,
  value,
  setValue,
  onSearch,
}) {
  const categoriesData = useSubjectCategoreis();
  const levelsData = useLevels();
  let [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    setLevel(searchParams.get("level"));
    setValue(searchParams.get("subjects"));
  }, []);

  /** handle level */
  const handleChange = (event) => {
    setLevel(event.target.value);
    setSearchParams({
      level: event.target.value,
      subjects: searchParams.get("subjects"),
    });
  };

  const lang = Cookies.get("i18next") || "en";
  const { t } = useTranslation();

  return (
    <Paper sx={{ padding: "32px 24px" }}>
      <Grid
        container
        spacing={2}
        alignItems="center"
        sx={{
          backgroundColor: "white",
          padding: "0px 10px 14px",
          borderRadius: "6px",
          position: "relative",
          zIndex: 3,
        }}
      >
        <Grid item xs={12} md={6} lg={5}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              {t("categories")}
            </InputLabel>
            <Select
              sx={{ textAlign: "start" }}
              placeholder="level"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setSearchParams({
                  level: searchParams.get("level"),
                  subjects: e.target.value,
                });
              }}
              label={t("studylevel")}
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
              {!categoriesData.isLoading &&
                categoriesData.data.data.length > 0 &&
                categoriesData.data.data.map((item, index) => {
                  return (
                    <MenuItem key={index + "zas"} value={item.id}>
                      {lang === "ar" ? item.titleAR : item.titleEN}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={6} lg={5}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">
              {t("studylevel")}
            </InputLabel>
            <Select
              sx={{ textAlign: "start" }}
              placeholder="level"
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={level}
              onChange={handleChange}
              label={t("studylevel")}
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
              {!levelsData.isLoading &&
                levelsData.data.data.length > 0 &&
                levelsData.data.data.map((item, index) => {
                  return (
                    <MenuItem key={index + "zas"} value={item.id}>
                      {lang === "en" ? item.titleEN : item.titleAR}
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12} lg={2}>
          <Button
            variant="contained"
            fullWidth
            onClick={onSearch}
            sx={{ textTransform: "capitalize" }}
          >
            {t("search")}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}
