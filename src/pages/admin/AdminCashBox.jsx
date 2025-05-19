import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab }              from '@mui/material';
import { useTranslation }        from 'react-i18next';
import React                     from 'react';
import AdminLayout               from '../../components/admin/AdminLayout';
import StudentView               from '../../components/admin/cashbox/StudentView';
import TeacherView               from '../../components/admin/cashbox/TeacherView';
//import DiscountRejectedView      from '../../components/admin/discounts/Rejected';

export default function AdminCashBox() {
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
                        <Tab label={t('cashbox_student')}      value="1" />
                        <Tab label={t('cashbox_teacher')}      value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1"><StudentView   /></TabPanel>
                <TabPanel value="2"><TeacherView   /></TabPanel>
               
            </TabContext>
        </AdminLayout>
    )
}