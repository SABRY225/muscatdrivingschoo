import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React                from 'react'
import TeacherLayout        from '../../components/teacher/TeacherLayout'
import { useTranslation }   from 'react-i18next';
import TeacherQuestionAdd        from '../../components/teacher/question/TeacherQuestionAdd';
import TeacherQuestionView       from '../../components/teacher/question/TeacherQuestionView';


export default function TeacherQuestion() {
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
                        <Tab label={t('view_teacher_question')}  value="1" />
                        <Tab label={t('add_teacher_quesiton')}   value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><TeacherQuestionView   /></TabPanel>
                    <TabPanel value="2"><TeacherQuestionAdd      /></TabPanel> 
            </TabContext>
        </TeacherLayout>
    )
}