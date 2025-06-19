import React from 'react';
import StudentLayout from '../../components/student/StudentLayout'
import { useSelector } from 'react-redux';
import { Button, Paper, styled, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import { t } from 'i18next';
import Loading from '../../components/Loading';
import Cookies from "js-cookie";

import { Link } from "react-router-dom";
import axios from 'axios';

const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    '& > :not(style) ~ :not(style)': {
        marginTop: theme.spacing(2),
    },
}));

function StudentExam() {
    const lang = Cookies.get("i18next") || "en";
    const columns = [
        { id: "photo", label: t("Photo"), minWidth: 150 },
        { id: "teacher", label: t("teacher"), minWidth: 150 },
        { id: "subject", label: t("subject"), minWidth: 150 },
        { id: "class", label: t("classes"), minWidth: 150 },
        { id: "semester", label: t("semester"), minWidth: 150 },
        { id: "studycurriculums", label: t("studycurriculums"), minWidth: 150 },
        { id: "link", label: t("Link Exam"), minWidth: 150 },
        { id: "docs", label: t("Test documents"), minWidth: 150 },
        { id: "currency", label: t("currency"), minWidth: 150 },
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
            const res = await axios(`${process.env.REACT_APP_API_KEY}api/v1/student/tests/${student.id}`);
            console.log(res.data);
            
            setData(res.data.data);
        })();
    }, [student.id]);
    if (data === null) return <Loading />
    else if (!data.length) return <StudentLayout><h1 className='text-center text-2xl text-sky-500 mt-20'>{t("Currently unavailable Exam")}</h1></StudentLayout>
    else return (
        <StudentLayout>
            <Root>
                <Paper sx={{ width: "100%", padding: "20px" }}>
                    <TableContainer sx={{ maxHeight: 440 }}>
                        <Table stickyHeader aria-label="sticky table">
                            <TableRow>
                                {columns.map((column, index) => (
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
                                    ?.filter((row) => {
                                        return lang === "ar"
                                            ? row?.Test?.subject?.titleAR && row?.Test?.subject?.titleEN
                                            : row?.price && row?.currency;
                                    })
                                    ?.map((row, index) => {
                                        return (
                                            <TableRow hover role="checkbox" key={row.id + "demj"}>
                                                <TableCell align="center"><img src={row?.Test?.image ? `${process.env.REACT_APP_API_KEY}images/${row?.Test?.image}` : "/logo.png"} alt={row?.Test?.image} width={"100px"} /></TableCell>
                                                <TableCell align="center">{row?.Test?.teacher?.firstName + " " + row?.Test?.teacher?.lastName}</TableCell>
                                                <TableCell align="center">{lang === "ar" ? row?.Test?.subject?.titleAR : row?.Test?.subject?.titleEN}</TableCell>
                                                <TableCell align="center">{lang === "ar" ? row?.Test?.classData?.titleAR : row?.Test?.classData?.titleEN}</TableCell>
                                                <TableCell align="center">{t(row?.Test?.semester)}</TableCell>
                                                <TableCell align="center">{lang === "ar" ? row?.Test?.curriculum?.titleAR : row?.Test?.curriculum?.titleEN}</TableCell>
                                                {row?.Test?.linkExam ? <TableCell align="center">
                                                    <Button
                                                        component={Link}
                                                        to={row?.Test?.linkExam}
                                                        target="_blank" // يفتح الرابط في صفحة جديدة
                                                        rel="noopener noreferrer"
                                                    >
                                                        {t("Link Exam")}
                                                    </Button>
                                                </TableCell> : <>
                                                    <TableCell align="center">{t("No link Exam")}</TableCell>
                                                </>}
                                                {row?.Test?.docs ? <TableCell align="center">
                                                    <Button
                                                        component={Link}
                                                        to={`${process.env.REACT_APP_API_KEY}images/${row?.Test?.docs}`}
                                                        target="_blank" // يفتح الرابط في صفحة جديدة
                                                        rel="noopener noreferrer"
                                                    >
                                                        {t("Test documents")}
                                                    </Button>
                                                </TableCell> : <>
                                                    <TableCell align="center">{t("No Documents")}</TableCell>
                                                </>}
                                                <TableCell align="center">{row?.Test?.price}</TableCell>
                                                <TableCell align="center">{t(row?.Test?.currency)}</TableCell>

                                            </TableRow>
                                        );
                                    })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[10, 25, 100]}
                        component="div"
                        count={data.length}
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

export default StudentExam;