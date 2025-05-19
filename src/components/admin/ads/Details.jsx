import React from "react";
import { Box, Typography ,Paper , styled , Container, Grid } from "@mui/material";
import { useTranslation }           from "react-i18next";
import { useState, useEffect }      from "react";
import { useNavigate , useParams }  from "react-router-dom";
import { useSelector }              from "react-redux";
import { useSnackbar }              from "notistack";
import Cookies                      from "js-cookie";
import AdminLayout                  from '../AdminLayout';
import Loading                      from "../../../components/Loading";
import { useAdsSingle }             from "../../../hooks/useAdsSingle";
import currencies                   from "../../../data/currencies";
import AdsImages                    from "../../guest/AdsImages";

const ImageLogo = styled("img")({
  height: "60px",

  "@media screen and (max-width: 600px) ": {
    height: "45px",
  },
  "@media screen and (max-width: 320px) ": {
    height: "27px",
  },
  objectFit: "cover",
  objectPosition: "bottom",
});
const ImageCall = styled("img")({
  width: "18px",
  height: "18px",
});

export default function Details() {
  const lang = Cookies.get("i18next") || "en";
  const { AdsId }         = useParams();
  const { guest, token }  = useSelector((state) => state.guest);
  const { data }          = useAdsSingle(AdsId);
 console.log(data);

  const navigate          = useNavigate();
  const { closeSnackbar, enqueueSnackbar } = useSnackbar();
  let current_currency = "";
  current_currency = currencies.find((e) => e.title == data?.data?.currency);
  
  const { t } = useTranslation();
  return (
    <AdminLayout>

      <Container sx={{ marginTop: "20px", marginBottom: "60px" }}>
      <Grid item xs={12} lg={9}>
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
      </Container>
    </AdminLayout>
  );
}
