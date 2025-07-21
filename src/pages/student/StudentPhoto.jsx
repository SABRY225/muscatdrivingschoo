import React, { useState } from 'react';
import StudentLayout from '../../components/student/StudentLayout';
import { Button, styled, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useStudent } from '../../hooks/useStudent';
import { useSelector, useDispatch } from 'react-redux';
import { changeStudentImage } from '../../redux/studentSlice';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';

const Label = styled("label")({
  width: "100%",
  display: "block",
  padding: "6px 16px",
  cursor: "pointer"
});

const Image = styled('img')({
  width: "100%",
  maxWidth: "300px",
  borderRadius: "8px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
});

export default function StudentPhoto() {
  const { student, token } = useSelector((state) => state.student);
  const { data, isLoading } = useStudent(student?.id);
  const [image, setImage] = useState(null);
  const { t } = useTranslation();
  const [load, setLoad] = useState(false);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const lang = Cookies.get("i18next") || "en";

  function handleChangeImage(e) {
    setImage(e.target.files[0]);
  }

  async function handleEditImage() {
    if (!image) return;

    setLoad(true);
    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/editImage/${student.id}`, {
        method: "POST",
        headers: {
          "Authorization": token,
        },
        body: formData
      });

      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Failed to upload image');
      }

      const resData = await response.json();
      dispatch(changeStudentImage({ image: resData.student.image }));

      enqueueSnackbar(lang === "ar" ? resData.msg.arabic : resData.msg.english, {
        variant: "success",
        autoHideDuration: 8000
      });

    } catch (err) {
      console.error(err);
      enqueueSnackbar(t("error_occurred"), { variant: "error" });
    } finally {
      setLoad(false);
    }
  }

  if (isLoading) return <Box textAlign="center" p={4}>{t("loading")}...</Box>;

  return (
    <StudentLayout>
      <input
        type="file"
        id="image"
        hidden
        accept="image/*"
        onChange={handleChangeImage}
      />

      <Button
        variant="contained"
        sx={{ textTransform: "capitalize", padding: 0, marginBottom: "20px" }}
        component="label"
        htmlFor="image"
      >
        <Label htmlFor="image">{t('replace_photo')}</Label>
      </Button>

      <Box sx={{ marginBottom: "30px" }}>
        {image && (
          <Image src={URL.createObjectURL(image)} alt="Preview" />
        )}

        {!image && data?.data?.image && (
          <Image
            src={`${process.env.REACT_APP_API_KEY}images/${data.data.image}`}
            alt="Student"
          />
        )}

        {image && (
          <Box mt={2}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleEditImage}
              disabled={load}
            >
              {load ? `${t('save')}...` : t('save')}
            </Button>
          </Box>
        )}
      </Box>
    </StudentLayout>
  );
}
