import StudentLayout from '../../components/student/StudentLayout'
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import axios from 'axios';
import Cookies from "js-cookie";
import { useTranslation } from 'react-i18next';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import { useNavigate } from 'react-router-dom';
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

    const printPDF = (session) => {
        
       navigate(`/invoicePDF/${session.Type}/${session.id}/${session.createdAt}/${student.name}/${session.Teacher?.firstName}/${session.Teacher?.lastName}/${session.Teacher?.email}/${session.Teacher?.phone}/${session.price}/${session.currency}`)
    };
    

    return (
        <StudentLayout>
            <div >
                <h2 className="text-xl font-bold mb-4">{t("Billing Report")}</h2>
            </div>
            <Paper sx={{ width: "100%", padding: "20px" }}>
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
                                        <TableCell align="center">{new Date(row.createdAt).toDateString()}</TableCell>
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
        </StudentLayout>
    )
}

export default MyBills
