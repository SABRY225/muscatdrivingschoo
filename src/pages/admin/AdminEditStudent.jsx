import AdminLayout from "../../components/admin/AdminLayout";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
  Box,
  TextField,
  Button,
  FormControlLabel,
  RadioGroup,
  Radio,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import AddLanguages from "../../components/reusableUi/AddLanguages";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useLevels } from "../../hooks/useLevels";
import { useClasses } from "../../hooks/useClasses";
import { useCurriculums } from "../../hooks/useCurriculums";
import { useStudent } from "../../hooks/useStudent";
import SelectTimeZone from "../../components/reusableUi/SelectTimeZone";
import Cookies from "js-cookie";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSnackbar } from "notistack";
import countries from "../../data/countries";
import { useNavigate, useParams } from "react-router-dom";

const AdminEditStudent = () => {
  const { studentId } = useParams();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const lang = Cookies.get("i18next") || "en";
  const { t } = useTranslation();
  const { data } = useStudent(studentId);
  const [chosenlanguages, setChosenLanguages] = useState([]);
  const [load, setLoad] = useState(false);
  const [regionTime, setRegionTime] = useState(null);
  const { token } = useSelector((state) => state.admin);

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      gender: "",
      fullName: "",
      dateOfBirth: "",
      phone: "",
      city: "",
      level: "",
      class: "",
      curriculum: "",
      regionTime: "",
      location: "",
      nationality: "",
    },
  });

  useEffect(() => {
    if (data) {
      const user = data?.data;
      setChosenLanguages(data?.data?.LangTeachStds);
      setRegionTime(user?.regionTime);
      reset({
        fullName: user?.name,
        gender: user?.gender,
        dateOfBirth: user?.dateOfBirth,
        phone: user?.phoneNumber,
        level: user?.LevelId,
        city: user?.city,
        class: user?.ClassId,
        curriculum: user?.CurriculumId,
        regionTime: user?.regionTime,
        location: user?.location,
        nationality: user?.nationality,
      });
    }
  }, [data]);

  const levels = useLevels();
  const classes = useClasses();
  const curriculums = useCurriculums();

  const [selectedClasses, setSelectedClasses] = useState([]);
  const [selectedCurriculums, setSelectedCurriculums] = useState([]);
  const navigate = useNavigate();

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

  const onSubmit = async (data) => {
    closeSnackbar();
    setLoad(true);
    const languages = chosenlanguages.map((lang) => {
      return {
        LanguageLevelId: lang.LanguageLevelId,
        StudentId: studentId,
        LanguageId: lang.LanguageId,
      };
    });
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/edit/student/${studentId}`,
        {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: data.fullName,
            gender: data.gender,
            dateOfBirth: data.dateOfBirth,
            phoneNumber: data.phone,
            city: data.city,
            nationality: data.nationality,
            location: data.location,
            regionTime: regionTime,
            LevelId: data.level,
            ClassId: data.class,
            CurriculumId: data.curriculum,
            languages: languages,
          }),
        }
      );
      const resData = await response.json();
      if (response.status !== 200 && response.status !== 201) {
        setLoad(false);
        throw new Error("failed occured");
      }
      enqueueSnackbar(
        lang === "ar" ? resData.msg.arabic : resData.msg.english,
        { variant: "success", autoHideDuration: 8000 }
      );
      navigate("/admin/students");
      setLoad(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <Paper sx={{ padding: "20px" }}>
        <Typography
          sx={{
            fontSize: "24px",
            marginTop: "12px",
            fontWeight: "600",
            marginBottom: "30px",
          }}
        >
          {t("personalInformation")}
        </Typography>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={6}>
            <Grid item xs={12} md={7}>
              <Box sx={{ marginBottom: "26px" }}>
                <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                  {t("fullname")}
                </InputLabel>
                <Controller
                  name="fullName"
                  control={control}
                  {...register("fullName", {
                    required: "fullName Address is required",
                  })}
                  render={({ field }) => <TextField {...field} fullWidth />}
                />
                {errors.fullName?.type === "required" && (
                  <Typography
                    color="error"
                    role="alert"
                    sx={{ fontSize: "13px", marginTop: "6px" }}
                  >
                    this field is required
                  </Typography>
                )}
              </Box>
              <Box sx={{ marginBottom: "26px" }}>
                <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                  {t("gender")}
                </InputLabel>
                <Controller
                  name="gender"
                  control={control}
                  {...register("gender", { required: "gender is required" })}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
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
                    this field is required
                  </Typography>
                )}
              </Box>
              <Box sx={{ marginBottom: "26px" }}>
                <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                  {t("timezone")}
                </InputLabel>
                <SelectTimeZone
                  selectedTimezone={regionTime}
                  setSelectedTimezone={setRegionTime}
                />
              </Box>
              <Box sx={{ marginBottom: "26px" }}>
                <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                  {t("birth")}
                </InputLabel>
                <Controller
                  name="dateOfBirth"
                  control={control}
                  render={({ field }) => (
                    <TextField {...field} fullWidth type={"date"} />
                  )}
                />
              </Box>
              <Box sx={{ direction: "rtl", marginBottom: "26px" }}>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => <PhoneInput {...field} />}
                  {...register("phone", {
                    required: "phone Address is required",
                  })}
                />
                {errors.phone?.type === "required" && (
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
                <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                  {t("city")}
                </InputLabel>
                <Controller
                  name="city"
                  control={control}
                  render={({ field }) => <TextField {...field} fullWidth />}
                  {...register("city", {
                    required: "city Address is required",
                  })}
                />
                {errors.city?.type === "required" && (
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
                <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                  {t("location")}
                </InputLabel>
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      MenuProps={{
                        elevation: 1,
                        PaperProps: {
                          style: {
                            maxHeight: 48 * 3 + 8,
                            width: 160,
                          },
                        },
                      }}
                      {...register("location", {
                        required: "location is required",
                      })}
                    >
                      {countries.map((op, index) => {
                        return (
                          <MenuItem key={index + "mjnnj"} value={op.code}>
                            {lang === "en" ? op.name_en : op.name_ar}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  )}
                />
                {errors.location?.type === "required" && (
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
                <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                  {t("nationality")}
                </InputLabel>
                <Controller
                  name="nationality"
                  control={control}
                  render={({ field }) => (
                    <Select
                      {...field}
                      fullWidth
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      MenuProps={{
                        elevation: 1,
                        PaperProps: {
                          style: {
                            maxHeight: 48 * 3 + 8,
                            width: 160,
                          },
                        },
                      }}
                      {...register("nationality", {
                        required: "nationality is required",
                      })}
                    >
                      {countries.map((op, index) => {
                        return (
                          <MenuItem key={index + "mjnnj"} value={op.code}>
                            {lang === "en" ? op.name_en : op.name_ar}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  )}
                />
              </Box>
              <AddLanguages
                chosenlanguages={chosenlanguages}
                setChosenLanguages={setChosenLanguages}
              />
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
                              label={
                                lang === "ar" ? item.titleAR : item.titleEN
                              }
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
                              label={
                                lang === "ar" ? item.titleAR : item.titleEN
                              }
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
                              label={
                                lang === "ar" ? item.titleAR : item.titleEN
                              }
                              key={index + "ma"}
                              control={<Radio size="2px" />}
                            />
                          );
                        })}
                    </RadioGroup>
                  )}
                />
              </Box>
            </Grid>
          </Grid>
          {load ? (
            <Button
              variant="contained"
              color="secondary"
              sx={{ marginY: "10px", opacity: 0.7 }}
            >
              {t("save")}...
            </Button>
          ) : (
            <Button
              variant="contained"
              color="secondary"
              type="submit"
              sx={{ marginY: "10px" }}
            >
              {t("save")}
            </Button>
          )}
        </form>
      </Paper>
    </AdminLayout>
  );
};

export default AdminEditStudent;
