import React, { useContext, useEffect, useState } from "react";
import "./myStyles.css";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import logo from "../Images/gamers_icon.png";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";
import { Button } from "@mui/material";


function Groups() {
  //const [refresh, setRefresh] = useState(true);
  const { refresh, setRefresh } = useContext(myContext);

  const lightTheme = useSelector((state) => state.themeKey);
  const dispatch = useDispatch();
  const [groups, SetGroups] = useState([]);
  const [showUpdateUsername, setShowUpdateUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');

  const userData = JSON.parse(localStorage.getItem("userData"));
   console.log("Data from LocalStorage : ", userData);
  const nav = useNavigate();
  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }

  const user = userData.data;
  useEffect(() => {
    console.log("Users refreshed : ", user.token);
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .get("http://localhost:8080/chat/fetchGroups", config)
      .then((response) => {
        console.log("Group Data from API ", response.data);
        SetGroups(response.data);
      });
  }, [refresh]);
  const handleUpdateUsername = async () => {
    // Add logic to update the username, e.g., make an API call
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };
  
    try {
      await axios.put(
        "http://localhost:8080/user/updateUsername",
        {
          userId: user._id,
          newUsername: newUsername,
        },
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
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          ease: "anticipate",
          duration: "0.3",
        }}
        className="list-container"
      >
        <div className={"ug-header" + (lightTheme ? "" : " dark")}>
          <img
            src={logo}
            style={{ height: "2rem", width: "2rem", marginLeft: "10px" }}
          />
          <p className={"ug-title" + (lightTheme ? "" : " dark")}>
            Available Groups
          </p>
          <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={() => {
              setRefresh(!refresh);
            }}
          >
            <RefreshIcon />
          </IconButton>
        </div>

        {/* Input and button for updating username */}
      {showUpdateUsername && (
        <div className={"sb-search" + (lightTheme ? "" : " dark")}>
          <input
            placeholder="New Username"
            className={"search-box" + (lightTheme ? "" : " dark")}
            value={newUsername}
            onChange={(e) => setNewUsername(e.target.value)}
          />
          <Button onClick={handleUpdateUsername}>Update Username</Button>
        </div>
      )}

        <div className={"sb-search" + (lightTheme ? "" : " dark")}>
          <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
            <SearchIcon />
          </IconButton>
          <input
            placeholder="Search"
            className={"search-box" + (lightTheme ? "" : " dark")}
          />
        </div>
        <div className="ug-list">
          {groups.map((group, index) => {
            return (
              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className={"list-tem" + (lightTheme ? "" : " dark")}
                key={index}
                onClick={() => {
                  console.log("Creating chat with group", group.name);
                   const config = {
                     headers: {
                       Authorization: `Bearer ${userData.data.token}`,
                     },
                   };
                   axios.post(
                     "http://localhost:8080/chat/",
                     {
                       userId: user._id,
                     },
                     config
                   );
                  dispatch(refreshSidebarFun());
                }}
              >
                <p className={"con-icon" + (lightTheme ? "" : " dark")}>T</p>
                <p className={"con-title" + (lightTheme ? "" : " dark")}>
                  {group.chatName}
                </p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Groups;
