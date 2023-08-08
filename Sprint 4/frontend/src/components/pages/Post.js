import { TextField, Button, Paper } from "@mui/material";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../UserContext";
import { useTheme } from "../theme/ThemeProvider";

import "../../css_files/jobpost.css";

function Post() {
  const { currentTheme } = useTheme();
  const textColor = currentTheme === "light" ? "black" : "white";

  const { user } = useContext(UserContext);
  console.log(user["_id"]);

  useEffect(() => {
    if (user["User_type"] !== "employer") {
      navigate("/home");
    }
  }, [user]); // Add the 'user' dependency to useEffect so it runs when 'user' changes

  const [inputs, setInputs] = useState({
    title: "",
    description: "",
    location: "",
    company: user["_id"],
  });

  const [postable, setPostable] = useState(false);
  const [applied, setApplied] = useState(false); // Added state to keep track of application status

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setInputs((prevState) => ({
      ...prevState,
      applied: true, // Mark the application as applied
    }));
    setPostable(true);
  };

  const handleWithdraw = () => {
    // Function to handle job withdrawal
    fetch(`http://localhost:9000/Users/${user["_id"]}/WithdrawJob`, {
      method: "DELETE",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputs), // You can send relevant job information here if needed
    })
      .then((response) => response.json())
      .then((json) => {
        if (json["status"] === "success") {
          // Handle successful withdrawal
          setApplied(false); // Update the application status to not applied
        }
      });
  };

  useEffect(() => {
    if (postable) {
      fetch(`http://localhost:9000/Users/${user["_id"]}/Posts`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(inputs),
      })
        .then((response) => response.json())
        .then((json) => {
          if (json["status"] === "success") {
            navigate("/companyposts/-0");
          }
        });
      setPostable(false);
    }
  }, [postable, inputs, user]); // Add 'postable', 'inputs', and 'user' as dependencies

  return (
    user["User_type"] === "employer" ? (
      <div className="container1">
        <p className="form-title2" style={{ paddingTop: "5%" }}>
          Add New Job Posting
        </p>
        <form
          style={{ paddingTop: "2%" }}
          className="postForm"
          onSubmit={handleSubmit}
        >
          {/* ... (rest of the code) ... */}

          <Button
            type="submit"
            variant="outlined"
            style={{
              padding: "10px",
              marginBottom: "5%",
              backgroundColor: "black",
              color: "white",
              borderRadius: "8px",
            }}
          >
            Post Job
          </Button>
        </form>
        {applied && (
          <Button
            onClick={handleWithdraw}
            variant="outlined"
            style={{
              padding: "10px",
              backgroundColor: "red",
              color: "white",
              borderRadius: "8px",
            }}
          >
            Withdraw Application
          </Button>
        )}
      </div>
    ) : (
      <>
      </>
    )
  );
}

export default Post;
