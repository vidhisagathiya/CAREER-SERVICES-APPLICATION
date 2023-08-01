import React, { useState, useEffect } from "react";
import { Container, Paper, Box, TextField } from "@mui/material";
import { useTheme } from "../theme/ThemeProvider";
import "../../css_files/jobpost.css";

function RegisteredStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Fetch registered students from the server
    fetch("/api/users/students")
      .then((response) => response.json())
      .then((data) => {
        setStudents(data.data.registeredStudents);
      })
      .catch((error) => {
        console.error("Error fetching registered students:", error);
      });
  }, []);