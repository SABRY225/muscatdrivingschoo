import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React                from 'react'
import TeacherLayout        from '../../components/teacher/TeacherLayout'
import { useTranslation }   from 'react-i18next';
import TeacherCertificatesView from '../../components/teacher/TeacherCertificatesView';
import { DisplaySettings }  from '@mui/icons-material';

export default function TeacherCertificates() {
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
                        <Tab label={t('view_teacher_certificates')} value="1" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><TeacherCertificatesView   /></TabPanel>
            </TabContext>
        </TeacherLayout>
    )
}