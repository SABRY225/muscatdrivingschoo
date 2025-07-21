import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useCreditTeacher } from "../../hooks/useCreditTeacher";
import { useSelector } from "react-redux";
import { useTeacherHistroy } from "../../hooks/useTeacherHistroy";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import Loading from "../../components/Loading";

export default function TeacherCredit() {
  const { t } = useTranslation();
  const { teacher, token } = useSelector((state) => state.teacher);
  const { data, isLoading } = useCreditTeacher(teacher?.id, token);
  const finicails = useTeacherHistroy(teacher?.id, token);
  const { enqueueSnackbar } = useSnackbar();
  const lang = Cookies.get("i18next") || "en";
  const { currency } = useSelector((state) => state.currency);
  const { conversionRate } = useSelector((state) => state.conversionRate);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [iban, setIban] = useState("");

  // Dialog state
  const [openDialog, setOpenDialog] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
const isFormValid = () => {
  if (!withdrawAmount || !paymentMethod) return false;

  if (paymentMethod === "phone") {
    return !!phoneNumber; // لازم يكون فيه رقم
  }

  if (paymentMethod === "bank") {
    return !!bankName && !!accountNumber && !!iban;
  }

  return false;
};

  const handleSubmitRequest = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/request-checkout/${teacher.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
          body: JSON.stringify({
            amount: withdrawAmount,
            method: paymentMethod,
            phoneNumber: paymentMethod === "phone" ? phoneNumber : undefined,
            bankInfo: paymentMethod === "bank"
              ? { bankName, accountNumber, iban }
              : undefined,
          })
        }
      );
      const responseData = await response.json();
      if (response.ok) {
        enqueueSnackbar(
          lang === "en" ? responseData.msg.english : responseData.msg.arabic,
          { variant: "success", autoHideDuration: 5000 }
        );
        setOpenDialog(false);
        window.location.reload();
      } else {
        enqueueSnackbar(
          lang === "en" ? responseData.english : responseData.arabic,
          { variant: "error", autoHideDuration: 5000 }
        );
      }
    } catch (error) {
      console.error("error: ", error);
      enqueueSnackbar(error.message, {
        variant: "error",
        autoHideDuration: 1000,
      });
    }
  };

  return (
    <Navbar>
      <Container sx={{ marginY: "120px" }}>
        {/* زر طلب السحب */}
        <Button
          sx={{
            textTransform: "capitalize",
            marginBottom: "20px",
            fontSize: "18px",
            fontWeight: "600",
          }}
          variant="contained"
          color="success"
          onClick={() => setOpenDialog(true)}
          disabled={
            isLoading ||
            !conversionRate ||
            (data?.data?.totalAmount - data?.data?.dues) * conversionRate < 1
          }
        >
          {t("requestPayment")}
        </Button>

        {/* فورم الطلب */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
          <DialogTitle>{t("requestPayment")}</DialogTitle>
          <DialogContent>
            {/* حقل المبلغ */}
            <TextField
              fullWidth
              label={t("amount")}
              type="number"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              sx={{ mt: 2 }}
            />

            {/* اختيار طريقة الدفع */}
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>{t("paymentMethod")}</InputLabel>
              <Select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                label={t("paymentMethod")}
              >
                <MenuItem value="phone">{t("Phone Number")}</MenuItem>
                <MenuItem value="bank">{t("Bank Account")}</MenuItem>
              </Select>
            </FormControl>

            {/* إدخال رقم الهاتف */}
            {paymentMethod === "phone" && (
              <TextField
                fullWidth
                label={t("phoneNumber")}
                type="text"
                sx={{ mt: 2 }}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            )}

            {/* إدخال بيانات الحساب البنكي */}
            {paymentMethod === "bank" && (
              <>
                <TextField
                  fullWidth
                  label={t("bankName")}
                  type="text"
                  sx={{ mt: 2 }}
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                />
                <TextField
                  fullWidth
                  label={t("accountNumber")}
                  type="text"
                  sx={{ mt: 2 }}
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                />
                <TextField
                  fullWidth
                  label={t("iban")}
                  type="text"
                  sx={{ mt: 2 }}
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                />
              </>
            )}
          </DialogContent>


          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>{t("cancel")}</Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitRequest}
              disabled={!isFormValid()}
            >
              {t("submit")}
            </Button>
          </DialogActions>
        </Dialog>

        {/* الرصيد */}
        {!isLoading && conversionRate ? (
          <Paper sx={{ padding: "40px 20px" }}>
            <Grid container rowGap={2} spacing={2} justifyContent="center" alignItems="center">
              <Grid item xs={12} md={4}>
                <Typography sx={{ fontSize: "18px", textAlign: "center" }}>
                  {t("totalbalance")}
                </Typography>
                <Typography sx={{ fontSize: "24px", textAlign: "center" }}>
                  {(data.data.totalAmount * conversionRate).toFixed(2)} {t(currency)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ fontSize: "18px", textAlign: "center" }}>
                  {t("availablebalance")}
                </Typography>
                <Typography sx={{ fontSize: "24px", textAlign: "center" }}>
                  {((data.data.totalAmount - data.data.dues) * conversionRate).toFixed(2)} {t(currency)}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography sx={{ fontSize: "18px", textAlign: "center" }}>
                  {t("withdrawnbalance")}
                </Typography>
                <Typography sx={{ fontSize: "24px", textAlign: "center" }}>
                  {(data.data.dues * conversionRate).toFixed(2)} {t(currency)}
                </Typography>
              </Grid>
            </Grid>
          </Paper>
        ) : (
          <Loading />
        )}

        {/* التاريخ */}
        {!finicails.isLoading && (
          <TableContainer component={Paper} sx={{ marginTop: "30px" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell align="right">{t("amount")}</TableCell>
                  <TableCell align="right">{t("status")}</TableCell>
                  <TableCell align="right">{t("history")}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {finicails.data?.data.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell align="right">{row.amount}</TableCell>
                    <TableCell align="right">{t(row.type)}</TableCell>
                    <TableCell align="right">{row.createdAt.split("T")[0]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Container>
    </Navbar>
  );
}
