import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Container, Paper, Box, TextField, Button, Typography } from "@mui/material";
import UserContext from "../../UserContext";
import { useTheme } from "../theme/ThemeProvider";
import "../../css_files/jobpost.css";

function AdminHome() {
  const { currentTheme } = useTheme();
  const textColor = currentTheme === "light" ? "black" : "white";

  const { user, setUser } = useContext(UserContext);
  