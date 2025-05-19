import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab }              from '@mui/material';
import { useTranslation }        from 'react-i18next';
import React                     from 'react';
import AdminLayout               from '../../components/admin/AdminLayout';
import DiscountView              from '../../components/admin/discounts/View';
import DiscountAcceptView        from '../../components/admin/discounts/Accept';
import DiscountRejectedView      from '../../components/admin/discounts/Rejected';

export default function AdminDiscount() {
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
                        <Tab label={t('discount_view_waiting')}      value="1" />
                        <Tab label={t('discount_view_accept')}       value="2" />
                        <Tab label={t('discount_view_rejected')}     value="3" />
                    </TabList>
                </Box>
                <TabPanel value="1"><DiscountView   /></TabPanel>
                <TabPanel value="2"><DiscountAcceptView   /></TabPanel>
                <TabPanel value="3"><DiscountRejectedView   /></TabPanel>
            </TabContext>
        </AdminLayout>
    )
}