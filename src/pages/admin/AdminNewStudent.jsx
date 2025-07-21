import {
  Autocomplete,
  Box,
  Button,
  Container,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AdminLayout from "../../components/admin/AdminLayout";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import PhoneInput from "react-phone-input-2";
import { useSelector } from "react-redux";
import countries from "../../data/countries";
import { useState } from "react";

const AdminNewStudent = () => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
      phoneNumber: "",
      location: "",
      password: "",
    },
  });

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const lang = Cookies.get("i18next") || "en";
  const { token } = useSelector((state) => state.admin);
  const [countryCode, setCountryCode] = useState("om"); // افتراضي عمان

  async function onSubmit(data) {
    closeSnackbar();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/createStudent`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify(data),
        }
      );
      if (response.status !== 200 && response.status !== 201) {
        enqueueSnackbar(
          lang === "ar" ? "الإيميل مستخدم من قبل" : "email already used",
          { variant: "error", autoHideDuration: 1000 }
        );
        throw new Error("failed occured");
      } else {
        const resData = await response.json();
        enqueueSnackbar(
          lang === "ar" ? resData.msg.arabic : resData.msg.english,
          { variant: "success", autoHideDuration: 1000 }
        );

        navigate("/admin/students");
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <AdminLayout>
      <Container>
        <Paper
          sx={{
            width: { md: "450px" },
            padding: "30px 50px",
            marginBottom: "60px",
            marginX: "auto",
          }}
        >
          <Typography sx={{ fontSize: 24, fontWeight: "bold", marginY: 2 }}>
            {t("newAccount")}
          </Typography>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("email")}
              </InputLabel>
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <TextField type="text" {...field} fullWidth />
                )}
                {...register("email", {
                  required: "email Address is required",
                })}
              />
              {errors.email?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            {/* Added by Abdelwahab */}
            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("phone")}
              </InputLabel>
              <Box sx={{ direction: "rtl" }}>
                <Controller
                  name="phoneNumber"
                  control={control}
                  render={({ field }) => <PhoneInput
                      {...field}
                      inputStyle={{ width: "100%" }}
                      country={"om"}
                    />}
                  {...register("phoneNumber", {
                    required: "Phone Number is required",
                  })}
                />
                {errors.phoneNumber?.type === "required" && (
                  <Typography
                    color="error"
                    role="alert"
                    sx={{
                      fontSize: "13px",
                      marginTop: "6px",
                      direction: lang === "en" ? "rtl" : "ltr",
                    }}
                  >
                    {t("required")}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("name")}
              </InputLabel>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField type="text" {...field} fullWidth />
                )}
                {...register("name", {
                  required: "name is required",
                })}
              />
              {errors.name?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            {/* ---------------------  location ----- */}
            <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                              {t("country")}
                            </InputLabel>
                            <Controller
                              name="location"
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
            {/* -------------------------- */}
            <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("password")}
              </InputLabel>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField type="password" {...field} fullWidth />
                )}
                {...register("password", {
                  required: "password Address is required",
                })}
              />
              {errors.email?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            {/* ------------------- */}
            <Button
              variant="contained"
              color="secondary"
              fullWidth
              type="submit"
              sx={{ textTransform: "capitalize" }}
            >
              {t("register")}
            </Button>
          </form>
        </Paper>
      </Container>
    </AdminLayout>
  );
};

export default AdminNewStudent;
