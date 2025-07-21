import { Box, Button, InputLabel, TextField, Typography , Autocomplete , Paper} from '@mui/material'
import React , { useState }         from 'react';
import { useForm,Controller }       from 'react-hook-form';
import { useTranslation }           from 'react-i18next';
import { useSnackbar }              from 'notistack'
import { useSelector }              from 'react-redux';
import Cookies                      from 'js-cookie';
import { useParents  }             from "../../../hooks/useParents";
import currencies                   from "../../../data/currencies";

export default function Add() {
    const {t} = useTranslation()
    const {closeSnackbar,enqueueSnackbar} = useSnackbar();
    const {admin , token} = useSelector((state)=>state.admin);
    const [amount,  setAmount] = useState(0);
    const [currencyValue,    setCurrencyValue]      = useState("");
    const [currencyCode,     setCurrencyCode]       = useState("");
    const [countryError,     setCurrencyError]      = useState(false);
    const { data:parents , isLoadingParent  }     = useParents();
    const [studentTypeError ] = useState("");
    const [ParentId , setParentValue ] = useState("");

    const handleAmount = (e) => {
        closeSnackbar();
        if (e.target.value < 0 || e.target.value > 100000000) {
          enqueueSnackbar(t("package_price_error"), {
            variant: "error",
            autoHideDuration: "5000",
          });
        } else {
          setAmount(e.target.value);
        }
    };

    const lang = Cookies.get("i18next") || "en";
    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            title_ar:"",
            title_en:""
        }
    });
    
    async function onSubmit(data)
    {
        const formData = new FormData();
        formData.append("amount",       amount);
        formData.append("ParentId",     ParentId);
        formData.append("currency",     currencyCode);
        formData.append("status",       "1");
        formData.append("AdminId" ,     admin?.id );
        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/exchangerequestparents`,{
                method:"POST",
                headers:{
                    "Authorization":token
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
<Paper sx={{ padding: "20px" }}>
    <form onSubmit={handleSubmit(onSubmit)}>

    {!isLoadingParent && (
          <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("package_trainingtype")}
              </InputLabel>

              <Autocomplete
               onChange={(event, newValue) => {
                setParentValue(newValue?.id || null);
               }}
                fullWidth
                name    ="student"
                options={parents?.data}
                getOptionLabel={(op) =>
                  (lang === "en" ? op.name : op.name) || op
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={lang === "en" ? "Choose a Parents " : "إختر الابناء"}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                  />
                )}
              />
              {studentTypeError && (
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

    <Box sx={{marginBottom:"18px"}}>
          <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('package_price')}</InputLabel>
          <TextField
              fullWidth name="amount"  type="number" min="0"  max="10000000000000" required
              sx={{ marginBottom: 3 }}
              onChange={handleAmount}
              value={amount}
            />
          {errors.amount?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
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
            
    <Button variant="contained" type="submit" sx={{ml:"6px",mr:"6px"}}>{t('save')}</Button>
    </form>
    </Paper>
    </Box>
</>
    )
}