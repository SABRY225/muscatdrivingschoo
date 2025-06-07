
import * as React from 'react';
import { t } from "i18next";
import { Card, CardMedia } from '@mui/material';
import Navbar from '../../Navbar';
import { Box, Grid } from '@mui/material'
import { Link } from 'react-router-dom'
import { useTests } from '../../../hooks/useTests';



function Test() {
  const {data}= useTests()
  console.log(data);
  
  return (
    <Navbar>
      <Box sx={{
        width: '90%',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '20px',
        paddingTop: '9rem',
        paddingBottom: '10px',
      }}>
        {/* title */}
        <Box sx={{
          fontSize: '2rem',
          fontWeight: 'bold',
          color: '#e74c3c',
        }}>
          {t("Educational tests on the Muscat driving platform for cars learn, valid your progress and develop your skills")}
        </Box>
        {/* description */}
        <Box sx={{
          fontSize: '1rem',
          fontWeight: '300',
          color: '#000',
          width: {md:'60%',xs:'100%'},
        }}>
          {t("The Muscat driving platform offers you a variety of educational tests that help you measure your knowledge and achieve tangible progress in your academic field. Whether you're a student seeking to evaluate your performance or a teacher wanting to test your students' skills, you'll find carefully designed tests here to suit all needs. Use these tests as a powerful tool to develop your skills and achieve excellence!")}
        </Box>
        {/* data */}
        <Grid container spacing={2} sx={{ padding: 2, justifyContent: "center", alignItems: "center" }}>
          {!data?"Unfortunately, there are currently no exam available.":(
            data?.data.map((row) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={row.id}> {/* أضف key هنا */}
                <Card>
                  <CardMedia
                    component="img"
                    image={row.image ? `${process.env.REACT_APP_API_KEY}images/${row.image}` : "/logo.png"}
                    alt="package img"
                    sx={{ filter: "brightness(50%)", height: "180px" }}
                  />
                  <Box sx={{
                    display: 'flex',
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    padding: "0 20px",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    color: "#000",
                    marginTop: "1rem",
                    marginBottom: "2rem",
                  }}>
                    {t(row.resource)}      
                    </Box>
                  <Box sx={{
                    display: 'flex',
                    justifyContent: "center",
                    alignItems: "center",
                    gap: "10px",
                    fontSize: "0.9rem",
                    fontWeight: "bold",
                    color: "#000",
                    marginTop: "1rem",
                    marginBottom: "2rem",
                  }}>
                    <Link 
                    // to={`/test/${row.id}`}
                    >
                      <Box
                        sx={{
                          width: "120px",
                          border: "1px solid",
                          borderRadius: "5px",
                          padding: "8px 12px",
                          color: "#FFF",
                          backgroundColor: "#e74c3c",
                          textAlign: "center",
                        }}
                      >
                        {t("View more")}
                      </Box>
                    </Link>
                  </Box>
                </Card>
              </Grid>
            ))
          )}
          
        </Grid>
      </Box>
    </Navbar>
  )
}
export default Test;