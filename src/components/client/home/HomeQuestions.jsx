import { Box, Container, Typography } from "@mui/material";
import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";

export default function HomeQuestions() {
  const { t } = useTranslation();
  const questions = [
    {
      question: t("q1"),
      answer: t("q1_a"),
    },
    {
      question: t("q2"),
      answer: t("q2_a"),
    },
    {
      question: t("q3"),
      answer: t("q3_a"),
    },
    {
      question: t("q4"),
      answer: t("q4_a"),
    },
    // {
    //     question:t('q5'),
    //     answer:t('q5_a')
    // }
  ];
  return (
    <Box>
      <Container sx={{ marginY: "60px" }}>
      <div className='contain_title'>
      
      </div>
        <Typography
          sx={{
            fontSize: { md: "26px", xs: "22px" },
            fontWeight: "700",
            color: "#D10909",
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          {t("questions")}
        </Typography>
        {questions.map((item, index) => {
          return (
            <Accordion key={index + "kj1"} sx={{ marginBottom: "12px" }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>{item.question}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography sx={{ fontSize: "14px" }}>{item.answer}</Typography>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Container>
    </Box>
  );
}
