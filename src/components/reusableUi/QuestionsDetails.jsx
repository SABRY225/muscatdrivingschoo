import React, { useState, useEffect } from 'react';
import {
  Dialog, DialogContent, DialogTitle, Button, Typography,
  AppBar, Toolbar, Slide, Box, Grid, CircularProgress
} from '@mui/material';
import { t } from 'i18next';
import Cookies from 'js-cookie';
import axios from 'axios';

// ==================== Dialog التفاصيل ====================
const QuestionDetails = ({ questions, DialogSatus, nameAR, nameEN, onClose }) => {
  const [open, setOpen] = useState(DialogSatus);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const lang = Cookies.get("i18next") || "en";

  const handleClose = () => {
    setOpen(false);
    onClose && onClose();
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));

    setFeedback(prev => ({
      ...prev,
      [questionId]: answer.isCorrectAnswer === 1 ? "True" : "False",
    }));
  };

  useEffect(() => {
    setOpen(DialogSatus);
  }, [DialogSatus]);

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      fullScreen
      onClose={handleClose}
    >
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {lang === "ar" ? nameAR : nameEN}
          </Typography>
          <Button color="inherit" onClick={handleClose}>
            {t("close")}
          </Button>
        </Toolbar>
      </AppBar>

      {questions.map((question) => (
        <React.Fragment key={question.id}>
          <DialogTitle>
            <Typography align="center" variant="h6">
              {lang === "ar" ? question.titleAR : question.titleEN}
            </Typography>
          </DialogTitle>

          <DialogContent>
            <Grid container spacing={2}>
              {question.answers.map((answer) => (
                <Grid item xs={12} sm={6} md={3} key={answer.id}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => handleAnswerSelect(question.id, answer)}
                  >
                    {lang === "ar" ? answer.titleAR : answer.titleEN}
                  </Button>
                </Grid>
              ))}
            </Grid>

            {selectedAnswers[question.id] && (
              <Box mt={4}>
                <Typography variant="subtitle1">
                  {t("selectedAnswer")}: {lang === "ar"
                    ? selectedAnswers[question.id].titleAR
                    : selectedAnswers[question.id].titleEN}
                </Typography>
                <Typography
                  variant="subtitle2"
                  color={feedback[question.id] === "True" ? "success.main" : "error.main"}
                >
                  {t("feedback")}: {t(feedback[question.id])}
                </Typography>
              </Box>
            )}
          </DialogContent>
        </React.Fragment>
      ))}
    </Dialog>
  );
};

// ==================== المكون الرئيسي ====================
const QuestionsDetails = ({ id, nameAR, nameEN }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [DialogStatus, setOpen] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await axios(`${process.env.REACT_APP_API_KEY}api/v1/student/getMyQuestions/${id}`);
        setQuestions(response.data.data);
      } catch {
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [id]);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;

  if (!questions.length) {
    return (
      <Typography variant="h6" align="center" sx={{ mt: 4, color: 'text.secondary' }}>
        {t("No questions available now")}
      </Typography>
    );
  }

  return (
    <>
      <Button
        variant="contained"
        size="small"
        sx={{ height: "50px" }}
        onClick={() => setOpen(true)}
      >
        {t("details")}
      </Button>

      <QuestionDetails
        questions={questions}
        DialogSatus={DialogStatus}
        nameAR={nameAR}
        nameEN={nameEN}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default QuestionsDetails;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
