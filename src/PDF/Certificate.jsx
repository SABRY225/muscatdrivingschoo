import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFViewer,
  Image,
} from "@react-pdf/renderer";
import { useParams } from "react-router-dom";
import QRCode from "qrcode";

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#f3f3f3",
    padding: 30,
    fontFamily: "Times-Roman",
  },
  container: {
    border: "5px solid #800020",
    padding: 20,
    borderRadius: 10,
    textAlign: "center",
    backgroundColor: "#ffffff",
    position: "relative",
  },
  logo: {
    width: 70,
    alignSelf: "center",
    marginBottom: 20,
    border: "1pt solid #ccc",
    borderRadius: 50,
  },
  heading: {
    fontSize: 28,
    color: "#2c3e50",
    marginBottom: 10,
  },
  subheading: {
    fontSize: 20,
    marginBottom: 10,
  },
  name: {
    fontSize: 26,
    color: "#800020",
    fontWeight: "bold",
    marginVertical: 10,
  },
  course: {
    fontSize: 22,
    color: "#1a73e8",
    marginBottom: 20,
  },
  dateSignature: {
    marginTop: 35,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 40,
  },
  date: {
    fontSize: 16,
  },
  signature: {
    fontSize: 16,
    textAlign: "center",
  },
  qrImage: {
    width: 60,
    height: 60,
    marginTop: 20,
    alignSelf: "center",
  },
  contact: {
    marginTop: 10,
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  contactRow: {
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12, // مسافة بين العناصر (خاصية غير رسمية لكن مدعومة)
  },
  contactText: {
    fontSize: 12,
    color: "#333",
    marginHorizontal: 10,
  },

});

const Certificate = () => {
  const { StudentName, teacherSignature, trainingStage, certificateDate } = useParams();
  const [qrUrl, setQrUrl] = useState(null);

  // ✅ توليد QR لصفحة الشهادة أو رابط تحقق
  useEffect(() => {
    const url = `${window.location.origin}/certificate/${StudentName}/${teacherSignature}/${trainingStage}/${certificateDate}`;
    QRCode.toDataURL(url)
      .then((data) => setQrUrl(data))
      .catch((err) => console.error(err));
  }, [StudentName, certificateDate]);

  if (!qrUrl) return null;

  return (
    <PDFViewer width="100%" height="700">
      <Document>
        <Page size={[900, 585]} style={styles.page}>
          <View style={styles.container}>
            <Image src="/logo.png" style={styles.logo} />
            <Text style={styles.heading}>Certificate of Completion</Text>
            <Text style={styles.subheading}>This is to certify that</Text>
            <Text style={styles.name}>{StudentName}</Text>
            <Text style={styles.subheading}>has successfully completed the course:</Text>
            <Text style={styles.course}>{trainingStage}</Text>

            <View style={styles.dateSignature}>
              <Text style={styles.date}>Date: {certificateDate}</Text>
              <View>
                <Text style={styles.signature}>Signature</Text>
                <Text style={{ fontWeight: 700 }}>{teacherSignature}</Text>
              </View>
            </View>

            {/* ✅ QR Code */}
            <Image src={qrUrl} style={styles.qrImage} />

            {/* ✅ Contact Info */}
            <View style={styles.contactRow}>
              <Text style={styles.contactText}>+968 94085688</Text>
              <Text style={styles.contactText}>info@muscatdrivingschool.com</Text>
              <Text style={styles.contactText}>www.muscatdrivingschool.com</Text>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default Certificate;
