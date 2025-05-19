import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React from 'react'
import AdminLayout              from '../../components/admin/AdminLayout'
import { useTranslation }       from 'react-i18next';
import LectureWaitingView       from '../../components/admin/Lecture/LectureWaitingView';
import LectureAcceptView        from '../../components/admin/Lecture/LectureAcceptView';
import LectureRejectedView      from '../../components/admin/Lecture/LectureRejectedView';

export default function AdminLecture() {
    const {t}                   = useTranslation()
    const [value, setValue]     = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <AdminLayout>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label={t('lecture_view_waiting')}      value="1" />
                        <Tab label={t('lecture_view_accept')}       value="2" />
                        <Tab label={t('lecture_view_rejected')}     value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1"><LectureWaitingView   /></TabPanel>
                <TabPanel value="2"><LectureAcceptView   /></TabPanel>
                <TabPanel value="3"><LectureRejectedView   /></TabPanel>
            </TabContext>
        </AdminLayout>
    )
}