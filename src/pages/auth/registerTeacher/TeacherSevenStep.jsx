import {  useState } from "react";
import {
  Alert, Box, Checkbox, Divider,
  FormControlLabel, Grid,
  InputLabel, MenuItem,
  Select, Snackbar,
  TextField, Typography,
  Container, Button
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useSubjects } from "../../../hooks/useSubject";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import Navbar from "../../../components/Navbar";
import CheckBoxSubjects from "../../../components/teacher/CheckBoxSubjects";
import SelectedCategory from "../../../components/teacher/SelectedCategory";
import currencies from "../../../data/currencies";
import HeaderSteps from "../../../components/auth/HeaderSteps";

function TeacherSevenStep() {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const teacher = JSON.parse(localStorage.getItem("teacher"));
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

  function handleDeleteSelectedCategory(id) {
    setChosenCategories((back) => back.filter((categ) => categ.id !== id));
  }


  const handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  const handleDiscount = (e) => {
    closeSnackbar();
    if (e.target.value < 0 || e.target.value > 100) {
      enqueueSnackbar(t("discount_error"), { variant: "error", autoHideDuration: 5000 });
    } else {
      setDiscount(e.target.value);
    }
  };

  const validateForm = () => {
    if (choseCategories.length === 0) {
      enqueueSnackbar(t("required_subjects"), { variant: "warning" });
      return false;
    }
    if (!online && !person) {
      enqueueSnackbar(t("select_teaching_method"), { variant: "warning" });
      return false;
    }
    if (online && (!remote || !remote.price)) {
      enqueueSnackbar(t("enter_online_price"), { variant: "warning" });
      return false;
    }
    if (person) {
      if (!teeacherHome && !studentHome) {
        enqueueSnackbar(t("select_f2f_method"), { variant: "warning" });
        return false;
      }
      if (teeacherHome && (!f2fTeacher || !f2fTeacher.price)) {
        enqueueSnackbar(t("enter_teacher_home_price"), { variant: "warning" });
        return false;
      }
      if (studentHome && (!f2fStudent || !f2fStudent.price)) {
        enqueueSnackbar(t("enter_student_home_price"), { variant: "warning" });
        return false;
      }
    }
    return true;
  };

  const onSubmit = async () => {
    if (!validateForm()) return;
    setLoad(true);
    let ar1 = choseCategories.map((sub) => ({ TeacherId: teacher.id, SubjectId: sub.id }));

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
            remote: discount >= 0 && remote ? { ...remote, currency, discount: +discount } : remote,
            f2fStudent: discount >= 0 && f2fStudent ? { ...f2fStudent, currency, discount: +discount } : f2fStudent,
            f2fTeacher: discount >= 0 && f2fTeacher ? { ...f2fTeacher, currency, discount: +discount } : f2fTeacher,
          }),
        }
      );

      setLoad(false);
      const resData = await response.json();

      if (resData.status !== 200 && resData.status !== 201) throw new Error("");

      enqueueSnackbar(t("update_success"), {
        variant: "success",
        autoHideDuration: 1000,
      });
      navigate("/teacherRegister/step8");
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
          <Container sx={{ marginTop: "110px", marginBottom: "2rem" }}>
         <HeaderSteps step={7} title={t("Professional materials")} steps={9} />
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
                      // onChange={handleCurrencyChange}
                    >
                      {currencies.map((item, index) => {
                        return (
                          <MenuItem value={item.title} key={index + "mhb"}>
                            <div style={{display:"flex",justifyItems:"center",alignItems:"center",gap:".5rem"}}>
                              <div className="pl-1"><img src={`https://flagcdn.com/w320/${item.code}.png`} style={{width:"25px"}} /></div>
                              <div>{t(item.title)}</div>
                            </div>
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
                      // onChange={handleCurrencyChange}
                    >
                      {currencies.map((item, index) => {
                        return (
                          <MenuItem value={item.title} key={index + "mhb"}>
                            <div style={{display:"flex",justifyItems:"center",gap:".5rem"}}>
                              <div className="pl-1"><img src={`https://flagcdn.com/w320/${item.code}.png`} style={{width:"25px"}} /></div>
                              <div>{t(item.title)}</div>
                            </div>
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
                      // onChange={handleCurrencyChange}
                    >
                      {currencies.map((item, index) => {
                        return (
                          <MenuItem value={item.title} key={index + "mhb"}>
                            <div style={{display:"flex",justifyItems:"center",alignItems:"center",gap:".5rem"}}>
                              <div className="pl-1"><img src={`https://flagcdn.com/w320/${item.code}.png`} style={{width:"25px"}} /></div>
                              <div>{t(item.title)}</div>
                            </div>
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
            <Button
  variant="contained"
  onClick={onSubmit}
  disabled={load}
  sx={{ textTransform: "capitalize" }}
>
  {load ? t("loading") : t("next") || "التالي"}
</Button>

        </Container>
        </Navbar>
  )
}

export default TeacherSevenStep