import {Autocomplete, Box,  Button,   FormControl, InputLabel, MenuItem, Select, TextField,Container, Typography} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useNavigate }  from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import "react-phone-input-2/lib/style.css";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import HeaderSteps from "../../../components/auth/HeaderSteps";
import Navbar from "../../../components/Navbar";
import AddLanguages from "../../../components/reusableUi/AddLanguages";
import countries from "../../../data/countries";


function TeacherFourStep() {
      const token = localStorage.getItem("token")
      const teacher  = JSON.parse(localStorage.getItem("teacher"))
      const [load, setLoad]     = useState(false);
      const lang = Cookies.get("i18next") || "en";
      const { closeSnackbar, enqueueSnackbar } = useSnackbar();
    
      const navigate = useNavigate();
      const { t } = useTranslation();
      const [chosenlanguages, setChosenLanguages] = useState([]);
      const [countryValue, setCountryValue]       = useState("");
      const [countryCode, setCountryCode]         = useState("");
      const [countryError, setCountryError]       = useState(false);
      const {
        register,
        control,
        formState: { errors },
        handleSubmit,
      } = useForm({
        defaultValues: {
          firstName: "",
          lastName: "",
          gender: "",
          dateOfBirth: "",
          phone: teacher.phone,
          country: "",
          city: "",
        },
      });
    
      async function onSubmit(data) {
        if (countryCode === "") {
          setCountryError(true);
          return;
        }
        setLoad(true);
        const languages = chosenlanguages?.map((lang) => {
          return {
            LanguageLevelId: lang.LanguageLevelId,
            TeacherId: teacher?.id,
            LanguageId: lang.LanguageId,
          };
        });
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/teacher/about/${teacher.id}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify({
              ...data,
              country: countryCode,
              languages: languages,
            }),
          }
        );
        setLoad(false);
        enqueueSnackbar(t("update_success"), {
          variant: "success",
          autoHideDuration: 1000,
        });
        navigate("/teacherRegister/step5");
      }
    
  return (
    <Navbar>
        <Container sx={{ marginTop: "110px" }}>
        <HeaderSteps step={4} title={t("Personal data")} steps={9} />
        <form onSubmit={handleSubmit(onSubmit)} >
          <Box >
            <Box sx={{
                display:"flex",
                gap:3
            }}>
            <Box sx={{flex:1, marginBottom: "26px"  }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}> {t("fname")}</InputLabel>
              <Controller name="firstName" control={control} render={({ field }) => <TextField {...field} fullWidth />}
                {...register("firstName", { required: "firstName Address is required",})}/>
              {errors.firstName?.type === "required" && (
                <Typography color="error" role="alert" sx={{ fontSize: "13px", marginTop: "6px" }}>{t("required")}</Typography>
              )}
            </Box>
            <Box sx={{flex:1,  marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("lname")}
              </InputLabel>
              <Controller
                name="lastName"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth />}
                {...register("lastName", {
                  required: "lastName Address is required",
                })}
              />
              {errors.lastName?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            </Box>
            <Box sx={{
                display:"flex",
                gap:3
            }}>
            <Box sx={{flex:1, marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("gender")}
              </InputLabel>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <Select
                      {...field}
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
            <Box sx={{ flex:1,marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("dateOfBirth")}
              </InputLabel>
              <Controller
                name="dateOfBirth"
                control={control}
                render={({ field }) => (
                  <TextField type="date" {...field} fullWidth />
                )}
                {...register("dateOfBirth", {
                  required: "dateOfBirth Address is required",
                })}
              />
              {errors.dateOfBirth?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            </Box>
            <Box sx={{
                display:"flex",
                gap:3
            }}>
            <Box sx={{flex:1, marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("country")}
              </InputLabel>
              <Controller
                              name="country"
                              control={control}
                              rules={{ required: t("required") }}
                              render={({ field }) => (
                                <Autocomplete
                                  options={countries}
                                  getOptionLabel={(option) =>
                                    lang === "en" ? option.name_en : option.name_ar
                                  }
                                  onChange={(_, selected) => {
                                    field.onChange(selected?.code || "");
                                    setCountryCode(selected?.code || "");
                                  }}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label={t("place")}
                                      error={!!errors.place}
                                      helperText={errors.place ? errors.place.message : ""}
                                    />
                                  )}
                                  renderOption={(props, option) => (
                                    <li {...props} style={{ display: "flex", alignItems: "center" }}>
                                      <img
                                        src={`https://flagcdn.com/w40/${option.code}.png`}
                                        alt={option.code}
                                        width="30"
                                        style={{ marginLeft: 8 }}
                                      />
                                      <span>{lang === "en" ? option.name_en : option.name_ar}</span>
                                    </li>
                                  )}
                                />
                              )}
                            />
            </Box>
            <Box sx={{flex:1, marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("city")}
              </InputLabel>
              <Controller
                name="city"
                control={control}
                render={({ field }) => <TextField {...field} fullWidth />}
                {...register("city", { required: "city is required" })}
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
            </Box>

            <AddLanguages
              chosenlanguages={chosenlanguages}
              setChosenLanguages={setChosenLanguages}
            />
          </Box>
          {!load ? (
            <Button variant="contained" type="submit">
              {t("next")}
            </Button>
          ) : (
            <Button variant="contained">{t("next")}...</Button>
          )}
        </form>
        </Container>

    </Navbar>
  )
}

export default TeacherFourStep