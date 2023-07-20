import { TextField, Button, Paper } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../UserContext";
import { useTheme } from "../theme/ThemeProvider"

import "../../css_files/jobpost.css";

function Post() {

  const { currentTheme } = useTheme();
  const textColor = currentTheme === 'light' ? 'black' : 'white';

  const { user } = useContext(UserContext);
  console.log(user["_id"])

  useEffect(() => {
    if (user["User_type"] !== "employer") {
      navigate('/home')
    }
  })


  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    location: "",
    company: user["_id"]
  })

  const [postable, setPostable] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = ((e) => {
    e.preventDefault();
    setPostable(true);
  })

  const handleChange = ((e) => {
    setInputs((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value
    }))
  })

  useEffect(() => {
    if (postable) {
      fetch(`http://localhost:9000/Users/${user["_id"]}/Posts`, {

        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs)
      }).then((response) => response.json())
        .then((json) => {
          if (json["status"] === 'success') {
            navigate('/home')
          }
        }

        );
      setPostable(false)
    }
  })

  return (user["User_type"] === "employer" ?
    <>
      <div className="container1">
        <p className="form-title2" style={{ paddingTop: "5%" }}>Post New Job</p>
        <form style={{ paddingTop: "2%" }} className="postForm" onSubmit={handleSubmit}>

          <Paper style={{ color: textColor, marginBottom: '15px' }}>
            <TextField required id="title" onChange={handleChange} name="title" label="Title of Job" style={{ width: '100%' }}/>
          </Paper>

          <Paper style={{ color: textColor, marginBottom: '15px' }}>
            <TextField required multiline rows="15" id="description" onChange={handleChange} name="description" label="Job Description" style={{ width: '100%' }}/>
          </Paper>

          <Paper style={{ color: textColor, marginBottom: '15px'  }}>
            <TextField required id="location" onChange={handleChange} name="location" label="Location" style={{ width: '100%' }}/>
          </Paper>

          <Button type="submit" variant="outlined" style={{ padding: '10px', marginBottom: '5%' }}>
            Post Job
          </Button>
        </form>
      </div>
    </> :
    <>
    </>
  )
}

export default Post;