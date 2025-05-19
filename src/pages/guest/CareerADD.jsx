import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab }         from '@mui/material';
import React                from 'react';
import Layout               from "../../components/guest/Layout";
import Navbar               from "../../components/Navbar";
import { useTranslation }   from 'react-i18next';
import CareerAdd            from '../../components/guest/career/Add';

export default function Career() {
    const {t} = useTranslation()
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <Navbar>
        <Layout active={0} title={t("career_add")}>
            <CareerAdd        />
        </Layout>
        </Navbar>
    )
}