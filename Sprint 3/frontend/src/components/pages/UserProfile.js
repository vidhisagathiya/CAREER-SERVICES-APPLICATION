import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Paper, Box, TextField } from "@mui/material";
import { useTheme } from "../theme/ThemeProvider";
import "../../css_files/jobpost.css";

function UserProfile() {
  const [userProfile, setUserProfile] = useState({});
  const { userId } = useParams();

  useEffect(() => {
    // Fetch user profile details based on userId from the server
    fetch(`/api/users/employees/${userId}`)
      .then((response) => response.json())
      .then((data) => {
        setUserProfile(data.data);
      })
      .catch((error) => {
        console.error("Error fetching user profile details:", error);
      });
  }, [userId]);

  const { currentTheme } = useTheme();
  const textColor = currentTheme === "light" ? "black" : "white";

  return (
    <div>
      <Container>
        <h2>User Profile</h2>
        <Paper style={{ color: textColor, marginBottom: "10px" }}>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Company"
              value={userProfile.company}
              variant="outlined"
              disabled
            />
          </Box>
          <Box mb={2}>
            <TextField
              fullWidth
              label="Email"
              value={userProfile.email}
              variant="outlined"
              disabled
            />
          </Box>
          {/* Add more information as needed */}
        </Paper>
      </Container>
    </div>
  );
}

export default UserProfile;
