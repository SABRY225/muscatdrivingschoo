import { DialogContent,DialogActions,InputLabel,Button, Box,TextField,Typography , Autocomplete} from '@mui/material'
import React , { useState } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack'
import Cookies from 'js-cookie';
import { useTeachers  }             from "../../../hooks/useTeachers";
import currencies                   from "../../../data/currencies";


export default function Update({handleClose,exchangerequeststeacher,setExchangeRequestsTeachers}) {
  console.log(exchangerequeststeacher);

    const {t} = useTranslation()
    const {closeSnackbar,enqueueSnackbar} = useSnackbar();

    const lang                  = Cookies.get("i18next") || "en";
    const {admin , token}       = useSelector((state)=>state.admin);
    const [amount,  setAmount]  = useState(exchangerequeststeacher?.amount);
    let current_currency;
    current_currency = currencies.find((e) => e.title == exchangerequeststeacher?.currency);
    const [currencyValue,    setCurrencyValue]      = useState(current_currency);
    const [currencyCode,     setCurrencyCode]       = useState(exchangerequeststeacher?.currency);
    const [countryError,     setCurrencyError]      = useState(false);
    const { data:teachers ,  isLoadingTeacher}      = useTeachers();
    const [Teacher , setTeacher ]             = useState(exchangerequeststeacher?.Teacher); 
    const [teachersTypeError ] = useState("");
    

    let currentTeacher;
    currentTeacher = teachers?.data.find((e) => e.id == exchangerequeststeacher?.Teacher.id);
    const [TeacherId ,    setTeacherValue ] = useState(currentTeacher);

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

    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            amount:exchangerequeststeacher?.amount,
            currencyValue:exchangerequeststeacher?.currency,
        }
    });

    //setAmount(exchangerequeststeacher?.amount);
    async function onSubmit(data)
    {
        const formData = new FormData();
        console.log(TeacherId);

        formData.append("amount",       amount);
        formData.append("TeacherId",    typeof(TeacherId) !== 'undefined' ? TeacherId?.id : exchangerequeststeacher?.TeacherId );
        formData.append("currency",     currencyCode);
        formData.append("status",       "1");
        formData.append("AdminId" ,     admin?.id );

        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/exchangerequestteachers/${exchangerequeststeacher.id}`,{
                method:"PUT",
                headers:{
                    "Authorization":token,
                },
                body:formData
            })
            if(response.status!==200&&response.status!==201)
            {
                throw new Error('failed occured')
            }
            const resData = await response.json()
            enqueueSnackbar(lang==="ar"?resData.msg.arabic:resData.msg.english,{variant:"success",autoHideDuration:8000})

            setExchangeRequestsTeachers(back=>back.map(item=>
                {
                    return item.id===exchangerequeststeacher.id?{...item,
                        amount:amount,
                        TeacherId:TeacherId,
                        currency:currencyCode,
                        AdminId:admin?.id
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
                
    {!isLoadingTeacher && (
          <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("package_trainingtype")}
              </InputLabel>

              <Autocomplete
               onChange={(event, newValue) => {
                let currentTeacher_select;
                currentTeacher_select = teachers?.data.find((e) => e.id == newValue?.id);

                setTeacherValue(currentTeacher_select || null);
               }}
                fullWidth
                name    ="teacher"
                value   ={TeacherId}
                options ={teachers?.data}
                getOptionLabel={(op) =>
                  (lang === "en" ? op.firstName + " " + op.lastName : op.firstName + " " + op.lastName) || op
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={lang === "en" ? "Choose a Teams " : "إختر المدرب"}
                    inputProps={{
                      ...params.inputProps,
                      autoComplete: "new-password",
                    }}
                  />
                )}
              />
              {teachersTypeError && (
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
