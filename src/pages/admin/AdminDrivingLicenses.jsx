import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useTranslation }   from 'react-i18next';
import DrivingLicensesAdd   from '../../components/admin/DrivingLicenses/DrivingLicensesAdd';
import DrivingLicensesView  from '../../components/admin/DrivingLicenses/DrivingLicensesView';

export default function AdminDrivingLicenses() {
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
                        <Tab label={t('view_drivinglicenses')} value="1" />
                        <Tab label={t('add_drivinglicenses')} value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><DrivingLicensesView    /></TabPanel>
                    <TabPanel value="2"><DrivingLicensesAdd     /></TabPanel>
                </TabContext>
        </AdminLayout>
    )
}