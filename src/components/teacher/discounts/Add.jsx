import {
    Box,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { LoadingButton } from "@mui/lab";
import { useCurriculums } from "../../../hooks/useCurriculums";
import { useClasses } from "../../../hooks/useClasses";
import currencies from "../../../data/currencies";

export default function AddDiscounts({ handleClose }) {
    const { t } = useTranslation();
    const lang = Cookies.get("i18next") || "en";
    const { closeSnackbar, enqueueSnackbar } = useSnackbar();
    const { teacher } = useSelector((state) => state.teacher);
    const { data: Curriculums } = useCurriculums()
    const { data: Classes } = useClasses()
    const Classrooms = [
        { id: "First semester", label: t("First semester") },
        { id: "Second semester", label: t("First semester") }
    ]
    const [fileImageName, setFileImageName] = useState('');
    const [Image, setImage] = useState();
    const [fileName, setFileName] = useState('');
    const [file, setFile] = useState();
    const {
        register,
        control,
        formState: { errors },
        handleSubmit,
        watch,
        setValue
    } = useForm({
        defaultValues: {
            titleArabic: "",
            titleEnglish: "",
            discountType: "",
            classId: '',
            semester: '',
            curriculums: '',
            discountRate: "",
      currency: '',
      amountBeforeDiscount: "",
            amountAfterDiscount: "",
            descriptionArabic: "",
            descriptionEnglish: "",
            discountStartDate: "",
            discountEndDate: "",
            termsAndConditionsArabic: "",
            termsAndConditionsEnglish: "",
            linkDiscount:""
        },
    });

    const navigate = useNavigate();
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

    const discountRate = watch("discountRate");
    const amountBeforeDiscount = watch("amountBeforeDiscount");
    useEffect(() => {
        if (discountRate && amountBeforeDiscount) {
            const discount = (amountBeforeDiscount * discountRate) / 100;
            const amountAfterDiscount = amountBeforeDiscount - discount;
            setValue("amountAfterDiscount", amountAfterDiscount.toFixed(2)); // تحديث القيمة
        }
    }, [discountRate, amountBeforeDiscount, setValue]);
    async function createDiscount(data) {
        console.log(data);

        closeSnackbar();
        const startDateTime = new Date(data.discountStartDate);
        const endDateTime = new Date(data.discountEndDate);


        if (startDateTime >= endDateTime) {
            enqueueSnackbar(t("Start date must be earlier than end date"), { variant: "error", autoHideDuration: 5000 });
            return;
        }
        data.discountStartDate = startDateTime;
        data.discountEndDate = endDateTime;
        const formData = new FormData();

        formData.append("image", Image);
        formData.append("docs", file);
        formData.append("teacherId", teacher.id);
        for (const key in data) {
            if (key !== "image" && key !== "teacherId" && key !== "docs" ) {
                formData.append(key, data[key]);
            }
        }

        try {
            const res = await axios.post(
                `${process.env.REACT_APP_API_KEY}api/v1/teacher/discounts/create-discount`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            console.log(res);

            enqueueSnackbar(t("A new Discount has been created."), { variant: "success", autoHideDuration: 8000 });
            navigate("/teacher/discounts")
        } catch (err) {
            console.log(err);

            enqueueSnackbar("Something went wrong", { variant: "error", autoHideDuration: 8000 });
        }
    }
    return (
        <>
            <Container sx={{ marginTop: '10px', marginBottom: '80px' }}>
                <form onSubmit={handleSubmit(createDiscount)}  >
                    <Box sx={{ marginBottom: "18px", display:  {md:"flex",xs:"block"}, width: "100%", gap: "16px" }}>
                        <Box sx={{ flex: 1 }}>
                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                {t("titleAr")}
                            </InputLabel>
                            <Controller
                                name="titleArabic"
                                control={control}
                                render={({ field }) => <TextField {...field} fullWidth />}
                                {...register("titleArabic", {
                                    required: "title Address is required",
                                })}
                            />
                            {errors.titleArabic?.type === "required" && (
                                <Typography
                                    color="error"
                                    role="alert"
                                    sx={{ fontSize: "13px", marginTop: "6px" }}
                                >
                                    {t("required")}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                {t("titleEn")}
                            </InputLabel>
                            <Controller
                                name="titleEnglish"
                                control={control}
                                render={({ field }) => <TextField {...field} fullWidth />}
                                {...register("titleEnglish", {
                                    required: "title Address is required",
                                })}
                            />
                            {errors.titleEnglish?.type === "required" && (
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
                    <Box sx={{ marginBottom: "18px", display:  {md:"flex",xs:"block"}, width: "100%", gap: "16px" }}>
                        <Box sx={{ flex: 1,marginBottom: "18px" }}>
                        <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                            {t("Discount Type")}
                        </InputLabel>
                        <Controller
                            name="discountType"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    fullWidth
                                >
                                    <MenuItem value="Monthly Discounts">{t("Monthly Discounts")}</MenuItem>
                                    <MenuItem value="Discounts for University Cardholders">{t("Discounts for University Cardholders")}</MenuItem>
                                </Select>
                            )}
                            rules={{ required: t("required") }}
                        />
                    </Box>
                    <Box sx={{ flex: 1, marginBottom: "18px" }}>
                        <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                            {t("classes")}
                        </InputLabel>
                        <Controller
                            name="classId"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    fullWidth
                                >
                                    {
                                        Classes?.data.map((calss, index) => (
                                            <MenuItem key={index} value={calss.id}>{lang === "ar" ? calss.titleAR : calss.titleEN}</MenuItem>
                                        ))
                                    }
                                </Select>
                            )}
                            rules={{ required: t("required") }}
                        />
                    </Box>
                    </Box>

                     <Box sx={{ marginBottom: "18px", display:  {md:"flex",xs:"block"}, width: "100%", gap: "16px" }}>
                    <Box sx={{ flex: 1,marginBottom: "18px" }}>
                        <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                            {t("studyCurriculum")}
                        </InputLabel>
                        <Controller
                            name="curriculums"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    fullWidth
                                >
                                    {
                                        Curriculums?.data.map((Curriculum, index) => (
                                            <MenuItem key={index} value={Curriculum.id}>{lang === "ar" ? Curriculum.titleAR : Curriculum.titleEN}</MenuItem>
                                        ))
                                    }
                                </Select>
                            )}
                            rules={{ required: t("required") }}
                        />
                    </Box>
                    <Box sx={{ flex: 1,marginBottom: "18px" }}>
                        <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                            {t("semester")}
                        </InputLabel>
                        <Controller
                            name="semester"
                            control={control}
                            render={({ field }) => (
                                <Select
                                    {...field}
                                    fullWidth
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
                            )}
                            rules={{ required: t("required") }}
                        />
                    </Box>
                     </Box>

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
                    <Box sx={{ marginBottom: "18px", display:  {md:"flex",xs:"block"}, width: "100%", gap: "16px" }}>
                        <Box sx={{ flex: 1 }}>
                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                {t("Discount Percentage")}
                            </InputLabel>
                            <Controller
                                name="discountRate"
                                control={control}
                                render={({ field }) => <TextField type="number"  {...field} fullWidth />}
                                {...register("discountRate", {
                                    required: "discountRate is required",
                                })}
                            />
                            {errors.discountRate?.type === "required" && (
                                <Typography
                                    color="error"
                                    role="alert"
                                    sx={{ fontSize: "13px", marginTop: "6px" }}
                                >
                                    {t("required")}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                {t("Amount Before Discount")}
                            </InputLabel>
                            <Controller
                                name="amountBeforeDiscount"
                                control={control}
                                render={({ field }) => <TextField type="number" {...field} fullWidth />}
                                {...register("amountBeforeDiscount", {
                                    required: "amountBeforeDiscount is required",
                                })}
                            />
                            {errors.amountBeforeDiscount?.type === "required" && (
                                <Typography
                                    color="error"
                                    role="alert"
                                    sx={{ fontSize: "13px", marginTop: "6px" }}
                                >
                                    {t("required")}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                {t("Amount After Discount")}
                            </InputLabel>
                            <Controller
                                name="amountAfterDiscount"
                                control={control}
                                render={({ field }) => <TextField type="number" disabled {...field} fullWidth />}
                                {...register("amountAfterDiscount", {
                                    required: "amountAfterDiscount is required",
                                })}
                            />
                            {errors.amountAfterDiscount?.type === "required" && (
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
                    <Box sx={{ marginBottom: "18px", display:  {md:"flex",xs:"block"}, width: "100%", gap: "16px" }}>
                        <Box sx={{ flex: 1 }}>
                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                {t("discount StartDate")}
                            </InputLabel>
                            <Controller
                                name="discountStartDate"
                                control={control}
                                render={({ field }) => <TextField type="date" {...field} fullWidth />}
                                {...register("discountStartDate", {
                                    required: "discountStartDate is required",
                                })}
                            />
                            {errors.discountStartDate?.type === "required" && (
                                <Typography
                                    color="error"
                                    role="alert"
                                    sx={{ fontSize: "13px", marginTop: "6px" }}
                                >
                                    {t("required")}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                {t("discount EndDate")}
                            </InputLabel>
                            <Controller
                                name="discountEndDate"
                                control={control}
                                render={({ field }) => <TextField type="date" {...field} fullWidth />}
                                {...register("discountEndDate", {
                                    required: "discountEndDate is required",
                                })}
                            />
                            {errors.discountEndDate?.type === "required" && (
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
                    <Box sx={{ marginBottom: "18px", display:  {md:"flex",xs:"block"}, width: "100%", gap: "16px" }}>
                        <Box sx={{ flex: 1 }}>
                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                {t("description Arabic")}
                            </InputLabel>
                            <Controller
                                name="descriptionArabic"
                                control={control}
                                render={({ field }) => <TextField multiline rows={4} {...field} fullWidth />}
                                {...register("descriptionArabic", {
                                    required: "descriptionArabic is required",
                                })}

                            />
                            {errors.descriptionArabic?.type === "required" && (
                                <Typography
                                    color="error"
                                    role="alert"
                                    sx={{ fontSize: "13px", marginTop: "6px" }}
                                >
                                    {t("required")}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                {t("description English")}
                            </InputLabel>
                            <Controller
                                name="descriptionEnglish"
                                control={control}
                                render={({ field }) => <TextField multiline rows={4} {...field} fullWidth />}
                                {...register("descriptionEnglish", {
                                    required: "descriptionEnglish is required",
                                })}
                            />
                            {errors.descriptionEnglish?.type === "required" && (
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
                    <Box sx={{ marginBottom: "18px", display: {md:"flex",xs:"block"}, width: "100%", gap: "16px" }}>
                        <Box sx={{ flex: 1 }}>
                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                {t("terms And Conditions English")}
                            </InputLabel>
                            <Controller
                                name="termsAndConditionsEnglish"
                                control={control}
                                render={({ field }) => <TextField multiline rows={4} {...field} fullWidth />}
                                {...register("termsAndConditionsEnglish", {
                                    required: "termsAndConditionsEnglish is required",
                                })}
                            />
                            {errors.termsAndConditionsEnglish?.type === "required" && (
                                <Typography
                                    color="error"
                                    role="alert"
                                    sx={{ fontSize: "13px", marginTop: "6px" }}
                                >
                                    {t("required")}
                                </Typography>
                            )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                            <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                                {t("terms And Conditions Arabic")}
                            </InputLabel>
                            <Controller
                                name="termsAndConditionsArabic"
                                control={control}
                                render={({ field }) => <TextField multiline rows={4} {...field} fullWidth />}
                                {...register("termsAndConditionsArabic", {
                                    required: "termsAndConditionsArabic is required",
                                })}
                            />
                            {errors.termsAndConditionsArabic?.type === "required" && (
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
                                        {t("Discount link (if you do not include documents related to the Discount, you must include a link to the Discount)")}
                                    </InputLabel>

                                    <FormControl fullWidth margin='dense'>
                                        <TextField type="text"  {...register("linkDiscount", {
                                            required: {
                                                // value: !file,
                                                message: t("file_video-validation")
                                            },
                                            pattern: {
                                                value: /^(https?:\/\/)?(www\.youtube\.com|youtu\.be)\/.+$/,
                                                message: t("youtube_link")
                                            }
                                        })} />

                                        <p className='text-red-500'>{errors.linkDiscount?.message}</p>
                                    </FormControl>
                                </Box>
                                 <Box sx={{ marginBottom: "18px", display:  {md:"flex",xs:"block"}, width: "100%", gap: "16px" }}>
                                    <Box sx={{ flex: 1,marginBottom: "18px" }}>
                                        <InputLabel sx={{ marginBottom: "6px", fontSize: "14px", fontWeight: 'bold', color: '#f50000' }}>
                                            {t("Discount documents")}
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
                                                {t("Discount documents")}
                                            </Typography>
                                        </div>

                                        {/* عرض اسم المستند بعد اختياره */}
                                        {fileName && (
                                            <Typography sx={{ marginTop: "10px", fontSize: "17px", color: "red", textAlign: "center" }}>
                                                {t("Selected File")}: {fileName}
                                            </Typography>
                                        )}
                                    </Box>

                                    <Box sx={{ flex: 1,marginBottom: "18px" }}>
                                        <InputLabel sx={{ marginBottom: "6px", fontSize: "14px", fontWeight: 'bold', color: '#f50000' }}>
                                            {t("Choose a suitable image for the discount")}
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
                                                {t("Choose a suitable image for the discount")}
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
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <LoadingButton
                            type="submit"
                            loadingPosition="start"
                            variant="contained"
                        >
                            {t("save")}
                        </LoadingButton>
                    </Box>
                </form>
            </Container>
        </>
    );
}
