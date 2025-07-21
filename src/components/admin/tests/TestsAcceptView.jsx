import React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import { Box, Button ,Avatar  } from "@mui/material";
import { useTranslation } from "react-i18next";

import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon  from "@mui/icons-material/Done";

import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Cookies         from "js-cookie";
import { useTests }    from "../../../hooks/useTests";
import Loading         from "../../Loading";
import currencies      from "../../../data/currencies";
export default function TestsAcceptView() {
  const { t } = useTranslation();

  const columns = [
    { id: "teacher",       label: t("teacher"),                 minWidth: 100 },
    { id: "price",         label: t("price"),               minWidth: 150 },
    { id: "level",         label: t("level"),          minWidth: 150 },
    { id: "currency",      label: t("currency"),         minWidth: 150 },
    { id: "status",        label: t("actions"),               minWidth: 50 },
  ];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const { data, isLoading }           = useTests();
  const [Tests, setTests]             = useState([]);

  const { token } = useSelector((state) => state.admin);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { lang } = Cookies.get("i18next") || "en";

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (data?.data) {
      setTests(data.data);
    }
  }, [data]);

  /** handle open dialog */
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  async function handleAccept(id) {
    filterList(id);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/acceptTests/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("failed occured");
      }

      if (response.ok) {
        const json = await response.json();
        if (lang === "en") {
          enqueueSnackbar(json.msg.english, { variant: "success" });
        } else {
          enqueueSnackbar(json.msg.arabic, { variant: "success" });
        }
        setTests(Tests.filter((c) => c.id !== id));
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
      
    } catch (err) {
      console.log(err);
    }
  }

  async function handleReject(id) {
    filterList(id);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/rejectTests/${id}`,
        {
          method: "POST",
          headers: {
            Authorization: token,
          },
        }
      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error("failed occured");
      }

      if (response.ok) {
        const json = await response.json();
        if (lang === "en") {
          enqueueSnackbar(json.msg.english, { variant: "success" });
        } else {
          enqueueSnackbar(json.msg.arabic, { variant: "success" });
        }
        setTests(Tests.filter((c) => c.id !== id));
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  function filterList(id) {
    setTests((pre) => pre.filter((item) => item.id !== id));
  }


  return (
    <Box>
      {!isLoading ? (
        <Paper sx={{ padding: "20px" }}>
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
                {Tests.length > 0 ? 
                  Tests
                  ?.filter(
                    (row) =>
                      `${row.titleAR || ""}`
                        .toLowerCase()
                        .includes(searchInput.toLowerCase().trim()) ||
                      `${row.titleEN || ""}`
                        .toLowerCase()
                        .includes(searchInput.toLowerCase().trim())
                  )
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => {
                    if (row.status == "2") {
                    
                    let current_currency;
                    current_currency = currencies.find((e) => e.title == row?.currency);
                    return (
                      <TableRow hover role="checkbox" key={row.id + "demj"}>
                        <TableCell align="center">{ lang === "en" ? row.titleEN : row.titleAR} {row.Teacher?.firstName}</TableCell>
                        <TableCell align="center">{ row.price }</TableCell>
                        <TableCell align="center">{ (lang == "en") ? current_currency.titleEn :  current_currency.titleAr}</TableCell>
                        <TableCell align="center">{ (lang == "en") ? row.Level.titleEN :  row.Level.titleAR}</TableCell>
                        <TableCell align="center">
                          <Button
                            color="success"
                            onClick={() => handleAccept(row.id)}
                          >
                            <DoneIcon />
                          </Button>
                          <Button
                            color="error"
                            onClick={() => handleReject(row.id)}
                          >
                          <ClearIcon />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  }
                  })
                  : <TableRow>
                      <TableCell align="center" colSpan={7}>
                      <p>{t("package_notfound")}</p>
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
