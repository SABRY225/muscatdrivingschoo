import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useTranslation } from "react-i18next";
import {Box,Container,Divider,Grid,Paper,styled,Typography,} from "@mui/material";
import Conversaition from "../../components/student/Conversaition";
import { collection, query, onSnapshot, where, doc } from "firebase/firestore";
import { db }         from "../../firebase";
import ContactPersonTeacher from "../../components/reusableUi/ContactPersonTeacher";
import lgo                from "../../images/messge.jpg";
import ContactPerson      from "../../components/reusableUi/ContactPerson";
import ContactTwoPersons  from "../../components/reusableUi/ContactTwoPersons";

const Image = styled("img")({
  width: "160px",
});

export default function AdminMessages() {
  const { t } = useTranslation();
  const [conversations, setConversations] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState(null);

  // Query List of Conversations
  useEffect(() => {
    const q = query(collection(db, "chats"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let temp = [];
      querySnapshot.forEach((doc) => {
        temp.push({ ...doc.data(), id: doc.id });
      });
      setConversations(temp.sort((a, b) => b.lastmessage - a.lastmessage));
    });
    return () => unsubscribe();
  }, []);

  // Query List of Messages
  useEffect(() => {
    if (chatId) {
      const unSub = onSnapshot(doc(db, "chats", chatId), (doc) => {
        doc.exists() && setMessages({ ...doc.data(), id: doc.id });
      });
      return () => {
        unSub();
      };
    }
  }, [chatId]);

  console.log(messages);

  return (
    <AdminLayout>
      <Container
        sx={{ marginBottom: "50px", marginTop: "30px", overflow: "hidden" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12} lg={4}>
            <Box>
              <Paper sx={{ paddingY: "20px" }}>
                <Typography sx={{ paddingX: "20px" }}>
                  {t("messages")}
                </Typography>
                <Divider sx={{ marginY: "10px" }} />
                <Box
                  sx={{
                    paddingX: "20px",
                    height: "500px",
                    overflowY: "scroll",
                  }}
                >
                  {conversations.length > 0 ? (
                    conversations.map((item, index) => {
                      return (
                        <ContactTwoPersons
                          item={item}
                          key={index + "k1"}
                          selectChat={() => setChatId(item.id)}
                          lastMessage={item.messages[item.messages.length - 1]}
                          active={item.id == chatId}
                        />
                      );
                    })
                  ) : (
                    <Typography>{t("loading_conversations")} .....</Typography>
                  )}
                </Box>
              </Paper>
            </Box>
          </Grid>
          <Grid item xs={12} lg={8}>
            {chatId ? (
              <>
                <Conversaition messages={messages} />
              </>
            ) : (
              <Paper
                sx={{
                  height: "400px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "column",
                }}
              >
                <Image src={lgo} alt="" />
                <Typography
                  sx={{ fontWeight: 600, marginTop: "12px", fontSize: "22px" }}
                >
                  {t("start_message")}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </AdminLayout>
  );
}
