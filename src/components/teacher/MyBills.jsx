import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import TeacherLayout from "./TeacherLayout";
import { useNavigate } from "react-router-dom";
function MyBillsTeacher() {
    const { t } = useTranslation();
    const [sessions, setSessions] = useState([]);
    const navigate = useNavigate();

    const { teacher } = useSelector((state) => state.teacher);
    useEffect(() => {
        const fetchBilling = async () => {
            try {
                const response = await axios.get(
                    `${process.env.REACT_APP_API_KEY}api/v1/teacher/get-bills-teacher/${teacher.id}`
                );

                console.log("Response Data:", response.data); // ✅ البيانات موجودة هنا
                setSessions(response.data.data);
            } catch (error) {
                console.error("Error fetching bills:", error);
            }
        };

        fetchBilling(); // ✅ استدعاء الدالة هنا

    }, [teacher]);

    function convertDate(dateString) {
        const date = new Date(dateString);
        return date.toISOString().split('T')[0]; // yyyy-mm-dd
    }

    const columns = [
        { id: "Invoice number", label: t("Invoice number"), minWidth: 150 },
        { id: "date", label: t("date"), minWidth: 150 },
        { id: "type", label: t("type service"), minWidth: 150 },
        { id: "price", label: t("price"), minWidth: 150 },
        { id: "student", label: t("student"), minWidth: 150 },
        { id: "phone", label: t("phone"), minWidth: 150 },
        { id: "email", label: t("email"), minWidth: 150 },
        { id: "action", label: t("actions"), minWidth: 150 },
    ];

    const printPDF = (session) => {
        navigate(`/invoice-teacher/${session.id}/${session.date}/${session.Student?.name}/${teacher?.firstName}/${teacher?.lastName}/${session.Student?.email}/${session.Student?.phoneNumber}/${session.price}/${session.currency}/${session.type}`)
    };

    return (
        <TeacherLayout>
                <Paper sx={{  padding: "20px", margin: 1 }}>
                     <div  >
                    <h2 className="text-xl font-bold mb-4">{t("Billing Report")}</h2>
                    </div>
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
                                            <TableCell align="center">{row.id}</TableCell>
                                            <TableCell align="center">{convertDate(row.date)}</TableCell>
                                            <TableCell align="center">{t(row.type=="student"?"Lesson":row.type)}</TableCell>
                                            <TableCell align="center">{row.price} {" "}{t(row.currency)}</TableCell>
                                            <TableCell align="center">{row.Student?.name || "N/A"}</TableCell>
                                            <TableCell align="center">{row.Student?.phoneNumber}</TableCell>
                                            <TableCell align="center">{row.Student?.email}</TableCell>
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
        </TeacherLayout>
    )
}

export default MyBillsTeacher
