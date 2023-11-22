import React, { useState } from "react";
import logo from "../Images/gamers_icon.png";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material"; // Import Button from MUI
import axios from "axios";


function Welcome() {
  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [showUpdateUsername, setShowUpdateUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  console.log(userData);
  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }
  
  const handleUpdateUsername = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userData.data.token}`,
        },
      };
      await axios.put(
        `https://mern-project-final-rho.vercel.app/user/update-username/${userData.data._id}`,
        { newUsername },
        config
      );

      // Optionally, you can refresh the user data or perform any other actions after a successful update
      console.log('Username updated successfully');
    } catch (error) {
      console.error('Error updating username:', error);
    }

    // Hide the username update input after update
    setShowUpdateUsername(false);
  };

  return (
    <div className={"welcome-container" + (lightTheme ? "" : " dark")}>
      <motion.img
        drag
        whileTap={{ scale: 1.05, rotate: 360 }}
        src={logo}
        alt="Logo"
        className="welcome-logo"
      />
      <b>Hi , {userData.data.name} 👋</b>
      <p>Chat directly with players in our Game Rooms—connect and play!</p>
      {/* Button to show the input field for updating the username */}
      <Button onClick={() => setShowUpdateUsername(!showUpdateUsername)}>
        Update Username
      </Button>

      {/* Input field for updating the username */}
      {showUpdateUsername && (
        <div>
          <input
            type="text"
            placeholder="New Username"
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <Button onClick={handleUpdateUsername}>Save</Button>
        </div>
      )}
    </div>
  );
}

export default Welcome;
