import React from "react";
import Navbar               from "../../../components/Navbar";
import AdsStepper           from "../../../components/guest/AdsStepper";
import { Controller, useForm } from "react-hook-form";
import { Autocomplete ,Box, InputLabel, TextField, Typography ,Paper , styled , Container, Grid} from "@mui/material";
import StepperButtonsGuest      from "../../../components/reusableUi/StepperButtonsGuest";
import { useTranslation } from "react-i18next";
import { useNavigate , useParams }  from "react-router-dom";
import { useSelector }      from "react-redux";
import { useState }         from "react";
import { useGuest }         from "../../../hooks/useGuest";
import { useEffect }        from "react";
import { useSnackbar }      from "notistack";
import { useSocialMedia }   from "../../../hooks/useSocialMedia";
import EmailOutlinedIcon    from "@mui/icons-material/EmailOutlined";
import call                 from "../../../images/callsvg.svg";
import currencies           from "../../../data/currencies";
import Cookies              from 'js-cookie';
const ImageLogo = styled("img")({
  height: "60px",

  "@media screen and (max-width: 600px) ": {
    height: "45px",
  },
  "@media screen and (max-width: 320px) ": {
    height: "27px",
  },
  objectFit: "cover",
  objectPosition: "bottom",
});
const ImageCall = styled("img")({
  width: "18px",
  height: "18px",
});

export default function StepFour() {
  const lang = Cookies.get("i18next") || "en";
  const { AdsId }         = useParams();
  const { guest, token }  = useSelector((state) => state.guest);
  const { data }          = useGuest(guest?.id);
  const [price, setPrice] = useState(0);
  const [load, setLoad]   = useState(false);
  const navigate          = useNavigate();
  const [currencyValue,    setCurrencyValue]      = useState("");
  const [currencyCode,     setCurrencyCode]       = useState("");
  const [countryError,     setCurrencyError]      = useState(false);
  const { closeSnackbar, enqueueSnackbar }        = useSnackbar();

  const { dataSocial } = useSocialMedia();
  const links = dataSocial?.data;
  const whatsAppLink = links
    ?.filter((obj) => obj.type === "Whatsapp")
    .map((obj) => obj.link);
  const { register, control,  reset,  formState: { errors },  handleSubmit,} = useForm({
    defaultValues: { carModel: "",  yearManufacture: "", price: "",},
  });

  useEffect(() => {
    if (data) {
      const user = data?.data;
      reset({  price: "",  yearManufacture: "",    carModel: "", });
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

  async function onSubmit(data) {
    console.log(data);

    try {
      setLoad(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/guest/addads/step4/${AdsId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            carModel        : data.carModel,
            yearManufacture : data.yearManufacture,
            carPrice        : price,
            currency        : currencyCode,
          }),
        }
      );
      const resData = await response.json();
      console.log(resData);
      
      enqueueSnackbar(t("update_success"), {
        variant: "success",
        autoHideDuration: 1000,
      });
      navigate("/guest/ads/details/" + AdsId);
      
    } catch (err) {
      console.log(err);
    }
  }

  const { t } = useTranslation();

  return (
    <Navbar>
      <AdsStepper active={2} title={t("Description")}>
      </AdsStepper>
      <Container sx={{ marginTop: "20px", marginBottom: "60px" }}>
        <Grid container spacing={2}>
        <Grid item xs={12} lg={9}>
        <Paper sx={{padding:"40px 20px"}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box sx={{ width: { md: "500px", xs: "100%" } }}>
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
          <Autocomplete
  fullWidth
  name="currency"
  options={currencies}
  value={currencyValue}
  inputValue={currencyValue}
  onChange={(event, newInputValue) => {
    if (newInputValue) {
      setCurrencyValue(
        lang === "en" ? newInputValue?.titleEn : newInputValue?.titleAr
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
  renderOption={(props, item) => (
    <li {...props}>
      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center" }}>
        <div className="pl-1">
          <img
            src={`https://flagcdn.com/w320/${item.code}.png`}
            alt=""
            style={{ width: "20px" }}
          />
        </div>
        <div>{lang === "en" ? item.titleEn : item.titleAr}</div>
      </div>
    </li>
  )}
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

            <StepperButtonsGuest load={load} />
          </Box>
        </form>
      </Paper>
      </Grid>
        <Grid item xs={12} lg={3} sx={{ overflow: "hidden" }}>
        <Paper sx={{padding:"40px 20px" , margin:"auto" , marginTop:"0px"}}>
        
        <h3>هل تحتاج الي مساعدة ؟</h3>
        <p>تواصل معنا الان</p>

        <a target="_blank" href="mailto:info@muscatdrivingschool.com">
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: "8px",
              justifyContent: "center",
              color: "#323232",
              margin : "auto",
              marginBottom: "12px",
              padding:"10px",
              border:"1px solid #323232",
              borderRadius : "15px",
              maxWidth:"230px" }}
          >
            <EmailOutlinedIcon sx={{ fontSize: "15px" }} />
            <Typography sx={{ fontSize: "14px" }}>
              info@muscatdrivingschool.com
            </Typography>
          </Box>
        </a>
        <a target="_blank" href={whatsAppLink || "/"}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              columnGap: "8px",
              justifyContent: "center",
              color: "#323232",
              margin : "auto",
              marginBottom: "12px",
              padding:"10px",
              border:"1px solid #323232",
              borderRadius : "15px",
              maxWidth:"230px"
            }}
          >
            <ImageCall src={call} />
            <Typography sx={{ fontSize: "14px" }}>{t("call")}</Typography>
          </Box>
        </a>
        </Paper>
        </Grid>
        </Grid>
      </Container>
      
      
    </Navbar>
  );
}
