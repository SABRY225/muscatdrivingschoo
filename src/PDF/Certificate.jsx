// src/components/Certificate.jsx
import React from "react";
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

// 🖌️ تنسيقات الشهادة
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
  dateStudent:{
    marginTop: 10,
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
    textAlign:"center"
  },
});

// 📄 مكون الشهادة
const Certificate = () => {
  const {StudentName,teacherSignature,trainingStage,certificateDate}=useParams()
  return (
    <PDFViewer width="100%" height="700">
      <Document>
        <Page size={[842, 500]} style={styles.page}>
          <View style={styles.container}>
            {/* 🔗 اللوجو (تقدر تغيره أو تحذفه) */}
            <Image
              src="/logo.png"
              style={styles.logo}
            />

            <Text style={styles.heading}>Certificate of Completion</Text>
            <Text style={styles.subheading}>This is to certify that</Text>
            <View style={styles.dateStudent}>
              <Text style={styles.name}>{StudentName}</Text>
            <Text style={styles.subheading}>
              has successfully completed the course:
            </Text>
            <Text style={styles.course}>{trainingStage}</Text>
            </View>

            <View style={styles.dateSignature}>
              <Text style={styles.date}>Date: {certificateDate}</Text>
              <View >
                <Text style={styles.signature}>Signature</Text>
                <Text style={{fontWeight:700}}>{teacherSignature}</Text>
              </View>
            </View>
          </View>
        </Page>
      </Document>
    </PDFViewer>
  );
};

export default Certificate;
