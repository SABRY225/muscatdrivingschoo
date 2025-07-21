import React, { useEffect, useState,useRef } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import StudentLayout from "../../components/student/StudentLayout";

const getYoutubeVideoId = (url) => {
  const regExp = /^.*(youtu.be\/|v\/|\/u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
};
function CustomYouTubePlayer({ videoId }) {
    const playerRef = useRef(null);

    useEffect(() => {
      // تحميل سكريبت YouTube IFrame API إذا لم يكن موجودًا
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);
      }
      const loadPlayer = () => {
        if (window.YT && window.YT.Player) {
          playerRef.current = new window.YT.Player("yt-player", {
            videoId,
            events: {
              onReady: (event) => {
                event.target.playVideo();
              },
              onStateChange: (event) => {
                if (event.data === window.YT.PlayerState.ENDED) {
                  console.log("الفيديو انتهى");
                }
              }
            },
            playerVars: {
              autoplay: 0,
              // controls: 0,
              modestbranding: 1,
              rel: 0,
              fs: 0,
              disablekb: 1,
              iv_load_policy: 3,
              playsinline: 1
            }
          });
        } else {
          // Retry if API isn't ready yet
          setTimeout(loadPlayer, 100);
        }
      };
      loadPlayer();
    }, [videoId]);

    return <div id="yt-player" style={{ width: "100%", height: "600px" }} />;
  }
  
function StudentViewLecture() {
  const [loading, setLoading] = useState(true);
  const [videoUrl, setVideoUrl] = useState("");
  const [lectureName, setLectureName] = useState("");

  useEffect(() => {
    // جلب الفيديو من localStorage (يفترض أنه تم تخزينه مسبقًا)
    const storedVideoUrl = localStorage.getItem("lectureVideo");
    const storedLectureName = localStorage.getItem("lectureNameAR");
 console.log(storedVideoUrl);
 
    if (storedVideoUrl) {
      setVideoUrl(storedVideoUrl);
    }
    if (storedLectureName) {
      setLectureName(storedLectureName);
    }

    setLoading(false);
  }, []);

  const videoId = getYoutubeVideoId(videoUrl);

  if (loading) {
    return (
      <StudentLayout>
        <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#f7f7fa">
          <CircularProgress color="warning" size={60} thickness={5} />
        </Box>
      </StudentLayout>
    );
  }

  if (!videoId) {
    return (
      <StudentLayout>
        <Box textAlign="center" mt={8} bgcolor="#fff3e0" p={4} borderRadius={3} boxShadow={2} mx="auto" maxWidth={500}>
          <Typography color="error" fontSize={22} fontWeight={700} mb={2}>رابط الفيديو غير صالح</Typography>
          <Typography color="textSecondary">يرجى مراجعة إدارة المدرسة أو التأكد من صحة الرابط.</Typography>
        </Box>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <Box minHeight="100vh" bgcolor="#f7f7fa" py={6} px={{ xs: 1, md: 0 }}>
        <Box maxWidth={700} mx="auto" boxShadow={4} borderRadius={4} bgcolor="#fff" p={{ xs: 2, md: 4 }}>
          <Typography
            variant="h4"
            color="warning.main"
            fontWeight={700}
            textAlign="center"
            mb={3}
            sx={{ letterSpacing: 1 }}
          >
            {lectureName}
          </Typography>
          <Box mb={0}>
            <CustomYouTubePlayer videoId={videoId} />
          </Box>
        </Box>
      </Box>
    </StudentLayout>
  );
}

export default StudentViewLecture;

