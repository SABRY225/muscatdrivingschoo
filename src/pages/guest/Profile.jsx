import { FormControl,Grid, InputLabel, MenuItem, Paper,  Select, Typography, Box,  TextField,  Button,  FormControlLabel,    RadioGroup,   Radio,  Autocomplete,} from "@mui/material";
import React, { useEffect, useState } from "react";
import Layout from "../../components/guest/Layout";
import { useForm, Controller } from "react-hook-form";
import { useTranslation }   from "react-i18next";
import { useSelector }      from "react-redux";
import { changeGuestName }  from "../../redux/guestSlice";
import { useDispatch }      from "react-redux";
import { useSnackbar }      from "notistack";
import { useGuest }         from "../../hooks/useGuest";
import Cookies from "js-cookie";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import countries from "../../data/countries";

export default function Profile() {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const lang = Cookies.get("i18next") || "en";
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { guest, token } = useSelector((s) => s.guest);
  console.log(guest);
  console.log(guest?.id);

  const { data, isLoading } = useGuest(guest?.id);
  const [chosenlanguages, setChosenLanguages] = useState([]);
  const [load, setLoad] = useState(false);
  const [regionTime, setRegionTime] = useState(null);
  const [countryValue, setCountryValue] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [countryError, setCountryError] = useState(false);
  const [nationalityValue, setNationalityValue] = useState("");
  const [nationalityCode, setNationalityCode] = useState("");
  const [nationalityError, setNationalityError] = useState(false);

  const {
    register,control, formState: { errors }, handleSubmit, watch,  reset,
  } = useForm({
    defaultValues: {
      gender: "",
      fullName: "",
      dateOfBirth: "",
      phone: "",
      city: "",
      regionTime: "",
      location: "",
      nationality: "",
    },
  });

  useEffect(() => {
    if (data) {
      console.log(data);
      const user = data?.data;
      
      reset({
        fullName    : user?.name,
        gender      : user?.gender,
        dateOfBirth : user?.dateOfBirth,
        phone       : user?.phoneNumber,
        city        : user?.city,
        location    : user?.location,
        nationality: user?.nationality,
      });
      let c;
      if (user?.location) {
        c = countries.find((e) => e.code == user.location);
        setCountryValue(lang === "en" ? c.name_en : c.name_ar);
        setCountryCode(c.code);
      }
      if (user?.nationality) {
        c = countries.find((e) => e.code == user.nationality);
        setNationalityValue(lang === "en" ? c.name_en : c.name_ar);
        setNationalityCode(c.code);
      }
    }
  }, [data]);

  const onSubmit = async (data) => {
    if (countryCode === "") {
      setCountryError(true);
      return;
    }
    if (nationalityCode === "") {
      setNationalityError(true);
      return;
    }
    closeSnackbar();
    setLoad(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/guest/editProfile/${guest.id}`,
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
            nationality: nationalityCode,
            location: countryCode,
          }),
        }
      );
      const resData = await response.json();
      if (response.status !== 200 && response.status !== 201) {
        setLoad(false);
        throw new Error("failed occured");
      }
      dispatch(changeGuestName({ name: data.fullName }));
      enqueueSnackbar(
        lang === "ar" ? resData.msg.arabic : resData.msg.english,
        { variant: "success", autoHideDuration: 8000 }
      );
      setLoad(false);
    } catch (err) {
      console.log(err);
    }
  };


  return (
    <Layout>
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
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                 <b className="b-pass"> {t("phone")} </b>
                </InputLabel>
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
                <Autocomplete
                  fullWidth
                  name="country"
                  options={countries}
                  value={countryValue}
                  inputValue={countryValue}
                  onChange={(event, newInputValue) => {
                    if (newInputValue) {
                      setCountryValue(
                        lang === "en"
                          ? newInputValue?.name_en
                          : newInputValue?.name_ar
                      );
                      setCountryCode(newInputValue?.code);
                      setCountryError(false);
                    } else {
                      setCountryValue("");
                      setCountryCode("");
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    setCountryValue(newInputValue);
                  }}
                  getOptionLabel={(op) =>
                    (lang === "en" ? op.name_en : op.name_ar) || op
                  }
                  isOptionEqualToValue={(op, value) =>
                    lang === "en" ? op.name_en == value : op.name_ar == value
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={lang === "en" ? "Choose a country" : "إختر بلدك"}
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password",
                      }}
                    />
                  )}
                />
                {countryError && (
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
                <Autocomplete
                  fullWidth
                  name="nationality"
                  options={countries}
                  value={nationalityValue}
                  inputValue={nationalityValue}
                  onChange={(event, newInputValue) => {
                    if (newInputValue) {
                      setNationalityValue(
                        lang === "en"
                          ? newInputValue?.name_en
                          : newInputValue?.name_ar
                      );
                      setNationalityCode(newInputValue?.code);
                      setNationalityError(false);
                    } else {
                      setNationalityValue("");
                      setNationalityCode("");
                    }
                  }}
                  onInputChange={(event, newInputValue) => {
                    setNationalityValue(newInputValue);
                  }}
                  getOptionLabel={(op) =>
                    (lang === "en" ? op.name_en : op.name_ar) || op
                  }
                  isOptionEqualToValue={(op, value) =>
                    lang === "en" ? op?.name_en == value : op?.name_ar == value
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label={
                        lang === "en" ? "Choose a nationality" : "إختر جنسيتك"
                      }
                      inputProps={{
                        ...params.inputProps,
                        autoComplete: "new-password",
                      }}
                    />
                  )}
                />
                {nationalityError && (
                  <Typography
                    color="error"
                    role="alert"
                    sx={{ fontSize: "13px", marginTop: "6px" }}
                  >
                    {t("required")}
                  </Typography>
                )}
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
    </Layout>
  );
}
