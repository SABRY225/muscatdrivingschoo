import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useTranslation } from 'react-i18next';
import SendMailStudent from '../../components/admin/SendMailStudent';
import SendMailTeacher from '../../components/admin/SendMailTeacher';
import SendMailParent from '../../components/admin/SendMailParent';

export default function AdminSendMail() {
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
                        <Tab label={t('teachers')} value="1" />
                        <Tab label={t('students')} value="2" />
                        <Tab label={t('parents')}  value="3" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><SendMailTeacher    /></TabPanel>
                    <TabPanel value="2"><SendMailStudent    /></TabPanel>
                    <TabPanel value="3"><SendMailParent    /></TabPanel>
            </TabContext>
        </AdminLayout>
    )
}