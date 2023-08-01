
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Paper, Box, TextField, Button, Typography } from "@mui/material";
import UserContext from "../../UserContext";
import { useTheme } from "../theme/ThemeProvider";
import "../../css_files/jobpost.css";

function AdminDashboard() {
  const { currentTheme } = useTheme();
  const textColor = currentTheme === "light" ? "black" : "white";

  const { user, setUser } = useContext(UserContext);

  return (
    <div>
      <Container>
        <h1>Welcome to the Admin Dashboard</h1>
        <p>
          This is the home page of the admin dashboard. You can manage various admin-related tasks and settings here.
        </p>
        <Paper style={{ color: textColor }}>
          <Box mb={2}>
            <Typography variant="h6">Registered Students</Typography>
          </Box>
          <Box mb={2}>
            <Link to="/adminDashboard/registeredStudents">
              <Button variant="outlined">View Registered Students</Button>
            </Link>
          </Box>
        </Paper>

        <Paper style={{ color: textColor }}>
          <Box mb={2}>
            <Typography variant="h6">Registered Employers</Typography>
          </Box>
          <Box mb={2}>
            <Link to="/adminDashboard/registeredEmployers">
              <Button variant="outlined">View Registered Employers</Button>
            </Link>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

export default AdminDashboard;

