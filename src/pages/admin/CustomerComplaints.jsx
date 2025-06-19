import React, { useEffect, useState } from 'react';
import { Button, Grid, Card, CardContent, Typography, Avatar, Divider, Box } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/admin/AdminLayout';
import Loading from '../../components/Loading';
import { useAdminComplaint } from '../../hooks/useAdminComplaint';

function CustomerComplaints() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, isData } = useAdminComplaint();

  useEffect(() => {
    if (!isData) {
      setComplaints(data?.data);
    }
  }, [data]);

  const handleReply = (messageId, studentId) => {
    navigate(`/admin/reply-complaint/${messageId}/${studentId}`);
  };

 return (
  <AdminLayout>
    {!complaints ? (
      <Loading />
    ) : complaints.length === 0 ? (
      <Box sx={{ textAlign: "center", mt: 5 }}>
        <Typography variant="h6" color="text.secondary">
          {t("There are no complaints")}
        </Typography>
      </Box>
    ) : (
      <Grid container spacing={3} sx={{ p: 3 }}>
        {complaints.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: 4,
                transition: "0.3s",
                "&:hover": { boxShadow: 6 },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
                  <Avatar
                    src={
                      item.from_user?.image
                        ? `${process.env.REACT_APP_API_KEY}images/${item.from_user?.image}`
                        : "/logo.png"
                    }
                    alt="avatar"
                    sx={{ width: 80, height: 80, mb: 1 }}
                  />
                  <Typography variant="subtitle1" fontWeight="bold">
                    {item.from_user?.name}
                  </Typography>
                </Box>

                <Typography variant="h6" color="error" gutterBottom textAlign="center">
                  {item.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ minHeight: "80px" }}>
                  {item.text}
                </Typography>

                {!item.isReply ? (
                  <Box sx={{ mt: 2, textAlign: "center" }}>
                    <Button
                      onClick={() => handleReply(item.id, item.from_user?.id)}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      {t("Reply to the complaint")}
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" color="text.secondary">
                      <strong>{t("Your reply")}:</strong> {item.reply}
                    </Typography>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    )}
  </AdminLayout>
);

}

export default CustomerComplaints;
