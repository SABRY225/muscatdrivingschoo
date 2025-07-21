import React from 'react';
import StudentLayout from '../../components/student/StudentLayout'
import { useSelector } from 'react-redux';
import { Button, Paper, styled, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import { t } from 'i18next';
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';



const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    '& > :not(style) ~ :not(style)': {
        marginTop: theme.spacing(2),
    },
}));

function StudentLecture() {
    const navigate = useNavigate();
    const lang = Cookies.get("i18next") || "en";
    const columns = [
        { id: "image", label: t("Photo"), minWidth: 150 },
        { id: "name_course_ar", label: t("title"), minWidth: 150 },
        { id: "description_course_en", label: t("Description"), minWidth: 150 },
        { id: "subject", label: t("subject"), minWidth: 150 },
        { id: "class", label: t("classes"), minWidth: 150 },
        // { id: "semester", label: t("semester"), minWidth: 150 },
        { id: "studycurriculums", label: t("studycurriculums"), minWidth: 150 },
        { id: "linkLecture", label: t("view lecture"), minWidth: 150 },
        { id: "docs", label: t("Lecture documents"), minWidth: 150 },
        { id: "price", label: t("price"), minWidth: 150 },
    ];

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };
    const { student } = useSelector(state => state.student);
    const [data, setData] = React.useState(null);
    React.useEffect(() => {
        (async () => {
            const res = await axios(`${process.env.REACT_APP_API_KEY}api/v1/student/lectures/${student.id}`);
            console.log(res.data.data);
            
            setData(res.data.data);
            
        })();
    }, [student.id]);
    const handelViewLecture=(lecture)=>{
        localStorage.setItem("lectureVideo",lecture.linkLecture);
        localStorage.setItem("lectureNameAR",lecture.titleAR);
        localStorage.setItem("lectureNameEN",lecture.titleEN);
        navigate("/student/view-lecture")
    }
     return (
        <StudentLayout>
            <Root>
                <Paper sx={{ padding: "20px" }}>
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
                                {data
                                    ?.map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" key={row.id + "demj"}>
                                                <TableCell align="center"><img src={row.TeacherLecture?.image ? `${process.env.REACT_APP_API_KEY}images/${row.TeacherLecture?.image}` : "/logo.png"} alt={row.lecture?.image} width={"100px"} /></TableCell>
                                                <TableCell align="center">{lang === "ar" ?row.TeacherLecture?.titleAR:row.TeacherLecture?.titleEN}</TableCell>
                                                <TableCell align="center">{lang === "ar" ?row.TeacherLecture?.descriptionAr:row.TeacherLecture?.descriptionEn}</TableCell>

                                                <TableCell align="center">{lang === "ar" ?row.TeacherLecture?.subject?.titleAR:row.TeacherLecture?.subject?.titleEN}</TableCell>
                                                <TableCell align="center">{lang === "ar" ?row?.TeacherLecture?.classData?.titleAR:row?.TeacherLecture?.classData?.titleEN}</TableCell>
                                                {/* <TableCell align="center">{t(row?.TeacherLecture?.semester)}</TableCell> */}
                                                <TableCell align="center">{lang === "ar" ?row.TeacherLecture?.curriculum?.titleAR:row?.TeacherLecture?.curriculum?.titleEN}</TableCell>
                                                {row.TeacherLecture?.linkLecture ? <TableCell align="center">
                            <Button
                              onClick={()=>handelViewLecture(row.TeacherLecture)}
                            >
                              {t("view")}
                            </Button>
                          </TableCell> : <>
                        <TableCell align="center">
                        {t("No Link Lecture")}
                        </TableCell>
                          </>}
                        {row.TeacherLecture?.docs ? <TableCell align="center">
                            <Button
                              component={Link}
                              to={`${process.env.REACT_APP_API_KEY}images/${row.TeacherLecture?.docs}`}
                              target="_blank" // يفتح الرابط في صفحة جديدة
                              rel="noopener noreferrer"
                            >
                              {t("Lecture documents")}
                            </Button>
                          </TableCell> : <>
                          <TableCell align="center">{t("No Documents")}</TableCell>
                          </>}
                                                <TableCell align="center">{row.TeacherLecture?.price} {t(row.TeacherLecture?.currency)}</TableCell>

                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={data?.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </Paper>
            </Root>
        </StudentLayout>
    )
}

export default StudentLecture;