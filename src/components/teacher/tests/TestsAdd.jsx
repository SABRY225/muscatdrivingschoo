import { Box, Button, InputLabel, TextField, Typography , styled , Paper , Autocomplete , MenuItem , FormControl , Select} from '@mui/material'
import React , { useState , useEffect} from 'react';
import { useForm,Controller } from 'react-hook-form';
import { useTranslation }            from 'react-i18next';
import { useSnackbar}                from 'notistack'
import { useSelector }               from 'react-redux';
import { useLevels }                 from "../../../hooks/useLevels";
import currencies                    from "../../../data/currencies";
import Cookies from 'js-cookie';
const Image = styled("img")({
    width: "300px",
});

export default function TestsAdd() {

    const { teacher , token}       = useSelector( (state)=>state.teacher );
    const {t}                      = useTranslation();
    const {closeSnackbar,enqueueSnackbar} = useSnackbar();
    const [image, setImage]       = useState(null);
    const {data ,           isLoadingLevel  }      = useLevels();
    const [LevelsData ,      setLevelsData  ]             = useState([]);


    const [currencyValue,    setCurrencyValue]      = useState("");
    const [currencyCode,     setCurrencyCode]       = useState("");
    const [countryError,     setCurrencyError]      = useState(false);
    
    const [LevelId ,     setLevelsCurrent]           = useState("");
    const [price, setPrice] = useState(0);

    const lang = Cookies.get("i18next") || "en";

    useEffect(() => {
      if (data?.data) {
        setLevelsData(data.data);
      }
    }, [data]);

    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            price    :   "0",
        }
    });
    
    const handlePrice = (e) => {
      closeSnackbar();
      if (e.target.value < 0 || e.target.value > 100000000) {
        enqueueSnackbar(t("package_price_error"), {
          variant: "error",
          autoHideDuration: "5000",
        });
      } else {
        setPrice(e.target.value);
      }
    };

    async function onSubmit(data)
    {
      closeSnackbar();
    const formData = new FormData();
    formData.append("image",          image);
    formData.append("TeacherId",      teacher.id);
    formData.append("LevelId",        LevelId);
    formData.append("price",          price);
    formData.append("currency",       currencyCode);

        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/tests`,{
                method:"POST",
                headers:{
                  Authorization: token,
                },
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
    
    
        <Box sx={{marginBottom:"18px"}}>
          <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('test_price')}</InputLabel>
          <TextField
              fullWidth name="price"  type="number" min="0"  max="10000000000000" required
              sx={{ marginBottom: 3 }}
              onChange={handlePrice}
              value={price}
            />
          {errors.price?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
        </Box>

        {!isLoadingLevel && (
          
          <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("package_classes")}
              </InputLabel>

              <Autocomplete
              onChange={(event, newValue) => {
                setLevelsCurrent(newValue?.id || null);
              }}
                fullWidth
                name="subject"
                options={LevelsData}
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
   
        <Button variant="contained" type="submit" sx={{ml:"6px",mr:"6px"}}>{t('save')}</Button>
        </form>
      </Paper>
      </Box>
    </>
    )
}