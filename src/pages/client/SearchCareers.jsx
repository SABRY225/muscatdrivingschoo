import { Box, Button, Container, Grid, Paper, Typography , styled , navigate} from "@mui/material";
import React, { useEffect, useState } from "react";
import Navbar                       from "../../components/Navbar";
import LinksFooter        from '../../components/client/home/LinksFooter';
import Footer             from '../../components/client/home/Footer';

import { useNavigate }              from "react-router-dom";
import { Link, useSearchParams }    from "react-router-dom";
import Loading                      from "../../components/Loading";
import Cookies                      from 'js-cookie';
import { useSelector }              from "react-redux";
import { useTranslation }           from "react-i18next";
import countries                    from "../../data/countries";
import { useCareerDepartments }     from "../../hooks/useCareerDepartments"
const Image = styled("img")({
  width: "300px",
});

export default function SearchCareers() {
  const navigate                          = useNavigate();
  const [searchParams, setSearchParams]   = useSearchParams();
  const [image, setImage]                 = useState(null);
  const { data:careerdepartments , isLoadingDepartment  }    = useCareerDepartments();

  const [isLoading, setIsLoading]         = useState(true);
  const { t } = useTranslation();
  const lang                  = Cookies.get("i18next") || "en";

  const [careers, setCareers]             = useState("");
  const [departmentId , setDepartmentID]  = useState(0);
  const [value, setValue] = useState([]);

  const { currency } = useSelector((state) => state.currency);

  const handleFilterDepartment = async (departmentId) => {
    //console.log(departmentId);
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_KEY}api/v1/admin/searchcareer/${departmentId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        }
      );
      const resData = await response.json();
      if (resData.status !== 200 && resData.status !== 201) {
        throw new Error("");
      }
      setCareers(resData.data);
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    async function getCareers() {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/admin/searchcareer/all`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
             departmentId : departmentId
            }),
          }
        );
        const resData = await response.json();
        if (resData.status !== 200 && resData.status !== 201) {
          throw new Error("");
        }
        setCareers(resData.data);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    }
    getCareers();
  }, [searchParams]);

  return (
    <Navbar>
      <div className="breadcrumb">
        <ul>
          <li><a href="/home">{t("lnk_home")}</a></li>
          <li><a href="/driving-licenses">{t("careers")}</a></li>
        </ul>
      </div>

      <Container sx={{ marginBottom: "40px", marginTop: "10px" }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
          <Paper
              sx={{ padding: "8px 20px", display: "flex",flexDirection: "column",
                    alignItems: "center",margin: "10px" }}
            >
              <h3 className="h2_title">{t("search_department")}</h3>
            
          {isLoadingDepartment ? (
              <Loading />
            ) : (
              <>
              {careerdepartments?.data.length > 0 ?
                  careerdepartments?.data.map((row) => {
                    return(
                    
                    <Button
                    variant="outlined" fullWidth
                    sx={{ textTransform: "capitalize" }}
                    onClick={()=>handleFilterDepartment(row.id)}>
                    { (lang === "en") ? row.titleEN : row.titleAR}
                    </Button>

                    )
              
              }) : 
              <p>{t("career_department_notfound")}</p>
              }
              </>
            )}
          </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            
            {isLoading ? (
              <Loading />
            ) : (
              <>
                {careers.length > 0 &&
                  careers.map((career) => {
                    let country = countries.find((e) => e.code == career?.country)
                    return (
                    <div className="div_block" >
                    <Grid container spacing={3}>
                      <Grid item xs={3} md={3}>
                        <Image
                          alt={lang==="ar"?career?.titleAR:career?.titleEN}
                          src={`${process.env.REACT_APP_API_KEY}images/${career?.image}`}
                          sx={{ width: "100%", height: "100%", fontSize: "42px" }}
                        />
                      </Grid>
                      <Grid item xs={9} md={9}>
                        <h3 className="h3_title"> {lang==="ar"?career?.titleAR:career?.titleEN} </h3>
                        <p className="p_2">  {lang==="ar"?career?.descriptionAr:career?.descriptionEn}  </p>
                        <p className="p_details">{ lang === "en" ? country?.name_en : country?.name_ar }</p>
                        <a className='btndetails_1'
                        onClick={() => navigate(`/career-details/${career.id}`)}
                        >
                        {t("driving_view")}
                        </a>
                      </Grid>
                      </Grid>
                    </div>
                    );
                  })}

                {careers.length === 0 && (
                  <Paper sx={{ padding: "16px" }}>
                    <Typography variant="h6">
                      {t("empty_search_career_result")}
                    </Typography>
                  </Paper>
                )}

              </>
            )}
          </Grid>
          
        </Grid>
      </Container>
      <LinksFooter/>
      <Footer/>
    </Navbar>
  );
}
