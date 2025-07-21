// src/pages/teacher/StepTwo.jsx
import React, { useState } from "react";
import { Box, Button, Container, Grid, Paper, styled } from "@mui/material";
import Navbar from "../../../components/Navbar";
import AdsStepper from "../../../components/guest/AdsStepper";
import StepperButtonsGuest from "../../../components/reusableUi/StepperButtonsGuest";
import { useParams, useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import noimage from "../../../images/noimage.svg";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Label = styled("label")({
  width: "100%",
  display: "block",
  padding: "6px 16px",
  cursor: "pointer",
});

const Image = styled("img")({
  width: "90%",
  border: "1px solid #323232",
  padding: "10px",
  borderRadius: "25px",
});

export default function StepTwo() {
  const { AdsId } = useParams();
  const { token } = useSelector((state) => state.guest);
  const navigate = useNavigate();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { t } = useTranslation();

  const [load, setLoad] = useState(false);

  const [images, setImages] = useState(
    Array(8).fill({ file: null, preview: noimage })
  );

  const handleImageChange = (e, index) => {
    const updated = [...images];
    updated[index] = {
      file: e.target.files[0],
      preview: URL.createObjectURL(e.target.files[0]),
    };
    setImages(updated);
  };

  const handleButtonSubmit = async () => {
    closeSnackbar();
    const hasImage = images.some((img) => img.file);
    if (!hasImage) {
      enqueueSnackbar(t("image_required"), { variant: "error" });
      return;
    }

    setLoad(true);

    try {
      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        if (img.file) {
          const formData = new FormData();
          formData.append("image", img.file);

          const response = await fetch(
            `${process.env.REACT_APP_API_KEY}api/v1/teacher/ads-step-two/${AdsId}`,
            {
              method: "POST",
              headers: {
                Authorization: token,
              },
              body: formData,
            }
          );

          if (!response.ok) {
            enqueueSnackbar(t("image_upload_error"), {
              variant: "error",
            });
            throw new Error(`Failed to upload image ${i + 1}`);
          }

          enqueueSnackbar(`${t("update_success")} - ${i + 1}`, {
            variant: "success",
          });
        }
      }

      navigate(`/teacher/create-ads/step3/${AdsId}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoad(false);
    }
  };

  return (
    <Navbar>
      <AdsStepper title={t("AdsImags")} active={1} />
      <Container sx={{ mt: 2, mb: 5 }}>
        <Paper sx={{ p: 4 }}>
          <Grid container spacing={3}>
            {images.map((img, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box>
                  <Image src={img.preview} alt={`image-${index + 1}`} />
                  <input
                    type="file"
                    id={`image-${index}`}
                    hidden
                    onChange={(e) => handleImageChange(e, index)}
                  />
                  <Button variant="contained" sx={{ mt: 1 }}>
                    <Label htmlFor={`image-${index}`}>
                      {t("upload_photo")} #{index + 1}
                    </Label>
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>

          <StepperButtonsGuest onSubmit={handleButtonSubmit} load={load} />
        </Paper>
      </Container>
    </Navbar>
  );
}
