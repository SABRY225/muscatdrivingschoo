import React from "react";
import { Box, Button , TableContainer, TableCell , TableBody, Paper,Table , TableRow , TablePagination }   from "@mui/material";
import { useTranslation }         from "react-i18next";
import Loading                    from "../../Loading";
import EditIcon                   from "@mui/icons-material/Edit";
import { useState, useEffect }    from "react";
import TextField                  from "@mui/material/TextField";
import DeleteIcon                 from "@mui/icons-material/Delete";
import { useSelector }            from "react-redux";
import { useSnackbar }            from "notistack";
import Cookies                    from "js-cookie";
import { useTestsTeacher }        from "../../../hooks/useTestsTeacher";
import currencies                 from "../../../data/currencies";
import { useNavigate } from "react-router-dom";
export default function TestsView() {
  const { t } = useTranslation();
    const navigate = useNavigate();

  const columns = [
    { id: "price",             label: t("price"),           minWidth: 150 },
    { id: "currency",          label: t("currency"),           minWidth: 150 },
    { id: "level",             label: t("level"),            minWidth: 150 },
    { id: "update",            label: t("update"),            minWidth: 50 },
    { id: "delete",            label: t("delete"),            minWidth: 50 },
  ];
  const [ page, setPage] = React.useState(0);
  const [ rowsPerPage, setRowsPerPage ] = React.useState(10);
  const [ searchInput, setSearchInput ] = React.useState("");
  const { teacher, token }           = useSelector((state)=>state.teacher);

  const { data, isLoading }         = useTestsTeacher( teacher?.id , token);
  const [ Tests , setTests]      = useState([]);
  

  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { lang }    = Cookies.get("i18next") || "en";

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (data?.data) {
      console.log("GEt A:: Tests");
      console.log(data);

      setTests(data.data);
    }
  }, [data]);

  /** handle open dialog */
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async (id) => {
    closeSnackbar();
    const isConfirmed = window.confirm(t("confirm_dangerous_action"));
    if (!isConfirmed) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/tests/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      if (res.ok) {
        const json = await res.json();
        if (lang === "en") {
          enqueueSnackbar(json.msg.english, { variant: "success" });
        } else {
          enqueueSnackbar(json.msg.arabic, { variant: "success" });
        }
        setTests( Tests.filter((c) => c.id !== id) );
      } else {
        enqueueSnackbar(res.message, { variant: "error" });
      }
    } catch (err) {
      enqueueSnackbar(t("somethingWentWrong"), { variant: "error" });
    }
  };
  return (
    <Box>
      {!isLoading ? (
        <Paper sx={{ width: "100%", padding: "20px" }}>
          <TableContainer sx={{ maxHeight: 440 }}>
            <TextField
              sx={{ m: 1, width: "90%" }}
              label={t("search")}
              variant="outlined"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
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
              {Tests.length> 0 ?
               Tests
                  ?.filter(
                    (row) =>
                      `${row.price || ""}`
                        .toLowerCase()
                        .includes(searchInput.toLowerCase().trim()) ||
                      `${row.currency || ""}`
                        .toLowerCase()
                        .includes(searchInput.toLowerCase().trim())
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {

                      let current_currency;
                      current_currency = currencies.find((e) => e.title == row?.currency);
                   
                    return (
                     
                      <TableRow hover role="checkbox" key={row.id + "demj"}>
                        <TableCell align="center">{row.price}</TableCell>
                        <TableCell align="center">{ (lang == "en") ? current_currency?.titleEn :  current_currency?.titleAr}</TableCell>
                        <TableCell align="center">{ (lang == "en") ? row?.Level?.titleEN :  row?.Level?.titleAR}</TableCell>
                        <TableCell align="center">
                          <Button onClick={() => navigate(`/teacher/editExam/${row?.id}`)}>
                            <EditIcon />
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          <Button
                            color="error"
                            onClick={() => handleDelete(row.id)}
                          >
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                  : <TableRow>
                  <TableCell align="center" colSpan={7}>
                   <p>{t("tests_notfound")}</p>
                   </TableCell>
                 </TableRow>
               }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={Tests?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      ) : (
        <Loading />
      )}
    </Box>
  );
}
