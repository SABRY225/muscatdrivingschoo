import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Grid, Card, CardContent, Typography, Button, Avatar } from '@mui/material';

const features = [
  {
    id: 1,
    title: "Points And Rewards",
    highlighted: true,
    icon: "Invitation.png",
    titleLink:"Getting to know the system",
    link: "/ractiveSystemInfo"
  },
  {
    id: 2,
    title: "Advertisements",
    highlighted: false,
    icon: "ads.png",
    titleLink:"addAds",
    link: "/loginGuest"
  },
  {
    id: 3,
    title: "careers",
    highlighted: true,
    titleLink:"more careers",
    icon: "jobs.png",
    link: "/careers"
  }
];

const FeaturesSection = () => {
  const { t } = useTranslation();

  return (
    <Box sx={{ py: 4, px: 2,mx:7 }}>
      <Grid container spacing={3} justifyContent="center">
        {features.map((feature) => (
          <Grid item xs={12} sm={6} md={4} key={feature.id}>
            <Card
              sx={{
                height: '100%',
                backgroundColor: feature.highlighted ? '#800020' : 'grey.100',
                borderRadius:5,
                transition: '0.3s',
                '&:hover': {
                  boxShadow: 8,
                },
                textAlign: 'center',
              }}
            >
              <CardContent>
                <Avatar
                  src={feature.icon}
                  alt={feature.title}
                  sx={{ width: 80, height: 80, mx: 'auto', mb: 2 ,bgcolor:"#fff",p:1,borderRadius:50}}
                  variant="rounded"
                />
                <Typography variant="h6" component="h3" gutterBottom sx={{color:feature.highlighted ? '#fff' : '#000',}}>
                  {t(feature.title)}
                </Typography>
                <Button
                  variant={feature.highlighted ? 'contained' : 'outlined'}
                  color="primary"
                  component={RouterLink}
                  to={feature.link}
                  onClick={() => console.log('Link clicked:', feature.link)}
                >
                  {t(feature.titleLink)}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FeaturesSection;
