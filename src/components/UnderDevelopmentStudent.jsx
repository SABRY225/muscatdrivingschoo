import React from "react";
import { FiTool } from "react-icons/fi";
import StudentLayout from "./student/StudentLayout";

const UnderDevelopmentStudent = () => {
  return (
    <StudentLayout>
    <div style={styles.container}>
      <FiTool style={styles.icon} />
      <h2 style={styles.title}>جاري العمل على التطوير</h2>
      <p style={styles.message}>شكراً لصبركم، سنعود قريباً بمميزات جديدة!</p>
    </div>      
    </StudentLayout>

  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#D10909",
  },
  icon: {
    fontSize: 70,
    marginBottom: 15,
  },
  title: {
    fontSize: 36,
    marginBottom: 10,
  },
  message: {
    fontSize: 20,
  },
};

export default UnderDevelopmentStudent;
