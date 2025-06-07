import {
  Box,
  Button,
  DialogActions,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useDropzone } from 'react-dropzone';
import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCurriculums } from "../../../hooks/useCurriculums";
import { useClasses } from "../../../hooks/useClasses";
import Loading from "../../Loading";
import currencies from "../../../data/currencies";
import { useLevels } from "../../../hooks/useLevels";

export default function TestAdd({ handleClose }) {
  const { t } = useTranslation();
  const { teacher } = useSelector((state) => state.teacher);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const [subjects, setSubjects] = useState([]);
  const { data: levelsData } = useLevels();
  const { data: curriculumsData } = useCurriculums();
  const { data: classesData } = useClasses();

  const [isLoading, setLoading] = useState(false);
  const [file, setFile] = useState();
  const [Image, setImage] = useState();
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

  const [fileImageName, setFileImageName] = useState('');
  const [fileName, setFileName] = useState('');

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
  } = useForm({
    defaultValues: {
      price: "",
      subject: "",
      currency: "",
      semester: "",
      class: "",
      curriculums: "",
      documents: "",
      LevelId:"",
      linkExam: "",
      image: null
    },
  });

  const navigate = useNavigate();
  const lang = Cookies.get("i18next") || "en";

  async function onSubmit(data) {
    closeSnackbar();
    const formData = new FormData();

    formData.append("TeacherId", teacher.id);
    formData.append("price", data.price);
    formData.append("subject", data.subject);
    formData.append("LevelId", data.LevelId);
    formData.append("currency", data.currency);
    formData.append("semester", data.Semester);
    formData.append("class", data.classes);
    formData.append("curriculums", data.curriculums)
    formData.append("linkExam", data.linkExam)

    if (file) {
      formData.append("docs", file);
    }

    if (Image) {
      formData.append("image", Image);
    }

    try {

      await axios.post(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/tests`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      enqueueSnackbar(t("A new Exam has been created."), { variant: "success", autoHideDuration: 8000 });
    } catch (err) {
      enqueueSnackbar(t("Something went wrong"), { variant: "error", autoHideDuration: 8000 });
    }
  }


  return (

    <Box sx={{ width: "100%" }}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Box
          sx={{
            display: { md: "flex", xs: "block" },
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <Box sx={{ flex: 1, marginBottom: "18px", marginTop: "9px" }}>
            <Controller
              name="price"
              control={control}

              render={({ field }) => <TextField type="number" placeholder={t("Price of Test")}{...field} fullWidth />}
              {...register("price", {
                required: "price is required",
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
          <Box sx={{ flex: 1, marginBottom: "18px" }}>
            <FormControl fullWidth margin="dense">
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                {t("subject")}
              </InputLabel>
              <Select
                labelId="subject"
                label={t("subject")}
                defaultValue="" // قيمة افتراضية
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
            </FormControl>
          </Box>
        </Box>

        <Box
          sx={{
            display: { md: "flex", xs: "block" },
            justifyContent: "space-between",
            gap: "20px",
          }}
        >
          <Box sx={{ flex: 1, marginBottom: "18px" }}>
            <FormControl fullWidth margin="dense">
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }} id="curriculums1">
                {t("studycurriculums")}
              </InputLabel>
              <Select
                labelId="curriculums1"
                label={t("curriculums")}
                {...register("curriculums", {
                  required: t("isRequired"),
                })}
              >
                {curriculumsData?.data?.length > 0 ? (
                  curriculumsData?.data.map((curriculums, index) => (
                    <MenuItem key={index} value={curriculums.id}>
                      {lang === "ar" ? t(curriculums.titleAR) : t(curriculums.titleEN)}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>{t("noData")}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flex: 1, marginBottom: "18px" }}>
            <FormControl fullWidth margin="dense">
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }} id="curriculums1">
                {t("classes")}
              </InputLabel>
              <Select
                labelId="class"
                label={t("class")}
                {...register("classes", {
                  required: t("isRequired"),
                })}
              >
                {classesData?.data?.length > 0 ? (
                  classesData?.data.map((curriculums, index) => (
                    <MenuItem key={index} value={curriculums.id}>
                      {lang === "ar" ? (t(curriculums.titleAR) + "  -  " + t(curriculums?.Level?.titleAR)) : t(curriculums.titleEN)}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>{t("noData")}</MenuItem>
                )}
              </Select>
            </FormControl>
          </Box>
        </Box>

          <Box sx={{ flex: 1, marginBottom: "18px" }}>
            <FormControl fullWidth margin="dense">
              <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }} id="curriculums1">
                {t("level")}
              </InputLabel>
              <Select
                labelId="LevelId"
                label={t("LevelId")}
                {...register("LevelId", {
                  required: t("isRequired"),
                })}
              >
                {
                  levelsData?.data.map((curriculums, index) => (
                    <MenuItem key={index} value={curriculums.id}>
                      {lang === "ar" ? t(curriculums?.titleAR) : t(curriculums.titleEN)}
                    </MenuItem>
                  ))
                }
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

        <Box sx={{ flex: 1, marginBottom: "18px" }}>
          <FormControl fullWidth margin="dense">
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }} id="curriculums2">
              {t("semester")}
            </InputLabel>
            <Select
              labelId="semester"
              label={t("semester")}
              {...register("Semester", {
                required: t("isRequired"),
              })}
            >
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
          </FormControl>
        </Box>
        <Box sx={{ flex: 1, marginBottom: "18px",marginTop:"-17px" }}>
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


        <Box sx={{ marginBottom: "18px" }}>
          <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
            {t("Exam link (if you do not include documents related to the Exam, you must include a link to the Exam)")}
          </InputLabel>

          <FormControl fullWidth margin='dense'>
            <TextField type="text"  {...register("linkExam", {
              required: {
                // value: !file,
                message: t("file_video-validation")
              },
              pattern: {
                value: /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/,
                message: t("youtube_link")
              }
            })} />

            <p className='text-red-500'>{errors.linkExam?.message}</p>
          </FormControl>
        </Box>
                <Box
          sx={{
            display: { md: "flex", xs: "block" },
            justifyContent: "space-between",
            gap: "20px",
          }}
        >

          <Box sx={{ flex: 1, marginBottom: "18px" }}>
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px", fontWeight: 'bold', color: ' #f50000' }}>
              {t("Test documents")}
            </InputLabel>
            <div {...getRootPropsFile()} style={{
              border: '2px dashed  #f50000',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: '4px'
            }}>
              <input {...getInputPropsFile()} />
              <CloudUploadIcon sx={{ fontSize: "30px", color: " #f50000" }} />
              <Typography sx={{ fontSize: "14px", color: " #f50000", marginTop: "8px" }}>
                {t("Test documents")}
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
            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px", fontWeight: 'bold', color: ' #f50000' }}>
              {t("Choose a suitable image for the exam")}
            </InputLabel>
            <div {...getRootPropsImage()} style={{
              border: '2px dashed  #f50000',
              padding: '20px',
              textAlign: 'center',
              cursor: 'pointer',
              borderRadius: '4px'
            }}>
              <input {...getInputPropsImage()} />
              <CloudUploadIcon sx={{ fontSize: "30px", color: " #f50000" }} />
              <Typography sx={{ fontSize: "14px", color: " #f50000", marginTop: "8px" }}>
                {t("Choose a suitable image for the exam")}
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
            type="submit"
            sx={{
              backgroundColor: " #f50000",
              color: "#fff",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            {t("send")}
          </Button>
        </DialogActions>
      </form>
    </Box>
  );
}
