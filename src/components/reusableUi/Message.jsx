import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { useTranslation } from "react-i18next";
import { format } from "timeago.js";

export default function Message({ you, message, isAdmin }) {
  const { t } = useTranslation();
  return (
    <Box
      sx={{
        marginBottom: "16px",
        display: "flex",
        flexDirection: "column",
        alignItems: you ? "end" : "start",
      }}
    >
      <Typography
        sx={{
          fontSize: "15px",
          backgroundColor: isAdmin ? "black" : you ? "#3268ab" : "#f5f8f9",
          width: "fit-content",
          color: isAdmin || you ? "white" : "#3268ab",
          padding: "6px 10px",
          borderRadius: "25px",
        }}
      >
        {isAdmin && t("admin_message")}
        {isAdmin && <br />}

        {message.text}
      </Typography>
      <Stack direction={"row"} alignItems="center">
        <Typography sx={{ fontSize: "11px", marginY: "5px", direction: "rtl" }}>
          {format(message.date.seconds * 1000)}
        </Typography>
      </Stack>
    </Box>
  );
}
