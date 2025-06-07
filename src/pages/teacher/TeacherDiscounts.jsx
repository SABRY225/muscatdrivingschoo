import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React                from 'react'
import TeacherLayout        from '../../components/teacher/TeacherLayout'
import { useTranslation }   from 'react-i18next';
import AddDiscounts        from '../../components/teacher/discounts/Add';
import View      from '../../components/teacher/discounts/View';


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
                        <Tab label={t('view_teacher_discount')} value="1" />
                        <Tab label={t('add_teacher_discount')} value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><View   /></TabPanel>
                    <TabPanel value="2"><AddDiscounts      /></TabPanel> 
            </TabContext>
        </TeacherLayout>
    )
}