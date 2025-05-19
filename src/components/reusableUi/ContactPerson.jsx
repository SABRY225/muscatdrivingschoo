import { Avatar, Box, Button, Typography} from "@mui/material";
import React            from "react";
import DeleteIcon       from "@mui/icons-material/Delete";
import { useTranslation } from "react-i18next";
import { db } from "../../firebase";
import { collection, query, onSnapshot, where, doc , deleteDoc } from "firebase/firestore";
import { useSnackbar }  from "notistack";
import { useTeacher }   from "../../hooks/useTeacher";

export default function ContactPerson({item,selectChat, lastMessage,active,}) {
  const { t } = useTranslation();
  const { closeSnackbar, enqueueSnackbar }  = useSnackbar();
  const { data } = useTeacher(item.teacherId);
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
        alignItems: "center",
        columnGap: "12px",
        marginBottom: "20px",
        cursor: "pointer",
        backgroundColor: active ? "#eee" : "",
        padding: "12px 8px",
        borderRadius: "6px",
      }}
      onClick={selectChat}
    >
      <Avatar
        alt={data?.data?.firstName}
        src={`${process.env.REACT_APP_API_KEY}images/${data?.data?.image}`}
        sx={{ width: "45px", height: "45px" }}
      />
      <Box>
        <Typography sx={{ margin: 0 }}>
          {item.teacherId === "0"
            ? "Admin"
            : `${data?.data?.firstName} ${data?.data?.lastName}`}
        </Typography>
        <Typography sx={{ fontSize: "12px" }}>
          {lastMessage?.text?.slice(0.3)}
        </Typography>

        <Button color="error" onClick={() => handleDelete(item)}>
            <DeleteIcon /> {t("delete")}
        </Button>
      </Box>
    </Box>
  );
}
