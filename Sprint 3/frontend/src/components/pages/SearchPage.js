import React, { useState } from "react";
import { TextField, Button, Container } from "@mui/material";

function SearchPage() {
  const [searchCriteria, setSearchCriteria] = useState({
    skills: "",
    qualifications: "",
    experience: "",
    location: "",
    // Add any other relevant search criteria here
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchCriteria((prevCriteria) => ({
      ...prevCriteria,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Call the backend API with the search criteria
    fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchCriteria),
    })
      .then((response) => response.json())
      .then((data) => {
        // Process the search results returned from the API
        console.log(data); // Display the search results in the console for now
      })
      .catch((error) => {
        console.error("Error fetching search results:", error);
      });
  };

  return (
    <Container>
      <h2>Search for Candidates</h2>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Skills"
          name="skills"
          value={searchCriteria.skills}
          onChange={handleChange}
          fullWidth
        />
        {/* Add other input fields for qualifications, experience, location, etc. */}
        <Button type="submit" variant="outlined" style={{ marginTop: "10px" }}>
          Search
        </Button>
      </form>
    </Container>
  );
}

export default SearchPage;
