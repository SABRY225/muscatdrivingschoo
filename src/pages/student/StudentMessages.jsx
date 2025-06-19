import {Box,Divider,  Alert,Paper, Stack,Typography,styled, useTheme,} from "@mui/material";
import React, { useEffect, useRef } from "react";
import { useState } from "react";
import ContactPerson from "../../components/reusableUi/ContactPerson";
import Conversaition from "../../components/student/Conversaition";
import StudentLayout from "../../components/student/StudentLayout";
import {collection,query,onSnapshot, where, doc,orderBy,} from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import lgo from "../../images/messge.jpg";
import { Link } from "react-router-dom";

const Image = styled("img")({
  width: "160px",
});

export default function StudentMessages() {
  const [conversaition, setConversaition] = useState([]);
  const scroll = useRef();
  const { t } = useTranslation();
  const theme = useTheme();

  const { student } = useSelector((state) => state.student);

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("studentId", "==", `31`) // ${student.id}
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      let conv = [];
      querySnapshot.forEach((doc) => {
        conv.push({ ...doc.data(), id: doc.id });
      });

      console.log("All Data");
      console.log(conv);

      setConversaition(conv.sort((a, b) => b.lastmessage - a.lastmessage));
    });
    return () => unsubscribe();
  }, [student.id]);

  const [chatId, setChatId]     = useState(null);
  const [messages, setMessages] = useState(null);

  console.log(conversaition);
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
      <Stack direction={{ md: "row", xs: "column" }} gap="10px">
        <Box sx={{ width: { xs: "100%", md: "70%" } }}>
          {chatId ? (
            <>
              <Conversaition messages={messages} scroll={scroll} />
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
        </Box>
        <Box sx={{ width: { xs: "100%", md: "30%" } }}>
          <Paper sx={{ paddingY: "20px" }}>
            <Typography sx={{ paddingX: "20px" }}>{t("messages")}</Typography>
            <Divider sx={{ marginY: "10px" }} />
            <Box sx={{ paddingX: "20px" }}>
              {conversaition.length > 0 ?
                conversaition.map((item, index) => {
                  return (
                    <ContactPerson
                      item={item}
                      key={item.id + "k1"}
                      selectChat={() => setChatId(item.id)}
                      lastMessage={item.messages[item.messages.length - 1]}
                      active={item.id == chatId}
                    />
                  );
                })
              :<p class='notfound'> { t("notfound_person_message")}</p>
              }
            </Box>
          </Paper>
        </Box>
      </Stack>
    </StudentLayout>
  );
}
