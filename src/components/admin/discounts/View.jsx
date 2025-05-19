import React from "react";
import { Box, Button, TextField ,Avatar , Paper , Table , TableBody , TableCell , TableRow , TablePagination , TableContainer } from "@mui/material";
import { useTranslation } from "react-i18next";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon  from "@mui/icons-material/Done";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useSelector }        from "react-redux";
import { useSnackbar }        from "notistack";
import Loading                from "../../Loading";
import { useDiscountAdmin }   from "../../../hooks/useDiscountAdmin";

export default function View() {
  const { t } = useTranslation();

  const columns = [
    { id: "image",          label: t("image"),                        minWidth: 100 },
    { id: "title",          label: t("title"),                        minWidth: 150 },
    { id: "titleEN",        label: t("discount_description"),        minWidth: 150 },
    { id: "descriptionAR",  label: t("conditions"),       minWidth: 150 },
    { id: "descriptionEN",  label: t("startDate"),  minWidth: 150 },
    { id: "link",           label: t("endDate"),           minWidth: 150 },
    { id: "link",           label: t("discount_percentage"),           minWidth: 150 },
    { id: "link",           label: t("discount_amountBeforeDiscount"),           minWidth: 150 },
    { id: "link",           label: t("discount_amountAfterDiscount"),           minWidth: 150 },
    { id: "link",           label: t("status"),           minWidth: 150 },
    { id: "status",         label: t("actions"),               minWidth: 50 },
  ];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const { token }           = useSelector((state) => state.admin);
  const { data, isLoading }             = useDiscountAdmin(token);
  const [Discounts, setDiscounts]       = useState([]);
  const [ checkFound, setCheckFound ] = useState(false);
  
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
      setDiscounts(data.data);
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

  async function handleAccept(id) {
    filterList(id);
    try {
      const formData   = new FormData();
      formData.append("status", "2");
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/discounts/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
          },
          body:formData,
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
        setDiscounts(Discounts.filter((c) => c.id !== id));
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
      const formData   = new FormData();
      formData.append("status", "0");
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/discounts/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
          },
          body:formData,
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
        setDiscounts(Discounts.filter((c) => c.id !== id));
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  function filterList(id) {
    setDiscounts((pre) => pre.filter((item) => item.id !== id));
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
                {Discounts.length > 0 && checkFound ?
                  Discounts
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
                    if(row.status == "1"){
                      let txt_status = t("waiting");
                      if(row.status == "0") txt_status = t("reject");
                      else if(row.status == "2") txt_status = t("accept");
                    
                    return (
                      <TableRow hover role="checkbox" key={row.id + "demj"}>
                        <TableCell align="center">
                        <Avatar
                            sx={{ width: "85px", height: "85px" }}
                            src={`${process.env.REACT_APP_API_KEY}images/${row.image}`}
                        />
                        </TableCell>
                        <TableCell align="center">{ (lang == "en") ? row.titleEN: row.titleAR }</TableCell>
                        <TableCell align="center">{ (lang == "en") ? row.descriptionEN: row.descriptionAR }</TableCell>
                        <TableCell align="center">{ (lang == "en") ? row.conditionsEN : row.conditionsAR }</TableCell>
                        <TableCell align="center">{ row.startDate }</TableCell>
                        <TableCell align="center">{ row.endDate }</TableCell>
                        <TableCell align="center">{ row.percentage }</TableCell>
                        <TableCell align="center">{ row.amountBeforeDiscount }</TableCell>
                        <TableCell align="center">{ row.amountAfterDiscount }</TableCell>
                        <TableCell align="center">{ txt_status }</TableCell>
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
                      <p>{t("discount_waiting_notfound")}</p>
                      </TableCell>
                    </TableRow>
                  }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={Discounts?.length}
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
