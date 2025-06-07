import React from 'react';
import { Button, Box, Typography, Paper } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import { useNavigate } from 'react-router-dom';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useTranslation } from 'react-i18next';

const PointsSystem = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();  

  return (
    <Box
      sx={{
        bgcolor: '#f0f4f8',
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          p: 9,
          borderRadius: 4,
          textAlign: 'center',
          bgcolor: 'white',
        }}
      >
        <HelpOutlineIcon sx={{ fontSize: 60, color: '#1976d2', mb: 2 }} />
        <Typography variant="h5" gutterBottom fontWeight="bold">
         
          {t("Points and invitations system")}

        </Typography>

        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<InfoIcon />}
          onClick={() => navigate('/ractiveSystemInfo')}
          sx={{
            px: 4,
            py: 2,
            fontWeight: 'bold',
            boxShadow: 3,
            transition: '0.3s',
            '&:hover': {
              boxShadow: 6,
              transform: 'scale(1.03)',
            },
          }}
        >
          {t("Know the details")}
        </Button>
      </Paper>
    </Box>
  );
};

export default PointsSystem;
