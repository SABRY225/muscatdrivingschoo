import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React                from 'react'
import TeacherLayout        from '../../components/teacher/TeacherLayout'
import { useTranslation }   from 'react-i18next';
import TeacherLectureAdd        from '../../components/teacher/lecture/TeacherLectureAdd';
import TeacherLecturesView      from '../../components/teacher/lecture/TeacherLecturesView';


export default function TeacherLectures() {
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
                        <Tab label={t('view_teacher_lectures')} value="1" />
                        <Tab label={t('add_teacher_lectures')} value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><TeacherLecturesView   /></TabPanel>
                    <TabPanel value="2"><TeacherLectureAdd      /></TabPanel> 
            </TabContext>
        </TeacherLayout>
    )
}