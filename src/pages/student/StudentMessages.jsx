import {Box,Divider,  Alert,Paper, Stack,Typography,styled, useTheme,} from "@mui/material";
import React, { useEffect } from "react";
import { useState } from "react";
import ContactPerson from "../../components/reusableUi/ContactPerson";
import Conversaition from "../../components/student/Conversaition";
import StudentLayout from "../../components/student/StudentLayout";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import lgo from "../../images/messge.jpg";
import { Link } from "react-router-dom";
import axios from "axios";

const Image = styled("img")({
  width: "60%",
  maxWidth: 160,
  height: "auto",
});

export default function StudentMessages() {
  const theme = useTheme();
  const [conversation, setConversation] = useState([]);
  const [chat, setChatId] = useState(null);
  const { t } = useTranslation();
  const { student } = useSelector((state) => state.student);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_KEY}api/v1/chat/friends/${student.id}`
        );
        setConversation(res?.data?.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFriends();
    const interval = setInterval(fetchFriends, 3000); // تحديث البيانات كل 3 ثوانٍ

    return () => clearInterval(interval); // تنظيف التايمر عند تفكيك المكون
  
  },[student.id,t]);

  return (
    <StudentLayout>
        <Stack spacing={2} mb={3}>
          <Alert severity="warning" sx={{ width: '100%' }}>
            {t("In order to maintain your rights, do not communicate with anyone outside the site")}
          </Alert>
          
          <Alert severity="warning" sx={{ width: '100%' }}>
            {t("Beware of fraud and do not transfer any amounts to the user outside the Muscat Driving Learning Platform. ")}{" "}
            <Link to="/student/technical-support" style={{ 
              color: theme.palette.primary.main,
              marginLeft: theme.spacing(1),
              textDecoration: 'none'
            }}>
              {t("Report any suspicious requests directly to us")}
            </Link>
          </Alert>
        </Stack>
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
              <Conversaition chat={chat} />
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
    </StudentLayout>
  );
}
