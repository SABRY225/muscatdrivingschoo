import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab }             from '@mui/material'
import React                    from 'react'
import TeacherLayout            from '../../components/teacher/TeacherLayout'
import { useTranslation }       from 'react-i18next';
import TeacherPackageAdd        from '../../components/teacher/package/TeacherPackageAdd';
import TeacherPackageView       from '../../components/teacher/package/TeacherPackageView';


export default function TeacherPackage() {
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
                        <Tab label={t('view_teacher_package')} value="1" />
                        <Tab label={t('add_teacher_package')} value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><TeacherPackageView   /></TabPanel>
                    <TabPanel value="2"><TeacherPackageAdd      /></TabPanel> 
            </TabContext>
        </TeacherLayout>
    )
}