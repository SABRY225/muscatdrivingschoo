import { Paper ,Typography,Rating, Divider, Box, Avatar,Button} from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'
import Dialog from '@mui/material/Dialog';
import AddRate from './AddRate';
import swal from 'sweetalert';
import { useSelector } from 'react-redux';

export default function RatingTeacher({teacher}) {
    const {t} = useTranslation()
    const [open, setOpen] = React.useState(false);
    const {student} = useSelector((state)=>state.student);

    const handleClickOpen = () => {
        if(!student){
            swal({text:t("login_as_student"), icon:"error", button:t('ok')});
            return;
        }
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Paper sx={{padding:"32px 24px",marginY:"30px"}}>
            <Typography sx={{fontSize:"22px",marginBottom:"8px"}}>{t('rating')}</Typography>
            <Typography sx={{marginBottom:"20px"}}>
                ({t('rating_desc')})
            </Typography>
            <Rating name="size-large" value={teacher.rate} readOnly size="large" />
            <Divider sx={{marginY:"16px"}}/>
            {
            teacher?.Rates.length>0&&
            teacher.Rates.map((rate,index)=>
            {
                return(
                    <Box key={index+'z1q'} sx={{marginBottom:"20px"}}>
                        <Box sx={{display:"flex",alignItems:"center",columnGap:"6px"}}>
                            <Avatar/>
                            <Box>
                                <Typography sx={{fontSize:"14px"}}>{rate.Student?.name||t('username')}</Typography>
                                <Rating name="size-small" defaultValue={rate.rating} readOnly size="small" />
                            </Box>
                        </Box>
                        <Typography sx={{marginTop:"4px"}}>{rate.comment}</Typography>
                    </Box>
                )
            })
            }
            <Button sx={{marginTop:"30px",textTransform:"capitalize"}} variant='contained'
            onClick={handleClickOpen}>{t('addrate')}</Button>
            <Dialog open={open} onClose={handleClose}>
                <AddRate TeacherId={teacher.id} handleClose={handleClose}/>
            </Dialog>
        </Paper>
    )
}
