import React, { useEffect, useState } from 'react';
import { Button, Grid, Card, CardContent, Typography, Avatar, Divider, Box } from "@mui/material";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/admin/AdminLayout';
import Loading from '../../components/Loading';
import { useAdminComplaint } from '../../hooks/useAdminComplaint';
import { useAdminRemoveComplaint } from '../../hooks/useAdminRemoveComplaint';

function CustomerComplaints() {
  const [complaints, setComplaints] = useState([]);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { data, isData } = useAdminComplaint();
  const removeMutation = useAdminRemoveComplaint();

  useEffect(() => {
    if (!isData) {
      setComplaints(data?.data);
    }
  }, [data]);


  const handleReply = (messageId, studentId) => {
    navigate(`/admin/reply-complaint/${messageId}/${studentId}`);
  };

  const handleRemove = async (complaintId) => {
    try {
      await removeMutation.mutateAsync(complaintId);
      setComplaints((prev) => prev.filter((item) => item.id !== complaintId));
    } catch (error) {
      // Handle error (show notification, etc.)
    }
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
      <Grid container spacing={4} sx={{ p: 4, background: '#f7f7fa', borderRadius: 3 }}>
        {complaints.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: 6,
                transition: "0.3s",
                background: 'linear-gradient(135deg, #fff 80%, #e3f2fd 100%)',
                border: '1px solid #e0e0e0',
                '&:hover': {
                  boxShadow: 12,
                  transform: 'scale(1.03)',
                  borderColor: '#90caf9',
                },
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                minHeight: 370,
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
                    sx={{ width: 80, height: 80, mb: 1, boxShadow: 3, border: '2px solid #90caf9' }}
                  />
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ color: '#1976d2', mb: 0.5 }}>
                    {item.from_user?.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
                    {item.from_user?.email}
                  </Typography>
                </Box>

                <Typography variant="h6" color="error" gutterBottom textAlign="center" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {item.title}
                </Typography>

                <Typography variant="body2" color="text.secondary" sx={{ minHeight: "80px", mb: 2, px: 1, textAlign: 'center' }}>
                  {item.text}
                </Typography>

                {!item.isReply ? (
                  <Box sx={{ mt: 2, textAlign: "center", display: "flex", justifyContent: "center", gap: 2 }}>
                    <Button
                      onClick={() => handleReply(item.id, item.from_user?.id)}
                      variant="contained"
                      color="primary"
                      size="small"
                      sx={{ borderRadius: 2, fontWeight: 'bold', boxShadow: 2 }}
                    >
                      {t("Reply to the complaint")}
                    </Button>
                    <Button
                      onClick={() => handleRemove(item.id)}
                      variant="outlined"
                      color="error"
                      size="small"
                      sx={{ borderRadius: 2, fontWeight: 'bold', boxShadow: 2 }}
                    >
                      {t("Remove")}
                    </Button>
                  </Box>
                ) : (
                  <>
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
                      <strong>{t("Your reply")}:</strong> {item.reply}
                    </Typography>
                    <Box sx={{ mt: 2, textAlign: "center" }}>
                      <Button
                        onClick={() => handleRemove(item.id)}
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ borderRadius: 2, fontWeight: 'bold', boxShadow: 2 }}
                      >
                        {t("Remove")}
                      </Button>
                    </Box>
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
