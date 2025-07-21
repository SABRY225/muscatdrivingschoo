import React, { useEffect, useState } from "react";
import {
    Box,
    Typography,
    IconButton,
    CircularProgress,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import AdminLayout from "../../components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import Moment from "moment";

const ParentPage = () => {
    const [parents, setParents] = useState([]);
    const [filteredParents, setFilteredParents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snack, setSnack] = useState({ open: false, message: "" });
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedParent, setSelectedParent] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);
    const { t } = useTranslation();
    const fetchParents = async () => {
        try {
            const { data } = await axios.get(`${process.env.REACT_APP_API_KEY}api/v1/admin/parents`);
            setParents(data.data);
            setFilteredParents(data.data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!selectedParent) return;

        try {
            await axios.delete(`${process.env.REACT_APP_API_KEY}api/v1/admin/parents/${selectedParent.id}`);
            const updated = parents.filter(p => p.id !== selectedParent.id);
            setParents(updated);
            setFilteredParents(updated);
            setSnack({ open: true, message: "تم حذف الأب بنجاح" });
        } catch (err) {
            console.error(err);
        }
        setConfirmOpen(false);
    };

    const handleSearch = (value) => {
        setSearchTerm(value);
        const filtered = parents.filter((parent) =>
            parent.name.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredParents(filtered);
    };

    const openDeleteDialog = (parent) => {
        setSelectedParent(parent);
        setConfirmOpen(true);
    };

    useEffect(() => {
        fetchParents();
    }, []);

    if (loading) return <Box p={3}><CircularProgress /></Box>;

    return (
        <AdminLayout>
            <Box p={3}>
                <Typography variant="h5" mb={2}>{t("parentList")}</Typography>

                <TextField
                    label={t("searchByName")}
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    sx={{ mb: 3 }}
                />


                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>{t("Joining date")}</TableCell>
                                <TableCell>{t("name")}</TableCell>
                                <TableCell>{t("email")}</TableCell>
                                <TableCell align="center">{t("actions")}</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredParents.map((parent) => (
                                <TableRow key={parent.id}>
                                    <TableCell>{Moment(parent.createdAt).format(
                                        "YYYY/MM/DD , h:mm:ss a"
                                    )}</TableCell>
                                    <TableCell>{parent.name}</TableCell>
                                    <TableCell>{parent.email}</TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            onClick={() => openDeleteDialog(parent)}
                                            color="error"
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredParents.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} align="center">
                                        {t("noResults")}
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Snackbar
                    open={snack.open}
                    autoHideDuration={3000}
                    onClose={() => setSnack({ open: false, message: "" })}
                    message={t("parentDeleted")}
                />

                {/* تأكيد الحذف */}
                <Dialog
                    open={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                >
                    <DialogTitle>{t("confirmDelete")}</DialogTitle>
                    <DialogContent>
                        <DialogContentText>
                            {t("deleteMessage", { name: selectedParent?.name })}
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)}>{t("cancel")}</Button>
                        <Button onClick={handleDelete} color="error">{t("delete")}</Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </AdminLayout>
    );
};

export default ParentPage;
