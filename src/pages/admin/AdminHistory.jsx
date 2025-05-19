import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { Box, Button, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import Loading from "../../components/Loading";
// import { Document, Page, pdfjs } from "react-pdf";
// pdfjs.GlobalWorkerOptions.workerSrc = new URL(
//   "pdfjs-dist/build/pdf.worker.min.js",
//   import.meta.url
// ).toString();
// const options = {
//   cMapUrl: "/cmaps/",
//   standardFontDataUrl: "/standard_fonts/",
// };
function AdminHistory() {
  const { t } = useTranslation();
  const { token } = useSelector((state) => state.admin);
  const [isLoading, setIsLoading] = useState(true);
  const [url, setURl] = useState("");

  useEffect(() => {
    let controller = new AbortController();
    (async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_KEY}api/v1/admin/allReportsPDF`,
          {
            headers: {
              Authorization: token,
            },
            signal: controller.signal,
          }
        );
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        setURl(url);
        setIsLoading(false);
      } catch (err) {
        console.log(err);
      }
    })();
    return () => controller?.abort();
  }, []);

  const handleDownloadFile = async () => {
    if (isLoading) {
      console.log("Loading....");
      return;
    }
    try {
      const a = document.createElement("a");
      a.href = url;
      a.download = "all_reports_document.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <AdminLayout>
      {!isLoading ? (
        <>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "30px",
              marginTop: "20px",
            }}
          >
            <Typography sx={{ fontSize: "20px", fontWeight: "500" }}>
              {t("file_manager")}
            </Typography>
            <Button variant="contained" onClick={handleDownloadFile}>
              {t("download")}
            </Button>
          </Box>
          <iframe src={url} width="100%" height="500px" />
          {/* <Document
            file={url}
            onLoadError={console.error}
            onLoadSuccess={onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} />
          </Document> */}
          {/* <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                width={800}
              />
            ))}
          </Document> */}
        </>
      ) : (
        <Loading />
      )}
    </AdminLayout>
  );
}

export default AdminHistory;
