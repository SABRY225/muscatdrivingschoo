import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useTranslation } from 'react-i18next';
import CareerDepartmentAdd          from '../../components/admin/careerdepartment/Add';
import CareerDepartmentView        from '../../components/admin/careerdepartment/View';

export default function AdminCareerDepartment() {
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
                        <Tab label={t('view_career_deparment')} value="1" />
                        <Tab label={t('add_career_department')} value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><CareerDepartmentView       /></TabPanel>
                    <TabPanel value="2"><CareerDepartmentAdd        /></TabPanel>
                </TabContext>
        </AdminLayout>
    )
}