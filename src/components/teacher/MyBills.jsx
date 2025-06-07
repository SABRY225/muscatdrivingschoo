import React, { useEffect, useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableRow } from '@mui/material';
import Navbar from '../../components/Navbar';
import TeacherLayout from "./TeacherLayout";
function MyBillsTeacher() {
    const { t } = useTranslation();
    const [sessions, setSessions] = useState([]);
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
        { id: "type", label: t("Type"), minWidth: 150 },
        { id: "price", label: t("price"), minWidth: 150 },
        { id: "student", label: t("student"), minWidth: 150 },
        { id: "phone", label: t("phone"), minWidth: 150 },
        { id: "email", label: t("email"), minWidth: 150 },
        { id: "action", label: t("actions"), minWidth: 300 },
    ];

    const generatePDF = (session) => {
        const doc = new jsPDF();
        const categories = session.Teacher.TeacherSubjects.map(ts => ts.Subject.SubjectCategory);
        const uniqueCategories = Array.from(new Map(categories.map(cat => [cat.id, cat])).values());
        const teacherSubjects = uniqueCategories
            .map(ts => ts?.titleEN)
            .filter(Boolean)
            .join(", ");
        // تحميل اللوجو
        const logo = "/logo.png"; // استخدم مسار اللوجو في `public` أو رابط مباشر للصورة
        doc.addImage(logo, "PNG", 160, 7, 15, 15); // تحديد الموقع والحجم (X, Y, Width, Height)
    
        // إضافة اسم الموقع
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.setTextColor(52, 152, 219);
        doc.text("Moalime", 20, 20);
    
        doc.setFontSize(16);
        doc.setTextColor(255, 0, 0);
        doc.text("Session Billing Report", 75, 30);
    
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(13);
        
        let y = 50;
        
        // النص الذي يلتف (wrapping text) داخل العرض المحدد
        doc.text(`Your ${session.type} with your student ${session?.Student?.name} has been successfully booked.`, 14, y, {maxWidth: 180});
        y += 10;
        doc.text(`These are the specializations of the teacher who will give you the class`, 14, y, {maxWidth: 180});
        y += 10;
        doc.text(`( ${teacherSubjects} )`, 14, y, {maxWidth: 180});
        y += 20;
        doc.setFontSize(12);
        doc.text(`Invoice Number: ${session.id}`, 14, y);
        y += 10;
        doc.text(`Date: ${convertDate(session.date)}`, 14, y);
        if(session.type==="online")
            {
            y += 10;
            doc.text(`Session Number: ${session.period}`, 14, y);            
            }
        y += 10;
        doc.text(`Price: ${session.price} ${session.currency}`, 14, y);
        y += 10;
        doc.text(`Student: ${session.Student?.name|| "N/A"}`, 14, y);
        y += 10;
        doc.text(`Student Phone: ${session.Student?.phoneNumber || "N/A"}`, 14, y);
        y += 10;
        doc.text(`Student Email: ${session.Student?.email || "N/A"}`, 14, y);
        y += 170;
        doc.text(`Moalime platform, I wish you success always`, 60, y);
        
        doc.save(`Session Billing Report.pdf`);
    };
    const printPDF = (session) => {
        const doc = new jsPDF();
        const categories = session.Teacher.TeacherSubjects.map(ts => ts.Subject.SubjectCategory);
        const uniqueCategories = Array.from(new Map(categories.map(cat => [cat.id, cat])).values());
        const teacherSubjects = uniqueCategories
            .map(ts => ts?.titleEN)
            .filter(Boolean)
            .join(", ");
        // تحميل اللوجو
        const logo = "/logo.png"; // استخدم مسار اللوجو في `public` أو رابط مباشر للصورة
        doc.addImage(logo, "PNG", 160, 7, 15, 15); // تحديد الموقع والحجم (X, Y, Width, Height)
    
        // إضافة اسم الموقع
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.setTextColor(52, 152, 219);
        doc.text("Moalime", 20, 20);
    
        doc.setFontSize(16);
        doc.setTextColor(255, 0, 0);
        doc.text("Session Billing Report", 75, 30);
    
        doc.setFont("helvetica", "normal");
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(13);
        
        let y = 50;
        
        // النص الذي يلتف (wrapping text) داخل العرض المحدد
        doc.text(`Your ${session.type} with your student ${session?.Student?.name} has been successfully booked.`, 14, y, {maxWidth: 180});
        y += 10;
        doc.text(`These are the specializations of the teacher who will give you the class`, 14, y, {maxWidth: 180});
        y += 10;
        doc.text(`( ${teacherSubjects} )`, 14, y, {maxWidth: 180});
        y += 20;
        doc.setFontSize(12);
        doc.text(`Invoice Number: ${session.id}`, 14, y);
        y += 10;
        doc.text(`Date: ${convertDate(session.date)}`, 14, y);
        if(session.type==="online")
        {
        y += 10;
        doc.text(`Session Number: ${session.period}`, 14, y);            
        }
        y += 10;
        doc.text(`Price: ${session.price} ${session.currency}`, 14, y);
        y += 10;
        doc.text(`Student: ${session.Student?.name || "N/A"}`, 14, y);
        y += 10;
        doc.text(`Student Phone: ${session.Student?.phoneNumber || "N/A"}`, 14, y);
        y += 10;
        doc.text(`Student Email: ${session.Student?.email || "N/A"}`, 14, y);
        y += 170;
        doc.text(`Moalime platform, I wish you success always`, 60, y);
        

        doc.autoPrint();
        window.open(doc.output("bloburl"), "_blank");
    };
    
    return (
            <Navbar>
            <TeacherLayout>
<div className='mt-28 p-5'>
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
                                        <TableCell align="center">{row.id}</TableCell>
                                        <TableCell align="center">{convertDate(row.date)}</TableCell>
                                        <TableCell align="center">{t(row.type)}</TableCell>
                                        <TableCell align="center">{row.price} {" "}{t(row.currency)}</TableCell>
                                        <TableCell align="center">{row.Student?.name || "N/A"}</TableCell>
                                        <TableCell align="center">{row.Student?.phoneNumber}</TableCell>
                                        <TableCell align="center">{row.Student?.email}</TableCell>
                                        <TableCell align="center">
                                            <div className="flex space-x-2 justify-between">
                                                <Button
                                                    onClick={() => generatePDF(row)}
                                                    className="bg-blue-500 text-white p-2 rounded m-3"
                                                    variant="contained"
                                                >
                                                    {t("Save as PDF")}
                                                </Button>
                                                <Button
                                                    onClick={() => printPDF(row) }
                                                    className="bg-green-500 text-white w-28 py-2 rounded"
                                                    variant="outlined"
                                                >
                                                    {t("Print")}
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
            </div>
            </TeacherLayout>
            </Navbar>
    )
}

export default MyBillsTeacher
