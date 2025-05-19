import styled from "@emotion/styled";
import {
  DialogContent,
  DialogActions,
  InputLabel,
  Button,
  Box,
  TextField,
  Typography,
  FormLabel,
} from "@mui/material";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import ImageIcon from "@mui/icons-material/Image";

const Image = styled("img")({
  width: "100%",
  height: "200px",
  borderRadius: "0px",
});

const Input = styled("input")({});

export default function UpdateSubject({ handleClose, subject, setSubjects }) {
  const { token } = useSelector((state) => state.admin);
  const { t } = useTranslation();
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      title_ar: subject?.titleAR,
      title_en: subject?.titleEN,
    },
  });
  const [image, setImage] = useState(null);

  async function onSubmit(data) {
    const formData = new FormData();
    formData.append("titleAR", data.title_ar);
    formData.append("titleEN", data.title_en);
    if (image) {
      formData.append("image", image);
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/updateSubCategories/${subject.id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
          },
          body: formData,
        }
      );
      const resData = await response.json();
      setSubjects((back) =>
        back.map((item) => {
          return item.id === subject.id ? resData.data : item;
        })
      );
      setImage(null);
      handleClose();
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Box sx={{ width: "500px", maxWidth: "100%", paddingTop: "12px" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ marginBottom: "8px" }}>
            <FormLabel htmlFor="image" sx={{ cursor: "pointer" }}>
              تعديل الصورة
            </FormLabel>
            <Input
              type="file"
              id="image"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Box>
          {image && <Image src={URL.createObjectURL(image)} />}
          <Box sx={{ marginBottom: "18px" }}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
              {t("titleAr")}
            </InputLabel>
            <Controller
              name="title_ar"
              control={control}
              render={({ field }) => <TextField {...field} fullWidth />}
              {...register("title_ar", {
                required: "title Address is required",
              })}
            />
            {errors.title_ar?.type === "required" && (
              <Typography
                color="error"
                role="alert"
                sx={{ fontSize: "13px", marginTop: "6px" }}
              >
                {t("required")}
              </Typography>
            )}
          </Box>
          <Box sx={{ marginBottom: "18px" }}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
              {t("titleEn")}
            </InputLabel>
            <Controller
              name="title_en"
              control={control}
              render={({ field }) => <TextField {...field} fullWidth />}
              {...register("title_en", {
                required: "title Address is required",
              })}
            />
            {errors.title_en?.type === "required" && (
              <Typography
                color="error"
                role="alert"
                sx={{ fontSize: "13px", marginTop: "6px" }}
              >
                {t("required")}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{t("cancel")}</Button>
          <Button type="submit">{t("save")}</Button>
        </DialogActions>
      </form>
    </Box>
  );
}
