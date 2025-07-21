import React from "react";
import { Box, Button, TableRow , Paper , TextField,TablePagination  , Table , TableContainer , TableBody  , TableCell } from "@mui/material";
import { useTranslation }           from "react-i18next";
import { useState, useEffect }      from "react";
import { useSelector }              from "react-redux";
import { useSnackbar }              from "notistack";
import { useNavigate }              from "react-router-dom";
import EditIcon                     from "@mui/icons-material/ViewWeek";
import DeleteIcon                   from "@mui/icons-material/Delete";
import Cookies                      from "js-cookie";
import Loading                      from "../../Loading";
import { useAdsByGuestId }          from "../../../hooks/useAdsByGuestId";

export default function View() {
  const { t } = useTranslation();

  const columns = [
    { id: "status",             label: t("status"),           minWidth: 150 },
    { id: "titleAR",            label: t("titleAR"),          minWidth: 150 },
    { id: "titleEN",            label: t("titleEN"),          minWidth: 150 },
    { id: "descriptionAR",      label: t("descriptionAR"),    minWidth: 150 },
    { id: "descriptionEN",      label: t("descriptionEN"),    minWidth: 150 },
    { id: "link",               label: t("link"),             minWidth: 150 },
    //{ id: "update",             label: t("update"),         minWidth: 50 },
    { id: "actions",             label: t("actions"),         minWidth: 50 },
  ];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const { guest, token }              = useSelector((state) => state.guest);
  const { data, isLoadingAds }        = useAdsByGuestId(guest.id);
  const [ AdsData, setAdsData ]       = useState([]);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { lang } = Cookies.get("i18next") || "en";
  const navigate            = useNavigate();
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (data?.data) {
      setAdsData(data?.data);
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
        `${process.env.REACT_APP_API_KEY}api/v1/guest/ads/${id}`,
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
        setAdsData(AdsData.filter((c) => c.id !== id));
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
      {!isLoadingAds ? (
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
                    key  ={column.id}   align={"center"}
                    style={{ top: 57,   minWidth: column.minWidth }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
              <TableBody>
                { data?.data.length> 0 ?
                  data?.data
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
                    let txt_status = t("waiting");
                    if(row.status == "1"){
                      txt_status = t("waiting");
                    }
                    else if(row.status == "0") txt_status = t("reject");
                    else if(row.status == "2") txt_status = t("accept");
                    

                    return (
                      <TableRow hover role="checkbox" key={ row.id + "demj"}>
                        <TableCell align="center">{ txt_status }       </TableCell>
                        <TableCell align="center">{ row.titleAR }       </TableCell>
                        <TableCell align="center">{ row.titleEN }       </TableCell>
                        <TableCell align="center">{ row.descriptionAR } </TableCell>
                        <TableCell align="center">{ row.descriptionEN } </TableCell>
                        <TableCell align="center">{ row.link }          </TableCell>
                        <TableCell align="center">
                          <Button onClick={() => navigate(`/guest/ads/details/${row.id}`)}>
                            <EditIcon />
                          </Button>
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
                      <p>{t("ads_notfound")}</p>
                      </TableCell>
                    </TableRow>
                  }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={AdsData?.length}
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
