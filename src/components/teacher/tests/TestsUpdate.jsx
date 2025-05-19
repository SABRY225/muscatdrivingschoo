import { DialogContent,DialogActions,InputLabel,Button, Box,TextField,Typography , styled , Paper , Autocomplete , MenuItem , FormControl , Select} from '@mui/material'
import React , { useState } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import {useSnackbar} from 'notistack';
import { useLevels  }     from "../../../hooks/useLevels";
import currencies                    from "../../../data/currencies";

import Cookies from 'js-cookie';
import { countries } from 'country-code-lookup';

const Image = styled("img")({
    width: "300px",
});

export default function TeacherPackageUpdate({handleClose,Tests,setTests}) {
  console.log(Tests);

    const { teacher , token}       = useSelector((state)=>state.teacher)
    const {t} = useTranslation()
    const {closeSnackbar , enqueueSnackbar} = useSnackbar();
    const [image, setImage]       = useState(null);
    const { data:levels ,     isLoadingLevel  }       = useLevels();
    const lang = Cookies.get("i18next") || "en";

    let current_currency;
    current_currency = currencies.find((e) => e.title == Tests?.currency);
    const [currencyValue,    setCurrencyValue]      = useState(current_currency);
    const [currencyCode,     setCurrencyCode]       = useState(Tests?.currency);
    const [countryError,     setCurrencyError]      = useState(false);

    let currentLevel;
    currentLevel = levels?.data.find((e) => e.id == Tests?.LevelId);

    const [LevelId ,     setLevels]                          = useState(currentLevel);  //Tests?.LevelId
    const [LevelId_Value ,        setLevelsValue  ]          = useState(currentLevel);  // Tests?.Level    
    const [price, setPrice]                    = useState(Tests?.price);
   

    
    const { register, control , formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            price             : Tests?.price,
            LevelId           : Tests?.Level.id,
            currencyValue     : Tests?.currency
            
        }
    });
    //setPrice(Tests?.price);

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

    async function onSubmit(data)
    {
    

    const formData = new FormData();
    console.log(LevelId);

    formData.append("TeacherId",        teacher.id);
    formData.append("price",            price);
    formData.append("LevelId",          typeof( LevelId) !== 'undefined' ? LevelId : Tests?.LevelId);
    formData.append("currency",         currencyCode);

        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/tests/${Tests.id}`,{
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

            setTests(back=>back.map(item=>
                {
                    return item.id === Tests.id?{...item,
                        price           : data.price,
                        currency        : currencyCode,
                        LevelId         : data.LevelId,
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
          <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('package_price')}</InputLabel>
          <TextField
              fullWidth name="price"  type="number" min="0"  max="1000000000"  required
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
