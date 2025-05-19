import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material';
import { useTranslation }       from 'react-i18next';
import React                    from 'react';
import AdminLayout              from '../../components/admin/AdminLayout';
import PackageView              from '../../components/admin/package/View';
import PackageAcceptView        from '../../components/admin/package/Accept';
import PackageRejectedView      from '../../components/admin/package/Rejected';

export default function AdminPackage() {
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
                        <Tab label={t('package_view_waiting')}      value="1" />
                        <Tab label={t('package_view_accept')}       value="2" />
                        <Tab label={t('package_view_rejected')}     value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1"><PackageView   /></TabPanel>
                <TabPanel value="2"><PackageAcceptView   /></TabPanel>
                <TabPanel value="3"><PackageRejectedView   /></TabPanel>
            </TabContext>
        </AdminLayout>
    )
}