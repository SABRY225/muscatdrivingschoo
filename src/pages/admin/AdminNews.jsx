import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useTranslation } from 'react-i18next';
import NewsAdd          from '../../components/admin/News/Add';
import NewsView         from '../../components/admin/News/View';

export default function AdminNews() {
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
                        <Tab label={t('view_news')} value="1" />
                        <Tab label={t('add_news')} value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><NewsView       /></TabPanel>
                    <TabPanel value="2"><NewsAdd        /></TabPanel>
                </TabContext>
        </AdminLayout>
    )
}