import { Box } from '@mui/material'
import React from 'react'
import TeacherLayout  from '../../components/teacher/TeacherLayout'
import MainBoxesTeacher    from '../../components/teacher/MainBoxesTeacher'

export default function TeacherHome() {
    return (
        <TeacherLayout>
            <Box sx={{marginY:"40px"}}>
                <MainBoxesTeacher   />
            </Box>
        </TeacherLayout>
    )
}
