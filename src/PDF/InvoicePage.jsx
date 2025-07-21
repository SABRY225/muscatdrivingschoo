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

const styles = StyleSheet.create({
    page: {
        padding: 30,
        fontSize: 14,
        fontFamily: "Helvetica",
        backgroundColor: "#f8f8f8",
    },
    container: {
        backgroundColor: "#fff",
        border: "1pt solid #ccc",
        borderRadius: 4,
        padding: 20,
    },
    title: {
        fontSize: 18,
        textAlign: "center",
        marginBottom: 20,
        color: "#800020",
    },
    section: {
        marginBottom: 10,
        lineHeight: 1
    },
    label: {
        fontWeight: "bold",
        fontSize: "12px"
    },
    label2: {
        fontSize: "12px"
    },
    footer: {
        marginTop: 10,
        textAlign: "center",
        fontSize: 12,
        color: "#555",
    },
    description: {
        fontSize: 12,
        textAlign: "center",
        marginBottom: 20,
        color: "#333",
    },

    logo: {
        width: 50,
        alignSelf: "center",
        marginBottom: 20,
        border: "1pt solid #ccc",
        borderRadius: 50,
    },
    QrCode:{
        width: 70,
        alignSelf: "center",
        marginBottom: 20,
        border: "5px solid #000",
    }
});



const InvoicePDF = () => {
    const {sessionType,sessionId,sessionCreatedAt,studentName,TeacherFirstName,TeacherLastName,TeacherEmail,TeacherPhone,sessionPrice,sessionCurrency}=useParams();

    return (
        <PDFViewer width="100%" height="700">
            <Document>
                <Page size={[400, 520]} style={styles.page}>
                    <View style={styles.container}>
                        {/* 🔗 اللوجو (تقدر تغيره أو تحذفه) */}
                        <Image
                            src="/logo.png"
                            style={styles.logo}
                        />
                        <Image
                            src="/Muscat Driving School.png"
                            style={styles.QrCode}
                        />


                        <Text style={styles.title}>Payment Invoice</Text>
                        {/* <Text style={styles.description}>{descraption}</Text> */}

                        <View style={styles.section}>
                            <Text>
                                <Text style={styles.label}>Student Name: </Text>
                                <Text style={styles.label2}>{studentName}</Text>

                            </Text>
                            <Text>
                                <Text style={styles.label}>Teacher Name: </Text>
                                <Text style={styles.label2}>{TeacherFirstName+" "+TeacherLastName}</Text>
                            </Text>
                            <Text>
                                <Text style={styles.label}>Teacher Email: </Text>
                                <Text style={styles.label2}>{TeacherEmail}</Text>
                            </Text>
                            <Text>
                                <Text style={styles.label}>Teacher Phone: </Text>
                                <Text style={styles.label2}>{TeacherPhone}</Text>
                            </Text>
                            <Text>
                                <Text style={styles.label}>Invoice ID: </Text>
                                <Text style={styles.label2}>INV-{sessionId}</Text>
                            </Text>
                            <Text>
                                <Text style={styles.label}>Date: </Text>
                                <Text style={styles.label2}>{new Date(sessionCreatedAt).toLocaleDateString("en-EG")}</Text>
                            </Text>
                        </View>
                        <View style={styles.section}>
                            <Text>
                                <Text style={styles.label}>Payment Type: </Text>
                                <Text style={styles.label2}>{sessionType==="session"?"Lesson":sessionType}</Text>
                            </Text>
                            <Text>
                                <Text style={styles.label}>Amount: </Text>
                                <Text style={styles.label2}>{sessionPrice}{" "}{sessionCurrency}</Text>
                            </Text>
                        </View>

                        <Text style={styles.footer}>
                            Payment completed successfully. Thank you for using our Muscat Driving School
                        </Text>
                    </View>
                </Page>
            </Document>
        </PDFViewer>
    );
};

export default InvoicePDF;
