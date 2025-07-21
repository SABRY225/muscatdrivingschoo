


import React from "react";
import TeacherLayout from "./TeacherLayout";
import { useTranslation } from "react-i18next";
import useStudentSubscriptions from "../../hooks/useStudentSubscriptions";
import { useSelector } from "react-redux";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from "@mui/material";

// Example: get studentId from props, context, or selection

const TableSection = ({ title, columns, data }) => {
  const { t } = useTranslation();
  return (
    <div style={{ marginBottom: 32 }}>
      <Typography variant="h6" fontWeight={600} mb={2}>{t(title)}</Typography>
      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label={t(title)}>
          <TableHead>
            <TableRow>
              {columns.map((col) => (
                <TableCell key={col.key} sx={{ fontWeight: 700, bgcolor: '#f5f5f5' }}>{t(col.label)}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((row, idx) => (
              <TableRow key={idx}>
                {columns.map((col) => (
                  <TableCell key={col.key}>{row[col.key]}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

const RequesStudents = () => {
  const { t, i18n } = useTranslation();
      const { teacher } = useSelector((state) => state.teacher);
  
  const { data, isLoading } = useStudentSubscriptions(teacher.id);

  // تجهيز بيانات الجداول من البيانات القادمة من الـ API
  if (isLoading) {
    return (
      <TeacherLayout>
        <div className="p-4 bg-white rounded shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">{t("Reserved by Students")}</h2>
          <div className="my-8 text-lg text-gray-600">جاري تحميل البيانات...</div>
        </div>
      </TeacherLayout>
    );
  }

  if (!data || data.length === 0) {
    return (
      <TeacherLayout>
        <div className="p-4 bg-white rounded shadow-md text-center">
          <h2 className="text-xl font-bold mb-4">{t("Reserved by Students")}</h2>
          <div className="my-8 text-lg text-red-500">لا توجد بيانات للعرض</div>
        </div>
      </TeacherLayout>
    );
  }

  // Packages
  const packagesRows = (data || [])
    .filter((item) => item.type === "package")
    .flatMap((item) =>
      (item.students || []).map((studentObj) => ({
        studentName: studentObj.student?.name,
        studentEmail: studentObj.student?.email,
        packageName: i18n.language === "ar" ? item.packageTitleAR : item.packageTitleEN,
        price: studentObj.price,
        currency: t(studentObj.currency),
        date: new Date(studentObj.subscribedAt).toLocaleString(),
      }))
    );

  // Tests
  const testsRows = (data || [])
    .filter((item) => item.type === "test")
    .flatMap((item) =>
      (item.tests || []).map((testObj) => ({
        studentName: testObj.student?.name,
        studentEmail: testObj.student?.email,
        price: testObj.price,
        currency: t(testObj.currency),
        testName: i18n.language === "ar" ? testObj.testTitleAR : testObj.testTitleEN,
        date: new Date(testObj.subscribedAt).toLocaleString(),
      }))
    );

  // Lectures
  const lecturesRows = (data || [])
    .filter((item) => item.type === "lecture")
    .map((item) => ({
      studentName: item.student?.name,
      studentEmail: item.student?.email,
      lectureName: i18n.language === "ar" ? item.lecture?.titleAR : item.lecture?.titleEN,
      price: item.price,
      currency: t(item.currency),
      date: new Date(item.subscribedAt).toLocaleString(),
    }));

  // Discounts
  const discountsRows = (data || [])
    .filter((item) => item.type === "discount")
    .map((item) => ({
      studentName: item.student?.name,
      studentEmail: item.student?.email,
      price: item.price,
      currency: t(item.currency),
      discountName: i18n.language === "ar" ? item.discount?.titleAR : item.discount?.titleEN,
      date: new Date(item.subscribedAt).toLocaleString(),
    }));

  return (
    <TeacherLayout>
      <div className="p-4 bg-white rounded shadow-md">
        {/* Packages Table */}
        <TableSection
          title="Package Reserved by students"
          columns={[
            { key: "studentName", label: "studentName" },
            { key: "studentEmail", label: "studentEmail" },
            { key: "packageName", label: "packageName" },
            { key: "price", label: "price" },
            { key: "currency", label: "currency" },
            { key: "date", label: "date" },
          ]}
          data={packagesRows}
        />
        {/* Lectures Table */}
        <TableSection
          title="Lecture Reserved by students"
          columns={[
            { key: "studentName", label: "studentName" },
            { key: "studentEmail", label: "studentEmail" },
            { key: "lectureName", label: "lectureName" },
            { key: "price", label: "price" },
            { key: "currency", label: "currency" },
            { key: "date", label: "date" },
          ]}
          data={lecturesRows}
        />
        {/* Tests Table */}
        <TableSection
          title="Test Reserved by students"
          columns={[
            { key: "studentName", label: "studentName" },
            { key: "studentEmail", label: "studentEmail" },
            { key: "testName", label: "testName" },
            { key: "price", label: "price" },
            { key: "currency", label: "currency" },
            { key: "date", label: "date" },
          ]}
          data={testsRows}
        />
        {/* Discounts Table */}
        <TableSection
          title="Discount Reserved by students"
          columns={[
            { key: "studentName", label: "studentName" },
            { key: "studentEmail", label: "studentEmail" },
            { key: "discountName", label: "discountName" },
            { key: "price", label: "price" },
            { key: "currency", label: "currency" },
            { key: "date", label: "date" },
          ]}
          data={discountsRows}
        />
      </div>
    </TeacherLayout>
  );
};

export default RequesStudents;
