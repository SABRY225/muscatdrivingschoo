import {
    Box,
    Button,
    Container,
    DialogActions,
    FormControl,
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
import { useClasses } from "../../hooks/useClasses";
import { useCurriculums } from "../../hooks/useCurriculums";
import Navbar from "../../components/Navbar";
import TeacherLayout from "../../components/teacher/TeacherLayout";
import currencies from "../../data/currencies";
import Loading from "../../components/Loading";
import { useLevels } from "../../hooks/useLevels";

export default function EditExam() {
    const { t } = useTranslation();
    const { id } = useParams();
    const { closeSnackbar, enqueueSnackbar } = useSnackbar();
    const [subjects, setSubjects] = useState([]);
    const { teacher } = useSelector((state) => state.teacher);
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const lang = Cookies.get("i18next") || "en";
    const [file, setFile] = useState();
    const [Image, setImage] = useState();
    const [fileImageName, setFileImageName] = useState('');
    const [fileName, setFileName] = useState('');
    const { data: classesData } = useClasses();
    const { data: curriculumsData } = useCurriculums();
    const { data: levelsData } = useLevels();

    const Classrooms = [
        { id: "First semester", label: t("First semester") },
        { id: "Second semester", label: t("First semester") }
    ]
    const {
        register,
        control,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
            price: "",
            subject: "",
            currency: "",
            curriculums: "",
            class: "",
            semester: "",
            docs: "",
            linkExam: "",
            image: null
        },
    });
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

    const [isLoading, setLoading] = useState(false);
    useEffect(() => {
        const getSubjects = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_KEY}api/v1/subject/allSubjects`
                );
                setSubjects(response.data.data);
                setLoading(true);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            }
        };
        getSubjects();
    }, [lang]);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_API_KEY}api/v1/teacher/test/${id}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);

                setExam(data.data);
            } catch (err) {
                console.error("Error fetching exam:", err);
            }
        };
        fetchExam();
    }, [id]);

    useEffect(() => {
        if ( exam?.LevelId) {
            reset({
                price: exam.price,
                subject: exam.subject?.id,
                currency: exam.currency,
                class: exam?.class?.id,
                LevelId: exam?.Level?.id,
                // semester: "",
                docs: exam.docs,
                image: exam.image,
                linkExam: exam.linkExam,
                curriculums: exam?.curriculums?.id,
            });
            setFileName(exam.docs);
            setFileImageName(exam.image);
        }
    }, [exam, reset]);

    async function onSubmit(data) {
        closeSnackbar();
        const formData = new FormData();

        // تحقق مما إذا قام المستخدم بتغيير الصورة أو المستند
        if (file && fileName !== exam.docs) {
            formData.append("docs", file);
        }

        if (Image && fileImageName !== exam.image) {
            formData.append("image", Image);
        }

        formData.append("TeacherId", teacher.id);

        for (const key in data) {
            if (key !== "image" && key !== "docs") {
                formData.append(key, data[key]);
            }
        }

        try {
            await axios.put(
                `${process.env.REACT_APP_API_KEY}api/v1/teacher/tests/${id}`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            enqueueSnackbar(t("exam has been updated."), {
                variant: "success",
                autoHideDuration: 8000,
            });
            navigate("/teacher/tests");
        } catch (err) {
            enqueueSnackbar(t("Something went wrong"), {
                variant: "error",
                autoHideDuration: 8000,
            });
        }
    }

    return (
        <>
            {isLoading ? (
                <>
                        <TeacherLayout>
                            <Container sx={{ marginTop: "50px", marginBottom: "80px" }}>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Box
                                        sx={{
                                            display: { md: "flex", xs: "block" },
                                            justifyContent: "space-between",
                                            gap: "20px",
                                        }}
                                    >
                                        <Box sx={{ flex: 1, marginBottom: "18px" }}>
                                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                                {t("price")}
                                            </InputLabel>
                                            <Controller
                                                name="price"
                                                control={control}
                                                render={({ field }) => <TextField {...field} fullWidth />}
                                                {...register("price", {
                                                    required: "Price is required",
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
                                                {t("subject")}
                                            </InputLabel>
                                            <Controller
                                                name="subject"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select {...field} fullWidth>
                                                        {subjects.map((subject, index) => (
                                                            <MenuItem key={index} value={subject.id}>
                                                                {lang === "ar"
                                                                    ? t(subject.titleAR)
                                                                    : t(subject.titleEN)}
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                )}
                                                rules={{ required: t("required") }}
                                            />
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
                                        <Box sx={{ flex: 1, marginBottom: "18px" }}>

                                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                                {t("level")}
                                            </InputLabel>
                                            <Controller
                                                name="LevelId"
                                                control={control}
                                                render={({ field }) => (
                                                    <Select {...field} fullWidth>
                                                        {
                                                            levelsData?.data.map((level, index) => (
                                                                <MenuItem key={index} value={level.id}>
                                                                    {lang === "ar" ? t(level?.titleAR) : t(level.titleEN)}
                                                                </MenuItem>
                                                            ))
                                                        }
                                                    </Select>
                                                )}
                                                rules={{ required: t("required") }}
                                            />
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

                                        {/* <Box sx={{ flex: 1, marginBottom: "18px" }}>
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
                                        </Box> */}
                                    </Box>

                                    <Box sx={{ flex: 1, marginBottom: "18px" }}>
                                        <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                            {t("currency")}
                                        </InputLabel>
                                        <Controller
                                            name="currency"
                                            control={control}
                                            render={({ field }) => (
                                                <Select {...field} fullWidth>
                                                    {currencies.map((curr, index) => (
                                                        <MenuItem key={index} value={curr.title}>
                                                            {lang === "en"
                                                                ? curr.titleEn
                                                                : curr.titleAr}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            )}
                                            rules={{ required: t("required") }}
                                        />
                                    </Box>

                                    <Box sx={{ flex: 1, marginBottom: "18px" }}>
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
                                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px", fontWeight: 'bold', color: '#333' }}>
                                                {t("Test documents")}
                                            </InputLabel>
                                            <div {...getRootPropsFile()} style={{
                                                border: '2px dashed #1976d2',
                                                padding: '20px',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                borderRadius: '4px'
                                            }}>
                                                <input {...getInputPropsFile()} />
                                                <CloudUploadIcon sx={{ fontSize: "30px", color: "#1976d2" }} />
                                                <Typography sx={{ fontSize: "14px", color: "#1976d2", marginTop: "8px" }}>
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
                                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px", fontWeight: 'bold', color: '#333' }}>
                                                {t("Choose a suitable image for the exam")}
                                            </InputLabel>
                                            <div {...getRootPropsImage()} style={{
                                                border: '2px dashed #1976d2',
                                                padding: '20px',
                                                textAlign: 'center',
                                                cursor: 'pointer',
                                                borderRadius: '4px'
                                            }}>
                                                <input {...getInputPropsImage()} />
                                                <CloudUploadIcon sx={{ fontSize: "30px", color: "#1976d2" }} />
                                                <Typography sx={{ fontSize: "14px", color: "#1976d2", marginTop: "8px" }}>
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
                                            variant="contained"
                                            type="submit"
                                            sx={{ ml: "6px", mr: "6px", textAlign: "center" }}
                                        >
                                            {t("edit")}
                                        </Button>
                                    </DialogActions>
                                </form>
                            </Container>
                        </TeacherLayout>
                </>
            ) : (
                <Loading />
            )}
        </>
    );
}
