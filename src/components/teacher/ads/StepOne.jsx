import { useState } from "react";
import AdsStepper               from "../../../components/guest/AdsStepper";
import { useForm }  from "react-hook-form";
import { Container, Grid,  Paper} from "@mui/material";
import StepperButtonsGuest      from "../../../components/reusableUi/StepperButtonsGuest";
import CheckBoxCategories       from "../../../components/guest/CheckBoxCategories";
import Navbar                   from "../../../components/Navbar";
import { useTranslation } from "react-i18next";
import { useSelector }    from "react-redux";
import { useNavigate }    from "react-router-dom";
import { useSnackbar }    from "notistack";


export default function StepOne() {
  const { t }                     = useTranslation();
  const [checked, setChecked]     = useState([]);
  const {teacher, token}            = useSelector((state) => state.teacher);
  const [load, setLoad]           = useState(false);
  const navigate                  = useNavigate();
  const { closeSnackbar, enqueueSnackbar} = useSnackbar();


  const {
     formState: { errors },  handleSubmit,
  } = useForm({
    defaultValues: {
    },
  });


  const onSubmit = async () => {
    setLoad(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/teacher/ads-step-one/${teacher.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
          body: JSON.stringify({
            AdsDepartmentId      : checked,
            advertiserPhone      : teacher?.phone,
          }),
        }
      );
      const resData = await response.json();
      console.log("response: ", resData);
      console.log(resData.data);
      setLoad(false);
      if (resData.status !== 200 && resData.status !== 201) {
        console.log("some error Occurred, response is: ", resData);
        throw new Error("");
      } else {
        enqueueSnackbar(t("update_success"), {
          variant: "success",
          autoHideDuration: 1000,
        });
        navigate("/teacher/create-ads/step2/" + resData.data.id);
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Navbar>
      <AdsStepper title={t("AdsDepartment")} active={0}></AdsStepper>
      <Container sx={{ marginTop: "40px", marginBottom: "60px" }}>
        <Grid container spacing={2}>
        <Grid item xs={12} lg={12}>
        <Paper sx={{padding:"40px 20px" ,  marginTop:"0px"}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CheckBoxCategories  checked={checked} setChecked={setChecked} />
          <StepperButtonsGuest load={load} skipLink="step2" />
        </form>
        </Paper>
        </Grid>
        </Grid>
      </Container>
    </Navbar>
  );
}
