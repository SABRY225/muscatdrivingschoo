import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React from 'react'
import AdminLayout      from '../../components/admin/AdminLayout';
import AdminAdd         from '../../components/admin/admin/Add';
import AdminGet         from '../../components/admin/admin/View';
import { useTranslation } from 'react-i18next';

export default function AdminLevels() {
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
                        <Tab label={t('page_admin_view')} value="1" />
                        <Tab label={t('page_admin_add')}  value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><AdminGet   /></TabPanel>
                    <TabPanel value="2"><AdminAdd   /></TabPanel>
                </TabContext>
        </AdminLayout>
    )
}
