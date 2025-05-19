import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab }             from '@mui/material';
import React                    from 'react';
import AdminLayout              from '../../components/admin/AdminLayout';
import { useTranslation }       from 'react-i18next';
import AdsDepartmentAdd         from '../../components/admin/adsdepartment/Add';
import AdsDepartmentView        from '../../components/admin/adsdepartment/View';

export default function AdsDepartment() {
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
                        <Tab label={t('view_ads_deparment')} value="1" />
                        <Tab label={t('add_ads_department')} value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><AdsDepartmentView       /></TabPanel>
                    <TabPanel value="2"><AdsDepartmentAdd        /></TabPanel>
                </TabContext>
        </AdminLayout>
    )
}