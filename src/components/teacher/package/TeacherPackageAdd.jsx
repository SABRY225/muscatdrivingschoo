import React, { useEffect, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import { Container, TextField, Select, Box, Typography, TextareaAutosize } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { t } from 'i18next';
import { Controller, useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import { useDropzone } from "react-dropzone";
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import axios from 'axios';
import { useCurriculums } from '../../../hooks/useCurriculums';
import { useClasses } from '../../../hooks/useClasses';
import Navbar from '../../Navbar';
import currencies from '../../../data/currencies';
import { useTrainingCategoryTypes } from '../../../hooks/useTrainingCategoryTypes';
import { useLimeType } from '../../../hooks/useLimeType';
import { useSubjects } from '../../../hooks/useSubject';

function TeacherPackageAdd() {
  const [levels, setLevels] = useState([]);
  const [error, setError] = useState(null);
  const lang = Cookies.get("i18next") || "en";
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const { teacher } = useSelector((state) => state.teacher);
  const i18next = Cookies.get('i18next');
  const { data: Curriculums } = useCurriculums()
  const { data: Classes } = useClasses()
  const { data: subjects } = useSubjects()
  const { data: TrainingCategoryTypes } = useTrainingCategoryTypes();
  const { data: LimeType } = useLimeType();

  const Classrooms = [
    { id: "First semester", label: t("First semester") },
    { id: "Second semester", label: t("First semester") }
  ]
  const genders = [
    { id: "male", label: t("male") },
    { id: "female", label: t("female") },
    { id: "male&female", label: t("male&female") }
  ]
  const [fileImageName, setFileImageName] = useState('');
  const [Image, setImage] = useState();
  const [fileName, setFileName] = useState('');
  const [file, setFile] = useState();

  useEffect(() => {
    const fetchLevels = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/levels`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setLevels(data.data); // Assuming the API returns an array of levels
      } catch (err) {
        console.error("Error fetching levels:", err);
        setError(err.message);
      }
    };

    fetchLevels();
  }, []); // The empty dependency array ensures it runs only once when the component mounts


  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, control, getValues } = useForm({
    defaultValues: {
      level: '',
      class: '',
      subject: '',
      semester: '',
      curriculums: '',
      titleAR: '',
      titleEN: '',
      duration: '',
      price: '',
      currency: '',
      startDate: '',
      endDate: '',
      gender: '',
      numTotalLesson: '',
      numWeekLesson: '',
      descriptionAr: '',
      descriptionEn: '',
      TrainingCategoryTypeId: '',
      LimeTypeId: '',
      teacherId: '',
      linkPackage: ""
    }
  });

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

  async function createPackage(data) {
    const startDateTime = new Date(data.startDate); // تحويل إلى كائن تاريخ
    const endDateTime = new Date(data.endDate); // تحويل إلى كائن تاريخ

    // تحقق من أن startDate أقل من endDate
    if (startDateTime >= endDateTime) {
      enqueueSnackbar(t("Start date must be earlier than end date"), { variant: "error", autoHideDuration: 5000 });
      return; // إنهاء الوظيفة إذا كان الشرط غير محقق
    }

    data.startDate = startDateTime;
    data.endDate = endDateTime;
    delete data.time;

    const formData = new FormData();

    formData.append("image", Image);
    formData.append("docs", file);
    formData.append("TeacherId", teacher.id);
    for (const key in data) {
      if (key !== "image" && key !== "teacherId" && key !== "docs") { // تجنب إضافة الصورة مرتين
        formData.append(key, data[key]);
      }
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_KEY}api/v1/teacher/createPackage`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      // setLoading(true);
      enqueueSnackbar(t("packageMsg"), { variant: "success", autoHideDuration: 5000 });
      navigate("/teacher/package")

    } catch (err) {
      enqueueSnackbar("Data submission failed", { variant: "error", autoHideDuration: 5000 });
      setLoading(false);
      console.error("Error:", err);
      throw new Error("Something went wrong: " + err);
    }
  }

  return (
    <Navbar>
      <Container sx={{ marginTop: '2px', marginBottom: '80px' }}>
        <form sx={{ margin: 'auto' }} encType="multipart/form-data" onSubmit={handleSubmit(createPackage)}>
          <Box
            sx={{
              display: { md: "flex", xs: "block" },
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <FormControl fullWidth margin="dense">
              <TextField
                label={t("packageTitleArabic")}
                type="text"
                variant="outlined"
                {...register("titleAR", {
                  required: t("isRequired"),
                  minLength: {
                    value: 5,
                    message: t("titleLimit")
                  }
                })} />
              <p className='text-red-500'>{errors.titleAR?.message}</p>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <TextField
                label={t("packageTitleEnglish")}
                type="text"
                variant="outlined"
                {...register("titleEN", {
                  required: t("isRequired"),
                  minLength: {
                    value: 5,
                    message: t("titleLimit")
                  }
                })} />
              <p className='text-red-500'>{errors.titleEN?.message}</p>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: { md: "flex", xs: "block" },
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <FormControl fullWidth margin="dense">
              <InputLabel id="trainingCategoryTypes">{t("viewtrainingcategorytypes")}</InputLabel>
              <Select
                labelId="TrainingCategoryTypeId"
                label={t("TrainingCategoryTypeId")}
                defaultValue="" // قيمة افتراضية
                {...register("TrainingCategoryTypeId", {
                  required: t("isRequired"),
                })}
              >
                {TrainingCategoryTypes?.data.map((row, index) => (
                    <MenuItem key={index} value={row.id}>{i18next === "ar"?t(row.titleAR):t(row.titleEN)}</MenuItem>
                ))
                }
              </Select>
              <p className="text-red-500">{errors.TrainingCategoryTypeId?.message}</p>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel id="limetype">{t("limetype")}</InputLabel>
              <Select
                labelId="LimeTypeId"
                label={t("LimeType")}
                defaultValue="" // قيمة افتراضية
                {...register("LimeTypeId", {
                  required: t("isRequired"),
                })}
              >
                {
                  LimeType?.data.map((row, index) => (
                    <MenuItem key={index} value={row.id}>{i18next === "ar" ? row.titleAR : row.titleEN}</MenuItem>
                  ))
                }
              </Select>
              <p className="text-red-500">{errors.LimeTypeId?.message}</p>
            </FormControl>
          </Box>
          <Box
            sx={{
              display: { md: "flex", xs: "block" },
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <FormControl fullWidth margin="dense">
              <InputLabel id="level">{t("choosesLevel")}</InputLabel>
              <Select
                labelId="level"
                label={t("choosesLevel")}
                defaultValue="" // قيمة افتراضية
                {...register("level", {
                  required: t("isRequired"),
                })}
              >
                {i18next === "ar"
                  ? levels.map((level, index) => (
                    <MenuItem key={index} value={level.id}>{t(level.titleAR)}</MenuItem>
                  ))
                  : levels.map((level, index) => (
                    <MenuItem key={index} value={level.id}>{t(level.titleEN)}</MenuItem>
                  ))
                }
              </Select>
              <p className="text-red-500">{errors.level?.message}</p>
            </FormControl>

            <FormControl fullWidth margin="dense">
              <InputLabel id="class">{t("classes")}</InputLabel>
              <Select
                labelId="class"
                label={t("classes")}
                defaultValue="" // قيمة افتراضية
                {...register("class", {
                  required: t("isRequired"),
                })}
              >
                {
                  Classes?.data.map((calss, index) => (
                    <MenuItem key={index} value={calss.id}>{i18next === "ar" ? calss.titleAR : calss.titleEN}</MenuItem>
                  ))
                }
              </Select>
              <p className="text-red-500">{errors.class?.message}</p>
            </FormControl>
          </Box>
            <FormControl fullWidth margin="dense">
              <InputLabel id="subject">{t("subject")}</InputLabel>
              <Select
                labelId="subject"
                label={t("subject")}
                defaultValue="" // قيمة افتراضية
                {...register("subject", {
                  required: t("isRequired"),
                })}
              >
                {
                  subjects?.data.map((subject, index) => (
                    <MenuItem key={index} value={subject.id}>{i18next === "ar"?t(subject?.titleAR):t(subject?.titleEN)}</MenuItem>
                  ))
                }
              </Select>
              <p className="text-red-500">{errors.subject?.message}</p>
            </FormControl>
          <FormControl fullWidth margin="dense">
              <InputLabel id="gender">{t("package_gender")}</InputLabel>
              <Select
                labelId="gender"
                label={t("package_gender")}
                {...register("gender", {
                  required: t("isRequired"),
                })}
              >
                {genders.map((row, index) => (
                    <MenuItem key={index} value={row.id}>{row.label}</MenuItem>
                ))
                }
              </Select>
              <p className="text-red-500">{errors.gender?.message}</p>
            </FormControl>
          <Box
            sx={{
              display: { md: "flex", xs: "block" },
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <FormControl fullWidth margin="dense">
              <InputLabel id="Curriculums">{t("studyCurriculum")}</InputLabel>
              <Select
                labelId="curriculums"
                label={t("curriculums")}
                defaultValue="" // قيمة افتراضية
                {...register("curriculums", {
                  required: t("isRequired"),
                })}
              >
                {
                  Curriculums?.data.map((Curriculum, index) => (
                    <MenuItem key={index} value={Curriculum.id}>{i18next === "ar" ? Curriculum.titleAR : Curriculum.titleEN}</MenuItem>
                  ))
                }
              </Select>
              <p className="text-red-500">{errors.curriculums?.message}</p>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }} id="semester">
                {t("semester")}
              </InputLabel>
              <Select
                labelId="semester"
                label={t("semester")}
                {...register("semester", {
                  required: t("isRequired"),
                })}
              >
                {Classrooms?.length > 0 ? (
                  Classrooms.map((semester, index) => (
                    <MenuItem key={index} value={semester.id}>
                      {t(semester.id)}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>{t("noData")}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>

          <Box
            sx={{
              display: { md: "flex", xs: "block" },
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <FormControl fullWidth margin="dense">
              <TextField
                label={t("sharePrice")}
                type="number"
                variant="outlined"
                {...register("price", {
                  required: t("isRequired"),
                })} />
              <p className='text-red-500'>{errors.price?.message}</p>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <InputLabel id="currency">{t("currency")}</InputLabel>
              <Select
                labelId="currency"
                label={t("currency")}
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
              <p className='text-red-500'>{errors.currency?.message}</p>
            </FormControl>
          </Box>

          <Box sx={{ display: "flex", gap: 3 }}>
            <Box sx={{ width: "100%" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("lessonDate")}
              </InputLabel>
              <Controller
                name="startDate"
                control={control}
                render={({ field }) => (
                  <TextField type="date" {...field} fullWidth />
                )}
                {...register("startDate", {
                  required: "start Date Address is required",
                })}
              />
              {errors.date?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>
            {/* ------------------------------- */}
            <Box sx={{ width: "100%" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("lessonTime")}
              </InputLabel>
              <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <TextField type="time" {...field} fullWidth />
                )}
                {...register("time", {
                  required: "time is required",
                })}
              />
              {errors.time?.type === "required" && (
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

          <Box sx={{ width: "100%" }}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "13px", marginTop: "3px" }}>
              {t("lessonEndDate")}
            </InputLabel>
            <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <TextField type="date" {...field} fullWidth />
              )}
              {...register("endDate", {
                required: "End Date Address is required",
              })}
            />
            {errors.date?.type === "required" && (
              <Typography
                color="error"
                role="alert"
                sx={{ fontSize: "13px", marginTop: "6px" }}
              >
                {t("required")}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              display: { md: "flex", xs: "block" },
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <FormControl fullWidth margin="dense">
              <TextField
                label={t("sharesCount")}
                type="number"
                variant="outlined"
                {...register("numTotalLesson", {
                  required: t("isRequired"),
                  minLength: {
                    value: 1,
                    message: t("share1")
                  }
                })} />
              <p className='text-red-500'>{errors.numTotalLesson?.message}</p>
            </FormControl>
            <FormControl fullWidth margin="dense">
              <TextField label={t("sharesCountInWeek")} type="number" variant="outlined" {...register("numWeekLesson", {
                required: t("isRequired"),
                validate: (value) => {
                  if (value > Number(getValues("numTotalLesson"))) {
                    return t("shareInWeekValid")
                  }
                },
                pattern: {
                  value: /^[1-9]$/,
                  message: t("share1")
                },
              })} />
              <p className='text-red-500'>{errors.numWeekLesson?.message}</p>
            </FormControl>


          </Box>

          <FormControl fullWidth margin="dense">
            <InputLabel id="duration">{t("duration")}</InputLabel>
            <Select
              labelId="duration"
              label={t("duration")}
              {...register("duration", {
                required: t("isRequired"),
              })}
            >
              <MenuItem value={1}>1 {t("hour")}</MenuItem>
              <MenuItem value={2}>2 {t("hour")}</MenuItem>
            </Select>
            <p className='text-red-500'>{errors.duration?.message}</p>
          </FormControl>
          <Box
            sx={{
              display: { md: "flex", xs: "block" },
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <FormControl fullWidth margin="dense">

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
              {errors.descriptionAr?.message === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </FormControl>
            <FormControl fullWidth margin="dense">
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
              {errors.descriptionEn?.message === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </FormControl>
          </Box>

          <Box sx={{ marginBottom: "18px", marginTop: "10px" }}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
              {t("Package link (if you do not include documents related to the Package, you must include a link to the Package)")}
            </InputLabel>

            <FormControl fullWidth margin='dense'>
              <TextField type="text"  {...register("linkPackage", {
                required: {
                  // value: !file,
                  message: t("file_video-validation")
                },
                pattern: {
                  value: /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/,
                  message: t("youtube_link")
                }
              })} />

              <p className='text-red-500'>{errors.linkPackage?.message}</p>
            </FormControl>
          </Box>

          <Box sx={{
            display: { md: "flex", xs: "block" },
            justifyContent: "space-between",
            gap: "20px",
          }}>
            <Box sx={{ flex: 1, marginBottom: "18px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px", fontWeight: 'bold', color: '#f50000' }}>
                {t("Package documents")}
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
                  {t("Package documents")}
                </Typography>
              </div>

              {/* عرض اسم المستند بعد اختياره */}
              {fileName && (
                <Typography sx={{ marginTop: "10px", fontSize: "17px", color: "red", textAlign: "center" }}>
                  {t("Selected File")}: {fileName}
                </Typography>
              )}
            </Box>

            <Box sx={{ flex: 1, marginBottom: "18px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px", fontWeight: 'bold', color: '#f50000' }}>
                {t("Choose a suitable image for the package")}
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
                  {t("Choose a suitable image for the package")}
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
          <br />
          <br />
          <LoadingButton
            type="submit"
            // loading={loading}
            loadingPosition="start"
            variant="contained"
          >{t("Add Package")}</LoadingButton>
        </form>
      </Container>
    </Navbar>
  )
}

export default TeacherPackageAdd;