import React from "react";
import { FiTool } from "react-icons/fi";
import TeacherLayout from "./teacher/TeacherLayout";

const UnderDevelopmentTeacher = () => {
  return (
    <TeacherLayout>
    <div style={styles.container}>
      <FiTool style={styles.icon} />
      <h2 style={styles.title}>جاري العمل على التطوير</h2>
      <p style={styles.message}>شكراً لصبركم، سنعود قريباً بمميزات جديدة!</p>
    </div>      
    </TeacherLayout>

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

export default UnderDevelopmentTeacher;
