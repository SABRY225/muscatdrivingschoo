import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab }         from '@mui/material';
import React                from 'react';
import { useTranslation }   from 'react-i18next';
import CareerAdd            from './Add';
import CareerView           from './View';
import TeacherLayout from '../TeacherLayout';

export default function CareerTeacher() {
    const {t} = useTranslation()
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <TeacherLayout>
            <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label={t('view_career')} value="1" />
                        <Tab label={t('add_career')} value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><CareerView       /></TabPanel>
                    <TabPanel value="2"><CareerAdd        /></TabPanel>
                </TabContext>
        </TeacherLayout>
    )
}