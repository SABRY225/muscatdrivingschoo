import React from 'react'
import StudentLayout from '../../components/student/StudentLayout'
import { Button,styled ,Box , Paper} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {useStudent} from '../../hooks/useStudent';
import {useSelector,useDispatch} from 'react-redux';
import {changeStudentImage} from '../../redux/studentSlice';
import { useSnackbar } from 'notistack';
import Cookies from 'js-cookie';

const Label = styled("label")({
    width:"100%",
    display:"block",
    padding:"6px 16px",
    cursor:"pointer"
})

const Image = styled('img')({
    width:"100%"
})

export default function StudentPhoto() {
    const {student,token} = useSelector((state)=>state.student)
    const {data,isLoading} = useStudent(student?.id);
    const [image,setImage] = useState(null)
    const {t} = useTranslation()
    const [load,setLoad] = useState(false)
    const dispatch = useDispatch();
    const {closeSnackbar,enqueueSnackbar} = useSnackbar()
    const lang = Cookies.get("i18next") || "en";
    
    
    function handleChangeImage(e)
    {
        setImage(e.target.files[0])
    }

    async function handleEditImage()
    {
        setLoad(true)
        const formData = new FormData()
        formData.append('image',image)
        try{
            const response = await fetch(`${process.env.REACT_APP_API_KEY}api/v1/student/editImage/${student.id}`,{
                method:"POST",
                headers:{
                    "Authorization":token
                },
                body:formData
            })
            if(response.status!==200&response.status!==201)
            {
                setLoad(false)
                throw new Error('failed occured')
            }
            const resData = await response.json();
            dispatch(changeStudentImage({image:resData.student.image}));
            enqueueSnackbar(lang==="ar"?resData.msg.arabic:resData.msg.english,{variant:"success",autoHideDuration:8000})
            setLoad(false)
        }
        catch(err)
        {
            console.log(err)
        }
    }

    return (
    <StudentLayout>
        <Paper sx={{ padding: "20px" }}>
            <input type="file" id="image" hidden onChange={(e)=>handleChangeImage(e)}/>
            <Button variant='contained' sx={{textTransform:"capitalize",padding:0,marginBottom:"20px"}}>
                <Label htmlFor='image'>{t('replace_photo')}</Label>
            </Button>
            <Box sx={{marginBottom:"30px"}}>
            {
                image&&
                <Image src={URL.createObjectURL(image)}/>
            }
            {
                !image&&data?.data.image&&
                <Image src={`${process.env.REACT_APP_API_KEY}images/${data.data.image}`}/>
            }
            {image&&
            <Box>
                {
                    !load?
                    <Button variant="contained" color="secondary" 
                    onClick={handleEditImage}>{t('save')}</Button>
                    :
                    <Button variant="contained" color="secondary">{t('save')}...</Button>
                }
            </Box>}
            </Box>
    </Paper>
</StudentLayout>
    )
}
