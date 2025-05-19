import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab }         from '@mui/material';
import React                from 'react';
import Layout               from "../../components/guest/Layout";
import { useTranslation }   from 'react-i18next';
import AdsAdd               from '../../components/guest/ads/Add';
import AdsView              from '../../components/guest/ads/View';

export default function Ads() {
    const {t} = useTranslation()
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Layout>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label={t('view_ads')}   value="1" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><AdsView       /></TabPanel>
                </TabContext>
        </Layout>
    )
}