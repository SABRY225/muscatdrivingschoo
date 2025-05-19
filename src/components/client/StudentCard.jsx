import { Avatar, Box, Button, Grid, Paper, Typography } from "@mui/material";
import Cookies from "js-cookie";
import ReactCountryFlag from "react-country-flag";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useSelector } from "react-redux";

function StudentCard({ student }) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const lang = Cookies.get("i18next") || "en";
  const { teacher } = useSelector((state) => state.teacher);

  const handleContact = async () => {
    const q = query(
      collection(db, "chats"),
      where("studentId", "==", `${student.id}`),
      where("teacherId", "==", `${teacher.id}`)
    );
    const res = await getDocs(q);
    if (res.empty) {
      const time = Timestamp.now();
      await addDoc(collection(db, "chats"), {
        messages: [],
        teacherId: `${teacher.id}`,
        studentId: `${student.id}`,
        studentName: student.name,
        studentImage: student.image,
        teacherName: `${teacher.firstName} ${teacher.lastName}`,
        teacherImage: teacher.image,
        lastmessage: time,
      });
    }
    navigate(`/teacher/messages`);
  };

  return (
    <Paper sx={{ paddingX: "24px", marginY: "20px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} lg={2}>
          <Avatar
            src={`${process.env.REACT_APP_API_KEY}images/${student?.image}`}
            variant="square"
            sx={{
              width: "60%",
              height: "60%",
              fontSize: "30px",
            }}
            alt={student?.name}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ display: "flex", columnGap: "6px", alignItems: "start" }}>
            <Typography
              sx={{ fontSize: "18px", marginBottom: "8px", fontWeight: "700" }}
            >
              {student.name}
            </Typography>
            {student.location && (
              <Box>
                <ReactCountryFlag
                  style={{
                    width: "1.5em",
                    height: "2em",
                    display: "flex",
                    alignItems: "start",
                    marginTop: "-2px",
                  }}
                  countryCode={student.location}
                  svg
                />
              </Box>
            )}
          </Box>
          <Box
            sx={{
              display: "flex",
              columnGap: "4px",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <SpeakerNotesIcon sx={{ fontSize: "16px", color: "#d5d5d5" }} />
            <Typography
              sx={{ color: "#4f4f51", fontSize: "14px", fontWeight: "bold" }}
            >
              {t("location")}:{" "}
            </Typography>
            <Typography sx={{ color: "#616161", fontSize: "14px" }}>
              {student.city}
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} lg={3}>
          <Button
            variant="outlined"
            fullWidth
            onClick={handleContact}
            sx={{ marginTop: "16px", textTransform: "capitalize" }}
          >
            {t("contactStudent")}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default StudentCard;
