import { DialogContent,DialogActions,InputLabel,Button, Box,TextField,Typography , styled , Paper , Autocomplete , MenuItem , FormControl , Select} from '@mui/material'
import React , { useState } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {useSnackbar} from 'notistack';
import { useSubjects }     from "../../../hooks/useSubject";
import { useTrainingCategoryTypes } from "../../../hooks/useTrainingCategoryTypes";
import { useLimeType }    from "../../../hooks/useLimeType";
import { useClasses  }    from "../../../hooks/useClasses";
import { useLevels  }     from "../../../hooks/useLevels";
import currencies                    from "../../../data/currencies";

import Cookies from 'js-cookie';
import { countries } from 'country-code-lookup';

const Image = styled("img")({
    width: "300px",
});

export default function TeacherPackageUpdate({handleClose,Package,setPackages}) {
  console.log(Package);

    const { teacher , token}       = useSelector((state)=>state.teacher)
    const {t} = useTranslation()
    const {closeSnackbar , enqueueSnackbar} = useSnackbar();
    const [image, setImage]       = useState(null);
    const { data:trainingcategorytypes , isLoadingTrainingType  }   = useTrainingCategoryTypes();
    
    const { data:limittypes , isLoadingLimeType  }    = useLimeType();
    const { data:subjects ,   isLoadingSubject  }     = useSubjects();
    const { data:levels ,     isLoadingLevel  }       = useLevels();
    const lang = Cookies.get("i18next") || "en";

    let current_currency;
    current_currency = currencies.find((e) => e.title == Package?.currency);
    const [currencyValue,    setCurrencyValue]      = useState(current_currency);
    const [currencyCode,     setCurrencyCode]       = useState(Package?.currency);
    const [countryError,     setCurrencyError]      = useState(false);
    const [trainingTypeError ]                      = useState("");
    const [ClassesId,    setClasses]                = useState("");
    console.log("Conseoslslslsl");

    let currentLevel;
    currentLevel = levels?.data.find((e) => e.id == Package?.LevelId);

    let currentTrainingCategoryType;
    currentTrainingCategoryType = trainingcategorytypes?.data.find((e) => e.id == Package?.TrainingCategoryTypeId);


    let currentSubjectCategory;
    currentSubjectCategory = subjects?.data.find((e) => e.id == Package?.SubjectCategoryId);

    let currentLimeType;
    currentLimeType = limittypes?.data.find((e) => e.id == Package?.LimeTypeId);

    const [SubjectCategoryId,    setSubjectCategory]               = useState(currentSubjectCategory);
    const [SubjectCategoryId_Value,    setSubjectCategoryValue]    = useState(currentSubjectCategory); //Package?.SubjectCategory
    const [LimeTypeId ,          setLimitType]                     = useState(currentLimeType); //(Package?.LimeType
    const [LimitTypeId_Value , setLimitTypeValue  ]                = useState(currentLimeType); // Package?.LimeType
    const [LevelId ,     setLevels]                          = useState(currentLevel);  //Package?.LevelId
    const [LevelId_Value ,        setLevelsValue  ]          = useState(currentLevel);  // Package?.Level
    
    const [TrainingCategoryType , setTrainingTypeValue ]             = useState(currentTrainingCategoryType);  // ( Package?.TrainingCategoryTypeId
    const [TrainingCategoryType_Value , setTrainingTypeValueId ]     = useState(currentTrainingCategoryType);  //Package?.TrainingCategoryType
    
    const [price, setPrice]                    = useState(Package?.price);
    const [numTotalLesson , setNumTotalLesson] = useState(Package?.numTotalLesson);
    const [numWeekLesson , setNumWeekLesson]   = useState(Package?.numWeekLesson);


    
    const { register, control , formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            image             : Package?.image,
            title_ar          : Package?.titleAR,
            title_en          : Package?.titleEN,
            description_ar    : Package?.descriptionAr,
            description_en    : Package?.descriptionEn,
            numTotalLesson    : Package?.numTotalLesson,
            numWeekLesson     : Package?.numWeekLesson,
            price             : Package?.price,
            duration          : Package?.duration,
            gender            : Package?.gender,
            startDate         : Package?.startDate,
            endDate           : Package?.endDate,
            SubjectCategoryId         : Package?.SubjectCategory,
            LimeTypeId       : Package?.LimeType,
            TrainingCategoryType  : Package?.TrainingCategoryType,
            LevelId           : Package?.Level,
            currencyValue     : Package?.currency
        }
    });
    //setPrice(Package?.price);

    const handlePrice = (e) => {
      closeSnackbar();
      if (e.target.value < 0 || e.target.value > 1000000000) {
        enqueueSnackbar(t("package_price_error"), {
          variant: "error",
          autoHideDuration: "5000",
        });
      } else {
        setPrice(e.target.value);
      }
    };

    const handleNumTotalLesson = (e) => {
      closeSnackbar();
      if (e.target.value < 0 || e.target.value > 100) {
        enqueueSnackbar(t("package_price_error"), {
          variant: "error",
          autoHideDuration: "5000",
        });
      } else {
        setNumTotalLesson(e.target.value);
      }
    };

    const handleNumWeekLesson = (e) => {
      closeSnackbar();
      if (e.target.value < 0 || e.target.value > 100) {
        enqueueSnackbar(t("package_price_error"), {
          variant: "error",
          autoHideDuration: "5000",
        });
      } else {
        setNumWeekLesson(e.target.value);
      }
    };

    async function onSubmit(data)
    {
    
      console.log("SubjectCategoryId");
    console.log(SubjectCategoryId);

    const formData = new FormData();
    formData.append("image",            image);
    formData.append("TeacherId",        teacher.id);
    formData.append("titleAR",          data.title_ar);
    formData.append("titleEN",          data.title_en);
    formData.append("descriptionAr",    data.description_ar);
    formData.append("descriptionEn",    data.description_en);
    formData.append("startDate",        data.startDate);
    formData.append("endDate",          data.endDate);
    formData.append("price",            price);
    formData.append("TrainingCategoryTypeId",  typeof(TrainingCategoryType) !== 'undefined' ? TrainingCategoryType : Package?.TrainingCategoryType   );
    formData.append("LimeTypeId",              typeof(LimeTypeId) !== 'undefined' ? LimeTypeId : Package?.LimeTypeId );
    formData.append("SubjectCategoryId",       typeof( SubjectCategoryId) !== 'undefined' ? SubjectCategoryId : Package?.SubjectCategoryId);
    formData.append("LevelId",                 typeof( LevelId) !== 'undefined' ? LevelId : Package?.LevelId);
    formData.append("numTotalLesson",       numTotalLesson);
    formData.append("numWeekLesson",        numWeekLesson);
    formData.append("duration",             data.duration);
    formData.append("gender",               data.gender);
    formData.append("currency",             currencyCode);

        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/updatePackage/${Package.id}`,{
                method:"PUT",
                headers:{
                    "Authorization":token,
                },
                body:formData,
            })
            if(response.status!==200&&response.status!==201)
            {
                throw new Error('failed occured')
            }
            const resData = await response.json()
            enqueueSnackbar(lang==="ar"?resData.msg.arabic:resData.msg.english,{variant:"success",autoHideDuration:8000})

            setPackages(back=>back.map(item=>
                {
                    console.log("Update Row");
                    console.log(data);
                    console.log("End Row Update");
                    return item.id === Package.id?{...item,
                        image           : data.image,
                        titleAr         : data.title_ar,
                        titleEn         : data.title_en,
                        descriptionAr   : data.description_ar,
                        descriptionEn   : data.description_en,
                        price           : data.price,
                        duration        : data.duration,
                        numTotalLesson           : data.numTotalLesson,
                        numWeekLesson            : data.numWeekLesson,
                        gender                   : data.gender,
                        startDate                : data.startDate,
                        endDate                  : data.endDate,
                        TrainingCategoryTypeId   : data.TrainingCategoryType,
                        LimeTypeId               : data.LimeTypeId,
                        LevelId                  : data.LevelId,
                        SubjectCategoryId        : data.SubjectCategoryId,
                    }:item
                }))
            handleClose()
        }
        catch(err)
        {
            console.log(err)
        }
    }
    
    return (
        <Box sx={{width:"500px",maxWidth:"100%",paddingTop:"12px"}}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                
                <Box sx={{marginBottom:"18px"}}>
                <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('titleAr')}</InputLabel>
                        <Controller
                        name="title_ar"
                        control={control}
                        render={({ field }) => <TextField {...field} fullWidth/>}
                        {...register("title_ar", { required: "title Address is required" })}
                        />
                        {errors.title_ar?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
                </Box>
                <Box sx={{marginBottom:"18px"}}>
                        <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('titleEn')}</InputLabel>
                        <Controller
                        name="title_en"
                        control={control}
                        render={({ field }) => <TextField {...field} fullWidth/>}
                        {...register("title_en", { required: "title arabic is required" })}
                        />
                        {errors.title_en?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
                </Box>

            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("package_descAr")}
              </InputLabel>
              <Controller
                name="description_ar"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("description_ar", {
                  required: "description_ar Address is required",
                })}
              />
              {errors.description_ar?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>

            <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("package_descEn")}
              </InputLabel>
              <Controller
                name="description_en"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("description_en", {
                  required: "description_ar Address is required",
                })}
              />
              {errors.description_en?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
            </Box>

        {!isLoadingTrainingType && (
          <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("package_trainingtype")}
              </InputLabel>

              <Autocomplete
                onChange={(event, newValue) => { setTrainingTypeValue(newValue?.id || null); }}
                fullWidth name ="trainingcategorytype"
                value={TrainingCategoryType_Value}
                options={trainingcategorytypes?.data}
                getOptionLabel={(op) =>
                  (lang === "en" ? op.titleEN : op.titleAR) || op
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={lang === "en" ? "Choose a Training Category Types" : "إختر فئه التدريب"}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                  />
                )}
              />
              {trainingTypeError && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
          </Box>
        )}

        {!isLoadingLimeType && (
          <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("package_limittype")}
              </InputLabel>

              <Autocomplete
                onChange={(event, newValue) => {
                  setLimitType(newValue?.id || null);
                }}
                fullWidth
                value = {LimitTypeId_Value}
                name="limittype"
                options={limittypes?.data}
                getOptionLabel={(op) =>
                  (lang === "en" ? op.titleEN : op.titleAR) || op
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={lang === "en" ? "Choose a Limit Type" : "إختر نوع الجير"}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                  />
                )}
              />
          </Box>
        )}

        {!isLoadingSubject && (
          <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("package_subject")}
              </InputLabel>

              <Autocomplete
              onChange={(event, newValue) => {
                setSubjectCategory(newValue?.id || null);
              }}
                fullWidth name="subjectcategory"
                value ={SubjectCategoryId_Value}
                options={subjects?.data}
                getOptionLabel={(op) =>
                  (lang === "en" ? op.titleEN : op.titleAR) || op
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={lang === "en" ? "Choose a Categories" : "إختر نوع التدريب "}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                  />
                )}
              />
          </Box>
        )}

        {!isLoadingLevel && (
          <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("package_classes")}
              </InputLabel>

              <Autocomplete
              onChange={(event, newValue) => {
                setLevels(newValue?.id || null);
              }}
                fullWidth
                value = {LevelId_Value}
                name="level"
                vale = {LevelId_Value}
                options={levels?.data}
                getOptionLabel={(op) =>
                  (lang === "en" ? op.titleEN : op.titleAR) || op
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={lang === "en" ? "Choose a Levels" : "إختر مراحل التدريب "}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                  />
                )}
              />
          </Box>
        )}
        
        <Box sx={{ marginBottom: "26px" }}>
          <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
              {t("package_startDate")}
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

        <Box sx={{ marginBottom: "26px" }}>
          <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
            {t("package_endDate")}
          </InputLabel>
          <Controller
              name="endDate"
              control={control}
              render={({ field }) => (
                <TextField type="date" {...field} fullWidth />
              )}
              {...register("endDate", {
                required: "start Date Address is required",
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

        <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("gender")}
              </InputLabel>
              <Controller
                name="gender"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <Select
                      {...field}
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      {...register("gender", {
                        required: "gender is required",
                      })}
                    >
                      <MenuItem value={"male"}>{t("male")}</MenuItem>
                      <MenuItem value={"female"}>{t("female")}</MenuItem>
                      <MenuItem value={"male&female"}>{t("male&female")}</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
              {errors.gender?.type === "required" && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
        </Box>

        <Box sx={{marginBottom:"18px"}}>
          <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('package_duration')}</InputLabel>
          <Controller  name="duration"  control={control}
              render={({ field }) => <TextField {...field} fullWidth/>}
              {...register("duration", { required: "Duration is required" })}
          />
          {errors.duration?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
        </Box>

        <Box sx={{marginBottom:"18px"}}>
          <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('package_price')}</InputLabel>
          <TextField
              fullWidth name="price"  type="number" min="0"  max="1000000000"  required
              onChange={handlePrice}
              value={price}
            />
          {errors.price?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
        </Box>

        <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("currency")}
              </InputLabel>
              <Autocomplete fullWidth name="currency"
                options={currencies}
                value={currencyValue}
                inputValue={currencyValue}
                onChange={(event, newInputValue) => {
                  if (newInputValue) {
                    setCurrencyValue(
                      lang === "en"
                        ? newInputValue?.titleEn
                        : newInputValue?.titleAr
                    );
                    setCurrencyCode(newInputValue?.title);
                    setCurrencyError(false);
                  } else {
                    setCurrencyValue("");
                    setCurrencyCode("");
                  }
                }}
                onInputChange={(event, newInputValue) => {
                  setCurrencyValue(newInputValue);
                }}
                getOptionLabel={(op) =>
                  (lang === "en" ? op.titleEn : op.titleAr) || op
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={lang === "en" ? "Choose a Currency" : "إختر العمله"}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                  />
                )}
              />
              {countryError && (
                <Typography
                  color="error"
                  role="alert"
                  sx={{ fontSize: "13px", marginTop: "6px" }}
                >
                  {t("required")}
                </Typography>
              )}
        </Box>

        <Box sx={{marginBottom:"18px"}}>
          <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('package_numTotalLesson')}</InputLabel>
          <TextField
              fullWidth name="numTotalLesson"  type="number" min="0"  max="100"  required
              sx={{ marginBottom: 3 }}
              onChange={handleNumTotalLesson}
              value={numTotalLesson}
            />
          {errors.numTotalLesson?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
        </Box>
        <Box sx={{marginBottom:"18px"}}>
          <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('package_numWeekLesson')}</InputLabel>
          <TextField
              fullWidth name="numWeekLesson"  type="number" min="0"  max="100"  required
              sx={{ marginBottom: 3 }}
              onChange={handleNumWeekLesson}
              value={numWeekLesson}
            />
          {errors.numWeekLesson?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
        </Box>

            <input
              type="file" id="image" hidden onChange={(e) => setImage(e.target.files[0])}
            />
            <Button
              variant="contained"color="secondary"
              sx={{ textTransform: "capitalize", padding: 0, marginBottom: "20px", }}
            >
            <InputLabel htmlFor="image">{t("addphoto")}</InputLabel>
            </Button>
            <Box>{image && <Image src={URL.createObjectURL(image)} />}</Box>
         
                </DialogContent>
                <DialogActions>
                <Button onClick={handleClose}>{t('cancel')}</Button>
                <Button type="submit">
                    {t('save')}
                </Button>
            </DialogActions>
            </form>
        </Box>
    )
}
