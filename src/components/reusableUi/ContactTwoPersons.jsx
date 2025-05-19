import { Avatar, Box, Typography , Button } from "@mui/material";
import React from "react";
import DeleteIcon       from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { db } from "../../firebase";
import { collection, query, onSnapshot, where, doc , deleteDoc } from "firebase/firestore";
import { useSnackbar }  from "notistack";
import { useTeacher }   from "../../hooks/useTeacher";

export default function ContactTwoPersons({item,selectChat,lastMessage,active,}) {
  const { t } = useTranslation();
  const { closeSnackbar, enqueueSnackbar }  = useSnackbar();
  // Added by eng.reem.shwky@gmail.com
  const handleDelete = async (itemToDelete) => {
    
    closeSnackbar();
    const isConfirmed = window.confirm(t("confirm_dangerous_action"));
    if (!isConfirmed) return;

    
    try {
      await deleteDoc(doc(db, "chats", itemToDelete?.id))
      enqueueSnackbar( t("success_chat_message") , { variant: "success" });
    } catch (error) {
      enqueueSnackbar(error, { variant: "error" });
    }
    
  };
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "start",
        flexDirection: "column",
        rowGap: "6px",
        cursor: "pointer",
        backgroundColor: active ? "#eee" : "",
        padding: "12px 8px",
        borderRadius: "6px",
      }}
      onClick={selectChat}
    >
      <Box
        sx={{
          display: "flex",
          columnGap: "12px",
        }}
      >
        {item.studentId === "0" || item.teacherId === "0" ? (
          item.studentId === "0" ? (
            <Avatar
              alt={item.teacherName}
              src={`${process.env.REACT_APP_API_KEY}images/${item.teacherImage}`}
              sx={{ width: "45px", height: "45px" }}
            />
          ) : (
            <Avatar
              alt={item.studentName}
              src={`${process.env.REACT_APP_API_KEY}images/${item.studentImage}`}
              sx={{ width: "45px", height: "45px" }}
            />
          )
        ) : (
          <>
            <Avatar
              alt={item.teacherName}
              src={`${process.env.REACT_APP_API_KEY}images/${item.teacherImage}`}
              sx={{ width: "45px", height: "45px" }}
            />
            <Avatar
              alt={item.studentName}
              src={`${process.env.REACT_APP_API_KEY}images/${item.studentImage}`}
              sx={{ width: "45px", height: "45px" }}
            />
          </>
        )}
        <Box>
          <Typography sx={{ margin: 0 }}>
            {item.studentId === "0" || item.teacherId === "0"
              ? item.teacherName + item.studentName
              : item.teacherName + " & " + item.studentName}
          </Typography>
        </Box>
      </Box>
      <Box>
        <Typography
          sx={{
            fontSize: "12px",
            marginX: "12px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
            maxWidth: "200px",
          }}
        >
          {lastMessage?.text?.slice(0.3)}
        </Typography>
        <Button color="error" onClick={() => handleDelete(item)}>
            <DeleteIcon /> {t("delete")}
        </Button>
      </Box>
    </Box>
  );
}
