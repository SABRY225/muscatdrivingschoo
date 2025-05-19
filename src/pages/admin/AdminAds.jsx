import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useTranslation }   from 'react-i18next';
import Add   from '../../components/admin/ads/Add';
import View  from '../../components/admin/ads/View';
import ViewWaiting  from '../../components/admin/ads/ViewWaiting';

export default function AdminAds() {
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
                        <Tab label={t('view_ads_waiting')} value="1" />
                        <Tab label={t('view_ads')} value="2" />
                        <Tab label={t('add_ads')} value="3" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><ViewWaiting    /></TabPanel>
                    <TabPanel value="2"><View    /></TabPanel>
                    <TabPanel value="3"><Add     /></TabPanel>
                </TabContext>
        </AdminLayout>
    )
}