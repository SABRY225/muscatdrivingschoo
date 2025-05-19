import { DialogContent,DialogActions,InputLabel,Button, Box,TextField,Typography , FormControl , Select , MenuItem, styled , Autocomplete} from '@mui/material'
import React , { useState , useEffect } from 'react'
import { useForm,Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useSnackbar } from 'notistack'
import Cookies from 'js-cookie';

const Image = styled("img")({
    width: "300px",
});

export default function Update({handleClose,discount,setDiscounts}) {
    const {t} = useTranslation()
    const {closeSnackbar,enqueueSnackbar} = useSnackbar();
    const lang = Cookies.get("i18next") || "en";
    const { teacher,token }         = useSelector((state)=>state.teacher);
    const [ value, setValue]                    = useState(null);
    const [image,           setImage]           = useState(null);
    const [percentage, setPercentage] = useState(0);
    const [amountBeforeDiscount, setAmountBeforeDiscount] = useState(0);
    const [amountAfterDiscount,  setAmountAfterDiscount] = useState(0);

    
    const { register,control, formState: { errors }, handleSubmit } = useForm({
        defaultValues: {
            titleAR:discount?.titleAR,
            titleEN:discount?.titleEN,
            descriptionAR : discount?.descriptionAR,
            descriptionEN : discount?.descriptionEN,
            discountType : discount?.discountType,
            conditionsAR : discount?.conditionsAR,
            conditionsEN : discount?.conditionsEN,
            startDate : discount?.startDate,
            endDate : discount?.endDate,
            percentage : discount?.percentage,
            amountBeforeDiscount : discount?.amountBeforeDiscount,
            amountAfterDiscount : discount?.amountAfterDiscount,
        }
    });

    const handlePercentage = (e) => {
      closeSnackbar();
      if (e.target.value < 0 || e.target.value > 100) {
        enqueueSnackbar(t("package_price_error"), {
          variant: "error",
          autoHideDuration: "5000",
        });
      } else {
        setPercentage(e.target.value);

        var num           = parseInt(amountBeforeDiscount);
        var percentageVal = parseInt(e.target.value);
        console.log(num);
        console.log(percentageVal);

        var total = num - ( (percentageVal/100) * num );
        console.log(total);

        setAmountAfterDiscount(total);

      }
    };
    const handleAmountBeforeDiscount = (e) => {
      closeSnackbar();
      if (e.target.value < 0 || e.target.value > 100000000) {
        enqueueSnackbar(t("package_price_error"), {
          variant: "error",
          autoHideDuration: "5000",
        });
      } else {
        setAmountBeforeDiscount(e.target.value);
        var num           = parseInt(e.target.value);
        var percentageVal = parseInt(percentage);
        var total = num - ( (percentageVal/100) * num );
        console.log(total);

        setAmountAfterDiscount(total);

      }
    };
    const handleAmountAfterDiscount = (e) => {
      closeSnackbar();
      if (e.target.value < 0 || e.target.value > 100000000) {
        enqueueSnackbar(t("package_price_error"), {
          variant: "error",
          autoHideDuration: "5000",
        });
      } else {
        setAmountAfterDiscount(e.target.value);
      }
    };

    async function onSubmit(data)
    {
        const formData = new FormData();
        formData.append("image", image);
        formData.append("TeacherId",        teacher?.id);
        formData.append("titleAR",        data.titleAR);
        formData.append("titleEN",        data.titleEN);
        formData.append("discountType",        data.discountType);
        
        formData.append("descriptionAR",  data.descriptionAR);
        formData.append("descriptionEN",  data.descriptionEN);
        formData.append("conditionsAR",   data.conditionsAR);
        formData.append("conditionsEN",   data.conditionsEN);
        formData.append("startDate",      data.startDate);
        formData.append("endDate",        data.endDate);
        formData.append("percentage",     percentage);
        formData.append("amountBeforeDiscount",    amountBeforeDiscount);
        formData.append("amountAfterDiscount",     amountAfterDiscount);

        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/discount/${discount.id}`,{
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

            setDiscounts(back=>back.map(item=>
                {
                    return item.id===discount.id?{...item,
                      titleAR:data.titleAR,
                      titleEN:data.titleEN,
                      descriptionEN:data.descriptionEN,
                      descriptionAR:data.descriptionAR,
                      conditionsAR:data.conditionsAR,
                      conditionsEN:data.conditionsEN,
                      startDate:data.startDate,
                      endDate:data.endDate,
                      percentage:data.percentage,
                      amountBeforeDiscount:data.amountBeforeDiscount,
                      amountAfterDiscount:data.amountAfterDiscount,
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
        name="titleAR"
        control={control}
        render={({ field }) => <TextField {...field} fullWidth/>}
        {...register("titleAR", { required: "title Address is required" })}
      />
      {errors.titleAR?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
    </Box>
    <Box sx={{marginBottom:"18px"}}>
      <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('titleEn')}</InputLabel>
      <Controller
          name="titleEN"   control={control}
          render={({ field }) => <TextField {...field} fullWidth/>}
          {...register("titleEN", { required: "title Address is required" })}
      />
      {errors.titleEN?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
    </Box>
    <Box sx={{ marginBottom: "26px" }}>
    <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}> {t("discountType")}</InputLabel>
                <Controller
                  name="discountType" control={control}
                  {...register("discountType", { required: "Discount Type is required" })}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <Select
                        {...field}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                      >
                        <MenuItem value={"monthy"}>{t("discount_monthy")}</MenuItem>
                        <MenuItem value={"card"}>{t("discount_card")}</MenuItem>
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
                    this field is required
                  </Typography>
                )}
    </Box>

    <Box sx={{marginBottom:"18px"}}>
          <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('discount_percentage')}</InputLabel>
          <TextField fullWidth name="percentage"  type="number" min="0"  max="100" required
              sx={{ marginBottom: 3 }}  onChange={handlePercentage}  value={percentage}
          />
          {errors.percentage?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
    </Box>

    <Box sx={{marginBottom:"18px"}}>
          <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('discount_amountBeforeDiscount')}</InputLabel>
          <TextField fullWidth name="amountBeforeDiscount"  type="number" min="0"  max="100" required
              sx={{ marginBottom: 3 }}  onChange={handleAmountBeforeDiscount}  value={amountBeforeDiscount}
          />
          {errors.amountBeforeDiscount?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
    </Box>

    <Box sx={{marginBottom:"18px"}}>
          <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('discount_amountAfterDiscount')}</InputLabel>
          <TextField fullWidth name="amountAfterDiscount"  type="number" min="0"  max="100" required
              sx={{ marginBottom: 3 }}  onChange={handleAmountAfterDiscount}  value={amountAfterDiscount}
          />
          {errors.amountAfterDiscount?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
    </Box>
    <Box sx={{ marginBottom: "30px", width: "100%" }}>
        <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}> {t("discount_startDate")}</InputLabel>
        <Controller name="startDate" control={control}
          render={({ field }) => (
            <TextField type="date" {...field} fullWidth />
          )}
          {...register("startDate", {
                      required: "Start Date is required",
          })}
        />
        {errors.startDate?.type === "required" && (
        <Typography color="error" role="alert"  sx={{ fontSize: "13px", marginTop: "6px" }}>{t("required")}</Typography>
        )}
      </Box>
      <Box sx={{ marginBottom: "30px", width: "100%" }}>
        <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}> {t("discount_endDate")}</InputLabel>
        <Controller name="endDate" control={control}
                    render={({ field }) => (
                      <TextField type="date" {...field} fullWidth />
                    )}
                    {...register("endDate", {
                      required: "End Date Address is required",
                    })}
        />
        {errors.endDate?.type === "required" && (
        <Typography color="error" role="alert"  sx={{ fontSize: "13px", marginTop: "6px" }}>{t("required")}</Typography>
        )}
      </Box>
      <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("career_descriptionAr")}
              </InputLabel>
              <Controller
                name="descriptionAR"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("descriptionAR", {
                  required: "descriptionAR Address is required",
                })}
              />
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
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("career_descriptionEn")}
              </InputLabel>
              <Controller
                name="descriptionEN"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("descriptionEN", {
                  required: "descriptionEN Address is required",
                })}
              />
              {errors.descriptionEN?.type === "required" && (
                <Typography color="error" role="alert"  sx={{ fontSize: "13px", marginTop: "6px" }}>
                  {t("required")}
                </Typography>
              )}
      </Box>
      <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("discount_termsAR")}
              </InputLabel>
              <Controller
                name="conditionsAR"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("conditionsAR", {
                  required: "conditionsAR Address is required",
                })}
              />
              {errors.conditionsAR?.type === "required" && (
                <Typography color="error" role="alert"  sx={{ fontSize: "13px", marginTop: "6px" }}>
                  {t("required")}
                </Typography>
              )}
        </Box>
        <Box sx={{ marginBottom: "26px" }}>
              <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
                {t("discount_termsEN")}
              </InputLabel>
              <Controller
                name="conditionsEN"
                control={control}
                render={({ field }) => (
                  <TextField {...field} fullWidth multiline rows={3} />
                )}
                {...register("conditionsEN", {
                  required: "conditionsEN Address is required",
                })}
              />
              {errors.conditionsEN?.type === "required" && (
                <Typography color="error" role="alert"  sx={{ fontSize: "13px", marginTop: "6px" }}>
                  {t("required")}
                </Typography>
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
