import { Avatar, Box, Typography, useTheme } from "@mui/material";

export default function ContactPerson({
  item,
  selectChat,
  active,
}) {
  const theme = useTheme();
  console.log(item);
  
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "space-around",
        gap: { xs: 5, sm: 10 },
        cursor: "pointer",
        backgroundColor: active ? theme.palette.action.selected : "transparent",
        p: 1,
        borderRadius: 1,
        transition: "background-color 0.2s ease",
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
        // width: "100%",
        // maxWidth: "100%",
      }}
      onClick={selectChat}
    >
      <Box sx={{
        display: "flex",
        alignItems: "center",
        gap: 1,
        color: "text.primary",
        fontSize: { xs: "0.75rem", sm: "0.8125rem" },
        fontWeight: 600,
      }}>
      <Avatar
        alt={item?.name}
        src={`${process.env.REACT_APP_API_KEY}images/${item?.image}`}
        sx={{ 
          width: { xs: 40, sm: 45 }, 
          height: { xs: 40, sm: 45 },
          bgcolor: theme.palette.primary.main
        }}
      />
      <Box sx={{ 
        minWidth: 0, // Prevent text overflow
        flex: 1 
      }}>
        <Typography 
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            color: active ? theme.palette.primary.main : "text.primary",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.name}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontSize: { xs: "0.75rem", sm: "0.8125rem" },
            color: "text.secondary",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {item.lastMessage?.text || " "}
        </Typography>
      </Box>
      </Box>
      <Box >
          {item.unreadCount === 0?" ":<Typography
          variant="body2"
          style={{
            backgroundColor:"red",
            width:"30px",
            height:"30px",
            borderRadius:"50%",
            color:"white",
            textAlign:"center",
            lineHeight:"30px",
          }}
        >{item.unreadCount}</Typography> }
      </Box>
    </Box>
  );
}