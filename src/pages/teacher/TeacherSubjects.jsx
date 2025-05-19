import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import TeacherLayout from "../../components/teacher/TeacherLayout";
import CheckBoxSubjects from "../../components/teacher/CheckBoxSubjects";
import {
  Alert,  Box,  Checkbox,  Divider,
  FormControlLabel, Grid,
  InputLabel, MenuItem,
  Select,     Snackbar,
  TextField,  Typography,
  Paper
} from "@mui/material";
import SelectedCategory from "../../components/teacher/SelectedCategory";
import StepperButtons from "../../components/reusableUi/StepperButtons";
import { useTranslation } from "react-i18next";
import { useSubjects } from "../../hooks/useSubject";
import currencies from "../../data/currencies";
import { useDispatch, useSelector } from "react-redux";
import { useTeacher } from "../../hooks/useTeacher";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { changeCurrency } from "../../redux/currency";
import { fetchConversionRate } from "../../redux/conversionRate";

export default function TeacherSubjects() {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { teacher, token } = useSelector((state) => state.teacher);
  const { data: teacher2, isLoading: isLoading2 } = useTeacher(teacher.id);
  const { data, isLoading } = useSubjects();
  const [choseCategories, setChosenCategories] = useState([]);
  const [load, setLoad] = useState(false);
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState(false);
  const [person, setPerson] = useState(false);
  const [studentHome, setStudentHome] = useState(false);
  const [teeacherHome, setTeacherHome] = useState(false);
  const [remote, setRemote] = useState(null);
  const [f2fStudent, setf2fStudent] = useState(null);
  const [f2fTeacher, setf2fTeacher] = useState(null);
  const [discount, setDiscount] = useState(0);
  const { currency } = useSelector((state) => state.currency);
  const dispatch = useDispatch();

  const handleCurrencyChange = (e) => {
    dispatch(changeCurrency({ currency: e.target.value }));
    dispatch(fetchConversionRate(e.target.value));
  };

  function handleDeleteSelectedCategory(id) {
    setChosenCategories((back) => back.filter((categ) => categ.id !== id));
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleDiscount = (e) => {
    closeSnackbar();
    if (e.target.value < 0 || e.target.value > 100) {
      enqueueSnackbar(t("discount_error"), {
        variant: "error",
        autoHideDuration: "5000",
      });
    } else {
      setDiscount(e.target.value);
    }
  };

  useEffect(() => {
    if (teacher2) {
      const user = teacher2?.data;
      if (user?.TeacherSubjects.length > 0) {
        setChosenCategories(user?.TeacherSubjects.map((cat) => cat?.Subject));
      }
      if (user?.RemoteSession) {
        setOnline(true);
        setRemote({
          price: +user?.RemoteSession?.price,
          TeacherId: user?.RemoteSession?.TeacherId,
          discount: discount,
        });
        setDiscount(user?.RemoteSession?.discount);
        dispatch(changeCurrency({ currency: user?.RemoteSession?.currency }));
      }
      if (user?.F2FSessionStd) {
        setPerson(true);
        setStudentHome(true);
        setf2fStudent({
          price: +user?.F2FSessionStd?.price,
          TeacherId: user?.F2FSessionStd?.TeacherId,
          discount: discount,
        });
        setDiscount(user?.F2FSessionStd?.discount);
        dispatch(changeCurrency({ currency: user?.F2FSessionStd?.currency }));
      }
      if (user?.F2FSessionTeacher) {
        setPerson(true);
        setTeacherHome(true);
        setf2fTeacher({
          price: +user?.F2FSessionTeacher?.price,
          TeacherId: user?.F2FSessionTeacher?.TeacherId,
          // currency: user?.F2FSessionTeacher?.currency,
          discount: discount,
        });
        setDiscount(user?.F2FSessionTeacher?.discount);
        dispatch(
          changeCurrency({ currency: user?.F2FSessionTeacher?.currency })
        );
      }
      dispatch(fetchConversionRate(currency));
    }
  }, [teacher2]);

  const onSubmit = async () => {
    setLoad(true);
    let ar1 = choseCategories.map((sub) => {
      return { TeacherId: teacher.id, SubjectId: sub.id };
    });
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/subjects/${teacher.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            subjects: ar1,
            remote:
              discount >= 0 && remote
                ? { ...remote, currency, discount: +discount }
                : remote,
            f2fStudent:
              discount >= 0 && f2fStudent
                ? { ...f2fStudent, currency, discount: +discount }
                : f2fStudent,
            f2fTeacher:
              discount >= 0 && f2fTeacher
                ? { ...f2fTeacher, currency, discount: +discount }
                : f2fTeacher,
          }),
        }
      );
      setLoad(false);
      const resData = await response.json();
      if (resData.status !== 200 && resData.status !== 201) {
        throw new Error("");
      } else {
        enqueueSnackbar(t("update_success"), {
          variant: "success",
          autoHideDuration: 1000,
        });
        navigate("/teacher/resume");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Navbar>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          {t("discount_error")}
        </Alert>
      </Snackbar>
      <TeacherLayout active={3} title={t("subjects")}>
      <Paper sx={{padding:"40px 20px"}}>
        {!isLoading && (
          <Grid container spacing={4}>
            <Grid item xs={12} lg={9}>
              {data?.data.map((subject, index) => {
                return (
                  <CheckBoxSubjects
                    subject={subject}
                    key={index + "p1"}
                    choseCategories={choseCategories}
                    setChosenCategories={setChosenCategories}
                  />
                );
              })}
            </Grid>
            <Grid item xs={9} md={5} lg={3}>
              <Typography sx={{ fontSize: "15px", marginBottom: "12px" }}>
                {t("selectedsubjects")}
              </Typography>
              <Divider />
              {choseCategories.length > 0 &&
                choseCategories.map((categ, index) => {
                  return (
                    <SelectedCategory
                      categ={categ}
                      key={index + "p1"}
                      onClick={() => handleDeleteSelectedCategory(categ.id)}
                    />
                  );
                })}
            </Grid>
          </Grid>
        )}
        <Grid container>
          <Grid item xs={12} lg={9}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
              {t("discount")}
            </InputLabel>
            <TextField
              fullWidth
              name="discount"
              type="number"
              min="0"
              max="100"
              required
              sx={{ marginBottom: 3 }}
              onChange={handleDiscount}
              value={discount}
            />
          </Grid>
        </Grid>
        <Box sx={{ marginTop: "40px", width: "100%" }}>
          <Divider sx={{ marginBottom: "40px" }} />
          <Typography
            sx={{ fontSize: "20px", fontWeight: "600", marginBottom: "18px" }}
          >
            {t("wouldTeach")}
          </Typography>
          <Box>
            <Box sx={{ marginBottom: "30px" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => {
                      setOnline((back) => !back);
                      setRemote(null);
                    }}
                    checked={online}
                  />
                }
                label={t("online")}
              />

              {online && (
                <Grid
                  container
                  sx={{ marginY: "2px", paddingX: "30px" }}
                  spacing={1}
                  alignItems="center"
                >
                  <Grid item xs={12} md={6}>
                    <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                      {t("rateperhour")}
                    </InputLabel>
                    <TextField
                      fullWidth
                      type="number"
                      name="rate"
                      value={remote?.price}
                      onChange={(e) =>
                        setRemote((pre) => {
                          return {
                            ...pre,
                            price: e.target.value,
                            TeacherId: teacher.id,
                          };
                        })
                      }
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                      {t("Currency")}
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      fullWidth
                      value={currency}
                      onChange={handleCurrencyChange}
                    >
                      {currencies.map((item, index) => {
                        return (
                          <MenuItem value={item.title} key={index + "mhb"}>
                            {item.title}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </Grid>
                </Grid>
              )}
            </Box>
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    onChange={() => {
                      setPerson((back) => !back);
                      setf2fTeacher(null);
                      setf2fStudent(null);
                    }}
                    checked={person}
                  />
                }
                label={t("person")}
              />
              {person && (
                <Box sx={{ paddingX: "20px", marginTop: "20px" }}>
                  <Box sx={{ marginBottom: "30px" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          onChange={() => {
                            setTeacherHome((back) => !back);
                            setf2fTeacher(null);
                          }}
                          checked={teeacherHome}
                        />
                      }
                      label={t("home")}
                    />
                    {teeacherHome && (
                      <Grid
                        container
                        sx={{ marginY: "2px", paddingX: "30px" }}
                        spacing={3}
                        alignItems="center"
                      >
                        <Grid item xs={12} md={6}>
                          <InputLabel
                            sx={{ marginBottom: "6px", fontSize: "13px" }}
                          >
                            {t("rateperhour")}
                          </InputLabel>
                          <TextField
                            fullWidth
                            type="number"
                            name="rate"
                            value={f2fTeacher?.price}
                            onChange={(e) => {
                              setf2fTeacher((pre) => {
                                return {
                                  ...pre,
                                  price: e.target.value,
                                  TeacherId: teacher.id,
                                };
                              });
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <InputLabel
                            sx={{ marginBottom: "6px", fontSize: "13px" }}
                          >
                            {t("Currency")}
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            fullWidth
                            value={currency}
                            onChange={handleCurrencyChange}
                          >
                            {currencies.map((item, index) => {
                              return (
                                <MenuItem
                                  value={item.title}
                                  key={index + "mhnmnjjnb"}
                                >
                                  {item.title}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </Grid>
                      </Grid>
                    )}
                  </Box>
                  <Box sx={{ marginBottom: "30px" }}>
                    <FormControlLabel
                      control={
                        <Checkbox
                          size="small"
                          onChange={() => {
                            setStudentHome((back) => !back);
                            setf2fStudent(null);
                          }}
                          checked={studentHome}
                        />
                      }
                      label={t("studenthome")}
                    />
                    {studentHome && (
                      <Grid
                        container
                        sx={{ marginY: "2px", paddingX: "30px" }}
                        spacing={3}
                        alignItems="center"
                      >
                        <Grid item xs={12} md={6}>
                          <InputLabel
                            sx={{ marginBottom: "6px", fontSize: "13px" }}
                          >
                            {t("rateperhour")}
                          </InputLabel>
                          <TextField
                            fullWidth
                            type="number"
                            name="rate-"
                            value={f2fStudent?.price}
                            onChange={(e) =>
                              setf2fStudent((pre) => {
                                return {
                                  ...pre,
                                  price: e.target.value,
                                  TeacherId: teacher.id,
                                };
                              })
                            }
                          />
                        </Grid>
                        <Grid item xs={12} md={6}>
                          <InputLabel
                            sx={{ marginBottom: "6px", fontSize: "13px" }}
                          >
                            {t("Currency")}
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            fullWidth
                            value={currency}
                            onChange={handleCurrencyChange}
                          >
                            {currencies.map((item, index) => {
                              return (
                                <MenuItem
                                  value={item.title}
                                  key={index + "mhbnbhx"}
                                >
                                  {item.title}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </Grid>
                      </Grid>
                    )}
                  </Box>
                </Box>
              )}
            </Box>
          </Box>
        </Box>
        <StepperButtons skipLink="resume" onSubmit={onSubmit} load={load} />
    </Paper>  
    </TeacherLayout>
    </Navbar>
  );
}
