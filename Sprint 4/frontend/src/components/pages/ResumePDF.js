import React from 'react';
import { PDFViewer, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import "./css_files/resume.css"

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#E4E4E4',
    padding: 20,
  },
  section: {
    margin: 10,
    padding: 10,
  },
  heading: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  heading1: {
    fontSize: 16,
    fontWeight: 'bolder',
    marginBottom: 5,
    textAlign: 'center',
    textTransform: 'uppercase'
  },
  content: {
    fontSize: 11,
    marginBottom: 3,
  },
  contenttext: {
    fontSize: 11,
    marginBottom: 3,
    textAlign: 'center'
  },
  dflex: {
    display: 'flex !important',
    justifyContent: 'center !important',
    flexDirection: 'row !important',
  },
});

const Resume = () => (
  <Document>
    <Page style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.heading1}>Shah Karnik</Text>
        <div className="dflex" style={styles.dflex}>
          <Text style={styles.contenttext}>john.doe@example.com | (555) 555-5555 | LinkedIn: john.doe | Github: john.doe</Text>
          {/* <Text style={styles.content}>Phone: </Text> */}
        </div>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>HIGHLIGHTS OF QUALIFICATIONS:</Text>
        <Text style={styles.content}>
          Highly motivated and skilled individual with experience in web development. Passionate
          about learning and applying new technologies to create innovative solutions.
        </Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Education:</Text>
        <Text style={styles.content}>Bachelor of Science in Computer Science, XYZ University, 2015</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.heading}>Work Experience:</Text>
        <Text style={styles.content}>Web Developer, ABC Company, 2016 - Present</Text>
        <Text style={styles.content}>- Developed and maintained company websites using React, HTML, CSS, and JavaScript.</Text>
        <Text style={styles.content}>- Collaborated with design and product teams to implement new features.</Text>
      </View>
    </Page>
  </Document>
);

const ResumePDF = () => {
  const navigate = useNavigate(); // Initialize the useNavigate hook

  const handleBackToBuildResume = () => {
    navigate('/build-resume'); // Navigate back to the "BuildResume" page
  };

  return (
    <div style={{ height: '100vh' }}>
      <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
        <MyResume />
      </PDFViewer>

      {/* Button to navigate back to the "BuildResume" page */}
      <button style={{ margin: '10px' }} onClick={handleBackToBuildResume}>
        Back to Build Resume
      </button>
    </div>
  );
};

export default ResumePDF;
