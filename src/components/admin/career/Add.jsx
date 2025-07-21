import { Box, Button, InputLabel, TextField, Typography , styled , Autocomplete , Paper} from '@mui/material'
import React , { useState , useEffect } from 'react';
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack'
import { useSelector } from 'react-redux';
import Cookies from 'js-cookie';
import countries                     from "../../../data/countries";
import { useCareerDepartments }     from "../../../hooks/useCareerDepartments"

const Image = styled("img")({
    width: "300px",
});

export default function Add() {
    
    const {token} = useSelector((state)=>state.admin)
    const {t} = useTranslation()
    const {closeSnackbar,enqueueSnackbar} = useSnackbar();
    const [ value, setValue]                    = useState(null);
    const [image,           setImage]           = useState(null);
    const [countryValue,    setCountryValue]    = useState("");
    const [countryCode,     setCountryCode]     = useState("");
    const [countryError,    setCountryError]    = useState(false);
    const { data , isLoading  }          = useCareerDepartments();
    const [CareerDepartments, setCareerDepartments] = useState([]);

    const lang = Cookies.get("i18next") || "en";
    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            titleAR        : "",
            titleEN        : "",
            country         : "",
            descriptionAR   : "",
            descriptionEN   : "",
            advertiserName  : "",
            advertiserPhone : "",
        }
    });

    useEffect(() => {
        if (data?.data) {
          setCareerDepartments(data.data);
        }
      }, [data]);
    
    async function onSubmit(data)
    {
        const formData = new FormData();
        formData.append("image",          image);
        formData.append("titleAR",        data.titleAR);
        formData.append("titleEN",        data.titleEN);
        formData.append("country",        countryCode);
        formData.append("descriptionAR",  data.descriptionAR);
        formData.append("descriptionEN",  data.descriptionEN);
        formData.append("advertiserName", data.advertiserName);
        formData.append("advertiserPhone",    data.advertiserPhone);
        formData.append("CareerDepartmentId", value);
      if(countryCode == ""){
        enqueueSnackbar( t("country_required"), {
          variant: "error",
          autoHideDuration: 8000,
        });
        throw new Error("failed occured");
      }
      if (!image) {
          enqueueSnackbar( t("image_required"), {
            variant: "error",
            autoHideDuration: 8000,
          });
          throw new Error("failed occured");
      }

        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/career`,{
                method:"POST",
                headers:{"Authorization":token},
                body:formData,
            })
            if(response.status!==200&&response.status!==201)
            {
                throw new Error('failed occured')
            }
            const resData = await response.json()
            enqueueSnackbar(lang==="ar"?resData.msg.arabic:resData.msg.english,{variant:"success",autoHideDuration:8000})
        }
        catch(err)
        {
            console.log(err)
        }
    }

    return (
        <>
        <Box sx={{width:"500px",maxWidth:"100%"}}>
        <Paper sx={{ padding: "20px" }}>
    <form onSubmit={handleSubmit(onSubmit)}>
    <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}> {t("choose_career_department")}</InputLabel>

    <Autocomplete onChange={(event, newValue) => { setValue(newValue?.id || null); }}
      id="size-small-standard-multi"  size="small" options={CareerDepartments}
      getOptionLabel={(option) => option.titleAR}
      renderInput={(params) => ( <TextField {...params} variant="standard" /> )}
    />

  <Box sx={{ marginBottom: "26px" }}>
        <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>{t("country")}</InputLabel>
        <Autocomplete fullWidth name="country" options={countries} value={countryValue}  inputValue={countryValue}
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
    <Controller name="titleAR" control={control}  render={({ field }) => <TextField {...field} fullWidth/>}
                    {...register("titleAR", { required: "title Address is required" })} />
    {errors.titleAR?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
  </Box>
  <Box sx={{marginBottom:"18px"}}>
    <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('titleEn')}</InputLabel>
    <Controller name="titleEN" control={control} render={({ field }) => <TextField {...field} fullWidth/>}
                    {...register("titleEN", { required: "title Address is required" })} />
      {errors.titleEN?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
  </Box>
    
  <Box sx={{ marginBottom: "26px" }}>
        <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}> {t("career_descriptionAr")} </InputLabel>
        <Controller name="descriptionAR" control={control} render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
        )}
        {...register("descriptionAR", { required: "descriptionAR Address is required",
        })} />
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

  <Box sx={{ marginBottom: "26px" }}>
    <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}> {t("career_descriptionEn")} </InputLabel>
    <Controller name="descriptionEN"  control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("descriptionEN", {
                  required: "descriptionEN Address is required",
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

            <Button variant="contained" type="submit" sx={{ml:"6px",mr:"6px"}}>{t('save')}</Button>
            </form>
            </Paper>
        </Box>
        </>
    )
}