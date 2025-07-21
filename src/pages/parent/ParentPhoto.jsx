import React, { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
  styled,
} from "@mui/material";
import ParentLayout from "../../components/parent/ParentLayout";
import { useTranslation } from "react-i18next";
import { useSelector, useDispatch } from "react-redux";
import { useParent } from "../../hooks/useParent";
import { changeParentImage } from "../../redux/parentSlice";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";

const Label = styled("label")(({ theme }) => ({
  display: "inline-block",
  padding: theme.spacing(1.2, 3),
  cursor: "pointer",
  width: "100%",
  textAlign: "center",
}));

const Image = styled("img")(({ theme }) => ({
  width: "250px",
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[1],
}));

export default function ParentPhoto() {
  const { t } = useTranslation();
  const lang = Cookies.get("i18next") || "en";
  const dispatch = useDispatch();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const { parent, token } = useSelector((s) => s.parent);
  const { data } = useParent(parent?.id, token);

  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChangeImage = (e) => {
    if (e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleEditImage = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("image", image);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/parent/editImage/${parent.id}`,
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
          body: formData,
        }
      );

      const resData = await response.json();

      if (response.status !== 200 && response.status !== 201) {
        throw new Error("Failed to update image");
      }

      enqueueSnackbar(
        lang === "ar" ? resData.msg.arabic : resData.msg.english,
        {
          variant: "success",
          autoHideDuration: 5000,
        }
      );
    } catch (error) {
      console.error(error);
      enqueueSnackbar(t("An error occurred"), {
        variant: "error",
        autoHideDuration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const currentImage = image
    ? URL.createObjectURL(image)
    : data?.data?.image
    ? `${process.env.REACT_APP_API_KEY}images/${data.data.image}`
    : null;

  return (
    <ParentLayout>
      <Paper sx={{ p: 4, mx: "auto" }}>
        <Typography variant="h5" fontWeight={600} mb={3}>
          {t("Profile Photo")}
        </Typography>

        <input
          type="file"
          id="image"
          hidden
          accept="image/*"
          onChange={handleChangeImage}
        />
        <Button
          variant="contained"
          component="span"
          fullWidth
          sx={{ mb: 3, textTransform: "capitalize" }}
        >
          <Label htmlFor="image" component="span">
            {t("replace_photo")}
          </Label>
        </Button>

        {currentImage && (
          <Box mb={3} sx={{display:"flex",justifyContent:"center"}}>
            <Image src={currentImage} alt="Profile Preview" />
          </Box>
        )}

        {image && (
          <Box textAlign="center">
            <Button
              variant="contained"
              color="secondary"
              onClick={handleEditImage}
              disabled={loading}
              sx={{ minWidth: 150 }}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ color: "#fff" }} />
              ) : (
                t("save")
              )}
            </Button>
          </Box>
        )}
      </Paper>
    </ParentLayout>
  );
}
