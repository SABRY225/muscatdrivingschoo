import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Box,
  Divider,
  Paper,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useSelector } from "react-redux";
import lgo from "../../images/messge.jpg";
import TeacherLayout from "../../components/teacher/TeacherLayout";
import ContactPerson from "../../components/reusableUi/ContactPerson";
import ConversaitionTeacher from "../../components/teacher/ConversaitionTeacher";
import axios from "axios";

const Image = styled("img")({
  width: "60%",
  maxWidth: 160,
  height: "auto",
});

export default function TeacherMessages() {
   const { t } = useTranslation();
  const [conversation, setConversaition] = useState([]);
  const { teacher } = useSelector((state) => state.teacher);
  const [chat, setChatId] = useState(null);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_KEY}api/v1/chat/friends/${teacher.id}`
        );
        setConversaition(res?.data?.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFriends();
    const interval = setInterval(fetchFriends, 3000); // تحديث البيانات كل 3 ثوانٍ
    
    return () => clearInterval(interval); // تنظيف التايمر عند تفكيك المكون
      
  }, [teacher.id]);


  return (
      <TeacherLayout>
      <Box sx={{ px: { xs: 1, sm: 2 }, py: 10,mt:5 }}>
        <Stack 
          direction={{ xs: 'column', md: 'row' }} 
          spacing={2}
          sx={{
            height: { md: 'calc(100vh - 240px)' },
            minHeight: 500
          }}
        >
          {/* Contacts List */}
          <Paper sx={{ 
            width: { xs: '100%', md: 320 },
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{ p: 2 }}>
              <Typography variant="h6">{t("Messages")}</Typography>
            </Box>
            <Divider />
            <Box sx={{ 
              flex: 1,
              overflowY: 'auto',
              p: 1
            }}>
              {conversation.map((item) => (
                <ContactPerson
                  key={item.id}
                  item={item}
                  selectChat={() => setChatId(item)}
                  active={item.id === chat?.id}
                />
              ))}
            </Box>
          </Paper>

          {/* Chat Container */}
          <Paper sx={{ 
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minWidth: 0, // Fix flexbox overflow issue
          }}>
            {chat ? (
              <ConversaitionTeacher chat={chat} />
            ) : (
              <Box
                sx={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  p: 3,
                  textAlign: 'center'
                }}
              >
                <Image 
                  src={lgo} 
                  alt={t("Start conversation")}
                  sx={{
                    width: { xs: '80%', sm: '60%', md: '40%' },
                    mb: 3
                  }}
                />
                <Typography 
                  variant="h5"
                  sx={{
                    fontSize: { xs: '1.2rem', sm: '1.5rem' },
                    fontWeight: 600,
                    color: 'text.secondary'
                  }}
                >
                  {t("start_message")}
                </Typography>
              </Box>
            )}
          </Paper>
        </Stack>
      </Box>
      </TeacherLayout>
  );
}
