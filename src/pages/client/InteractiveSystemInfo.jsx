import React from 'react';
import { Box, Typography, Card, CardContent, Divider, List, ListItem, ListItemText, ListItemIcon } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import Navbar from '../../components/Navbar';
import { useTranslation } from 'react-i18next';

const InteractiveSystemInfo = () => {
    const { t } = useTranslation();

    return (
        <Navbar>
            <Box sx={{ p: 4 }}>
                {/* النظام الثاني */}
                <Card sx={{ mt: 14 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {t("Invitation System (for Teachers)")}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {t("We enable teachers to send a custom invitation link to:")}
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemIcon><CheckCircleOutlineIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={t("Other unregistered teachers.")} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckCircleOutlineIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={t("New students.")} />
                            </ListItem>
                        </List>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            {t("When a new person registers via the link: The teacher or student who invited you will receive points as a reward.")}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 2 }}>
                            {t("If a student purchases any service offered by the teacher, the teacher receives points for each purchase.")}
                        </Typography>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1">
                            {t("How does the teacher benefit from the points?")}
                        </Typography>
                        <Typography variant="body2">
                            {t("The points collected by the teacher are converted into cash amounts that can be withdrawn or used within the platform.")}
                        </Typography>
                    </CardContent>
                </Card>
                {/* النظام الأول */}
                <Card sx={{ mb: 4, mt: 10 }}>
                    <CardContent>
                        <Typography variant="h5" gutterBottom>
                            {t("Interactive Points System (for Students)")}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {t("Students can collect points for every action they take on the platform, such as:")}
                        </Typography>
                        <List dense>
                            <ListItem>
                                <ListItemIcon><CheckCircleOutlineIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={t("Purchasing a bundle, lecture, or test.")} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckCircleOutlineIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={t("Using a discount.")} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckCircleOutlineIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={t("Booking a private lesson.")} />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><CheckCircleOutlineIcon color="primary" /></ListItemIcon>
                                <ListItemText primary={t("Benefiting from a specific resource.")} />
                            </ListItem>
                        </List>
                        <Divider sx={{ my: 2 }} />
                        <Typography variant="subtitle1">
                            {t("How does the student benefit from the points?")}
                        </Typography>
                        <Typography variant="body2">
                            {t("The points collected by the student can be used later to purchase lectures, bundles, tests, or book live lessons.")}
                        </Typography>

                    </CardContent>
                </Card>

            </Box>
        </Navbar>
    );
};

export default InteractiveSystemInfo;
