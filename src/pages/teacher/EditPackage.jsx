import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import FormControl from '@mui/material/FormControl';
import { Container, TextField, Select, Box, Typography } from '@mui/material';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import { t } from 'i18next';
import { Controller, useForm } from 'react-hook-form';
import currencies from '../../data/currencies';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack';
import { useNavigate, useParams } from 'react-router-dom';
import LoadingButton from '@mui/lab/LoadingButton';
import axios from 'axios';
import { useDropzone } from "react-dropzone";
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { useCurriculums } from '../../hooks/useCurriculums';
import { useClasses } from '../../hooks/useClasses';
import TeacherLayout from '../../components/teacher/TeacherLayout';
import { useSubjects } from '../../hooks/useSubject';
import { useTrainingCategoryTypes } from '../../hooks/useTrainingCategoryTypes';
import { useLimeType } from '../../hooks/useLimeType';
function EditPackage() {
    const { id } = useParams()
    const [levels, setLevels] = useState([]);
    const [error, setError] = useState(null);
    const lang = Cookies.get("i18next") || "en";
    const { enqueueSnackbar } = useSnackbar();
    const [file, setFile] = useState();
    const [close, setClose] = useState(false);
    const [Package, setPackage] = useState()
    const [loading, setLoading] = useState(false);
    const { teacher } = useSelector((state) => state.teacher);
    const i18next = Cookies.get('i18next');
    let [LevelData, setLevelData] = useState([]);
    const navigate = useNavigate();
    const { data: Curriculums } = useCurriculums();
    const { data: Classes } = useClasses();
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
    const { register, handleSubmit, formState: { errors }, control, getValues, reset } = useForm({
        defaultValues: {
            LevelId: '',
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
            time: '',
            linkPackage: ""
        }
    });

    useEffect(() => {
        const fetchLevels = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/levels`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setLevels(data.data);
                for (const key in levels) {
                    if (levels[key].id === Package.level) {
                        setLevelData(levels[key]);
                    }
                }
            } catch (err) {
                console.error("Error fetching levels:", err);
                setError(err.message);
            }
        };

        const fetchPackageData = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/getSinglePackage/${id}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPackage(data.data); // Assuming the package contains a level property
                setLoading(true)
            } catch (err) {
                setError(err.message);
            }
        };

        // Fetch data
        fetchLevels();
        fetchPackageData();
    }, [id]);

    function convertDate(dateString) {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // yyyy-mm-dd
    }
    useEffect(() => {

        if (Package?.startDate && Package?.endDate) {
            reset({
                LevelId: Package?.LevelId,
                class: Package?.class,
                subject: Package?.subject,
                semester: Package?.semester,
                curriculums: Package?.curriculums,
                titleAR: Package?.titleAR,
                titleEN: Package?.titleEN,
                duration: Package?.duration,
                price: Package?.price,
                currency: Package?.currency,
                startDate: convertDate(Package?.startDate),
                endDate: convertDate(Package?.endDate),
                gender: Package?.gender,
                numTotalLesson: Package?.numTotalLesson,
                numWeekLesson: Package?.numWeekLesson,
                descriptionAr: Package?.descriptionAr,
                descriptionEn: Package?.descriptionEn,
                TrainingCategoryTypeId: Package?.TrainingCategoryTypeId,
                LimeTypeId: Package?.LimeTypeId,
                teacherId: Package?.teacherId,
                linkPackage: Package?.linkPackage,
                time: Package?.time
            });
            setFileImageName(Package.image)
            setFileName(Package.docs)
        }
    }, [Package, reset]); // هنا، سيتم تنفيذ هذا الـ useEffect عند تغيير الـ Package فقط

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
        console.log(data);

        const startDateTime = new Date(data.startDate); // تحويل إلى كائن تاريخ
        const endDateTime = new Date(data.endDate); // تحويل إلى كائن تاريخ

        // // تحقق من أن startDate أقل من endDate
        if (startDateTime >= endDateTime) {
            enqueueSnackbar(t("Start date must be earlier than end date"), { variant: "error", autoHideDuration: 5000 });
            return; // إنهاء الوظيفة إذا كان الشرط غير محقق
        }

        data.startDate = startDateTime;
        data.endDate = endDateTime;

        const formData = new FormData();
        if (Image)
            formData.append("image", Image);
        if (file)
            formData.append("docs", file);
        formData.append("teacherId", teacher.id);
        for (const key in data) {
            if (key !== "image" && key !== "teacherId" && key !== "docs") { // تجنب إضافة الصورة مرتين
                formData.append(key, data[key]);
            }
        }
        try {
            await axios.put(`${process.env.REACT_APP_API_KEY}api/v1/teacher/updatePackage/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            enqueueSnackbar(t("packageEditMsg"), { variant: "success", autoHideDuration: 5000 });
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
            <TeacherLayout>
                <Container sx={{ marginTop: '50px', marginBottom: '80px' }}>
                    <form sx={{ margin: 'auto' }} encType="multipart/form-data" onSubmit={handleSubmit(createPackage)}>
                        <Box
                            sx={{
                                display: { md: "flex", xs: "block" },
                                justifyContent: "space-between",
                                gap: "20px",
                            }}
                        >
                            <Box sx={{ flex: 1, marginBottom: "18px" }}>
                                <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                    {t("titleAr")}
                                </InputLabel>
                                <Controller
                                    name="titleAR"
                                    control={control}
                                    render={({ field }) => <TextField  {...field} fullWidth />}
                                    rules={{ required: t("required") }}
                                />

                            </Box>
                            <Box sx={{ flex: 1, marginBottom: "18px" }}>
                                <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                    {t("titleEn")}
                                </InputLabel>
                                <Controller
                                    name="titleEN"
                                    control={control}
                                    render={({ field }) => <TextField  {...field} fullWidth />}
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
                                <InputLabel id="TrainingCategoryTypeId">{t("viewtrainingcategorytypes")}</InputLabel>
                                <Controller
                                    name="TrainingCategoryTypeId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            fullWidth
                                            {...register("TrainingCategoryTypeId", {
                                                required: t("isRequired"),
                                            })}
                                        >
                                            {TrainingCategoryTypes?.data.map((row, index) => (
                                                <MenuItem key={index} value={row.id}>{i18next === "ar" ? t(row.titleAR) : t(row.titleEN)}</MenuItem>
                                            ))
                                            }
                                        </Select>
                                    )}
                                    rules={{ required: t("required") }}
                                />
                            </Box>
                            <Box sx={{ flex: 1, marginBottom: "18px" }}>
                                <InputLabel id="limetype">{t("limetype")}</InputLabel>
                                <Controller
                                    name="LimeTypeId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            fullWidth
                                            {...register("LimeTypeId", {
                                                required: t("isRequired"),
                                            })}
                                        >
                                            {LimeType?.data.map((row, index) => (
                                                <MenuItem key={index} value={row.id}>{i18next === "ar" ? t(row.titleAR) : t(row.titleEN)}</MenuItem>
                                            ))
                                            }
                                        </Select>
                                    )}
                                    rules={{ required: t("required") }}
                                />
                            </Box>
                        </Box>
                        {/* level - class */}
                        <Box
                            sx={{
                                display: { md: "flex", xs: "block" },
                                justifyContent: "space-between",
                                gap: "20px",
                            }}
                        >
                            <Box sx={{ flex: 1, marginBottom: "18px" }}>
                                <InputLabel id="LevelId">{t("choosesLevel")}</InputLabel>
                                <Controller
                                    name="LevelId"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            fullWidth
                                            {...register("LevelId", {
                                                required: t("isRequired"),
                                            })}
                                        >
                                            {levels.map((row, index) => (
                                                <MenuItem key={index} value={row.id}>{i18next === "ar" ? t(row.titleAR) : t(row.titleEN)}</MenuItem>
                                            ))
                                            }
                                        </Select>
                                    )}
                                    rules={{ required: t("required") }}
                                />
                            </Box>
                            <Box sx={{ flex: 1, marginBottom: "18px" }}>
                                <InputLabel id="class">{t("classes")}</InputLabel>
                                <Controller
                                    name="class"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            fullWidth
                                            {...register("class", {
                                                required: t("isRequired"),
                                            })}
                                        >
                                            {Classes?.data.map((row, index) => (
                                                <MenuItem key={index} value={row.id}>{i18next === "ar" ? t(row.titleAR) : t(row.titleEN)}</MenuItem>
                                            ))
                                            }
                                        </Select>
                                    )}
                                    rules={{ required: t("required") }}
                                />
                            </Box>
                        </Box>
                        {/* subject  */}
                        <Box
                            sx={{
                                display: { md: "flex", xs: "block" },
                                justifyContent: "space-between",
                                gap: "20px",
                            }}
                        >
                            <Box sx={{ flex: 1, marginBottom: "18px" }}>
                                <InputLabel id="subject">{t("subject")}</InputLabel>
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
                                            {subjects?.data.map((row, index) => (
                                                <MenuItem key={index} value={row.id}>{i18next === "ar" ? t(row.titleAR) : t(row.titleEN)}</MenuItem>
                                            ))
                                            }
                                        </Select>
                                    )}
                                    rules={{ required: t("required") }}
                                />
                            </Box>
                            <Box sx={{ flex: 1, marginBottom: "18px" }}>
                                <InputLabel id="gender">{t("package_gender")}</InputLabel>
                                <Controller
                                    name="gender"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            fullWidth
                                            {...register("gender", {
                                                required: t("isRequired"),
                                            })}
                                        >
                                            {genders.map((row, index) => (
                                                <MenuItem key={index} value={row.id}>{row.label}</MenuItem>
                                            ))
                                            }
                                        </Select>
                                    )}
                                    rules={{ required: t("required") }}
                                />
                            </Box>
                        </Box>

                        {/* Curriculums */}
                        <Box
                            sx={{
                                display: { md: "flex", xs: "block" },
                                justifyContent: "space-between",
                                gap: "20px",
                            }}
                        >
                            <Box sx={{ flex: 1, marginBottom: "18px" }}>
                                <InputLabel id="curriculums">{t("studyCurriculum")}</InputLabel>
                                <Controller
                                    name="curriculums"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            fullWidth
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
                                    )}
                                    rules={{ required: t("required") }}
                                />
                            </Box>
                            <Box sx={{ flex: 1, marginBottom: "18px" }}>
                                <InputLabel id="semester">{t("semester")}</InputLabel>
                                <Controller
                                    name="semester"
                                    control={control}
                                    render={({ field }) => (
                                        <Select
                                            {...field}
                                            fullWidth
                                            {...register("semester", {
                                                required: t("isRequired"),
                                            })}
                                        >
                                            {Classrooms.map((semester, index) => (
                                                <MenuItem key={index} value={semester.id}>
                                                    {t(semester.id)}
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
                                <Controller
                                    name="price"
                                    control={control}
                                    rules={{ required: t("isRequired") }}
                                    render={({ field }) => (
                                        <TextField
                                            label={t("sharePrice")}
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            margin="dense"
                                            {...field}
                                        />
                                    )}
                                />
                                <p className="text-red-500">{errors.price?.message}</p>
                            </Box>

                            <Box sx={{ flex: 1, marginBottom: "18px" }}>
                                <Controller
                                    name="currency"
                                    control={control}
                                    rules={{ required: t("isRequired") }}
                                    render={({ field }) => (
                                        <FormControl fullWidth margin="dense">
                                            <InputLabel id="currency">{t("currency")}</InputLabel>
                                            <Select labelId="currency" label={t("currency")} {...field}>
                                                {currencies.map((curr) => (
                                                    <MenuItem key={curr.title} value={curr.title}>
                                                        {lang === "en" ? curr.titleEn : curr.titleAr}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                <p className="text-red-500">{errors.currency?.message}</p>
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
                                <Controller
                                    name="startDate"
                                    control={control}
                                    rules={{ required: t("required") }}
                                    render={({ field }) => (
                                        <TextField type="date" {...field} fullWidth />
                                    )}
                                />
                                {errors.startDate?.type === "required" && (
                                    <Typography color="error" sx={{ fontSize: "13px", mt: "6px" }}>
                                        {t("required")}
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ flex: 1, marginBottom: "18px" }}>
                                <Controller
                                    name="time"
                                    control={control}
                                    rules={{ required: t("required") }}
                                    render={({ field }) => (
                                        <TextField type="time" {...field} fullWidth />
                                    )}
                                />
                                {errors.time?.type === "required" && (
                                    <Typography color="error" sx={{ fontSize: "13px", mt: "6px" }}>
                                        {t("required")}
                                    </Typography>
                                )}

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
                                <Controller
                                    name="endDate"
                                    control={control}
                                    rules={{ required: t("required") }}
                                    render={({ field }) => (
                                        <TextField type="date" {...field} fullWidth />
                                    )}
                                />
                                {errors.endDate?.type === "required" && (
                                    <Typography color="error" sx={{ fontSize: "13px", mt: "6px" }}>
                                        {t("required")}
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ flex: 1, marginBottom: "18px" }}>
                                <Controller
                                    name="numTotalLesson"
                                    control={control}
                                    rules={{
                                        required: t("isRequired"),
                                        minLength: {
                                            value: 1,
                                            message: t("share1"),
                                        },
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            label={t("sharesCount")}
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            margin="dense"
                                            {...field}
                                        />
                                    )}
                                />
                                <p className="text-red-500">{errors.numTotalLesson?.message}</p>
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
                                <Controller
                                    name="numWeekLesson"
                                    control={control}
                                    rules={{
                                        required: t("isRequired"),
                                        validate: (value) => {
                                            if (value > Number(getValues("numTotalLesson"))) {
                                                return t("shareInWeekValid");
                                            }
                                        },
                                        pattern: {
                                            value: /^[1-9]$/,
                                            message: t("share1"),
                                        },
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            label={t("sharesCountInWeek")}
                                            type="number"
                                            variant="outlined"
                                            fullWidth
                                            margin="dense"
                                            {...field}
                                        />
                                    )}
                                />
                                <p className="text-red-500">{errors.numWeekLesson?.message}</p>

                            </Box>
                            <Box sx={{ flex: 1, marginBottom: "18px" }}>
                                <Controller
                                    name="duration"
                                    control={control}
                                    rules={{ required: t("isRequired") }}
                                    render={({ field }) => (
                                        <FormControl fullWidth margin="dense">
                                            <InputLabel id="duration">{t("duration")}</InputLabel>
                                            <Select labelId="duration" label={t("duration")} {...field}>
                                                <MenuItem value={1}>1 {t("hour")}</MenuItem>
                                                <MenuItem value={2}>2 {t("hour")}</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                <p className="text-red-500">{errors.duration?.message}</p>
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
                                <Controller
                                    name="descriptionAr"
                                    control={control}
                                    rules={{ required: t("required") }}
                                    render={({ field }) => (
                                        <>
                                            <InputLabel sx={{ mb: 1 }}>{t("descriptionAr")}</InputLabel>
                                            <TextField multiline rows={4} fullWidth {...field} />
                                        </>
                                    )}
                                />
                                {errors.descriptionAr?.type === "required" && (
                                    <Typography color="error" sx={{ fontSize: "13px", mt: "6px" }}>
                                        {t("required")}
                                    </Typography>
                                )}
                            </Box>
                            <Box sx={{ flex: 1, marginBottom: "18px" }}>
                                <Controller
                                    name="descriptionEn"
                                    control={control}
                                    rules={{ required: t("required") }}
                                    render={({ field }) => (
                                        <>
                                            <InputLabel sx={{ mb: 1 }}>{t("descriptionEn")}</InputLabel>
                                            <TextField multiline rows={4} fullWidth {...field} />
                                        </>
                                    )}
                                />
                                {errors.descriptionEn?.type === "required" && (
                                    <Typography color="error" sx={{ fontSize: "13px", mt: "6px" }}>
                                        {t("required")}
                                    </Typography>
                                )}
                            </Box>
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
                        <LoadingButton
                            type="submit"
                            variant="contained"
                        >{t("Edit Package")}
                        </LoadingButton>
                    </form>
                </Container>
            </TeacherLayout>

        </Navbar>
    )
}

export default EditPackage;
