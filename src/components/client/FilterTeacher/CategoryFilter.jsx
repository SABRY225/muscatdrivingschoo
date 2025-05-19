import { Box, Typography } from '@mui/material'
import Cookies from 'js-cookie';
import React from 'react'
import { useTranslation } from 'react-i18next';

export default function CategoryFilter({subject,handleCategory,category}) {
    const lang = Cookies.get("i18next") || "en";
    const {t} = useTranslation()
    return (
        <Box>
            <Typography sx={{fontSize:"20px",fontWeight:"bold",color:"#151313",textAlign:"center"}}>
                {t('chooseCategory')}  
            </Typography>
            <Box sx={{marginTop:"30px"}}>
                <Box sx={{display:"flex",columnGap:"8px",alignItems:"center",flexWrap:"wrap" , rowGap:"8px"}}>
                {
                    subject.Subjects.length>0&&subject.Subjects.map((item,index)=>
                    {
                        return(
                            <Box key={index+'iq1'} sx={{color:category[0]===item.id?"#151313":"#6D6D6D",borderRadius:"6px",
                            padding:"4px 10px",backgroundColor:category[0]===item.id?'#005b8e4d':"#e7e7e7",cursor:"pointer"}}
                            onClick={()=>handleCategory(item.id)}>{lang==="en"?item.titleEN:item.titleAR}</Box>
                        )
                    })
                }
                </Box>
            </Box>
        </Box>
    )
}
