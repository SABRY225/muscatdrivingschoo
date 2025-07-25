import React from "react";
import { Box, Button, Dialog , Avatar , Paper , Table, TableBody, TableCell , TablePagination , TableRow , TableContainer}   from "@mui/material";
import { useTranslation }         from "react-i18next";
import Loading          from "../../Loading";
import EditIcon         from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import TextField        from "@mui/material/TextField";
import DeleteIcon       from "@mui/icons-material/Delete";
import { useSelector }  from "react-redux";
import { useSnackbar }  from "notistack";
import Cookies          from "js-cookie";
import { useTeacherLectures }     from "../../../hooks/useTeacherLectures";
import { useNavigate } from "react-router-dom";

export default function TeacherLecturesView() {
  const { t } = useTranslation();
    const navigate = useNavigate();

  const columns = [
    { id: "image",             label: t("image"),             minWidth: 100 },
    { id: "title",           label: t("title"),           minWidth: 150 },
    { id: "description",     label: t("Description"),     minWidth: 150 },
    { id: "subject",           label: t("subject"),           minWidth: 150 },
    // { id: "semester",     label: t("semester"),     minWidth: 150 },
    { id: "classes",     label: t("classes"),     minWidth: 150 },
    { id: "price",     label: t("price"),     minWidth: 150 },
    { id: "status",            label: t("status"),            minWidth: 150 },
    { id: "update",            label: t("update"),            minWidth: 50 },
    { id: "delete",            label: t("delete"),            minWidth: 50 },
  ];
  const [ page, setPage] = React.useState(0);
  const [ rowsPerPage, setRowsPerPage ] = React.useState(10);
  const [ searchInput, setSearchInput ] = React.useState("");
  const { teacher,token }         = useSelector((state)=>state.teacher);

  const { data, isLoading }       = useTeacherLectures( teacher?.id , token);
  const [ Lectures , setLectures] = useState([]);


  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const lang   = Cookies.get("i18next") || "en";
 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    if (data?.data) {
      console.log(data.data);
      
      setLectures(data.data);
    }
  }, [data]);
  
  const handleDelete = async (id) => {
    closeSnackbar();
    const isConfirmed = window.confirm(t("confirm_dangerous_action"));
    if (!isConfirmed) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/deleteLecture/${id}`,
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
        setLectures( Lectures.filter((c) => c.id !== id) );
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
        <Paper sx={{  padding: "20px" }}>
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
                  Lectures.length > 0 ? 
                Lectures
                  ?.filter(
                    (row) =>
                      `${row.name || ""}`
                        .toLowerCase()
                        .includes(searchInput.toLowerCase().trim()) ||
                      `${row.subject || ""}`
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
                        <TableCell align="center">{lang==="ar"?row?.titleAR:row?.titleEN}</TableCell>
                        <TableCell align="center">{lang==="ar"?row?.descriptionAr:row?.descriptionEn}</TableCell>
                        <TableCell align="center">{lang==="ar"?row?.subject?.titleAR:row?.subject?.titleEN}</TableCell>
                        {/* <TableCell align="center">{t(row?.semester)}</TableCell> */}
                        <TableCell align="center">{lang==="ar"?row?.class?.titleAR:row?.class?.titleEN}</TableCell>
                        <TableCell align="center">{row?.price}{" "}{t(row?.currency)}</TableCell>
                        <TableCell align="center">{row?.status==1?t("status_waiting"):row?.status==2?t("status_accept"):t("status_rejected")}</TableCell>
                        <TableCell align="center">
                          <Button onClick={() => navigate(`/teacher/lectures/${row?.id}`)}>
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
                    <TableCell align="center" colSpan={6}>
                    <p>{t("lectrue_notfound")}</p>
                    </TableCell>
                  </TableRow>
                }
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={Lectures?.length}
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
