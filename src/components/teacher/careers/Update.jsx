import { DialogContent,DialogActions,InputLabel,Button, Box,TextField,Typography , styled , Autocomplete} from '@mui/material'
import React , { useState , useEffect } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack'
import Cookies from 'js-cookie';
import countries              from "../../../data/countries";
import { useCareerDepartments }     from "../../../hooks/useCareerDepartments"
;

const Image = styled("img")({
    width: "300px",
});

export default function CareerUpdate({handleClose,career,setCareers}) {
    const {t} = useTranslation()
    const {enqueueSnackbar} = useSnackbar()
    const lang = Cookies.get("i18next") || "en";
    
    const [image,           setImage]           = useState(null);
    const [countryValue,    setCountryValue]    = useState("");
    const [countryCode,     setCountryCode]     = useState("");
    const [countryError,    setCountryError]    = useState(false);
    const [check,    setCheck]    = useState(false);
    const { data:careersdepartments , isLoading  }          = useCareerDepartments();
    const { CareerDepartment , setCareerDepartment  }                  = useCareerDepartments();
    let objCareerDepartment;
    objCareerDepartment = careersdepartments?.data.find((e) => e.id == career?.CareerDepartmentId);
    console.log(objCareerDepartment);

    const [CareerDepartment_Value ,     setCareerDepartmentValue ]     = useState(objCareerDepartment); 
    const [ value, setValue]                    = useState(objCareerDepartment?.id);
    console.log(career.CareerDepartmentId);
    
    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            title_ar            : career?.titleAR,
            title_en            : career?.titleEN,
            descriptionAr       : career?.descriptionAr,
            descriptionEn       : career?.descriptionEn,
            advertiserName      : career?.advertiserName,
            advertiserPhone     : career?.advertiserPhone,
        }
    });
    const admin = useSelector((state) => state.admin);
    const teacher = useSelector((state) => state.teacher);

const token = admin?.token || teacher?.token;


    useEffect(() => {
        if (career && check == false) {
          let c;
          c = countries.find((e) => e.code == career?.country);
          setCountryValue(lang === "en" ? c.name_en : c.name_ar);
          setCountryCode(c.code);
          setCheck(true);
        }
        if(careersdepartments?.data){
            setCareerDepartmentValue(objCareerDepartment);
        }
    });
    console.log("token = ", token);

    async function onSubmit(data)
    {
        const formData = new FormData();
        formData.append("image",                  image);
        formData.append("titleAR",                data.title_ar);
        formData.append("titleEN",                data.title_en);
        formData.append("country",                countryCode);
        formData.append("descriptionAr",          data.descriptionAr);
        formData.append("descriptionEn",          data.descriptionEn);
        formData.append("CareerDepartmentId",     value);
        formData.append("advertiserName",         data.advertiserName);
        formData.append("advertiserPhone",        data.advertiserPhone);
        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/career/${career.id}`,{
                method:"PUT",
                headers:{
                    "Authorization":token
                },
                body:formData
            })
            if(response.status!==200&&response.status!==201)
            {
                throw new Error('failed occured')
            }
            const resData = await response.json()
            enqueueSnackbar(lang==="ar"?resData.msg.arabic:resData.msg.english,{variant:"success",autoHideDuration:8000})

            setCareers(back=>back.map(item=>
                {
                  let objCareerDepartment;
    objCareerDepartment = careersdepartments?.data.find((e) => e.id === value);
                    return item.id===career.id?{...item,
                        titleAR:data.title_ar,
                        titleEN:data.title_en,
                        descriptionEn:data.descriptionEn,
                        descriptionAr:data.descriptionAr,
                        advertiserPhone: data.advertiserPhone,
                        advertiserName    : data.advertiserName,
                        CareerDepartment  : objCareerDepartment,
                        CareerDepartmentId:value
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
    
                <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
        {t("choose_career_department")}
    </InputLabel>

    <Autocomplete
                onChange={(event, newValue) => { setValue(newValue?.id || null); }}
                fullWidth name ="careersdepartment"
                value={CareerDepartment_Value}
                options={careersdepartments?.data}
                getOptionLabel={(op) =>
                  (lang === "en" ? op.titleEN : op.titleAR) || op
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={lang === "en" ? "Choose a Categories" : "إختر القسم"}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                  />
                )}
              />

        <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("country")}
              </InputLabel>
              <Autocomplete
                fullWidth
                name="country"
                options={countries}
                value={countryValue}
                inputValue={countryValue}
                onChange={(event, newInputValue) => {
                  if (newInputValue) {
                    setCountryValue(
                      lang === "en"
                        ? newInputValue?.name_en
                        : newInputValue?.name_ar
                    );
                    setCountryCode(newInputValue?.code);
                    setCountryError(false);
                  } else {
                    setCountryValue("");
                    setCountryCode("");
                  }
                }}
                onInputChange={(event, newInputValue) => {
                  setCountryValue(newInputValue);
                }}
                getOptionLabel={(op) =>
                  (lang === "en" ? op.name_en : op.name_ar) || op
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={lang === "en" ? "Choose a country" : "إختر بلدك"}
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
                        {...register("title_en", { required: "title Address is required" })}
                        />
                        {errors.title_en?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
                </Box>
                <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("career_descriptionAr")}
              </InputLabel>
              <Controller
                name="descriptionAr"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("descriptionAr", {
                  required: "descriptionAr Address is required",
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

        <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("career_descriptionEn")}
              </InputLabel>
              <Controller
                name="descriptionEn"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("descriptionEn", {
                  required: "descriptionEn Address is required",
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
  
  <Box sx={{marginBottom:"18px"}}>
    <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('advertiserName')}</InputLabel>
    <Controller name="advertiserName" control={control}
          render={({ field }) => <TextField {...field} fullWidth/>}
          {...register("advertiserName", { required: "advertiser Name is required" })}
    />
    {errors.advertiserName?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
  </Box>

  <Box sx={{marginBottom:"18px"}}>
    <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('advertiserPhone')}</InputLabel>
    <Controller name="advertiserPhone" control={control}
          render={({ field }) => <TextField {...field} fullWidth/>}
          {...register("advertiserPhone", { required: "advertiser Phone is required" })}
    />
    {errors.advertiserPhone?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
  </Box>

        <input type="file" id="image" hidden onChange={(e) => setImage(e.target.files[0])} />
        <Button
              variant="contained"
              color="secondary"
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
