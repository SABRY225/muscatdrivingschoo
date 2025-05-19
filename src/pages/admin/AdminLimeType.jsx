import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/admin/AdminLayout'
import LimeTypeAdd from '../../components/admin/LimeType/Add';
import LimeTypeView from '../../components/admin/LimeType/View';

export default function AdminLimeType() {
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
                        <Tab label={t('limetype_view')} value="1" />
                        <Tab label={t('limetype_add')} value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><LimeTypeView   /></TabPanel>
                    <TabPanel value="2"><LimeTypeAdd    /></TabPanel>
                </TabContext>
        </AdminLayout>
    )
}