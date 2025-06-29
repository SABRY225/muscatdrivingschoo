import { Button, styled, Box, Container } from "@mui/material";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import Navbar from "../../../components/Navbar";
import HeaderSteps from "../../../components/auth/HeaderSteps";

const Label = styled("label")({
  width: "100%",
  display: "block",
  padding: "6px 16px",
  cursor: "pointer",
});

const Image = styled("img")({
  width: "300px",
  borderRadius: "8px",
  marginBottom: "20px",
});

function TeacherFiveStep() {
  const token = localStorage.getItem("token");
  const teacher = JSON.parse(localStorage.getItem("teacher"));
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState(teacher?.image);
  const [load, setLoad] = useState(false);

  const { t } = useTranslation();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleButtonSubmit = async () => {
    try {
      closeSnackbar();
      setLoad(true);

      if (!image) {
        enqueueSnackbar(t("image_required") || "الرجاء اختيار صورة", {
          variant: "warning",
        });
        setLoad(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", image);

      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/image/${teacher.id}`,
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formData,
        }
      );

      const resData = await response.json();
      setLoad(false);

      if (response.status !== 200 && response.status !== 201) {
        enqueueSnackbar(t("image_upload_error") || "حدث خطأ أثناء رفع الصورة", {
          variant: "error",
        });
        return;
      }

      enqueueSnackbar(t("update_success") || "تم التحديث بنجاح", {
        variant: "success",
      });

      navigate("/teacherRegister/step6");
    } catch (err) {
      setLoad(false);
      console.error(err);
      enqueueSnackbar(t("something_went_wrong") || "حدث خطأ", {
        variant: "error",
      });
    }
  };

  return (
    <Navbar>
      <Container sx={{ marginTop: "110px" }}>
        <HeaderSteps step={5} title={t("profile_photo")} steps={9} />

        <input
          type="file"
          id="image"
          hidden
          accept="image/*"
          onChange={(e) => {
            const selectedFile = e.target.files[0];
            setImage(selectedFile);
            setImageUrl(URL.createObjectURL(selectedFile));
          }}
        />

        <Button
          variant="contained"
          sx={{ textTransform: "capitalize", padding: 0, marginBottom: "20px" }}
        >
          <Label htmlFor="image">{t("upload_photo")}</Label>
        </Button>

        <Box>
          {imageUrl && (
            <Image
              src={
                imageUrl.startsWith("blob")
                  ? imageUrl
                  : `${process.env.REACT_APP_API_KEY}images/${imageUrl}`
              }
              alt="Preview"
            />
          )}
        </Box>

        <Button
          variant="contained"
          onClick={handleButtonSubmit}
          disabled={load}
          sx={{ textTransform: "capitalize" }}
        >
          {load ? t("loading") : t("next") || "التالي"}
        </Button>
      </Container>
    </Navbar>
  );
}

export default TeacherFiveStep;
