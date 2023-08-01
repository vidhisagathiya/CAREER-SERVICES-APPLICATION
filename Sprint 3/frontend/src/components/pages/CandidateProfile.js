// CandidateProfile.js
import React, { useState } from "react";
import { Container, TextField, Button } from "@mui/material";

function CandidateProfile() {
  const [profileData, setProfileData] = useState({
    name: "",
    skills: "",
    qualifications: "",
    experience: "",
    location: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the backend API to save the candidate profile data
    fetch("/api/candidates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data); // Display the response data in the console
        // Reset the form or show a success message
      })
      .catch((error) => {
        console.error("Error saving candidate profile:", error);
        // Show an error message if needed
      });
  };

  return (
    <Container>
      <h2>Candidate Profile</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Name"
          name="name"
          value={profileData.name}
          onChange={handleChange}
          fullWidth
        />
       
        <Button type="submit" variant="outlined" style={{ marginTop: "10px" }}>
          Save Profile
        </Button>
      </form>
    </Container>
  );
}

export default CandidateProfile;
