import { Box } from '@mui/material'
import React from 'react'
import AdminLayout          from '../../components/admin/AdminLayout'
import MainBoxes            from '../../components/admin/MainBoxesExchange'

export default function AdminExchangeRequest() {
    return (
        <AdminLayout>
            <Box sx={{marginY:"40px"}}>
                <MainBoxes  />
            </Box>
        </AdminLayout>
    )
}
