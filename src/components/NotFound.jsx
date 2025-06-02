import React from "react";
import { FiAlertTriangle } from "react-icons/fi";
import Navbar from "./Navbar";

const NotFound = () => {
  return (
    <Navbar>
          <div style={styles.container}>
      <FiAlertTriangle style={styles.icon} />
      <h1 style={styles.title}>404</h1>
      <p style={styles.message}>الصفحة التي تبحث عنها غير موجودة.</p>
    </div>
    </Navbar>

  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "100px 20px",
    color: "#ff4c4c",
    margin:"10rem 0"
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 72,
    margin: 0,
  },
  message: {
    fontSize: 24,
  },
};

export default NotFound;
