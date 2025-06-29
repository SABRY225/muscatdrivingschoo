import { Button, Container, Grid, Paper } from "@mui/material";
import React from "react";
import Navbar from "../../components/Navbar";
import { useTeacherSession } from "../../hooks/useTeacherSession";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {collection, query,  where,  getDocs,  addDoc, Timestamp,} from "firebase/firestore";
import { db }               from "../../firebase";
import { useSelector }      from "react-redux";
import { useTranslation }   from "react-i18next";
import swal                 from "sweetalert";
import AboutSingleTeacher   from "../../components/client/singleTeacher/AboutSingleTeacher";
import AvailablitySingleTeacher from "../../components/client/singleTeacher/AvailablitySingleTeacher";
import HeaderSingleTeacher from "../../components/client/singleTeacher/HeaderSingleTeacher";
import ResumeSingleTeacher from "../../components/client/singleTeacher/ResumeSingleTeacher";
import StdeuntsTypeSingleTeacher from "../../components/client/singleTeacher/StdeuntsTypeSingleTeacher";
import RatingTeacher        from "../../components/client/singleTeacher/RatingTeacher";
import PayingTeacher        from "../../components/client/singleTeacher/PayingTeacher";
import LectureSingleTeacher from "../../components/client/singleTeacher/LectureSingleTeacher";
import PackageSingleTeacher from "../../components/client/singleTeacher/PackageSingleTeacher";
import TestSingleTeacher    from "../../components/client/singleTeacher/TestSingleTeacher";
import DiscountSingleTeacher from "../../components/client/singleTeacher/DiscountSingleTeacher";

export default function SingleTeacher() {
  const { id }              = useParams();
  const { currency }        = useSelector((state) => state.currency);
  const { data, isLoading } = useTeacherSession(id, currency);
  const { student }         = useSelector((state) => state.student);
  const { t } = useTranslation();
  
  const navigate = useNavigate();
    const handleCreateMessage = async () => {
    if (!student) {
      swal({ text: t("login_as_student"), icon: "error", button: t("ok") });
      return;
    }
    const addFrind=(async () => {
      await fetch(`${process.env.REACT_APP_API_KEY}api/v1/chat/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user1Id: student?.id, user1Type:"student", user2Id:id, user2Type:"teacher"
        })
      });
    })
    addFrind();
    navigate(`/student/messages`);
  };

  const handleRequestBook = async () => {
    if (!student) {
      swal({ text: t("login_as_student"), icon: "error", button: t("ok") });
      return;
    }
    navigate(`/book/${data?.data.id}`);
  };

  return (
    <Navbar>
      {isLoading ? (
        <Loading />
      ) : (

        <Container sx={{ marginBottom: "40px", marginTop: "80px" }}>
          <Grid container spacing={3}>
            <Grid item md={12} lg={8}>
              <HeaderSingleTeacher        teacher={data?.data} />
              <AboutSingleTeacher         teacher={data?.data} />
              <StdeuntsTypeSingleTeacher  teacher={data?.data} />
              <AvailablitySingleTeacher   teacher={data?.data} />
              <RatingTeacher              teacher={data?.data} />
              <PayingTeacher              teacher={data?.data} />
              <ResumeSingleTeacher        teacher={data?.data} />
              <LectureSingleTeacher       teacher={data?.data}  />
              <PackageSingleTeacher       teacher={data?.data}  />
              <TestSingleTeacher          teacher={data?.data}  />
              <DiscountSingleTeacher      teacher={data?.data}  />
            </Grid>
            <Grid item md={12} lg={4}>
              <Paper sx={{ padding: "24px 12px", marginY: "30px" }}>
                <Button
                  variant="contained"
                  color="secondary"
                  fullWidth
                  sx={{ textTransform: "capitalize", marginBottom: "16px" }}
                  onClick={handleRequestBook}
                >
                  {t("requestBook")}
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{ textTransform: "capitalize" }}
                  onClick={handleCreateMessage}
                >
                  {t("contactTeacher")}
                </Button>
              </Paper>
            </Grid>
          </Grid>
        </Container>
      )}
    </Navbar>
  );
}
