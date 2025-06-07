import { useEffect, useState } from "react";
import { t } from "i18next";
import Container from "@mui/material/Container";
import { Grid, Card, CardContent, Typography } from "@mui/material";
// import { useCount } from "../../../hooks/useCount";
import student from '../../../images/student.png'
import teacher from '../../../images/teacher.png'
import lesson from '../../../images/lesson.png'
import lecture from '../../../images/lecture.png'


function NumberTab() {
    //   const { data } = useCount();
    const [dataCount, setDataCount] = useState(null); // ✅ تخزين البيانات باستخدام useState

    //   useEffect(() => {
    //     if (data?.data) {
    //       setDataCount(data.data);
    //     }
    //   }, [data]);

    return (
        <Container sx={{
            marginTop: { md: 18, xs: 5 }
        }}>
            <Grid container spacing={2} sx={{ padding: 2 }}>
                <Grid item xs={12} sm={6} md={4} lg={6}>
                    <Card sx={{
                        textAlign: "center", boxShadow: 3, borderRadius: "20px", background: "#e74c3c", display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <CardContent >
                            <Typography component="div" sx={{
                                background: "#FFF",
                                borderRadius: "50%",
                                width: "100px",
                                height: "100px",
                                                                display: "flex",        
                                justifyContent: "center", 
                                alignItems: "center",    
                                margin: "0 auto",   
                            }}>
                                <img src={student} alt={student} width={80} height={80} />
                            </Typography>
                            <Typography variant="h6" component="div" className="font-bold" sx={{ color: "#fff" }}>
                                {dataCount?.students || 400}
                            </Typography>
                            <Typography variant="body2" className="font-bold" sx={{ color: "#fff" }}>
                                {t("students")}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={6}>
                    <Card sx={{
                        textAlign: "center", boxShadow: 3, borderRadius: "20px", background: "#e74c3c", display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <CardContent >
                            <Typography component="div" sx={{
                                background: "#FFF",
                                borderRadius: "50%",
                                width: "100px",
                                height: "100px",
                                                                display: "flex",        
                                justifyContent: "center", 
                                alignItems: "center",    
                                margin: "0 auto",   
                            }}>
                                <img src={teacher} alt={teacher} width={80} height={80} />
                            </Typography>
                            <Typography variant="h6" component="div" className="font-bold" sx={{ color: "#fff" }}>
                                {dataCount?.teachers || 500}
                            </Typography>
                            <Typography variant="body2" className="font-bold" sx={{ color: "#fff" }}>
                                {t("teachers")}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={6}>
                    <Card sx={{
                        textAlign: "center", boxShadow: 3, borderRadius: "20px", background: "#e74c3c", display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <CardContent >
                            <Typography component="div" sx={{
                                background: "#FFF",
                                borderRadius: "50%",
                                width: "100px",
                                height: "100px",
                                                                display: "flex",        
                                justifyContent: "center", 
                                alignItems: "center",    
                                margin: "0 auto",   
                            }}>
                                <img src={lecture} alt={lecture} width={80} height={80} />
                            </Typography>
                            <Typography variant="h6" component="div" className="font-bold" sx={{ color: "#fff" }}>
                                {dataCount?.lectures || 200}
                            </Typography>
                            <Typography variant="body2" className="font-bold" sx={{ color: "#fff" }}>
                                {t("Lecture")}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={4} lg={6}>
                    <Card sx={{
                        textAlign: "center", boxShadow: 3, borderRadius: "20px", background: "#e74c3c", display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}>
                        <CardContent >
                            <Typography component="div" sx={{
                                background: "#FFF",
                                borderRadius: "50%",
                                width: "100px",
                                height: "100px",
                                display: "flex",        
                                justifyContent: "center", 
                                alignItems: "center",    
                                margin: "0 auto",         
                            }}>
                                <img src={lesson} alt={lesson} width={60} height={60} />
                            </Typography>
                            <Typography variant="h6" component="div" className="font-bold" sx={{ color: "#fff" }}>
                                {dataCount?.lessons || 200}
                            </Typography>
                            <Typography variant="body2" className="font-bold" sx={{ color: "#fff" }}>
                                {t("lessons")}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Container>
    );
}

export default NumberTab;
