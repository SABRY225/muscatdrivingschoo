import {
  Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import { useForm, Controller } from "react-hook-form";
import Navbar from "../../../components/Navbar";
import HeaderSteps from "../../../components/auth/HeaderSteps";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLevels } from "../../../hooks/useLevels";
import { useClasses } from "../../../hooks/useClasses";
import { useCurriculums } from "../../../hooks/useCurriculums";
import Cookies from "js-cookie";
import { loginStudent } from "../../../redux/studentSlice";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
export default function StudentFouthStep() {
  const lang = Cookies.get("i18next") || "en";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();

  const [load, setLoad] = useState(false);
  const {
    register,
    control,
    watch,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      gender: "",
      level: "1",
      class: "1",
      curriculum: "1",
    },
  });

  const levels = useLevels();
  const classes = useClasses();
  const curriculums = useCurriculums();

  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedCurriculums, setSelectedCurriculums] = useState([]);

  async function onSubmit(data) {
    setLoad(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/student/signup/data`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gender: data.gender,
            levelId: data.level,
            curriculumId: data.curriculum,
            classId: data.class,
            email: localStorage.getItem("studentEmail"),
          }),
        }
      );
      const resData = await response.json();
      if (response.status !== 200 && response.status !== 201) {
        setLoad(false);
        throw new Error("failed occured");
      }
      // ----------------------------
      closeSnackbar();
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              password: localStorage.getItem("password"),
              email: localStorage.getItem("studentEmail"),
              long: localStorage.getItem("longitude"),
              lat: localStorage.getItem("latitude"),
            }),
          }
        );
        const resData = await response.json();
        if (response.status !== 200 && response.status !== 201) {
          setLoad(false);
          enqueueSnackbar(resData.message, {
            variant: "error",
            autoHideDuration: "8000",
          });
          throw new Error("failed occured");
        }
        localStorage.clear();
        dispatch(loginStudent({ token: resData.token, student: resData.data }));
        navigate("/student/profile");
        // ----------------------------
        setLoad(false);
      } catch (err) {
        console.log(err);
      }
    } catch (err) {
      console.log(err);
    }
  }

  const { t } = useTranslation();

  useEffect(() => {
    if (classes?.data) {
      const filteredClasses = classes?.data.data.filter(
        (item) => item.LevelId == watch("level")
      );
      setSelectedClasses(filteredClasses);
    }
    if (curriculums?.data) {
      const filteredCurriculms = curriculums.data.data.filter(
        (item) =>
          item.CurriculumLevels.findIndex(
            (val) => val.LevelId == watch("level")
          ) !== -1
      );
      setSelectedCurriculums(filteredCurriculms);
    }
  }, [classes || watch("level")]);

  return (
    <Navbar>
      <Container sx={{ marginTop: "110px" }}>
        <Paper
          sx={{
            width: { md: "450px" },
            padding: "30px 50px",
            margin: "60px auto 60px",
          }}
        >
          <HeaderSteps step={4} title={t("additionalInformation")} steps={4} />
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("gender")}
              </InputLabel>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      {...register("gender", {
                        required: "gender is required",
                      })}
                    >
                      <MenuItem value={"male"}>{t("male")}</MenuItem>
                      <MenuItem value={"female"}>{t("female")}</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              {errors.gender?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                {t("studylevel")}
              </InputLabel>
              <Controller
                {...register("level", {
                  required: "nationality Address is required",
                })}
                name="level"
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    {!levels.isLoading &&
                      levels?.data?.data.map((item, index) => {
                        return (
                          <FormControlLabel
                            key={index + "mnz"}
                            value={item.id}
                            control={<Radio size="2px" />}
                            label={lang === "ar" ? item.titleAR : item.titleEN}
                          />
                        );
                      })}
                  </RadioGroup>
                )}
              />
              {errors.level?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                {t("studyYear")}
              </InputLabel>
              <Controller
                name="class"
                {...register("class", { required: "class is required" })}
                control={control}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    {selectedClasses.length > 0 &&
                      selectedClasses.map((item, index) => {
                        return (
                          <FormControlLabel
                            value={item.id}
                            label={lang === "ar" ? item.titleAR : item.titleEN}
                            key={index + "ma"}
                            control={<Radio size="2px" />}
                          />
                        );
                      })}
                  </RadioGroup>
                )}
              />
              {errors.class?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                {t("studyCurriculum")}
              </InputLabel>
              <Controller
                name="curriculum"
                control={control}
                {...register("curriculum", {
                  required: "curriculum is required",
                })}
                render={({ field }) => (
                  <RadioGroup {...field}>
                    {selectedCurriculums.length > 0 &&
                      selectedCurriculums.map((item, index) => {
                        return (
                          <FormControlLabel
                            value={item.id}
                            label={lang === "ar" ? item.titleAR : item.titleEN}
                            key={index + "ma"}
                            control={<Radio size="2px" />}
                          />
                        );
                      })}
                  </RadioGroup>
                )}
              />
            </Box>
            {!load ? (
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                type="submit"
                sx={{ textTransform: "capitalize" }}
              >
                {t("save")}
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                sx={{ textTransform: "capitalize" }}
              >
                {t("save")}...
              </Button>
            )}
          </form>
        </Paper>
      </Container>
    </Navbar>
  );
}
