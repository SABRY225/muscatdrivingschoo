import React, { useState } from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { Box, Typography,Tab } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { TabContext, TabList, TabPanel } from '@mui/lab'
import TeacherHistoryDues from '../../components/admin/TeacherHistoryDues';
import AdminTeacherPay from '../../components/admin/AdminTeacherPay';
import { useParams } from 'react-router-dom';
import { useTeacherDues } from '../../hooks/useTeacherDues';
import { useSelector } from 'react-redux';

export default function AdminTeacherDues() {
    const {token}   = useSelector((state)=>state.admin)
    const {id}      = useParams()
    const {t}       = useTranslation()
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const {data,isLoading} = useTeacherDues(id,token);

    return (
    <AdminLayout>
        <Box sx={{marginBottom:"30px",marginTop:"20px"}}>
        <Typography sx={{fontSize:"16px",fontWeight:"500"}}>{t('totalAmount')} {isLoading?0:data?.data.totalAmount} OMR</Typography>
            <Typography sx={{fontSize:"16px",fontWeight:"500",marginBottom:"8px"}}>{t('dues')} : {isLoading?0:data?.data.totalAmount-data?.data.dues} OMR</Typography>
        </Box>
        <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label={t('financialRecord')} value="1" />
                        <Tab label={t('pay')} value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><TeacherHistoryDues id={id}/></TabPanel>
                    <TabPanel value="2"><AdminTeacherPay id={id}/></TabPanel>
            </TabContext>
    </AdminLayout>
)
}