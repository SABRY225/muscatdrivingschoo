import { Avatar, Box, Container, Paper, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAdminLessons } from "../../hooks/useAdminLessons";
import AdminLayout from "../../components/admin/AdminLayout";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PhoneEnabledIcon from "@mui/icons-material/PhoneEnabled";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import Moment from "moment";

function SingleBookedLesson() {
  const { bookedLessonId } = useParams();
  const { token } = useSelector((state) => state.admin);
  const { t } = useTranslation();
  const lang = Cookies.get("i18next") || "en";
  const { data, isLoading } = useAdminLessons(token);
  const [bookedLesson, setBookedLesson] = useState([]);
  useEffect(() => {
    if (data) {
      setBookedLesson(data.data.filter((i) => `${i.id}` === bookedLessonId)[0]);
      console.log(data);
    }
  }, [data, bookedLessonId]);

  console.log(bookedLesson?.startedAt);
  console.log(new Date(+bookedLesson?.startedAt));
  return (
    <AdminLayout>
      {!isLoading ? (
        <>
          {bookedLesson ? (
            <>
              {/* teacher details section */}
              <Paper sx={{ padding: "1.5rem" }}>
                <Typography variant="h4">{t("aboutTeacher")}</Typography>
                <Box
                  sx={{ marginTop: "30px", display: "flex", columnGap: "20px" }}
                >
                  <Avatar
                    src={`${process.env.REACT_APP_API_KEY}images/${bookedLesson?.Teacher?.image}`}
                    sx={{ width: "141px", height: "141px" }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "20px",
                        marginBottom: "8px",
                        fontWeight: "700",
                      }}
                    >
                      {bookedLesson?.Teacher?.firstName +
                        " " +
                        bookedLesson?.Teacher?.lastName}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "4px",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <SpeakerNotesIcon
                        sx={{ fontSize: "16px", color: "#d5d5d5" }}
                      />
                      <Typography
                        sx={{
                          color: "#4f4f51",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {t("certifiedTeacher")}:{" "}
                      </Typography>
                      <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                        {bookedLesson?.Teacher?.experienceYears}{" "}
                        {t("yearsofexperience")}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "4px",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <LocationOnIcon
                        sx={{ fontSize: "16px", color: "#d5d5d5" }}
                      />
                      <Typography
                        sx={{
                          color: "#4f4f51",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {t("location")}:{" "}
                      </Typography>
                      <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                        {bookedLesson?.Teacher?.city +
                          " , " +
                          bookedLesson?.Teacher?.country}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "4px",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <PhoneEnabledIcon
                        sx={{ fontSize: "16px", color: "#d5d5d5" }}
                      />
                      <Typography
                        sx={{
                          color: "#4f4f51",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {t("phone")}:{" "}
                      </Typography>
                      <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                        {bookedLesson?.Teacher?.phone}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "4px",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <AlternateEmailIcon
                        sx={{ fontSize: "16px", color: "#d5d5d5" }}
                      />
                      <Typography
                        sx={{
                          color: "#4f4f51",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {t("email")}:{" "}
                      </Typography>
                      <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                        {bookedLesson?.Teacher?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
              {/*   student details section */}
              <Paper sx={{ padding: "1.5rem", marginY: "1rem" }}>
                <Typography variant="h4">{t("aboutStudent")}</Typography>
                <Box
                  sx={{ marginTop: "30px", display: "flex", columnGap: "20px" }}
                >
                  <Avatar
                    src={`${process.env.REACT_APP_API_KEY}images/${bookedLesson?.Student?.image}`}
                    sx={{ width: "141px", height: "141px" }}
                  />
                  <Box>
                    <Typography
                      sx={{
                        fontSize: "20px",
                        marginBottom: "8px",
                        fontWeight: "700",
                      }}
                    >
                      {bookedLesson?.Student?.name}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "4px",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <LocationOnIcon
                        sx={{ fontSize: "16px", color: "#d5d5d5" }}
                      />
                      <Typography
                        sx={{
                          color: "#4f4f51",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {t("location")}:{" "}
                      </Typography>
                      <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                        {bookedLesson?.Student?.city +
                          " , " +
                          bookedLesson?.Student?.nationality}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "4px",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <PhoneEnabledIcon
                        sx={{ fontSize: "16px", color: "#d5d5d5" }}
                      />
                      <Typography
                        sx={{
                          color: "#4f4f51",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {t("phone")}:{" "}
                      </Typography>
                      <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                        {bookedLesson?.Student?.phoneNumber}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        columnGap: "4px",
                        alignItems: "center",
                        marginBottom: "8px",
                      }}
                    >
                      <AlternateEmailIcon
                        sx={{ fontSize: "16px", color: "#d5d5d5" }}
                      />
                      <Typography
                        sx={{
                          color: "#4f4f51",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {t("email")}:{" "}
                      </Typography>
                      <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                        {bookedLesson?.Student?.email}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Paper>
              {/* Session details section */}
              <Paper sx={{ padding: "1.5rem" }}>
                <Typography variant="h4">{t("aboutSession")}</Typography>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                    marginY: "12px",
                    marginX: "6px",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#4f4f51",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {t("bookingDate")}:{" "}
                    </Typography>
                    <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                      {Moment(bookedLesson.createdAt).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#4f4f51",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {t("bookedLessonDate")}:{" "}
                    </Typography>
                    <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                      {Moment(bookedLesson.date).format(
                        "MMMM Do YYYY, h:mm:ss a"
                      )}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#4f4f51",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {t("lessonTitle")}:{" "}
                    </Typography>
                    <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                      {bookedLesson?.title}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#4f4f51",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {t("where")}:{" "}
                    </Typography>
                    <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                      {t(bookedLesson?.type + "_place")}
                    </Typography>
                  </Box>
                  {/* -------------------------------- */}
                  {bookedLesson?.startedAt && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#4f4f51",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {t("lesson_starting_at")}:{" "}
                      </Typography>
                      <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                        {Moment(new Date(+bookedLesson?.startedAt)).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </Typography>
                    </Box>
                  )}
                  {bookedLesson?.endedAt && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#4f4f51",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {t("lesson_ending_at")}:{" "}
                      </Typography>
                      <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                        {Moment(new Date(+bookedLesson?.endedAt)).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </Typography>
                    </Box>
                  )}
                  {bookedLesson?.startedAt && bookedLesson?.endedAt && (
                    <Box
                      sx={{
                        display: "flex",
                        gap: "8px",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "#4f4f51",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {t("lesson_calculated_length")}:{" "}
                      </Typography>
                      <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                        {Moment(new Date(+bookedLesson)?.endedAt).diff(
                          new Date(+bookedLesson?.startedAt),
                          "h"
                        ) > 0 &&
                          Moment(new Date(+bookedLesson?.endedAt)).diff(
                            new Date(+bookedLesson?.startedAt),
                            "h"
                          ) +
                            " " +
                            t("hour")}
                        {" , "}
                        {Moment(new Date(+bookedLesson?.endedAt)).diff(
                          new Date(+bookedLesson?.startedAt),
                          "m"
                        ) %
                          60 >
                          0 &&
                          (Moment(new Date(+bookedLesson?.endedAt)).diff(
                            new Date(+bookedLesson?.startedAt),
                            "m"
                          ) %
                            60) +
                            " " +
                            t("minute")}
                      </Typography>
                    </Box>
                  )}
                  {/* -------------------------------- */}
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#4f4f51",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {t("period")}:{" "}
                    </Typography>
                    <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                      {bookedLesson.period}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#4f4f51",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {t("lessonPrice")}:{" "}
                    </Typography>
                    <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                      {bookedLesson?.price}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#4f4f51",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {t("totlalessonPrice")}:{" "}
                    </Typography>
                    <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                      {bookedLesson?.totalPrice}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#4f4f51",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {t("currency")}:{" "}
                    </Typography>
                    <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                      {bookedLesson?.currency}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#4f4f51",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {t("payment")}:{" "}
                    </Typography>
                    <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                      {t(bookedLesson?.typeOfPayment)}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#4f4f51",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {t("confirmTeacher")}:{" "}
                    </Typography>
                    <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                      {bookedLesson?.teacherAccept
                        ? t("confirmed")
                        : t("pending")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#4f4f51",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {t("confirmStudent")}:{" "}
                    </Typography>
                    <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                      {bookedLesson?.studentAccept
                        ? t("confirmed")
                        : t("pending")}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#4f4f51",
                        fontSize: "14px",
                        fontWeight: "bold",
                      }}
                    >
                      {t("payed")}:{" "}
                    </Typography>
                    <Typography sx={{ color: "#616161", fontSize: "14px" }}>
                      {bookedLesson?.isPaid ? t("confirmed") : t("pending")}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </>
          ) : (
            <Paper sx={{ padding: "2rem" }}>
              <Typography variant="h2">
                {t("invalid_session") + bookedLessonId}
              </Typography>
            </Paper>
          )}
        </>
      ) : (
        <Loading />
      )}
      {/* </Container> */}
    </AdminLayout>
  );
}

export default SingleBookedLesson;
