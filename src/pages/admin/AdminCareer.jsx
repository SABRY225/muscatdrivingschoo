import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useTranslation } from 'react-i18next';
import CareerAdd          from '../../components/admin/career/Add';
import CareerView         from '../../components/admin/career/View';
import CareerViewWaiting  from '../../components/admin/career/ViewWaiting';

export default function AdminCareer() {
    const {t} = useTranslation()
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <AdminLayout>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label={t('view_career_waiting')} value="1" />
                        <Tab label={t('view_career')} value="2" />
                        <Tab label={t('add_career')} value="3" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><CareerViewWaiting       /></TabPanel>
                    <TabPanel value="2"><CareerView       /></TabPanel>
                    <TabPanel value="3"><CareerAdd        /></TabPanel>
                </TabContext>
        </AdminLayout>
    )
}