import { Box, Stack, Typography } from "@mui/material";
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export default function Message({ sender, message }) {
  const isImageFile = (url) => {
    return /\.(jpeg|jpg|gif|png|webp)$/i.test(url);
  };

  const isPDFFile = (url) => {
    return /\.(pdf)$/i.test(url);
  };

  const getFileName = (url) => {
    return url?.split('/').pop() || 'file';
  };

  const isValidHttpUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  };

  return (
    <Box
      sx={{
        marginBottom: "5px",
        display: "flex",
        flexDirection: "column",
        alignItems: sender ? "start" : "end",
        maxWidth: "100%",
      }}
    >
      {/* Text Message */}
      {message.message && (
        <Typography
          component={isValidHttpUrl(message.message) ? "a" : "p"}
          href={isValidHttpUrl(message.message) ? message.message : undefined}
          target={isValidHttpUrl(message.message) ? "_blank" : undefined}
          rel={isValidHttpUrl(message.message) ? "noopener noreferrer" : undefined}
          sx={{
            fontSize: "15px",
            backgroundColor: sender ? "#3268ab" : "#f5f8f9",
            width: "fit-content",
            color: sender ? "white" : "#3268ab",
            padding: "6px 10px",
            borderRadius: "25px",
            margin: "0 0 0.5rem",
            wordBreak: "break-word",
            textDecoration: isValidHttpUrl(message.message) ? "underline" : "none",
            cursor: isValidHttpUrl(message.message) ? "pointer" : "default"
          }}
        >
          {message.message}
        </Typography>
      )}

      {/* File Preview */}
      {message.fileUrl && (
        <Box
          sx={{
            backgroundColor: sender ? "#f0f4f8" : "#3268ab20",
            borderRadius: "12px",
            p: 1,
            mb: 0.5,
          }}
        >
          {isImageFile(message.fileUrl) ? (
            <img 
              src={`${process.env.REACT_APP_API_KEY}images/${message.fileUrl}`}
              alt="Sent file"
              style={{ 
                maxWidth: "200px", 
                maxHeight: "200px",
                borderRadius: "8px",
                objectFit: "cover"
              }}
            />
          ) : (
            <Stack 
              direction="row" 
              alignItems="center" 
              spacing={1}
              component="a"
              href={`${process.env.REACT_APP_API_KEY}images/${message.fileUrl}`}
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                textDecoration: "none",
                color: "inherit",
                cursor: "pointer",
              }}
            >
              {isPDFFile(message.fileUrl) ? (
                <PictureAsPdfIcon sx={{ color: sender ? "#3268ab" : "#607d8b" }} />
              ) : (
                <InsertDriveFileIcon sx={{ color: sender ? "#3268ab" : "#607d8b" }} />
              )}
              <Typography
                variant="body2"
                sx={{
                  color: sender ? "#3268ab" : "#607d8b",
                  maxWidth: "150px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {getFileName(message.fileUrl)}
              </Typography>
            </Stack>
          )}
        </Box>
      )}

      {/* Timestamp */}
      <Stack direction={"row"} alignItems="center">
        <Typography 
          sx={{ 
            fontSize: "11px", 
            marginY: "5px", 
            color: sender ? "#3268ab" : "#607d8b",
          }}
        >
          {new Date(message.createdAt).toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </Typography>
      </Stack>
    </Box>
  );
}
