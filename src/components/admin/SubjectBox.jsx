import React from "react";
import { Box, Button, Typography } from "@mui/material";
import Cookies from "js-cookie";
import { useTranslation } from "react-i18next";
import styled from "@emotion/styled";
import { useSnackbar } from "notistack";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Image = styled("img")({
  width: "80%",
  height: "160px",
  borderRadius: "8px",
});

export default function SubjectBox({ subject, setOpen }) {
  const { t } = useTranslation();

  const { token } = useSelector((state) => state.admin);
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  const { lang } = Cookies.get("i18next") || "en";
  const navigate = useNavigate();

  const handleDelete = async (id) => {
    closeSnackbar();
    const isConfirmed = window.confirm(t("confirm_dangerous_action"));
    if (!isConfirmed) return;
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/subjectCategory/${id}`,
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
        // setCategoires(categories.filter((c) => c.id !== id));
        navigate("/admin/subjects");
      } else {
        enqueueSnackbar(res.message, { variant: "error" });
      }
    } catch (err) {
      console.log("error: ", err);
      enqueueSnackbar(t("somethingWentWrong"), { variant: "error" });
    }
  };
  return (
    <Box
      sx={{
        backgroundColor: "#59aefc1a",
        borderRadius: "6px",
        padding: "16px 10px",
        textAlign: "center",
      }}
    >
      <Image src={`${process.env.REACT_APP_API_KEY}images/${subject.image}`} />
      <Typography
        sx={{ fontSize: "20px", fontWeight: "600", marginBottom: "8px" }}
      >
        {Cookies.get("i18next") === "ar" ? subject.titleAR : subject.titleEN}
      </Typography>
      <Typography sx={{ fontSize: "13px" }}>
        {subject?.Subjects?.length} {t("categories")}
      </Typography>
      <Button
        variant="contained"
        size="small"
        sx={{ marginTop: "20px" }}
        onClick={() => setOpen(subject.id)}
      >
        {t("update")}
      </Button>
      <Button
        variant="contained"
        size="small"
        sx={{ marginTop: "20px", marginX: 2 }}
        color="error"
        onClick={() => handleDelete(subject.id)}
      >
        {t("delete")}
      </Button>
    </Box>
  );
}
