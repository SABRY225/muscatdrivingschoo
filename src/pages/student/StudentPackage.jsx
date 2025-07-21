import React from 'react';
import StudentLayout from '../../components/student/StudentLayout';
import { useSelector } from 'react-redux';
import {
  Divider,
  styled,
  Typography,
  Box,
  Grid,
  Paper,
  Button
} from '@mui/material';
import { t } from 'i18next';
import Loading from '../../components/Loading';
// import PackageDetails from '../../components/reusableUi/PackageDetails';
import Cookies from "js-cookie";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Root = styled(Box)(({ theme }) => ({
  width: '100%',
  ...theme.typography.body2,
  color: theme.palette.text.secondary,
  '& > :not(style) ~ :not(style)': {
    marginTop: theme.spacing(4),
  },
}));

function StudentPackage() {
  const lang = Cookies.get("i18next") || "en";
  const { student } = useSelector(state => state.student);
  const [data, setData] = React.useState(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    (async () => {
      const res = await axios(`${process.env.REACT_APP_API_KEY}api/v1/student/packages/${student.id}`);
      setData(res.data.data);
    })();
  }, [student.id]);

  if (data === null) return <Loading />;
  
  const handelPakage =(pkg)=>{
    localStorage.setItem('package',JSON.stringify(pkg))
    navigate('/student/package/single-package')
  }
  if (!data.length) {
    return (
      <StudentLayout>
        <Typography
          sx={{
            fontSize: "25px",
            textAlign: "center",
            marginTop: "3rem",
            color: "#808b96",
          }}
        >
          {t("noPackage")}
        </Typography>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <Root>
        {data.map((pkg, index) => (
          <Box key={index} component={Paper} sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h6">
                  {t("package")}:
                  {lang === "ar" ? ` ${pkg.titleAR}` : ` ${pkg.titleEN}`}
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {t("Description")}:
                  {lang === "ar" ? ` ${pkg.descriptionAr}` : ` ${pkg.descriptionEn}`}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Button variant="contained" size="small" sx={{ height: "50px" }} onClick={()=>handelPakage(pkg)}>
                    {t("details")}
                </Button>
              </Grid>
            </Grid>
            <Divider sx={{ mt: 3 }} />
          </Box>
        ))}
      </Root>
    </StudentLayout>
  );
}

export default StudentPackage;
