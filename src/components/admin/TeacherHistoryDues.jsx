import React from 'react'
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import { Box} from '@mui/material';
import Loading from '../../components/Loading'
import { useTranslation } from 'react-i18next';
import { useAdminTeacherHistory } from '../../hooks/useAdminTeacherHistory';
import { useSelector } from 'react-redux';

export default function TeacherHistoryDues({id}) {
    const {t} = useTranslation();
    const { admin }   = useSelector((state)=>state.admin);

    const columns = [
        { id: 'Name',       label: t('amount'), minWidth: 150 },
        { id: 'Email',      label: t('teacheramount'), minWidth: 150 },
        { id: 'Email',      label: t('adminamount'), minWidth: 150 },
        { id: 'Email',      label: t('history'), minWidth: 150 },
        { id: 'Gender',     label: t('status'), minWidth: 150 }
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

    const {token} = useSelector((state)=>state.admin)
    const {data,isLoading} = useAdminTeacherHistory(id,token)
    let totalTeacherAmount = 0;
    let totalAdminAmount = 0;
    return (
    <Box>
        {!isLoading?
        <Paper sx={{ width: '100%',padding:"20px"}}>
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
                        {
                        
                        data?.data.length > 0 ?
                        data.data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((row) => {
                            
                            let discount        = 1 - +admin.profitRatio / 100.0;
                            let teacheramount   = row.amount * discount;
                            totalTeacherAmount  += teacheramount;
                            let adminamount     = (row.amount) -  row.amount * discount;
                            totalAdminAmount    += adminamount;

                            return <TableRow hover role="checkbox"  key={row.id+"demj"}>
                                <TableCell align='center'>
                                    {row.amount}
                                </TableCell>
                                <TableCell align='center'>
                                    {teacheramount}
                                </TableCell>
                                <TableCell align='center'>
                                    {adminamount.toFixed(2)}
                                </TableCell>
                                <TableCell align='center'>
                                    {row.createdAt.split('T')[0]}
                                </TableCell>
                                <TableCell align="center">
                                    {t(row.type)}
                                </TableCell>
                            </TableRow>
                        })
                        :
                    <TableRow>
                        <TableCell align="center" colSpan={5}>
                        <p>{t("records_notfound")}</p>
                        </TableCell>
                      </TableRow>
                    }
                    </TableBody>
                </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 100]}
                    component="div"
                    count={data?.data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />

            <hr />
            <br />
            <br />
            <table>
                <tr>
                    <td>{t("teacher_totalamount")} = </td>
                    <td> <b> {totalTeacherAmount} </b> </td>
                </tr>
                <tr>
                    <td>{t("admi_totalnamount")} = </td>
                    <td> <b> {totalAdminAmount.toFixed(2)} </b></td>
                </tr>
            </table>
        </Paper>


        :
        <Loading/>
        }
    </Box>
)
}