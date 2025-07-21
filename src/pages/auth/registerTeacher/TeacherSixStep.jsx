import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  FormControlLabel,
  InputLabel,
  Radio,
  RadioGroup,
  Typography,
  Container,
  Button,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

import Navbar from "../../../components/Navbar";
import CheckBoxLevels from "../../../components/teacher/CheckBoxLevels";
import CheckBoxCurriculum from "../../../components/teacher/CheckBoxCurriculum";
import CheckBoxTrainingCategoryTypes from "../../../components/teacher/CheckBoxTrainingCategoryTypes";
import CheckBoxLimeType from "../../../components/teacher/CheckBoxLimeType";
import HeaderSteps from "../../../components/auth/HeaderSteps";

function TeacherSixStep() {
  const { t } = useTranslation();
  const [checked, setChecked] = useState([]);
  const [checked_2, setChecked_2] = useState([]);
  const [checked_3, setChecked_3] = useState([]);
  const [checked_4, setChecked_4] = useState([]);
  const token = localStorage.getItem("token");
  const teacher = JSON.parse(localStorage.getItem("teacher"));
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [profit, setProfit] = useState("");

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      certificates: "",
      experience: "",
      yearsOfExperience: "",
      gender: "",
      hours_per_week: "",
      bank_name: "",
      acc_name: "",
      acc_number: "",
      iban: "",
      paypal_acc: "",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/teacher/profit-ratio`
        );
        if (!response.ok) throw new Error("Request failed");
        const resData = await response.json();
        setProfit(resData.profitRatio);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (passedData) => {
    setLoad(true);
    try {
      // تحقق من أن كل checkboxes مختارة
      if (
        checked.length === 0 ||
        checked_2.length === 0 ||
        checked_3.length === 0 ||
        checked_4.length === 0
      ) {
        enqueueSnackbar(t("please_select_all_required_fields"), {
          variant: "warning",
        });
        setLoad(false);
        return;
      }

      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/additionalInfo/${teacher.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            curriculums: checked_2,
            levels: checked,
            trainingcategorytypes: checked_3,
            limetypes: checked_4,
            haveCertificates: passedData.certificates === "yes",
            haveExperience: passedData.experience === "yes",
            favHours: passedData.hours_per_week,
            favStdGender: passedData.gender,
            experienceYears: passedData.yearsOfExperience,
            bank_name: passedData.bank_name,
            acc_name: passedData.acc_name,
            acc_number: passedData.acc_number,
            iban: passedData.iban,
            paypal_acc: passedData.paypal_acc,
          }),
        }
      );

      const resData = await response.json();
      setLoad(false);

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Something went wrong");
      }

      enqueueSnackbar(t("update_success"), {
        variant: "success",
        autoHideDuration: 1000,
      });
      navigate("/teacherRegister/step7");
    } catch (err) {
      console.log(err);
      enqueueSnackbar(t("something_went_wrong"), {
        variant: "error",
      });
      setLoad(false);
    }
  };

  return (
    <Navbar>
      <Container sx={{ marginTop: "110px", marginBottom: "2rem" }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <HeaderSteps step={6} title={t("Professional data")} steps={9} />

          {/* الشهادات */}
          <Box sx={{ marginBottom: "26px" }}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
              {t("certificates")}
            </InputLabel>
            <Controller
              name="certificates"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel value="yes" control={<Radio />} label={t("yes")} />
                  <FormControlLabel value="no" control={<Radio />} label={t("no")} />
                </RadioGroup>
              )}
            />
            {errors.certificates && (
              <Typography color="error" sx={{ fontSize: "13px", mt: 1 }}>
                {t("required")}
              </Typography>
            )}
          </Box>

          {/* الخبرة */}
          <Box sx={{ marginBottom: "26px" }}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
              {t("experience")}
            </InputLabel>
            <Controller
              name="experience"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel value="yes" control={<Radio />} label={t("yes")} />
                  <FormControlLabel value="no" control={<Radio />} label={t("no")} />
                </RadioGroup>
              )}
            />
            {errors.experience && (
              <Typography color="error" sx={{ fontSize: "13px", mt: 1 }}>
                {t("required")}
              </Typography>
            )}
          </Box>

          {/* سنوات الخبرة */}
          <Box sx={{ marginBottom: "26px" }}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
              {t("yearsExp")}
            </InputLabel>
            <Controller
              name="yearsOfExperience"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel value="0" control={<Radio />} label="0" />
                  <FormControlLabel value="1" control={<Radio />} label="1" />
                  <FormControlLabel value="2-4" control={<Radio />} label="2-4" />
                  <FormControlLabel value="5-10" control={<Radio />} label="5-10" />
                  <FormControlLabel value="+10" control={<Radio />} label="+10" />
                </RadioGroup>
              )}
            />
            {errors.yearsOfExperience && (
              <Typography color="error" sx={{ fontSize: "13px", mt: 1 }}>
                {t("required")}
              </Typography>
            )}
          </Box>

          {/* الجنس */}
          <Box sx={{ marginBottom: "26px" }}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
              {t("genderType")}
            </InputLabel>
            <Controller
              name="gender"
              control={control}
              rules={{ required: true }}
              render={({ field }) => (
                <RadioGroup {...field}>
                  <FormControlLabel value="male" control={<Radio />} label={t("male")} />
                  <FormControlLabel value="female" control={<Radio />} label={t("female")} />
                  <FormControlLabel value="both" control={<Radio />} label={t("both")} />
                </RadioGroup>
              )}
            />
            {errors.gender && (
              <Typography color="error" sx={{ fontSize: "13px", mt: 1 }}>
                {t("required")}
              </Typography>
            )}
          </Box>

          {/* checkboxes */}
          <CheckBoxLevels checked={checked} setChecked={setChecked} />
          {checked.length === 0 && (
            <Typography color="error" sx={{ fontSize: "13px", mb: 2 }}>
              {t("required")}
            </Typography>
          )}

          <CheckBoxCurriculum checked={checked_2} setChecked={setChecked_2} />
          {checked_2.length === 0 && (
            <Typography color="error" sx={{ fontSize: "13px", mb: 2 }}>
              {t("required")}
            </Typography>
          )}

          <CheckBoxTrainingCategoryTypes checked={checked_3} setChecked={setChecked_3} />
          {checked_3.length === 0 && (
            <Typography color="error" sx={{ fontSize: "13px", mb: 2 }}>
              {t("required")}
            </Typography>
          )}

          <CheckBoxLimeType checked={checked_4} setChecked={setChecked_4} />
          {checked_4.length === 0 && (
            <Typography color="error" sx={{ fontSize: "13px", mb: 2 }}>
              {t("required")}
            </Typography>
          )}

          <Button
            variant="contained"
            type="submit"
            disabled={load}
            sx={{ textTransform: "capitalize" }}
          >
            {load ? t("loading") : t("next")}
          </Button>
        </form>
      </Container>
    </Navbar>
  );
}

export default TeacherSixStep;
