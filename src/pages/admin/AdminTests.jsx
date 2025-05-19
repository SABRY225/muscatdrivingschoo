import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useTranslation }       from 'react-i18next';
import TestsView              from '../../components/admin/tests/TestsView';
import TestsAcceptView        from '../../components/admin/tests/TestsAcceptView';
import TestsRejectedView      from '../../components/admin/tests/TestsRejectedView';

export default function AdminTests() {
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
                        <Tab label={t('tests_view_waiting')}      value="1" />
                        <Tab label={t('tests_view_accept')}       value="2" />
                        <Tab label={t('tests_view_rejected')}     value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1"><TestsView   /></TabPanel>
                <TabPanel value="2"><TestsAcceptView   /></TabPanel>
                <TabPanel value="3"><TestsRejectedView   /></TabPanel>
            </TabContext>
        </AdminLayout>
    )
}