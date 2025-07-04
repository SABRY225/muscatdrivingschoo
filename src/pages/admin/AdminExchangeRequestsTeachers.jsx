import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';
import AdminLayout        from '../../components/admin/AdminLayout';
import Add                from '../../components/admin/ExchangeRequestTeachers/Add';
import View               from '../../components/admin/ExchangeRequestTeachers/View';

export default function AdminExchangeRequestsTeachers() {
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
                        <Tab label={t('ExchangeRequestTeachers_view')} value="1" />
                        <Tab label={t('ExchangeRequestTeachers_add')} value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><View   /></TabPanel>
                    <TabPanel value="2"><Add    /></TabPanel>
                </TabContext>
        </AdminLayout>
    )
}