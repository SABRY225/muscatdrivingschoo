import React from 'react';
import StudentLayout from '../../components/student/StudentLayout'
import { useSelector } from 'react-redux';
import { Button, Paper, styled, Table, TableBody, TableCell, TableContainer, TablePagination, TableRow } from '@mui/material';
import { t } from 'i18next';
import Loading from '../../components/Loading';
import Cookies from "js-cookie";
import { Link } from 'react-router-dom';
import axios from 'axios';


const Root = styled('div')(({ theme }) => ({
    width: '100%',
    ...theme.typography.body2,
    color: theme.palette.text.secondary,
    '& > :not(style) ~ :not(style)': {
        marginTop: theme.spacing(2),
    },
}));

function StudentDiscount() {
    const lang = Cookies.get("i18next") || "en";
    const columns = [
        { id: "image", label: t("Photo"), minWidth: 150 },
        { id: "name_course_ar", label: t("title"), minWidth: 150 },
        { id: "Description", label: t("Description"), minWidth: 150 },
        { id: "link", label: t("Link Discount"), minWidth: 150 },
        { id: "docs", label: t("Discount documents"), minWidth: 150 },
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
            const res = await axios(`${process.env.REACT_APP_API_KEY}api/v1/student/discounts/${student.id}`);
            console.log(res.data.data);
            
            setData(res.data.data);
        })();
    }, [student.id]);


    if (data === null) return <Loading />
    else if (!data.length) return <StudentLayout><h1 className='text-center text-2xl text-sky-500 mt-20'>{t("Discounts are not available now")}</h1></StudentLayout>
    else return (
        <StudentLayout>
            <Root>
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
                                {data
                                    ?.filter((row) => {
                                        return lang === "ar" || lang === "en"
                                            ? row.Discount?.titleAR&& row.Discount?.descriptionAR
                                            : row.Discount?.titleEN && row.Discount?.descriptionEN;
                                    })
                                    ?.map((row) => {
                                        return (
                                            <TableRow hover role="checkbox" key={row.id + "demj"}>
                                                <TableCell align="center"><img src={row.Discount?.image ? `${process.env.REACT_APP_API_KEY}images/${row.Discount?.image}` : "/logo.png"} alt={row.Discount?.image} width={"100px"} /></TableCell>
                                                <TableCell align="center">{lang === "ar" ?row.Discount?.titleAR:row.Discount?.titleEN}</TableCell>
                                                <TableCell align="center">{lang === "ar" ?row.Discount?.descriptionAR:row.Discount?.descriptionEN}</TableCell>
                                                {row.Discount?.linkDiscount !=="null" ? <TableCell align="center">
                                                    <Button
                                                        component={Link}
                                                        to={row.Discount?.linkDiscount}
                                                        target="_blank" // يفتح الرابط في صفحة جديدة
                                                        rel="noopener noreferrer"
                                                    >
                                                        {t("Link Discount")}
                                                    </Button>
                                                </TableCell> : <>
                                                    <TableCell align="center">{t("No link Discount")}</TableCell>
                                                </>}
                                                {row.Discount?.docs ? <TableCell align="center">
                                                    <Button
                                                        component={Link}
                                                        to={`${process.env.REACT_APP_API_KEY}images/${row.Discount?.docs}`}
                                                        target="_blank" // يفتح الرابط في صفحة جديدة
                                                        rel="noopener noreferrer"
                                                    >
                                                        {t("Discount documents")}
                                                    </Button>
                                                </TableCell> : <>
                                                    <TableCell align="center">{t("No Documents")}</TableCell>
                                                </>}
                                                <TableCell align="center">{row.Discount?.amountAfterDiscount} {t(row?.currency)} </TableCell>

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

export default StudentDiscount;