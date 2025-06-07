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
import React, { useEffect, useState } from "react";
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { useCurriculums } from "../../../hooks/useCurriculums";
import { useClasses } from "../../../hooks/useClasses";
import currencies from "../../../data/currencies";



export default function TeacherLectureAdd({ handleClose }) {
    const { t } = useTranslation();
    const { closeSnackbar, enqueueSnackbar } = useSnackbar();
    const { teacher, token } = useSelector((state) => state.teacher)
    const [file, setFile] = useState();
    const [Image, setImage] = useState();
    const [subjects, setSubjects] = useState([]);
    const { data: curriculumsData } = useCurriculums();
    const { data: classesData } = useClasses();

    const [isLoading, setLoading] = useState(false);
    const [fileImageName, setFileImageName] = useState('');
    const [fileName, setFileName] = useState('');
    const Classrooms = [
        { id: "First semester", label: t("First semester") },
        { id: "Second semester", label: t("Second semester") }
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




    const navigate = useNavigate();
    const lang = Cookies.get("i18next") || "en";

    const watchLinkLecture = watch("linkLecture"); // مراقبة الرابط
    const watchDocs = watch("docs"); // مراقبة المستندات

    async function onSubmit(data) {
        if (!watchLinkLecture && !file) {
            enqueueSnackbar(t("You must enter the lecture link or upload a document."), { variant: "error" });
            return;
        }
        closeSnackbar();
        const formData = new FormData();
        formData.append("docs", file);
        formData.append("image", Image);
        formData.append("TeacherId", teacher.id);
        formData.append("class", data.classes);
        formData.append("semester", data.Semester);
        for (const key in data) {
            if (key !== "image" && key !== "teacherId" && key !== "docs" && key !== "class" && key !== "semester" && key !== "classes" && key !== "Semester") {
                formData.append(key, data[key]);
            }
        }

        try {
            await axios.post(
                `${process.env.REACT_APP_API_KEY}api/v1/teacher/createLecture`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            enqueueSnackbar(t("A new lecture has been created."), { variant: "success", autoHideDuration: 8000 });
            navigate("/teacher/lectures")
        } catch (err) {
            enqueueSnackbar(t("Something went wrong"), { variant: "error", autoHideDuration: 8000 });
        }
    }

    return (
        <>
            <Box sx={{ width: "100%" }}>
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <Box sx={{
                        display: { md: "flex", xs: "block" },
                        justifyContent: "space-around",
                        gap: "20px",
                    }}>
                        <Box sx={{ flex: 1, marginBottom: "18px" }}>
                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                {t("titleAr")}
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
                                {t("titleEn")}
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
                                    required: "location Address is required",
                                })}
                            />
                            {errors.locationAr?.type === "required" && (
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
                                    required: "location Address is required",
                                })}
                            />
                            {errors.locationEn?.type === "required" && (
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
                        <Box sx={{ flex: 1, marginBottom: "18px" }}>
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
                        <Box sx={{ flex: 1, marginBottom: "18px" }}>
                            <FormControl fullWidth margin="dense">
                                <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                    {t("studycurriculums")}
                                </InputLabel>
                                <Select
                                    labelId="curriculums"
                                    label={t("curriculums")}
                                    defaultValue="" // قيمة افتراضية
                                    {...register("curriculums", {
                                        required: t("isRequired"),
                                    })}
                                >
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
                            </FormControl>
                        </Box>

                    </Box>


                    <Box sx={{
                        display: { md: "flex", xs: "block" },
                        justifyContent: "space-around",
                        gap: "20px",
                    }}>
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
                                        classesData.data.map((curriculums, index) => (
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
                    </Box>
                    <Box sx={{
                        display: { md: "flex", xs: "block" },
                        justifyContent: "space-around",
                        gap: "20px",
                    }}>
                        <Box sx={{ flex: 1, marginBottom: "18px" }}>
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

                        <Box sx={{ flex: 1, marginBottom: "18px" }}>
                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                {t("descriptionEnglish")}
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


                    <Box sx={{ flex: 1, marginBottom: "18px" }}>
                        <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                            {t("Lecture link (if you do not include documents related to the lecture, you must include a link to the lecture)")}
                        </InputLabel>

                        <FormControl fullWidth margin='dense'>
                            <TextField type="text"  {...register("linkLecture", {
                                required: {
                                    // value: !file,
                                    message: t("file_video-validation")
                                },
                                pattern: {
                                    value: /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/,
                                    message: t("youtube_link")
                                }
                            })} />

                            <p className='text-red-500'>{errors.linkLecture?.message}</p>
                        </FormControl>
                    </Box>

                    <Box sx={{
                        display: { md: "flex", xs: "block" },
                        justifyContent: "space-around",
                        gap: "20px",
                    }}>
                        <Box sx={{ flex: 1, marginBottom: "18px" }}>
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

                        <Box sx={{ flex: 1, marginBottom: "18px" }}>
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
                    </DialogActions>
                </form>

            </Box>
        </>
    );
}






