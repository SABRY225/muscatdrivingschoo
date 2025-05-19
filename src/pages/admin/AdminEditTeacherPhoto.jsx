import AdminLayout from "../../components/admin/AdminLayout";
import TeacherLayout from "../../components/admin/TeacherLayout";
import { useTranslation } from "react-i18next";
import { Button, styled, Box , Paper} from "@mui/material";
import React, { useEffect, useState } from "react";
import StepperButtons from "../../components/reusableUi/StepperButtons";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useTeacher } from "../../hooks/useTeacher";

const Label = styled("label")({
  width: "100%",
  display: "block",
  padding: "6px 16px",
  cursor: "pointer",
});

const Image = styled("img")({
  width: "300px",
});

const AdminEditTeacherPhoto = () => {
  const { teacherId } = useParams();
  const { token } = useSelector((state) => state.admin);
  const { data } = useTeacher(teacherId);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState();
  const [load, setLoad] = useState(false);

  const { t } = useTranslation();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if (data) {
      setImageUrl(data.data.image);
    }
  }, [data]);

  const handleButtonSubmit = async () => {
    try {
      closeSnackbar();
      if (!imageUrl && !image) {
        enqueueSnackbar(t("image_required"), {
          variant: "error",
          autoHideDuration: 2000,
        });
        throw new Error("image is not found");
      } else if (imageUrl && !image) {
        navigate("/admin/edit/teacher/AdditionalInformation/" + teacherId);
      } else {
        setLoad(true);
        const formData = new FormData();
        formData.append("image", image);
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/admin/edit/teacher/image/${teacherId}`,
          {
            method: "POST",
            headers: {
              Authorization: token,
            },
            body: formData,
          }
        );
        if (response.status !== 200 && response.status !== 201) {
          enqueueSnackbar(t("image_upload_error"), {
            variant: "error",
            autoHideDuration: 2000,
          });
          throw new Error("failed occured");
        }
        setLoad(false);
        await response.json();
        enqueueSnackbar(t("update_success"), {
          variant: "success",
          autoHideDuration: 1000,
        });
        navigate("/admin/edit/teacher/AdditionalInformation/" + teacherId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      <Box sx={{marginTop:"-100px"}}>
      <TeacherLayout active={1} title={t("profile_photo")}>
      <Paper sx={{ width: "100%", padding: "20px" }}>
        <input
          type="file"
          id="image"
          hidden
          onChange={(e) => {
            setImage(e.target.files[0]);
            setImageUrl(URL.createObjectURL(e.target.files[0]));
          }}
        />
        <Button
          variant="contained"
          sx={{ textTransform: "capitalize", padding: 0, marginBottom: "20px" }}
        >
          <Label htmlFor="image">{t("replace_photo")}</Label>
        </Button>

        <Box>
          {imageUrl && (
            <Image
              src={
                imageUrl.startsWith("blob")
                  ? imageUrl
                  : `${process.env.REACT_APP_API_KEY}images/${imageUrl}`
              }
            />
          )}
        </Box>
        <Box sx={{ display: "flex", gap: "12px" }}>
          <StepperButtons onSubmit={handleButtonSubmit} load={load} />
          <Button
            sx={{ textTransform: "capitalize", marginTop: "40px" }}
            variant="outlined"
            onClick={() =>
              navigate("/admin/edit/teacher/additionalInformation/" + teacherId)
            }
          >
            {t("skip")}
          </Button>
        </Box>
        </Paper>
      </TeacherLayout>
      </Box>
    </AdminLayout>
  );
};

export default AdminEditTeacherPhoto;
