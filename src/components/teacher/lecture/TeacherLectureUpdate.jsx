import {
  Box,
  Button,
  Container,
  DialogActions,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useClasses } from "../../../hooks/useClasses";
import { useCurriculums } from "../../../hooks/useCurriculums";
import currencies from "../../../data/currencies";
import Navbar from "../../Navbar";
import TeacherLayout from "../TeacherLayout";

export default function TeacherLectureUpdate() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { teacher } = useSelector((state) => state.teacher);
  const [lecture, setLecture] = useState([]);
  const [file, setFile] = useState();
  const [Image, setImage] = useState();
  const [subjects, setSubjects] = useState([]);
  const { data: classesData } = useClasses();
  const { data: curriculumsData } = useCurriculums();
  const [fileImageName, setFileImageName] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setLoading] = useState(false);

  const Classrooms = [
    { id: "First semester", label: t("First semester") },
    { id: "Second semester", label: t("First semester") }
  ]
  useEffect(() => {
    const getSubjects = async () => {
      const response = await axios.get(`${process.env.REACT_APP_API_KEY}api/v1/subject/allSubjects`);
      setSubjects(response.data.data);
      setLoading(true);
    };
    getSubjects();
  }, []);
  // هنا بنعمل ال hook للملفات
  const { getRootProps: getRootPropsImage, getInputProps: getInputPropsImage } = useDropzone({
    onDrop: (acceptedFiles) => handleFileUpload(acceptedFiles),  // عند اختيار الصورة
    accept: 'image/*'  // تحديد أن نوع الملف المسموح به هو الصور
  });

  const { getRootProps: getRootPropsFile, getInputProps: getInputPropsFile } = useDropzone({
    onDrop: (acceptedFiles) => handleFile(acceptedFiles),  // عند اختيار المستند
    accept: '.pdf,.doc,.docx,.ppt,.pptx,.txt'  // تحديد أن نوع الملف المسموح به هو المستندات
  });

  // هذه دالة التعامل مع صورة
  const handleFileUpload = (files) => {
    if (files && files[0]) {
      setFileImageName(files[0].name);  // تخزين اسم الصورة
      setImage(files[0]);

    }
  };

  // هذه دالة التعامل مع المستند
  const handleFile = (files) => {
    if (files && files[0]) {
      setFileName(files[0].name);  // تخزين اسم المستند
      setFile(files[0]);

    }
  };

  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch
  } = useForm({
    defaultValues: {
            titleAR: "",
            titleEN: "",
            descriptionAr: "",
            descriptionEn: "",
            locationAr: "",
            locationEn: "",
            price: "",
            currency: "",
            curriculums: "",
            semester: "",
            class: "",
            subject: "",
            linkLecture: "",
            docs: "",
            image: ""
    },
  });
  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/lecture/${id}`);
        console.log(response);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLecture(data.data);
      } catch (err) {
        console.error("Error fetching levels:", err);
      }
    };
    fetchLevels();
  }, [id])
  useEffect(() => {
    console.log(lecture);
    
    if (lecture) {
      reset({
            titleAR: lecture?.titleAR,
            titleEN: lecture?.titleEN,
            descriptionAr:lecture?.descriptionAr,
            descriptionEn: lecture?.descriptionEn,
            locationAr:lecture?.locationAr,
            locationEn: lecture?.locationEn,
            price:lecture?.price,
            currency:lecture?.currency,
            curriculums:lecture?.curriculums?.id,
            semester: lecture?.semester,
            class:  lecture?.class?.id,
            subject:lecture?.subject?.id,
            linkLecture:lecture?.linkLecture,
      });
      setFileImageName(lecture.image);
      setFileName(lecture.docs);

    }
  }, [lecture, reset]);

  const navigate = useNavigate();
  const lang = Cookies.get("i18next") || "en";

  const handleClose = () => {
    navigate("/teacher/lectures")
  }
  const watchLinkLecture = watch("linkLecture"); // مراقبة الرابط

  async function onSubmit(data) {
    if (watchLinkLecture !== "" && (!lecture.docs)) {
      enqueueSnackbar(t("You must enter the lecture link or upload a document."), { variant: "error" });
      return;
    }
    closeSnackbar();
    const formData = new FormData();

    if (file && fileName !== lecture.docs) {
      formData.append("docs", file);
    }

    if (Image && fileImageName !== lecture.image) {
      formData.append("image", Image);
    }

    formData.append("teacherId", teacher.id);

    for (const key in data) {
      if (key !== "image" && key !== "docs") {
        formData.append(key, data[key]);
      }
    }
    try {
      await axios.put(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/updateLecture/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      enqueueSnackbar(t("The lecture has been modified."), { variant: "success", autoHideDuration: 8000 });
      navigate("/teacher/lectures")
    } catch (err) {
      enqueueSnackbar(t("Something went wrong"), { variant: "error", autoHideDuration: 8000 });
    }
  }

  return (
    <Navbar>
      <TeacherLayout>
        <Container sx={{ marginTop: '70px', marginBottom: '80px' }}>
          <form onSubmit={handleSubmit(onSubmit)} style={{ margin: 'auto' }}>
            <Box sx={{
              display: { md: "flex", xs: "block" },
              justifyContent: "space-around",
              gap: "20px",
            }}>

              <Box sx={{ flex: 1, marginBottom: "18px" }}>
                <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                  {t("titleAR")}
                </InputLabel>
                <Controller
                  name="titleAR"
                  control={control}
                  render={({ field }) => <TextField {...field} fullWidth />}
                  {...register("titleAR", {
                    required: "title Address is required",
                  })}
                />
                {errors.titleAR?.type === "required" && (
                  <Typography
                    color="error"
                    role="alert"
                    sx={{ fontSize: "13px", marginTop: "6px" }}
                  >
                    {t("required")}
                  </Typography>
                )}
              </Box>

              <Box sx={{ flex: 1, marginBottom: "18px" }}>
                <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                  {t("titleEN")}
                </InputLabel>
                <Controller
                  name="titleEN"
                  control={control}
                  render={({ field }) => <TextField {...field} fullWidth />}
                  {...register("titleEN", {
                    required: "title Address is required",
                  })}
                />
                {errors.titleEN?.type === "required" && (
                  <Typography
                    color="error"
                    role="alert"
                    sx={{ fontSize: "13px", marginTop: "6px" }}
                  >
                    {t("required")}
                  </Typography>
                )}
              </Box>
            </Box>
                        <Box sx={{
              display: { md: "flex", xs: "block" },
              justifyContent: "space-around",
              gap: "20px",
            }}>

              <Box sx={{ flex: 1, marginBottom: "18px" }}>
                <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                  {t("locationAr")}
                </InputLabel>
                <Controller
                  name="locationAr"
                  control={control}
                  render={({ field }) => <TextField {...field} fullWidth />}
                  {...register("locationAr", {
                    required: "title Address is required",
                  })}
                />
                {errors.titleAR?.type === "required" && (
                  <Typography
                    color="error"
                    role="alert"
                    sx={{ fontSize: "13px", marginTop: "6px" }}
                  >
                    {t("required")}
                  </Typography>
                )}
              </Box>

              <Box sx={{ flex: 1, marginBottom: "18px" }}>
                <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                  {t("locationEn")}
                </InputLabel>
                <Controller
                  name="locationEn"
                  control={control}
                  render={({ field }) => <TextField {...field} fullWidth />}
                  {...register("locationEn", {
                    required: "title Address is required",
                  })}
                />
                {errors.titleEN?.type === "required" && (
                  <Typography
                    color="error"
                    role="alert"
                    sx={{ fontSize: "13px", marginTop: "6px" }}
                  >
                    {t("required")}
                  </Typography>
                )}
              </Box>
            </Box>
            <Box sx={{
              display: { md: "flex", xs: "block" },
              justifyContent: "space-around",
              gap: "20px",
            }}>
            <Box sx={{ flex: 1,marginBottom: "18px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                {t("price")}
              </InputLabel>
              <Controller
                name="price"
                control={control}
                render={({ field }) => <TextField {...field} type="number" fullWidth />}
                {...register("price", {
                  required: "price Address is required",
                })}
              />
              {errors.price?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            <Box sx={{ flex: 1,marginBottom: "18px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                {t("currency")}
              </InputLabel>
              <Controller
                name="currency"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    fullWidth
                    {...register("currency", {
                      required: t("isRequired"),
                    })}
                  >
                    {
                      currencies.map((curr) => {
                        return <MenuItem value={curr.title}>{lang === "en" ? curr.titleEn : curr.titleAr}</MenuItem>
                      })
                    }
                  </Select>
                )}
                rules={{ required: t("required") }}
              />
            </Box>
            </Box>

            <Box sx={{
              display: { md: "flex", xs: "block" },
              justifyContent: "space-around",
              gap: "20px",
            }}>
            <Box sx={{ flex: 1,marginBottom: "18px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                {t("subject")}
              </InputLabel>
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    fullWidth
                    {...register("subject", {
                      required: t("isRequired"),
                    })}
                  >
                    {lang === "ar"
                      ? subjects.map((subject, index) => (
                        <MenuItem key={index} value={subject.id}>{t(subject.titleAR)}</MenuItem>
                      ))
                      : subjects.map((subject, index) => (
                        <MenuItem key={index} value={subject.id}>{t(subject.titleEN)}</MenuItem>
                      ))
                    }
                  </Select>
                )}
                rules={{ required: t("required") }}
              />

            </Box>
            <Box sx={{flex: 1, marginBottom: "18px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                {t("studycurriculums")}
              </InputLabel>
              <Controller
                name="curriculums"
                control={control}
                render={({ field }) => (
                  <Select {...field} fullWidth>
                    {curriculumsData?.data.map((curriculums, index) => (
                      lang === "ar" ? (
                        <MenuItem key={index} value={curriculums.id}>
                          {t(curriculums.titleAR)}
                        </MenuItem>
                      ) : (
                        <MenuItem key={index} value={curriculums.id}>
                          {t(curriculums.titleEN)}
                        </MenuItem>
                      )
                    ))}
                  </Select>
                )}
                rules={{ required: t("required") }}
              />
            </Box>
            </Box>

            <Box sx={{
              display: { md: "flex", xs: "block" },
              justifyContent: "space-around",
              gap: "20px",
            }}>

              <Box sx={{flex: 1, marginBottom: "18px"}}>
                <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }} id="curriculums1">
                  {t("classes")}
                </InputLabel>
                <Controller
                  name="class"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} fullWidth>
                      {classesData?.data.map((curriculums, index) => (
                        <MenuItem key={index} value={curriculums.id}>
                          {lang === "ar" ? (t(curriculums.titleAR) + "  -  " + t(curriculums?.Level?.titleAR)) : t(curriculums.titleEN)}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                  rules={{ required: t("required") }}
                />
              </Box>

              <Box sx={{ flex: 1,marginBottom: "18px"}}>
                <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }} id="curriculums2">
                  {t("semester")}
                </InputLabel>
                <Controller
                  name="semester"
                  control={control}
                  render={({ field }) => (
                    <Select {...field} fullWidth>
                      {Classrooms?.length > 0 ? (
                        Classrooms.map((curriculums, index) => (
                          <MenuItem key={index} value={curriculums.id}>
                            {t(curriculums.id)}
                          </MenuItem>
                        ))
                      ) : (
                        <MenuItem disabled>{t("noData")}</MenuItem>
                      )}
                    </Select>
                  )}
                  rules={{ required: t("required") }}
                />
              </Box>
            </Box>

            <Box sx={{
              display: { md: "flex", xs: "block" },
              justifyContent: "space-around",
              gap: "20px",
            }}>
            <Box sx={{flex:1, marginBottom: "18px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                {t("descriptionAr")}
              </InputLabel>
              <Controller
                name="descriptionAr"
                control={control}
                render={({ field }) => <TextField multiline rows={4} {...field} fullWidth />}
                {...register("descriptionAr", {
                  required: "description Address is required",
                })}
              />
              {errors.descriptionAr?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>

            <Box sx={{flex:1, marginBottom: "18px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                {t("descriptionEn")}
              </InputLabel>
              <Controller
                name="descriptionEn"
                control={control}
                render={({ field }) => <TextField multiline rows={4} {...field} fullWidth />}
                {...register("descriptionEn", {
                  required: "description Address is required",
                })}
              />
              {errors.descriptionEn?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            </Box>




            <Box sx={{ marginBottom: "18px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                {t("Lecture link (if you do not include documents related to the lecture, you must include a link to the lecture)")}
              </InputLabel>
              <Controller
                name="linkLecture"
                control={control}
                rules={{ required: false }} 
                render={({ field }) => <TextField {...field} fullWidth />}

              />
            </Box>

            <Box sx={{
              display: { md: "flex", xs: "block" },
              justifyContent: "space-around",
              gap: "20px",
            }}>
              <Box sx={{flex:1, marginBottom: "18px" }}>
                <InputLabel sx={{ marginBottom: "6px", fontSize: "14px", fontWeight: 'bold', color: '#333' }}>
                  {t("Lecture documents")}
                </InputLabel>
                <div {...getRootPropsFile()} style={{
                  border: '2px dashed #f50000',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}>
                  <input {...getInputPropsFile()} />
                  <CloudUploadIcon sx={{ fontSize: "30px", color: "#f50000" }} />
                  <Typography sx={{ fontSize: "14px", color: "#f50000", marginTop: "8px" }}>
                    {t("Lecture documents")}
                  </Typography>
                </div>

                {/* عرض اسم المستند بعد اختياره */}
                {fileName && (
                  <Typography sx={{ marginTop: "10px", fontSize: "17px", color: "red", textAlign: "center" }}>
                    {t("Selected File")}: {fileName}
                  </Typography>
                )}
              </Box>

              <Box sx={{flex:1,  marginBottom: "18px" }}>
                <InputLabel sx={{ marginBottom: "6px", fontSize: "14px", fontWeight: 'bold', color: '#333' }}>
                  {t("Choose a suitable image for the lecture")}
                </InputLabel>
                <div {...getRootPropsImage()} style={{
                  border: '2px dashed #f50000',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}>
                  <input {...getInputPropsImage()} />
                  <CloudUploadIcon sx={{ fontSize: "30px", color: "#f50000" }} />
                  <Typography sx={{ fontSize: "14px", color: "#f50000", marginTop: "8px" }}>
                    {t("Choose a suitable image for the lecture")}
                  </Typography>
                </div>

                {/* عرض اسم الصورة بعد اختياره */}
                {fileImageName && (
                  <Typography sx={{ marginTop: "10px", fontSize: "17px", color: "red", textAlign: "center" }}>
                    {t("selected Image")}: {fileImageName}
                  </Typography>
                )}
              </Box>
            </Box>
            <DialogActions>
              <Button
                variant="contained"
                type="submit"
                sx={{ ml: "6px", mr: "6px" }}
              >
                {t("save")}
              </Button>
              <Button onClick={handleClose} color="error">
                {t("cancel")}
              </Button>
            </DialogActions>
          </form>
        </Container>
      </TeacherLayout>


    </Navbar>

  );
}

