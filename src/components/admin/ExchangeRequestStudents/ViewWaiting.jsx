import React from "react";
import { Box, Button, Dialog ,Avatar  ,TableRow ,Table , TextField ,Paper , TableContainer  , TableBody, TablePagination , TableCell} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Loading            from "../../Loading";
import ClearIcon          from "@mui/icons-material/Clear";
import DoneIcon           from "@mui/icons-material/Done";
import Cookies            from "js-cookie";
import { useExchangeRequestsStudents } from "../../../hooks/useExchangeRequestsStudents";

export default function ViewWaiting() {
  const { t } = useTranslation();

  const columns = [
    { id: "image",         label: t("image"),        minWidth: 100 },
    { id: "name",          label: t("student"),      minWidth: 150 },
    { id: "amount",        label: t("amount"),       minWidth: 150 },
    { id: "currency",      label: t("currency"),     minWidth: 150 },
    { id: "reason",        label: t("reason"),       minWidth: 50 },
    { id: "actions",        label: t("actions"),     minWidth: 50 }
  ];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const { data, isLoading }           = useExchangeRequestsStudents();
  const [ checkFound, setCheckFound ] = useState(false);
  const [ExchangeRequestsStudents, setExchangeRequestsStudents] = useState([]);

  const { admin , token } = useSelector((state) => state.admin);
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
      setExchangeRequestsStudents(data.data);

      let rowWaiting;
      rowWaiting = data?.data.find((e) => e.status == "1");
      if(rowWaiting !== undefined){
        setCheckFound(true);
      }else{
        setCheckFound(false);
      }
    }
  }, [data]);

  /** handle open dialog */
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  function filterList(id) {
    setExchangeRequestsStudents((pre) => pre.filter((item) => item.id !== id));
  }

  // Added by eng.reem.shwky@gmail.com
  async function handleAccept(id) {
    filterList(id);
    const formData      = new FormData();
    formData.append("status",       "2");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/exchangerequeststudentsbystatus/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
          },
          body:formData
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
        setExchangeRequestsStudents(ExchangeRequestsStudents.filter((c) => c.id !== id));
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
      
    } catch (err) {
      console.log(err);
    }
  }

  async function handleReject(id) {
    filterList(id);
    const formData = new FormData();
    formData.append("status",       "0");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/exchangerequeststudentsbystatus/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
          },
          body:formData
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
        setExchangeRequestsStudents(ExchangeRequestsStudents.filter((c) => c.id !== id));
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (err) {
      console.log(err);
    }
  }
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
                {
                ExchangeRequestsStudents.length > 0 && checkFound
                ?
                (
                ExchangeRequestsStudents
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
                    if (row.status == "1"){
                    return (
                      <TableRow hover role="checkbox" key={row.id + "demj"}>
                        <TableCell align="center">
                        <Avatar
                            sx={{ width: "85px", height: "85px" }}
                            src={`${process.env.REACT_APP_API_KEY}images/${row.Student?.image}`}
                        />
                        </TableCell>
                        <TableCell align="center">{row.Student?.name}</TableCell>
                        <TableCell align="center">{row.amount}</TableCell>
                        <TableCell align="center">{row.currency}</TableCell>
                        <TableCell align="center">{row.reason}</TableCell>
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
                )
                  :
                  <TableRow>
                    <TableCell align="center" colSpan={6}>
                      <p>{t("ExchangeRequestsStudents_notfound")}</p>
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={ExchangeRequestsStudents?.length}
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
