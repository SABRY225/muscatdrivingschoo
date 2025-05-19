import React from "react";
import { Box, Button, TextField ,Avatar , Paper, Table, TableBody , TableCell, TableRow ,TablePagination , TableContainer } from "@mui/material";
import { useTranslation } from "react-i18next";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon  from "@mui/icons-material/Done";
import Cookies from "js-cookie";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import { usePackageStatus }  from "../../../hooks/usePackageStatus";
import Loading   from "../../Loading";
export default function Accept() {
  const { t } = useTranslation();

  const columns = [
    { id: "image",         label: t("image"),                 minWidth: 100 },
    { id: "titleAr",       label: t("titleAr"),               minWidth: 150 },
    { id: "teacher_name",  label: t("teacher_name"),          minWidth: 150 },
    { id: "level_name",    label: t("package_level"),         minWidth: 150 },
    { id: "level_name",    label: t("package_trainingtype"),  minWidth: 150 },
    { id: "level_name",    label: t("package_limittype"),     minWidth: 150 },
    { id: "status",        label: t("actions"),               minWidth: 50 },
  ];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const { data, isLoading }           = usePackageStatus("2");
  const [Packages, setPackages]       = useState([]);

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
      setPackages(data.data);
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
        `${process.env.REACT_APP_API_KEY}api/v1/admin/acceptPackage/${id}`,
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
        setPackages(Packages.filter((c) => c.id !== id));
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
        `${process.env.REACT_APP_API_KEY}api/v1/admin/rejectPackage/${id}`,
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
        setPackages(Packages.filter((c) => c.id !== id));
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  function filterList(id) {
    setPackages((pre) => pre.filter((item) => item.id !== id));
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
                {Packages
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
                    return (
                      <TableRow hover role="checkbox" key={row.id + "demj"}>
                        <TableCell align="center">
                        <Avatar
                            sx={{ width: "85px", height: "85px" }}
                            src={`${process.env.REACT_APP_API_KEY}images/${row.image}`}
                        />
                        </TableCell>
                        <TableCell align="center">{ lang === "en" ? row.titleEN : row.titleAR}</TableCell>
                        <TableCell align="center">{row.Teacher?.firstName}</TableCell>
                        <TableCell align="center">{ lang === "en" ? row.Level?.titleEN : row.Level?.titleAR }</TableCell>
                        <TableCell align="center">{ lang === "en" ? row.TrainingCategoryType?.titleEN : row.TrainingCategoryType?.titleAR }</TableCell>
                        <TableCell align="center">{ lang === "en" ? row.LimeType?.titleEN : row.LimeType?.titleAR }</TableCell>
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
                  })}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={Packages?.length}
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
