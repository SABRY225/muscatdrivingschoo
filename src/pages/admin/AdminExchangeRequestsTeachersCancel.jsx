import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';
import AdminLayout        from '../../components/admin/AdminLayout';
import ViewCancel from '../../components/admin/ExchangeRequestTeachers/ViewCancel';

function AdminExchangeRequestsTeachersCancel() {
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
                        <Tab label={t('view_ExchangeRequestTeachers_rejected')} value="1" />
                    </TabList>
                </Box>
                <TabPanel value="1"><ViewCancel   /></TabPanel>
            </TabContext>
        </AdminLayout>
    )
}

export default AdminExchangeRequestsTeachersCancel