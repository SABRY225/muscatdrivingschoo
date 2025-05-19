import React from "react";
import { Box, Button, Dialog ,Avatar  ,TableRow ,Table , TextField ,Paper , TableContainer  , TableBody, TablePagination , TableCell} from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Loading            from "../../Loading";
import EditIcon           from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import Cookies from "js-cookie";
import { useNavigate, useParams }   from "react-router-dom";
import { useExchangeRequestsTeachers } from "../../../hooks/useExchangeRequestsTeachers";
import Update from "./Update";

export default function View() {
  const { t }     = useTranslation();
  const navigate  = useNavigate();
  const columns = [
    { id: "image",         label: t("image"),        minWidth: 100 },
    { id: "name",          label: t("team"),         minWidth: 150 },
    { id: "amount",        label: t("amount"),       minWidth: 150 },
    { id: "currency",      label: t("currency"),     minWidth: 150 },
    { id: "status",        label: t("status"),       minWidth: 150 },
    { id: "reason",        label: t("reason"),       minWidth: 50 },
    { id: "actions",       label: t("actions"),      minWidth: 150 },
  ];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const { data, isLoading }           = useExchangeRequestsTeachers();
  const [ExchangeRequestsTeachers, setExchangeRequestsTeachers] = useState([]);

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
      console.log(data);
      setExchangeRequestsTeachers(data.data);
    }
  }, [data]);

  /** handle open dialog */
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  // Added by eng.reem.shwky@gmail.com
  const handleDelete = async (id) => {
    closeSnackbar();
    const isConfirmed = window.confirm(t("confirm_dangerous_action"));
    if (!isConfirmed) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/exchangerequestteachers/${id}`,
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
        setExchangeRequestsTeachers(ExchangeRequestsTeachers.filter((c) => c.id !== id));
      } else {
        enqueueSnackbar(res.message, { variant: "error" });
      }
    } catch (err) {
      console.log("error: ", err);
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
                {ExchangeRequestsTeachers.length > 0 ?
                 ExchangeRequestsTeachers
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
                    let status_txt = t("status_waiting");
                    if(row.status == "0"){
                      status_txt = t("status_rejected");
                    }else if(row.status == "2"){
                      status_txt = t("status_accept");
                    }else if(row.status == "4"){
                      status_txt = t("status_refund");
                    }

                    return (
                      <TableRow hover role="checkbox" key={row.id + "demj"}>
                        <TableCell align="center">
                        <Avatar
                            sx={{ width: "85px", height: "85px" }}
                            src={`${process.env.REACT_APP_API_KEY}images/${row.Teacher?.image}`}
                        />
                        </TableCell>
                        <TableCell align="center">{row.Teacher?.firstName} {row.Teacher?.lastName}</TableCell>
                        <TableCell align="center">{row.amount}</TableCell>
                        <TableCell align="center">{row.currency}</TableCell>
                        <TableCell align="center">{status_txt}</TableCell>
                        <TableCell align="center">{row.reason}</TableCell>
                        <TableCell align="center">
                      { (row.status == "2" && admin.role == "accountant") ?
                        <Button onClick={() => navigate(`/admin/refund-teacher/${row.id}`)} sx={{ backgroundColor: "#ffeaea",padding : "10px" , borderRadius:"15px"}}>
                            {t("request_refund")}
                        </Button>
                        : ""
                        }
                          <Button onClick={() => setOpen(row.id)}>
                            <EditIcon />
                          </Button>
                          <Dialog open={open === row.id} onClose={handleClose}>
                            <Update
                              setExchangeRequestsTeachers={setExchangeRequestsTeachers}
                              exchangerequeststeacher={row}
                              handleClose={handleClose}
                            />
                          </Dialog>

                          <Button color="error" onClick={() => handleDelete(row.id)}>
                            <DeleteIcon />
                          </Button>
                        </TableCell>
                        <TableCell align="center">
                          
                        </TableCell>
                      </TableRow>
                    );
                  })
                : 
                <TableRow>
                  <TableCell align="center" colSpan={6}>
                    <p>{t("ExchangeRequestsTeachers_notfound")}</p>
                  </TableCell>
                </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={ExchangeRequestsTeachers?.length}
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
