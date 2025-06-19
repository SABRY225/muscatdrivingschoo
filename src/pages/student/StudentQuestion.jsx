import React, { useEffect, useState } from 'react';
import StudentLayout from '../../components/student/StudentLayout';
import { useSelector } from 'react-redux';
import { Divider, styled, Grid, Typography, Box } from '@mui/material';
import { t } from 'i18next';
import Cookies from "js-cookie";
import QuestionsDetails from '../../components/reusableUi/QuestionsDetails';
import axios from 'axios';

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  '& > :not(style) ~ :not(style)': {
    marginTop: theme.spacing(2),
  },
}));

function StudentQuestion() {
  const lang = Cookies.get("i18next") || "en";
  const { student } = useSelector(state => state.student);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios(`${process.env.REACT_APP_API_KEY}api/v1/student/getLecturesWithQuestions/${student.id}`);
        setData(res.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [student.id]);

  if (data === null) {
    return (
      <StudentLayout>
        <Box sx={{ mt: 10, textAlign: 'center' }}>
          <Typography variant="h5" color="primary">
            {t("Currently unavailable Questions")}
          </Typography>
        </Box>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <Root>
        {data.map((item) => (
          <React.Fragment key={item.Id}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h6">
                  {lang === "ar" ? item.nameAR : item.nameEN}
                </Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <QuestionsDetails id={item.Id} nameEN={item.nameEN} nameAR={item.nameAR} />
              </Grid>
            </Grid>
            <Divider sx={{ my: 2 }} />
          </React.Fragment>
        ))}
      </Root>
    </StudentLayout>
  );
}

export default StudentQuestion;
