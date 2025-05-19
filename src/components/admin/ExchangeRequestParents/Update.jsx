import { DialogContent,DialogActions,InputLabel,Button, Box,TextField,Typography , Autocomplete} from '@mui/material'
import React , { useState } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack'
import Cookies from 'js-cookie';
import { useParents  }             from "../../../hooks/useParents";
import currencies                   from "../../../data/currencies";


export default function Update({handleClose,exchangerequestsparent,setExchangeRequestsParents}) {
  console.log(exchangerequestsparent);

    const {t} = useTranslation()
    const {closeSnackbar,enqueueSnackbar} = useSnackbar();

    const lang                  = Cookies.get("i18next") || "en";
    const {admin , token}       = useSelector((state)=>state.admin);
    const [amount,  setAmount]  = useState(exchangerequestsparent?.amount);
    let current_currency;
    current_currency = currencies.find((e) => e.title == exchangerequestsparent?.currency);
    const [currencyValue,    setCurrencyValue]      = useState(current_currency);
    const [currencyCode,     setCurrencyCode]       = useState(exchangerequestsparent?.currency);
    const [countryError,     setCurrencyError]      = useState(false);
    const { data:parents ,  isLoadingParent}      = useParents();
    const [Parent , setParent ]             = useState(exchangerequestsparent?.Parent); 
    const [teachersTypeError ] = useState("");
    

    let currentTeacher;
    currentTeacher = parents?.data.find((e) => e.id == exchangerequestsparent?.Parent.id);
    const [ParentId ,    setTeacherValue ] = useState(currentTeacher);

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
            amount:exchangerequestsparent?.amount,
            currencyValue:exchangerequestsparent?.currency,
        }
    });

    //setAmount(exchangerequestsparent?.amount);
    async function onSubmit(data)
    {
        const formData = new FormData();
        console.log(ParentId);

        formData.append("amount",       amount);
        formData.append("ParentId",     typeof(ParentId) !== 'undefined' ? ParentId?.id : exchangerequestsparent?.ParentId );
        formData.append("currency",     currencyCode);
        formData.append("status",       "1");
        formData.append("AdminId" ,     admin?.id );

        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/exchangerequestparents/${exchangerequestsparent.id}`,{
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

            setExchangeRequestsParents(back=>back.map(item=>
                {
                    return item.id===exchangerequestsparent.id?{...item,
                        amount:amount,
                        ParentId:ParentId,
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
                
    {!isLoadingParent && (
          <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("package_trainingtype")}
              </InputLabel>

              <Autocomplete
               onChange={(event, newValue) => {
                let currentStudent_select;
                currentStudent_select = parents?.data.find((e) => e.id == newValue?.id);

                setTeacherValue(currentStudent_select || null);
               }}
                fullWidth
                name    ="Parent"
                value   ={ParentId}
                options ={parents?.data}
                getOptionLabel={(op) =>
                  (lang === "en" ? op.name : op.name) || op
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label={lang === "en" ? "Choose a Parents " : "إختر الاباء"}
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
