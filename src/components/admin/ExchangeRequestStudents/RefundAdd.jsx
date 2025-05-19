import { Box, Button, InputLabel, TextField, Typography , Autocomplete , Paper} from '@mui/material';
import React , { useState, useEffect }         from 'react';
import { useForm,Controller }       from 'react-hook-form';
import { useTranslation }           from 'react-i18next';
import { useSnackbar }              from 'notistack'
import { useSelector }              from 'react-redux';
import Cookies                      from 'js-cookie';
import { useExchangeRequestsStudent } from "../../../hooks/useExchangeRequestsStudent";
import AdminLayout                  from "../AdminLayout";
import { useNavigate, useParams }   from "react-router-dom";
import Loading from '../../Loading';

export default function RefundAdd() {
    const {t}                             = useTranslation();
    const { exchangeRequestStudentId }    = useParams();
    const {closeSnackbar,enqueueSnackbar} = useSnackbar();
    const {admin ,   token}               = useSelector((state)=>state.admin);
    const [amount,   setAmount]           = useState(0);
    const [Student,  setStudent]          = useState([]);
    const [currency,  setCurrency]          = useState("");
    const { data , isLoading}     = useExchangeRequestsStudent(exchangeRequestStudentId);


    useEffect(() => {
      if (data?.data) {
        setStudent(data?.data.Student);
        setCurrency(data?.data.currency);
        setAmount(data?.data.amount);
      }
    }, [data]);
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
          amount:"",  reasonAR:"",  reasonEN:""
        }
    });
    
    async function onSubmit(data)
    {
        const formData = new FormData();
        formData.append("amount",       amount);
        formData.append("reasonAR",     data.reasonAR);
        formData.append("reasonEN",     data.reasonEN);
        formData.append("currency",     currency)
        formData.append("StudentId",    Student?.id);
        formData.append("wallet",       Student?.wallet);
        formData.append("AdminId" ,     admin?.id );
        formData.append("exchangeRequestStudentId" , exchangeRequestStudentId);
        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/admin/createRefundStudent`,{
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
<AdminLayout>
<Box sx={{width:"100%",maxWidth:"100%"}}>
<Paper sx={{ width: "100%", padding: "20px" , marginTop:"20px"}}>
    <form onSubmit={handleSubmit(onSubmit)}>

    {!isLoading ? (
    <Box sx={{ marginBottom: "26px" }}>
      <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}> {t("student_name")}</InputLabel>
      <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}> { Student?.name } - { Student?.email }</InputLabel>
    </Box>
    ) :( <Loading /> )
    }

    <Box sx={{marginBottom:"18px"}}>
      <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('refund_amount')}</InputLabel>
      <TextField
        fullWidth name="amount"   type="number" min="0"   max="10000000000000" required
        sx={{ marginBottom: 3 }}  onChange={handleAmount} value={amount}
      />
      {errors.amount?.type === 'required' && <Typography color="error" role="alert" sx={{fontSize:"13px",marginTop:"6px"}}>{t('required')}</Typography>}
    </Box>

    <Box sx={{ marginBottom: "26px" }}>
      <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
        {t("refund_reasonAR")}
      </InputLabel>
      <Controller
        name="reasonAR" control={control}
        render={({ field }) => (
          <TextField {...field} fullWidth multiline rows={3} />
        )}
        {...register("reasonAR", { required: "reasonAR Address is required",})}
      />
      {errors.reasonAR?.type === "required" && (
        <Typography color="error" role="alert" sx={{ fontSize: "13px", marginTop: "6px" }}>
          {t("required")}
        </Typography>
      )}
    </Box>

    <Box sx={{ marginBottom: "26px" }}>
      <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
        {t("refund_reasonEN")}
      </InputLabel>
      <Controller
        name="reasonEN" control={control}
        render={({ field }) => (
          <TextField {...field} fullWidth multiline rows={3} />
        )}
        {...register("reasonEN", { required: "reasonEN Address is required",})}
      />
      {errors.reasonEN?.type === "required" && (
        <Typography color="error" role="alert" sx={{ fontSize: "13px", marginTop: "6px" }}>
          {t("required")}
        </Typography>
      )}
    </Box>

            
    <Button variant="contained" type="submit" sx={{ml:"6px",mr:"6px"}}>{t('save')}</Button>
    </form>
    </Paper>
    </Box>
    </AdminLayout>
</>
    )
}