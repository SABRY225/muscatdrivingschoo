import { Box, Container, Paper, Typography } from '@mui/material'
import React from 'react'
import Navbar from '../../components/Navbar'
import ErrorIcon from '@mui/icons-material/Error';
export default function FailCharge() {
    return (
        <Navbar>
            <Container sx={{marginTop:"120px"}}>
                <Paper sx={{width:"350px",margin:"80px auto",borderRadius:"12px",padding:"20px"}}>
                    <Box sx={{width:"55px",height:"55px",backgroundColor:"#d6293e",borderRadius:"50%",
                    display:"flex",alignItems:"center",justifyContent:"center",margin:"auto",}}>
                        <ErrorIcon sx={{color:"white",fontSize:"34px"}}/>
                    </Box>
                    <Typography sx={{textAlign:"center",fontSize:"22px",fontWeight:"600",marginTop:"20px"}}>Charge Failed !</Typography>
                </Paper>
            </Container>
        </Navbar>
    )
}
