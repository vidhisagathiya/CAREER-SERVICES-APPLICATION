import React, { useContext, useState } from "react";
import EditProfile from "./EditProfile";
import { TextField, Button, Container, Typography, Box, Paper } from '@mui/material';

import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import UserContext from "../../UserContext";
import { useTheme } from "../theme/ThemeProvider"
import "../../css_files/jobpost.css";

const BuildResume = () => {

  const { currentTheme } = useTheme();
  const textColor = currentTheme === 'light' ? 'black' : 'white';

  const { user, setUser } = useContext(UserContext)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user ? user.name : '',
    password: "",
    company: user ? user.company : '',
    phone: user ? user.phone : '',
  });
  const buildResume = () => {
    navigate('/resume'); 
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log("Hello");
    try {
      const response = await fetch(`http://localhost:9000/Users/${user._id}/update`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const updatedUser = await response.json();
      console.log("Updated user:", updatedUser);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };



  return (
    user ?
      <div className="profile">
        <Container>
          <p className="h5" style={{ paddingTop: "10%" }}>Update User Information</p>

          <form onSubmit={handleSubmit} style={{ paddingTop: "4%" }}>
         
              <>
                <Paper style={{ color: textColor }}>
                  <Box mb={2}>
                    <TextField
                      fullWidth
                      label="School"
                      name="school"
                      value="Vrajbhoomi International School"
                    //   onChange={handleChange}
                      variant="outlined"
                    />
                  </Box>
                </Paper>

                <Paper style={{ color: textColor }}>
                  <Box mb={2}>
                    <TextField
                      fullWidth
                      type="text"
                      label="College"
                      name="college"
                      value="SVIT vasad"
                    //   onChange={handleChange}
                      variant="outlined"
                    />
                  </Box>
                </Paper>
              </>
            
         
              <Button variant="contained" onClick={buildResume} style={{ marginTop: '10px' }}>
                Build Resume
              </Button>
       
      

         
          </form>

        </Container>
      </div> : <></>
  )
}

export default BuildResume;
