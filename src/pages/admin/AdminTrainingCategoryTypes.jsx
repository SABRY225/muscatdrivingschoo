import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import { useTranslation } from 'react-i18next';
import TrainingCategoryTypeAdd      from '../../components/admin/TrainingCategoryType/Add';
import TrainingCategoryTypesView    from '../../components/admin/TrainingCategoryType/View';

export default function AdminTrainingCategoryTypes() {
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
                        <Tab label={t('viewtrainingcategorytypes')} value="1" />
                        <Tab label={t('add_trainingcategorytype')} value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><TrainingCategoryTypesView  /></TabPanel>
                    <TabPanel value="2"><TrainingCategoryTypeAdd    /></TabPanel>
                </TabContext>
        </AdminLayout>
    )
}