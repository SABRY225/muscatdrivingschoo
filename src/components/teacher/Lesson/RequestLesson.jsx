import React from 'react'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import { useTranslation } from 'react-i18next';
import AllLesson from './AllLesson';
import PendingLessons from './PendingLessons';
import Navbar from '../../Navbar';
import TeacherLayout from '../TeacherLayout';

function TeacherRequestLesson() {
        const {t} = useTranslation()
        const [value, setValue] = React.useState('1');
        const handleChange = (event, newValue) => {
            setValue(newValue);
        };
  return (
    <Navbar>
           <TeacherLayout>
 <TabContext value={value} >
                <Box sx={{ borderBottom: 1, borderColor: 'divider',marginTop:"1rem"}}>
                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                        <Tab label={t('View Lesson')} value="1" />
                        <Tab label={t('Pending Lesson')} value="2" />
                    </TabList>
                </Box>
                    <TabPanel value="1"><AllLesson /></TabPanel>
                    <TabPanel value="2"><PendingLessons /></TabPanel>
                </TabContext>
           </TeacherLayout>
    </Navbar>
  )
}

export default TeacherRequestLesson