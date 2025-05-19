import {
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
                  render={({ field }) => <PhoneInput {...field} />}
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
            {/* -------------------------- */}
            <Box sx={{ marginBottom: "30px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("place")}
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
