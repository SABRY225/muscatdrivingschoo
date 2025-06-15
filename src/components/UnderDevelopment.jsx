import React from "react";
import { FiTool } from "react-icons/fi";
import Navbar from "./Navbar";

const UnderDevelopment = () => {
  return (
    <Navbar>
    <div style={styles.container}>
      <FiTool style={styles.icon} />
      <h2 style={styles.title}>جاري العمل على التطوير</h2>
      <p style={styles.message}>شكراً لصبركم، سنعود قريباً بمميزات جديدة!</p>
    </div>      
    </Navbar>

  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "80px 20px",
    color: "#800020",
    margin:"10rem 0"
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

export default UnderDevelopment;
