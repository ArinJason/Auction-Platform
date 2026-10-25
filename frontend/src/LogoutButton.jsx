import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();
  const isSignedIn = Boolean(
    localStorage.getItem("token") && localStorage.getItem("user")
  );

  if (!isSignedIn) return null;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <button className="logout-button" type="button" onClick={handleLogout}>
      Log out
    </button>
  );
};

export default LogoutButton;