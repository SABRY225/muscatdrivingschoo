import Cookies from "js-cookie";
import React , { useState } from "react";
import { useForm , Controller}    from 'react-hook-form';
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useSnackbar }            from 'notistack';
import { useTeacherRefund } from "../../hooks/useTeacherRefund";
import TeacherLayout from "../../components/teacher/TeacherLayout";
import {Box,Paper,Table, TableBody,TableCell,  TableHead, TableRow , Button, Tab, InputLabel, TextField, Typography , Autocomplete} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import moment from "moment";
import Loading from "../../components/Loading";
import currencies     from "../../data/currencies";

function TeacherRefund() {
  const lang = Cookies.get("i18next") || "en";
  const { t } = useTranslation();
  const {closeSnackbar,enqueueSnackbar} = useSnackbar();
  const [ value, setValue  ] = React.useState("1");
  const { teacher, token }  = useSelector((state) => state.teacher);
  const [amount,  setAmount] = useState(0);
  const [currencyValue,    setCurrencyValue]      = useState("");
  const [currencyCode,     setCurrencyCode]       = useState("");
  const [countryError,     setCurrencyError]      = useState(false);
  const [reason, setReason] = useState('');
  const { data, isLoading } = useTeacherRefund(teacher.id, token);
 const handleChange = (event, newValue) => {
     setValue(newValue);
   };
   const { register,control, formState: { errors }, handleSubmit } = useForm({
         defaultValues: {
             title_ar:"",
             title_en:""
         }
   });
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
 
 async function SaveData(data)
     {
         const formData = new FormData();
         formData.append("amount",       amount);
         formData.append("reason",       reason);
         formData.append("TeacherId",    teacher?.id);
         formData.append("currency",     currencyCode);
         formData.append("status",       "1");
         formData.append("AdminId" ,     "0");
         try{
             const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/teacher/exchangerequestteachers`,{
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
    <TeacherLayout>
      <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <TabList onChange={handleChange} aria-label="lab API tabs example">
              <Tab label={t("refund_view")} value="1" />
              <Tab label={t("refund_add")}  value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
      {!isLoading ? (
        <Paper sx={{ padding: "20px", marginBottom: "40px" }}>
          <Typography sx={{fontSize: "24px",marginTop: "12px",fontWeight: "600",marginBottom: "30px",}}>
            {t("refunds")}
          </Typography>
          <Box sx={{ overflow: "auto" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("reasons")}
                  </TableCell>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("amount")}
                  </TableCell>
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("currency")}
                  </TableCell>
                  
                  <TableCell
                    align={lang === "en" ? "right" : "left"}
                    sx={{ color: "#005B8E" }}
                  >
                    {t("history")}
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data?.data.length > 0 ?
                  data?.data.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {row.reasonEN + " " + row.reasonAR}
                      </TableCell>
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {row.amount}
                      </TableCell>
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {row.currency}
                      </TableCell>
                      <TableCell align={lang === "en" ? "right" : "left"}>
                        {moment(row.createdAt).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                    :<TableRow>
                      <TableCell colSpan={4}>
                        <p className="notfound">{t("student_refunds_notfound")}</p>
                      </TableCell>
                    </TableRow>
                  }
              </TableBody>
            </Table>
          </Box>
        </Paper>
      ) : (
        <Loading />
      )}
     </TabPanel>
     <TabPanel value="2">
    <Paper sx={{ padding: "20px", marginBottom: "40px" }}>
    <Box sx={{marginBottom:"18px"}}>
          <InputLabel sx={{marginBottom:"6px",fontSize:"14px"}}>{t('price')}</InputLabel>
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

    <Box sx={{ marginBottom: "26px" }}>
      <InputLabel sx={{ marginBottom: "6px", fontSize: "13px" }}>
        {t("refund_reason")}
      </InputLabel>
      <textarea value={reason} className="reason" onChange={(e) => setReason(e.target.value)} style={{width:"100%", height: "130px !important;"}}></textarea>
    </Box>
    <Button variant="contained" type="submit" onClick={SaveData} sx={{ml:"6px",mr:"6px"}}>{t('save')}</Button>
    </Paper>
          </TabPanel>
        </TabContext>
    </TeacherLayout>
  );
}

export default TeacherRefund;
