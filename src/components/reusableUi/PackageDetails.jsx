import {
  AppBar,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  Toolbar,
  Typography,
  Box,
  Grid,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { t } from 'i18next';
import Cookies from 'js-cookie';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function PackageDetails({ data, teacherButton }) {
  console.log(data);
  
  const [open, setOpen] = useState(false);
  const { currency } = useSelector((state) => state.currency);
  const lang = Cookies.get('i18next') || 'en';
  const navigate = useNavigate();

  const image = data?.image ? `${process.env.REACT_APP_API_KEY}images/${data.image}` : '/logo.png';

  const handleClose = () => setOpen(false);
  const convertDate = (dateString) => new Date(dateString).toISOString().split('T')[0];
  if (!data) return <div>{t("loading")}...</div>;
 
  return (
    <>
      <Button variant="contained" size="small" sx={{ height: "50px" }} onClick={() => setOpen(true)}>
        {t("details")}
      </Button>
      <Dialog open={open} TransitionComponent={Transition} fullScreen onClose={handleClose}>
        <AppBar sx={{ position: 'relative' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
              {t("package")}
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              {t("close")}
            </Button>
          </Toolbar>
        </AppBar>

        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Box component="img" src={image} alt="package" sx={{ height: 200, width: 300, boxShadow: 3 }} />
          </Box>
          <Typography sx={{ textAlign: 'center', mt: 2 }} variant="h6">
            {`${t("package")}: ${lang === "ar" ? data?.titleAR : data?.titleEN}`}
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Typography sx={{ mb: 3 }} variant="body1">
            {`${t("Description")}: ${lang === "ar" ? data?.descriptionAr : data?.descriptionEn}`}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="h6">{`${t("level")}: ${lang === "ar" ? data?.level?.titleAR : data?.level?.titleEN}`}</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6">{`${t("classes")}: ${data?.classId?(lang === "ar" ? data?.classId?.titleAR : data?.classId?.titleEN):""}`}</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6">{`${t("semester")}: ${t(data?.semester)}`}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6">{`${t("studyCurriculum")}: ${data?.curriculums?(lang === "ar" ? data?.curriculums?.titleAR : data?.curriculums?.titleEN):""}`}</Typography>
            </Grid>

            {data?.docs && (
              <Grid item xs={12} md={6}>
                <Typography variant="h6">
                  {`${t("Package documents")}: `}
                  <Button
                    variant="contained"
                    component={Link}
                    to={`${process.env.REACT_APP_API_KEY}images/${data?.docs}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("Package documents")}
                  </Button>
                </Typography>
              </Grid>
            )}

            {data?.linkPackage && (
              <Grid item xs={12} md={6}>
                <Typography variant="h6">
                  {`${t("Link Package")}: `}
                  <Button
                    variant="contained"
                    component={Link}
                    to={data?.linkPackage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {t("Link Package")}
                  </Button>
                </Typography>
              </Grid>
            )}

            <Grid item xs={12} md={6}>
              <Typography variant="h6">{`${t("sharesCount")}: ${data?.numTotalLesson} ${t("shares")}`}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6">{`${t("sharesCountInWeek")}: ${data?.numWeekLesson} ${t("shares")}`}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6">{`${t("sharePrice")}: ${(data?.price)/data?.numTotalLesson}`}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="h6">{`${t("sharesTotal")}: ${(data?.price)}`}</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6">{`${t("currency")}: ${t(currency)}`}</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6">{`${t("package_duration")}: ${data?.duration} ${t("hour")}`}</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6">{`${t("startDate")}: ${convertDate(data?.startDate)}`}</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Typography variant="h6">{`${t("endDate")}: ${convertDate(data?.endDate)}`}</Typography>
            </Grid>
          </Grid>
        </DialogContent>

        {teacherButton && (
          <DialogActions sx={{ justifyContent: "center", mb: 3 }}>
            <Button
              variant="contained"
              sx={{ width: "300px" }}
              onClick={() => navigate("/teacher/" + data?.TeacherId)}
            >
              {t("teacher")}
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}

export default PackageDetails;
