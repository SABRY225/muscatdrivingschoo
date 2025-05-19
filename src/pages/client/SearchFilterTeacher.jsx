import { Box, Button, Container } from '@mui/material'
import React from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import LandingBanner from '../../components/client/landing/LandingBanner'
import Navbar from '../../components/Navbar'
import { useSingleSubject } from '../../hooks/useSingleSubject'
import CategoryFilter from '../../components/client/FilterTeacher/CategoryFilter'
import LevelFilter from '../../components/client/FilterTeacher/LevelFilter'
import { useState } from 'react'
import Footer from '../../components/client/home/Footer'
import LinksFooter from '../../components/client/home/LinksFooter'
import { useTranslation } from 'react-i18next';

export default function SearchFilterTeacher() {
    const {t} = useTranslation()
    const navigate = useNavigate()
    const {subjectId} = useParams()
    const {isLoading,data} = useSingleSubject(subjectId)
    const [page,setPage] = useState(0)
    const [category,setCategory] = useState([])
    const [level,setLevel] = useState("")

    function handleCategory(id)
    {
        setCategory([id])
    }

    function handleLevel(id)
    {
        setLevel(id)
    }

    return (
        <Navbar>
            <LandingBanner/>
            {
                !isLoading&&
                <Container sx={{marginY:"40px"}}>
                    {
                        page===0?
                        <CategoryFilter subject={data.data} category={category} handleCategory={handleCategory}/>
                        :
                        <LevelFilter page={page} level={level} handleLevel={handleLevel}/>
                    }
                    <Box sx={{display:"flex",justifyContent:"space-between",alignItems:"center",marginY:"40px"}}>
                        <Button variant="contained" sx={{minWidth:"10px"}}>{page+1}</Button>
                        <Box sx={{display:"flex",columnGap:"6px"}}>
                            {page!==0&&<Button color="Gray" variant='contained' onClick={()=>setPage(back=>back-1)}>{t('prev')}</Button>}
                            {page!==1&&<Button variant='contained' onClick={()=>setPage(back=>back+1)}>{t('next')}</Button>}
                            {page===1&&<Button variant='contained' 
                            onClick={()=>navigate(`/teachers/search?level=${level}&&subjects=${category}`)}>{t('save')}</Button>}
                        </Box>
                    </Box>
                </Container>

            }
            <LinksFooter/>
            <Footer/>
        </Navbar>
    )
}
