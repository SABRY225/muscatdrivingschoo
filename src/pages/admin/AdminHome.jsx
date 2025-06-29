import { Box } from '@mui/material'
import React from 'react'
import AdminLayout from '../../components/admin/AdminLayout'
import MainBoxes from '../../components/admin/MainBoxes'
import NewStudentsList from '../../components/admin/NewStudentsList'

export default function AdminHome() {
    return (
        <AdminLayout>
            <Box >
                {/* <MainBoxes/> */}
                <NewStudentsList/>
            </Box>
        </AdminLayout>
    )
}
