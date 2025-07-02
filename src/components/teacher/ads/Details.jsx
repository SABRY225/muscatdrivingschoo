import Navbar               from "../../../components/Navbar";
import { Paper  , Container, Grid} from "@mui/material";
import { useTranslation } from "react-i18next";
import {useParams }  from "react-router-dom";
import AdsImages              from "./AdsImages";
import currencies             from "../../../data/currencies";
import Cookies                from 'js-cookie';
import { useAdsSingleTeacher } from "../../../hooks/useAdsSingleTeacher";

export default function Details() {
  const lang = Cookies.get("i18next") || "en";
  const { AdsId }         = useParams();
  const { data }          = useAdsSingleTeacher(AdsId);



  let current_currency = "";
  current_currency = currencies.find((e) => e.title == data?.data?.currency);
  console.log(data);
  
  const { t } = useTranslation();
  return (
    <Navbar>
      <Container sx={{ marginTop: "120px", marginBottom: "60px" }}>
      <Grid container spacing={2}>
      <Grid item xs={12} lg={12}>
      <Paper sx={{padding:"40px 20px"}}>
      <table className="table_student">
            <tr>
              <td><h4> {t("titleAR")} </h4></td>
              <td> <p>{data?.data?.titleAR}</p></td>
            </tr>
            <tr>
              <td><h4> {t("titleEN")} </h4></td>
              <td> <p>{data?.data?.titleEN}</p></td>
            </tr>
            <tr>
              <td><h4> {t("descriptionAR")} </h4></td>
              <td> <p>{data?.data?.descriptionAR}</p></td>
            </tr>
            <tr>
              <td><h4> {t("descriptionEN")} </h4></td>
              <td> <p>{data?.data?.descriptionEN}</p></td>
            </tr>
            <tr>
              <td><h4> {t("price")} </h4></td>
              <td> <p>{data?.data?.carPrice} { ( lang == "ar" ) ? current_currency?.titleAr : current_currency?.titleEn }</p></td>
            </tr>

            <tr>
              <td><h4> {t("carModel")} </h4></td>
              <td><p>{data?.data?.carModel == "" ? t("carModel_notfound") : data?.data?.carModel}</p></td>
            </tr>

            <tr>
              <td><h4> {t("yearManufacture")} </h4></td>
              <td><p>{data?.data?.yearManufacture == "" ? t("yearManufacture_notfound") : data?.data?.yearManufacture}</p></td>
            </tr>

            <tr>
              <td><h4> {t("link")} </h4></td>
              <td> <p>{data?.data?.link}</p></td>
            </tr>
            <tr>
              <td><h4> {t("departmentAds")} </h4></td>
              <td> <p>{data?.data?.AdsDepartment.titleEN}</p></td>
            </tr>

            <tr>
              <td><h4> {t("advertiserPhone")} </h4></td>
              <td> <p>{data?.data?.advertiserPhone}</p></td>
            </tr>

        <tr>
          <td><h4>{t("images")}</h4></td>
          <td> 
            <p>
            <AdsImages AdsId={AdsId} />
            </p>
          </td>
        </tr>
      </table>
      </Paper>
      </Grid>
      </Grid>
      </Container>
    </Navbar>
  );
}
