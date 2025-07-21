import { Box, Paper, Typography,Button } from '@mui/material'
import React from 'react'
import StudentLayout from '../../components/student/StudentLayout'
import { useTranslation } from 'react-i18next';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import { useNavigate } from 'react-router-dom';
import { useStudentCredit } from '../../hooks/useStudentCredit';
import { useSelector } from 'react-redux';
import { convertCurrency } from '../../utils/convertCurrency';

export default function StudentCredit() {
    const {t} = useTranslation()
    const navigate = useNavigate()

    const {student} = useSelector((state)=>state.student)
    const {currency} = useSelector((state)=>state.currency)
    const {data,isLoading} = useStudentCredit(student.id)
    const [convertedAmount, setConvertedAmount] = React.useState(null);
  
React.useEffect(() => {
    const fetchCurrency = async () => {
        if (data?.data?.wallet != null) {
            const result = await convertCurrency(data.data.wallet, "OMR", currency);
            setConvertedAmount(result);
        }
    };
    fetchCurrency();
}, [currency, data]); // 👈 أضف `data` هنا

 console.log(convertedAmount);

    return (
        <StudentLayout>
            <Paper sx={{padding:"20px"}}>
                <Typography sx={{fontSize:"24px",marginTop:"12px",fontWeight:"600",marginBottom:"30px"}}>{t('credit')}</Typography>
                <Box sx={{backgroundColor:"#0cbc87",borderRadius:"16px",padding:"20px",width:"300px",
                display:"flex",columnGap:"12px",color:"white"}}>
                    <MonetizationOnOutlinedIcon/>
                    <Box>
                        <Typography sx={{fontSize:"14px"}}>{t('credit')}</Typography>
                        <Typography sx={{fontWeight:"700",fontSize:"18px",mt:2}}>
  {convertedAmount !== null ? `${convertedAmount} ${t(currency)}` : t("loading")}
</Typography>
                    </Box>
                </Box>
                <Box sx={{marginTop:"40px"}}>
                    <Button variant='contained' onClick={()=>navigate('/pay-now')}>{t('charge')}</Button>
                </Box>
            </Paper>
        </StudentLayout>
    )
}
