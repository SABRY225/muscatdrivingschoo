import {
  Grid,
  InputLabel,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ParentLayout from "../../components/parent/ParentLayout";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { changeParentName } from "../../redux/parentSlice";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useSnackbar } from "notistack";

import { useParent } from "../../hooks/useParent";

export default function ParentProfile() {
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const lang = Cookies.get("i18next") || "en";
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { parent, token }   = useSelector((s) => s.parent);
  const { data, isLoading } = useParent(parent?.id , token);
  const [load, setLoad]     = useState(false);


  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      name: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (data) {
      const user = data?.data;
      reset({
        name:   user?.name,
        phone:  user?.phone,
        email:  user?.email,
      });
    }
  }, [data]);

  const onSubmit = async (data) => {
    closeSnackbar();
    setLoad(true);
    try {
      console.log("DATA");
      console.log(data);
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/parent/editProfile/${parent.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
            
          },
          body: JSON.stringify({
            name:  data.name,
            phone: data.phone,
          }),
        }
      );
      const resData = await response.json();
      if (resData.status !== 200 && resData.status !== 201) {
        setLoad(false);
        throw new Error("failed occured");
      }
      dispatch(changeParentName({ name: data.name }));
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
    <ParentLayout>
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
                  name="name"
                  control={control}
                  {...register("name", {
                    required: "Name Address is required",
                  })}
                  render={({ field }) => <TextField {...field} fullWidth />}
                />
                {errors.name?.type === "required" && (
                  <Typography
                    color="error"
                    role="alert"
                    sx={{ fontSize: "13px", marginTop: "6px" }}
                  >
                    this field is required
                  </Typography>
                )}
              </Box>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" , textAlign:"right" , direction: "ltr", }}>
                  {t("phone")}
                </InputLabel>
              <Box sx={{ direction: "rtl", marginBottom: "26px" }}>
              
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => <PhoneInput {...field} />}
                  {...register("phone", {
                    required: "Phone is required",
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
    </ParentLayout>
  );
}
