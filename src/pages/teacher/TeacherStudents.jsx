import { Container, Paper, Typography } from "@mui/material";
import Navbar from "../../components/Navbar";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { useMyStudents } from "../../hooks/useMyStudents";
import Loading from "../../components/Loading";
import StudentCard from "../../components/client/StudentCard";

function TeacherStudents() {
  const { t } = useTranslation();
  const { teacher, token } = useSelector((state) => state.teacher);
  const students = useMyStudents(teacher.id, token);
  console.log(students);
  return (
    <Navbar>
      <Container sx={{ marginY: "120px" }}>
        <Paper sx={{ padding: "40px 20px" }}>
          <Typography
            sx={{
              fontSize: "24px",
              marginTop: "12px",
              fontWeight: "600",
              marginBottom: "30px",
            }}
          >
            {t("my_students")}
          </Typography>
          {students.isLoading ? (
            <Loading />
          ) : (
            <>
              {students.data.data.length > 0 &&
                students.data.data.map((student) => {
                  return (
                    <StudentCard key={student.id + ",ekm"} student={student} />
                  );
                })}
              {students.data.data.length === 0 && (
                <Paper sx={{ padding: "16px" }}>
                  <Typography variant="h6">{t("my_students_empty")}</Typography>
                </Paper>
              )}
            </>
          )}
        </Paper>
      </Container>
    </Navbar>
  );
}

export default TeacherStudents;
