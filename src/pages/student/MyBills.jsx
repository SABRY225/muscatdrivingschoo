import StudentLayout from '../../components/student/StudentLayout'
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import axios from 'axios';
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useStudentHistory } from '../../hooks/useStudentHistory';
function MyBills() {
    const lang = Cookies.get("i18next") || "en";
    const { t } = useTranslation();
    const [sessions, setSessions] = useState([]);
    const { student } = useSelector((state) => state.student);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBilling = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_KEY}api/v1/student/get-bills-student/${student.id}`
                );

                console.log("Response Data:", response.data); // ✅ البيانات موجودة هنا
                setSessions(response.data.data);
            } catch (error) {
                console.error("Error fetching bills:", error);
            }
        };

        fetchBilling(); // ✅ استدعاء الدالة هنا

    }, [student]);


    const columns = [
        { id: "Invoice number", label: t("Invoice number"), minWidth: 150 },
        { id: "date", label: t("date"), minWidth: 150 },
        { id: "price", label: t("price"), minWidth: 150 },
        { id: "teacher", label: t("teacher"), minWidth: 150 },
        { id: "phone", label: t("phone"), minWidth: 150 },
        { id: "email", label: t("email"), minWidth: 150 },
        { id: "action", label: t("actions"), minWidth: 150 },
    ];

    // Wallet table columns
    const walletColumns = [
        { id: "date", label: t("date"), minWidth: 120 },
        { id: "currency", label: t("currency"), minWidth: 100 },
        { id: "amount", label: t("amount"), minWidth: 100 },
        { id: "type", label: t("type Operation"), minWidth: 120 },
        { id: "status", label: t("status"), minWidth: 100 },
        { id: "action", label: t("actions"), minWidth: 150 },
    ];

    // Get wallet records
    const token = Cookies.get('token');
    const { data: walletData, isLoading: walletLoading } = useStudentHistory(student.id);

    const printPDF = (session) => {
        
       navigate(`/invoicePDF/${session.Type}/${session.id}/${session.createdAt}/${student.name}/${session.Teacher?.firstName}/${session.Teacher?.lastName}/${session.Teacher?.email}/${session.Teacher?.phone}/${session.price}/${session.currency}`)
    };
    
    const printPDFbalanced = (session) => {
        
       navigate(`/invoice-balance/${session.typeEn}/${session.createdAt}/${session.isPaid}/${session.price}/${session.currency}`)
    };

    return (
        <StudentLayout>
            <Paper sx={{ mb: 4, p: 2 }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '12px', color: '#1976d2' }}>{t('Pay Lesson')}</div>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={"center"}
                                    style={{ top: 57, minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableBody>
                            {sessions?.map((row) => {
                                return (
                                    <TableRow hover role="checkbox" key={row.id + "demj"}>
                                        <TableCell align="center">INV-{row.id}</TableCell>
                                        <TableCell align="center">{new Date(row.createdAt).toLocaleDateString("ar-EG")}</TableCell>
                                        <TableCell align="center">{row.price} {" "}{t(row.currency)}</TableCell>
                                        <TableCell align="center">{row.Teacher?.firstName || "N/A"} {row.Teacher?.lastName || "N/A"}</TableCell>
                                        <TableCell align="center">{row.Teacher?.phone|| "N/A"}</TableCell>
                                        <TableCell align="center">{row.Teacher?.email|| "N/A"}</TableCell>
                                        <TableCell align="center">
                                            <div className="flex space-x-2 justify-between">
                                                <Button
                                                    onClick={() => printPDF(row)}
                                                    className="bg-green-500 text-white w-28 py-2 rounded"
                                                    variant="outlined"
                                                >
                                                    {t("open")}
                                                </Button>
                                            </div>
                                        </TableCell>


                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
            <Paper sx={{ p: 2 }}>
                <div style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '12px', color: '#43a047' }}>{t('Add Balance')}</div>
                <TableContainer sx={{ maxHeight: 440, mt: 2 }}>
                    <Table stickyHeader aria-label="wallet table">
                        <TableRow>
                            {walletColumns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={"center"}
                                    style={{ top: 57, minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableBody>
                            {walletLoading ? (
                                <TableRow>
                                    <TableCell colSpan={walletColumns.length} align="center">
                                        {t("Loading...")}
                                    </TableCell>
                                </TableRow>
                            ) : (
                                walletData?.data?.map((row) => (
                                    <TableRow hover role="checkbox" key={row.id + "wallet"}>
                                        <TableCell align="center">{new Date(row.createdAt).toLocaleDateString("ar-EG")}</TableCell>
                                        <TableCell align="center">{row.currency}</TableCell>
                                        <TableCell align="center">{row.price}</TableCell>
                                        <TableCell align="center">
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '6px 18px',
                                                    borderRadius: '16px',
                                                    color: '#fff',
                                                    fontWeight: 'bold',
                                                    background: '#1976d2',
                                                }}
                                            >
                                                {lang === "ar" ? row.typeAr : row.typeEn}
                                            </span>
                                        </TableCell>
                                        <TableCell align="center">
                                            <span
                                                style={{
                                                    display: 'inline-block',
                                                    padding: '6px 18px',
                                                    borderRadius: '16px',
                                                    color: '#fff',
                                                    fontWeight: 'bold',
                                                    background: row.isPaid ? '#43a047' : '#e53935',
                                                }}
                                            >
                                                {row.isPaid
                                                    ? t("Successful Payment")
                                                    : t("Failed Payment")}
                                            </span>
                                        </TableCell>
                                        <TableCell align="center">
                                            <div className="flex space-x-2 justify-between">
                                                <Button
                                                    onClick={() => printPDFbalanced(row)}
                                                    className="bg-green-500 text-white w-28 py-2 rounded"
                                                    variant="outlined"
                                                >
                                                    {t("open")}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                </Paper>
                
        </StudentLayout>
    )
}

export default MyBills
