import React from "react";
import { Box, Button, Dialog, Avatar, Paper, Table, TableBody, TableRow, TablePagination, TableContainer, TableCell } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import ClearIcon from "@mui/icons-material/Clear";
import DoneIcon from "@mui/icons-material/Done";
import { useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import Cookies from "js-cookie";
import Loading from "../../Loading";
import { useAds } from "../../../hooks/useAds";


export default function ViewWaiting() {
  const { t } = useTranslation();

  const columns = [
    { id: "status", label: t("status"), minWidth: 150 },
    { id: "titleAR", label: t("titleAR"), minWidth: 150 },
    { id: "titleEN", label: t("titleEN"), minWidth: 150 },
    { id: "descriptionAR", label: t("descriptionAR"), minWidth: 150 },
    { id: "descriptionEN", label: t("descriptionEN"), minWidth: 150 },
    { id: "link", label: t("link"), minWidth: 150 },
    { id: "carModel", label: t("carModel"), minWidth: 150 },
    { id: "yearManufacture", label: t("yearManufacture"), minWidth: 150 },
    { id: "carPrice", label: t("carPrice"), minWidth: 150 },
    { id: "images", label: t("images"), minWidth: 200 },
    { id: "actions", label: t("actions"), minWidth: 150 },
  ];
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [searchInput, setSearchInput] = React.useState("");
  const { data, isLoading } = useAds();
  const [Ads, setAds] = useState([]);

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
      setAds(data.data);
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
      const formData = new FormData();
      formData.append("status", "2");
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/adsStatus/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
          },
          body: formData,
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
        setAds(Ads.filter((c) => c.id !== id));
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
      const formData = new FormData();
      formData.append("status", "0");
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/adsStatus/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: token,
          },
          body: formData,
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
        setAds(Ads.filter((c) => c.id !== id));
      } else {
        enqueueSnackbar(response.message, { variant: "error" });
      }
    } catch (err) {
      console.log(err);
    }
  }

  function filterList(id) {
    setAds((pre) => pre.filter((item) => item.id !== id));
  }

  const [imagesDialogOpen, setImagesDialogOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleOpenImagesDialog = (images) => {
    setSelectedImages(images); // لازم الصور تكون Array of URLs
    setImagesDialogOpen(true);
  };

  const handleCloseImagesDialog = () => {
    setImagesDialogOpen(false);
    setSelectedImages([]);
  };
  console.log(Ads);

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
                {Ads.length > 0 ?
                  Ads
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
                      if (row.status == "1") {

                        let txt_status = t("waiting");
                        if (row.status == "1") {
                          txt_status = t("waiting");
                        }
                        else if (row.status == "0") txt_status = t("reject");
                        else if (row.status == "2") txt_status = t("accept");
                        return (
                          <TableRow hover role="checkbox" key={row.id + "demj"}>
                            <TableCell align="center">{txt_status}</TableCell>
                            <TableCell align="center">{row.titleAR}</TableCell>
                            <TableCell align="center">{row.titleEN}</TableCell>
                            <TableCell align="center">{row.descriptionAR}</TableCell>
                            <TableCell align="center">{row.descriptionEN}</TableCell>
                            <TableCell align="center">{row.link}</TableCell>
                            <TableCell align="center">{row.carModel}</TableCell>
                            <TableCell align="center">{row.yearManufacture}</TableCell>
                            <TableCell align="center">{row.carPrice} {row?.currency} </TableCell>
                            <TableCell align="center">
                              <Button
                                variant="outlined"
                                onClick={() => handleOpenImagesDialog(row?.images)}
                                disabled={!row?.images?.length}
                              >
                                {t("view_images")}
                              </Button>
                            </TableCell>
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
                    <TableCell align="center" colSpan={8}>
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
            count={Ads?.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
          <Dialog open={imagesDialogOpen} onClose={handleCloseImagesDialog} maxWidth="md" fullWidth>
            <Box sx={{ padding: 2, display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
              {selectedImages.map((img, index) => (
                <img key={index} src={`${process.env.REACT_APP_API_KEY}images/${img.image}`} alt={`ad-${index}`} style={{ width: "200px", borderRadius: 8 }} />
              ))}
            </Box>
          </Dialog>
        </Paper>
      ) : (
        <Loading />
      )}
    </Box>
  );
}
