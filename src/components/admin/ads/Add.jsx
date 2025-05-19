import React , { useState , useEffect } from 'react';
import { Box, Button, InputLabel, TextField, Typography , styled , Autocomplete , Paper} from '@mui/material'
import { useForm,Controller } from 'react-hook-form';
import { useTranslation }     from 'react-i18next';
import { useSnackbar }        from 'notistack'
import { useSelector }        from 'react-redux';
import Cookies                from 'js-cookie';
import currencies             from "../../../data/currencies";
import { useAdsDepartments }  from "../../../hooks/useAdsDepartments";
const Image = styled("img")({
    width: "300px",
});

export default function Add() {
    
    const {token} = useSelector((state)=>state.admin)
    const {t} = useTranslation()
    const {closeSnackbar,enqueueSnackbar}           = useSnackbar();
    const [ value, setValue]                        = useState(null);
    const [image,           setImage]               = useState(null);
    const [price, setPrice]                         = useState(0);
    const [currencyValue,    setCurrencyValue]      = useState("");
    const [currencyCode,     setCurrencyCode]       = useState("");
    const [countryError,     setCurrencyError]      = useState(false);
    const { data , isLoading  }                     = useAdsDepartments();
    const [AdsDepartments, setAdsDepartments]       = useState([]);

    const lang = Cookies.get("i18next") || "en";
    const { register,control, formState: { errors }, handleSubmit } = useForm({
      defaultValues: { titleAR         : "",   titleEN         : "",   descriptionAR   : "",  descriptionEN   : "",}
    });

    useEffect(() => {
      if (data?.data) {
        setAdsDepartments(data.data);
      }
    }, [data]);

    const handlePrice = (e) => {
      closeSnackbar();
      if (e.target.value < 0 || e.target.value > 100000000) {
        enqueueSnackbar(t("package_price_error"), { variant: "error", autoHideDuration: "5000", });
      } else {
        setPrice(e.target.value);
      }
    };

    async function onSubmit(data)
    {
        const formData = new FormData();
        formData.append("image",              image);
        formData.append("titleAR",            data.titleAR);
        formData.append("titleEN",            data.titleEN);
        formData.append("descriptionAR",      data.descriptionAR);
        formData.append("descriptionEN",      data.descriptionEN);
        formData.append("link",               data.link);
        formData.append("carModel",           data.carModel);
        formData.append("yearManufacture",    data.yearManufacture);
        formData.append("carPrice",           price);
        formData.append("currency",           currencyCode);
        formData.append("AdsDepartmentId",    value);
        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/ads`,{
              method:"POST",
              headers:{  "Authorization":token },
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
    <Paper sx={{ width: "100%", padding: "20px" }}>
    <form onSubmit={handleSubmit(onSubmit)}>

    <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}> {t("choose_career_department")}</InputLabel>

    <Autocomplete onChange={(event, newValue) => { setValue(newValue?.id || null); }}
      id="size-small-standard-multi"  size="small" options={AdsDepartments}
      getOptionLabel={(option) => option.titleAR}
      renderInput={(params) => ( <TextField {...params} variant="standard" /> )}
    />


      <Box sx={{marginBottom:"18px"}}>
        <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('titleAr')}</InputLabel>
        <Controller  name="titleAR" control={control} render={({ field }) => <TextField {...field} fullWidth/>}
          {...register("titleAR", { required: "title Address is required" })}
        />
        {errors.titleAR?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
      </Box>

      
      <Box sx={{marginBottom:"18px"}}>
        <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('titleEn')}</InputLabel>
        <Controller name="titleEN" control={control} render={({ field }) => <TextField {...field} fullWidth/>}
          {...register("titleEN", { required: "title Address is required" })}
        />
        {errors.titleEN?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
      </Box>

      <Box sx={{marginBottom:"18px"}}>
        <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('link')}</InputLabel>
        <Controller
          name="link"
          control={control}
          render={({ field }) => <TextField {...field} fullWidth/>}
          {...register("link", { required: "link is required" })}
        />
        {errors.link?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
      </Box>
    
      <Box sx={{ marginBottom: "26px" }}>
        <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>{t("career_descriptionAr")}</InputLabel>
        <Controller name="descriptionAR" control={control} render={({ field }) => ( <TextField {...field} fullWidth multiline rows={3} /> )}
                {...register("descriptionAR", { required: "descriptionAR Address is required", })}
        />
        {errors.descriptionAR?.type === "required" && (
                <Typography color="error" role="alert"  sx={{ fontSize: "13px", marginTop: "6px" }}>{t("required")}</Typography>
        )}
      </Box>

        <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("career_descriptionEn")}
              </InputLabel>
              <Controller name="descriptionEN"  control={control} render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("descriptionEN", {
                  required: "descriptionEN Address is required",
                })}
              />
              {errors.descriptionEN?.type === "required" && (
                <Typography color="error" role="alert" sx={{ fontSize: "13px", marginTop: "6px" }}>
                  {t("required")}
                </Typography>
              )}
        </Box>
    
        <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>{t("carModel")}</InputLabel>
              <Controller name="carModel" control={control}  render={({ field }) => <TextField {...field} fullWidth />}
                {...register("carModel", {  required: "carModel Address is required",})}
              />
              {errors.carModel?.type === "required" && (
                <Typography  color="error" role="alert"   sx={{ fontSize: "13px", marginTop: "6px" }}>
                  {t("required")}
                </Typography>
              )}
        </Box>
      
        <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>{t("yearManufacture")}</InputLabel>
              <Controller
                name="yearManufacture"  control={control} render={({ field }) => <TextField {...field} fullWidth />}
                {...register("yearManufacture", { required: "year of Manufacture is required",})}
              />
              {errors.yearManufacture?.type === "required" && (
                <Typography color="error" role="alert" sx={{ fontSize: "13px", marginTop: "6px" }}>{t("required")}</Typography>
              )}
        </Box>
    
        <Box sx={{marginBottom:"18px"}}>
          <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('AdsPrice')}</InputLabel>
          <TextField
              fullWidth name="price"  type="number" min="0"  max="10000000000000" required
              sx={{ marginBottom: 3 }}
              onChange={handlePrice}
              value={price}
            />
          {errors.price?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
        </Box>

        <Box sx={{ marginBottom: "26px" }}>
          <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>{t("currency")}</InputLabel>
          <Autocomplete fullWidth name="currency"
                options={currencies}    value={currencyValue}     inputValue={currencyValue}
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
            <Typography color="error" role="alert"  sx={{ fontSize: "13px", marginTop: "6px" }}>{t("required")}</Typography>
          )}
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