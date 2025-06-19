import React from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import { useTranslation } from 'react-i18next';
import AllLesson from '../../components/admin/AllLesson';
import PendingLesson from '../../components/admin/PendingLesson';

function AdminRequestLesson() {
        const {t} = useTranslation()
        const [value, setValue] = React.useState('1');
        const handleChange = (event, newValue) => {
            setValue(newValue);
        };
  return (
    <AdminLayout>
            <TabContext value={value} >
                <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label={t('View Lesson')} value="1" />
                        <Tab label={t('Pending Lesson')} value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><AllLesson /></TabPanel>
                    <TabPanel value="2"><PendingLesson /></TabPanel>
                </TabContext>
    </AdminLayout>
  )
}

export default AdminRequestLesson