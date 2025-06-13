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
import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import { LoadingButton } from "@mui/lab";
import { useCurriculums } from "../../../hooks/useCurriculums";
import { useClasses } from "../../../hooks/useClasses";
import Navbar from "../../Navbar";
import Loading from "../../Loading";
import currencies from "../../../data/currencies";
import TeacherLayout from "../TeacherLayout";
export default function EditDiscount() {
  const { t } = useTranslation();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { teacher } = useSelector((state) => state.teacher);
  const [discount, setDiscount] = useState()
  const [isLoading, setLoading] = useState(false)
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
  const { id } = useParams()
  function convertDate(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0]; // yyyy-mm-dd
  }
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    watch,
    setValue,
    reset
  } = useForm({
    defaultValues: {
      titleAR: "",
      titleEN: "",
      discountType: "",
      class: '',
      semester: '',
      curriculums: '',
      percentage: "",
      amountBeforeDiscount: "",
      amountAfterDiscount: "",
      descriptionAR: "",
      descriptionEN: "",
      startDate: "",
      endDate: "",
      conditionsAR: "",
      conditionsEN: "",
      image: null,
      currency: '',
      linkDiscount: ""

    },
  });
  const lang = Cookies.get("i18next") || "en";

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
  const handleClose = () => {
    navigate("/teacher/discounts")
  }
  useEffect(() => {
    const fetchDiscount = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/discount/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setDiscount(data.data);
        setLoading(true)
      } catch (err) {
        console.error("Error fetching levels:", err);
      }
    };
    fetchDiscount();
  }, [id, lang])
  useEffect(() => {
    console.log("discount", discount);

    if (discount) {
      reset({
        titleAR: discount.titleAR,
        titleEN: discount.titleEN,
        discountType: discount.discountType,
        percentage: discount.percentage,
        class: discount?.class,
        semester: discount.semester,
        curriculums: discount?.curriculums,
        amountBeforeDiscount: discount?.amountBeforeDiscount,
        amountAfterDiscount: discount?.amountAfterDiscount,
        descriptionAR: discount?.descriptionAR,
        descriptionEN: discount?.descriptionEN,
        startDate: convertDate(discount?.startDate),
        endDate: convertDate(discount?.endDate),
        conditionsAR: discount?.conditionsAR,
        conditionsEN: discount?.conditionsEN,
        currency: discount?.currency,
        image: discount?.image || null,
        linkDiscount: discount?.linkDiscount || null,
      });
      setFileImageName(discount?.image)
      setFileName(discount?.docs)

    }
  }, [discount, reset]);

  async function onSubmit(data) {
    closeSnackbar();
    const startDateTime = new Date(data.startDate);
    const endDateTime = new Date(data.endDate);

    if (startDateTime >= endDateTime) {
      enqueueSnackbar(t("Start date must be earlier than end date"), { variant: "error", autoHideDuration: 5000 });
      return;
    }
    data.startDate = startDateTime;
    data.endDate = endDateTime;
    const formData = new FormData();
    if (Image) {
      formData.append("image", Image);
    } else if (discount?.image) {
      formData.append("image", discount.image);
    }
    if (file)
      formData.append("docs", file);

    formData.append("teacherId", teacher.id);
    for (const key in data) {
      if (key !== "image" && key !== "teacherId" && key !== "docs") {
        formData.append(key, data[key]);
      }
    }
    try {
      await axios.put(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/discount/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      enqueueSnackbar(t("A new Discount has been updated."), { variant: "success", autoHideDuration: 8000 });
      navigate("/teacher/discounts")
    } catch (err) {
      enqueueSnackbar(t("Something went wrong"), { variant: "error", autoHideDuration: 8000 });
    }
  }
  const percentage = watch("percentage");
  const amountBeforeDiscount = watch("amountBeforeDiscount");
  useEffect(() => {
    if (percentage && amountBeforeDiscount) {
      const discount = (amountBeforeDiscount * percentage) / 100;
      const amountAfterDiscount = amountBeforeDiscount - discount;
      setValue("amountAfterDiscount", amountAfterDiscount.toFixed(2)); // تحديث القيمة
    }
  }, [percentage, amountBeforeDiscount, setValue]);
  return (
    <>
      <Navbar>
        {isLoading ?
          <>
            <TeacherLayout>
              <Container sx={{ marginTop: '50px', marginBottom: '80px' }}>
                <form onSubmit={handleSubmit(onSubmit)}  >
                  <Box sx={{
                    display: { md: "flex", xs: "block" },
                    justifyContent: "space-around",
                    gap: "20px",
                    marginBottom: "18px"
                  }}>
                    <Box sx={{ flex: 1 }}>
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
                    <Box sx={{ flex: 1 }}>
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
                    marginBottom: "18px"
                  }}>
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
                  <Box sx={{flex: 1, marginBottom: "18px" }}>
                    <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                      {t("classes")}
                    </InputLabel>
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
                   <Box sx={{
                    display: { md: "flex", xs: "block" },
                    justifyContent: "space-around",
                    gap: "20px",
                    marginBottom: "18px"
                  }}>
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
                  <Box sx={{ marginBottom: "18px", display: "flex", width: "100%", gap: "16px" }}>
                    <Box sx={{ flex: 1 }}>
                      <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                        {t("Discount Percentage")}
                      </InputLabel>
                      <Controller
                        name="percentage"
                        control={control}
                        render={({ field }) => <TextField type="number"  {...field} fullWidth />}
                        {...register("percentage", {
                          required: "percentage is required",
                        })}
                      />
                      {errors.percentage?.type === "required" && (
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
                  <Box sx={{ marginBottom: "18px", display: "flex", width: "100%", gap: "16px" }}>
                    <Box sx={{ flex: 1 }}>
                      <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                        {t("discount StartDate")}
                      </InputLabel>
                      <Controller
                        name="startDate"
                        control={control}
                        render={({ field }) => <TextField type="date" {...field} fullWidth />}
                        {...register("startDate", {
                          required: "startDate is required",
                        })}
                      />
                      {errors.startDate?.type === "required" && (
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
                        name="endDate"
                        control={control}
                        render={({ field }) => <TextField type="date" {...field} fullWidth />}
                        {...register("endDate", {
                          required: "endDate is required",
                        })}
                      />
                      {errors.endDate?.type === "required" && (
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
                  <Box sx={{ marginBottom: "18px", display: "flex", width: "100%", gap: "16px" }}>
                    <Box sx={{ flex: 1 }}>
                      <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                        {t("description Arabic")}
                      </InputLabel>
                      <Controller
                        name="descriptionAR"
                        control={control}
                        render={({ field }) => <TextField multiline rows={4} {...field} fullWidth />}
                        {...register("descriptionAR", {
                          required: "descriptionAR is required",
                        })}

                      />
                      {errors.descriptionAR?.type === "required" && (
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
                        name="descriptionEN"
                        control={control}
                        render={({ field }) => <TextField multiline rows={4} {...field} fullWidth />}
                        {...register("descriptionEN", {
                          required: "descriptionEN is required",
                        })}
                      />
                      {errors.descriptionEN?.type === "required" && (
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
                  <Box sx={{ marginBottom: "18px", display: "flex", width: "100%", gap: "16px" }}>
                    <Box sx={{ flex: 1 }}>
                      <InputLabel sx={{ marginBottom: "6px", fontSize: "14px" }}>
                        {t("terms And Conditions English")}
                      </InputLabel>
                      <Controller
                        name="conditionsEN"
                        control={control}
                        render={({ field }) => <TextField multiline rows={4} {...field} fullWidth />}
                        {...register("conditionsEN", {
                          required: "conditionsEN is required",
                        })}
                      />
                      {errors.conditionsEN?.type === "required" && (
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
                        name="conditionsAR"
                        control={control}
                        render={({ field }) => <TextField multiline rows={4} {...field} fullWidth />}
                        {...register("conditionsAR", {
                          required: "conditionsAR is required",
                        })}
                      />
                      {errors.conditionsAR?.type === "required" && (
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
                  <Box sx={{
                    display: { md: "flex", xs: "block" },
                    justifyContent: "space-around",
                    gap: "20px",
                    marginBottom: "18px"
                  }}>
                    <Box sx={{flex:1, marginBottom: "18px" }}>
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

                    <Box sx={{ flex:1,marginBottom: "18px" }}>
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
                  <DialogActions>
                    <Button
                      variant="contained"
                      type="submit"
                      sx={{ ml: "6px", mr: "10px" }}
                    >
                      {t("save")}
                    </Button>
                    <Button
                      color="error"
                      variant="contained"
                      onClick={() => handleClose()}
                      sx={{ ml: "6px", mr: "10px" }}
                    >
                      {t("cancel")}
                    </Button>
                  </DialogActions>
                </form>
              </Container>
            </TeacherLayout>

          </> :
          <>
            <Loading />
          </>}
      </Navbar>
    </>
  );
}
