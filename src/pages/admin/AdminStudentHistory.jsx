import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useTranslation } from 'react-i18next';
import StudentHistoryWallet from '../../components/admin/StudentHistoryWallet';
import StudentHistoryThawani from '../../components/admin/StudentHistoryThawani';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function AdminStudentHistory() {
    const {t} = useTranslation()
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const {id} = useParams()
    const {token} = useSelector((state)=>state.admin)
    return (
        <AdminLayout>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label={t('wallet')} value="1" />
                        <Tab label={t('Thawani')} value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><StudentHistoryWallet id={id}/></TabPanel>
                    <TabPanel value="2"><StudentHistoryThawani id={id}/></TabPanel>
            </TabContext>
        </AdminLayout>
    )
}