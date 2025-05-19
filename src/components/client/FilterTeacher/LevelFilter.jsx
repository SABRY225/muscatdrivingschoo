import { Box, Typography } from '@mui/material'
import React from 'react'
import { useLevels } from '../../../hooks/useLevels'
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

export default function CategoryFilter({level,handleLevel}) {
    const {data,isLoading} = useLevels()
    const lang = Cookies.get("i18next") || "en";
    const {t} = useTranslation()
    return (
        <Box>
            <Typography sx={{fontSize:"20px",fontWeight:"bold",color:"#151313",textAlign:"center"}}>
                {t('choosesLevel')}
            </Typography>
            {!isLoading&&
            <Box sx={{marginTop:"30px"}}>
                <Box sx={{display:"flex",columnGap:"8px",alignItems:"center",flexWrap:"wrap",rowGap:"8px"}}>
                {
                    data.data.length>0&&data.data.map((item,index)=>
                    {
                        return(
                            <Box key={index+'iq1'} sx={{color:level===item.id?"#151313":"#6D6D6D",borderRadius:"6px",
                            padding:"4px 10px",backgroundColor:level===item.id?'#005b8e4d':"#e7e7e7",cursor:"pointer"}}
                            onClick={()=>handleLevel(item.id)}>{lang==="en"?item.titleEN:item.titleAR}</Box>
                        )
                    })
                }
                </Box>
            </Box>
            }
        </Box>
    )
}
