import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfilePage.css";
import { useNavigate } from "react-router-dom";
import defaultAvatar from "../pages/default-avatar.png";

function ProfilePage() {

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("");

  const token = localStorage.getItem("token");

useEffect(() => {
  if (!token) {
    window.location.href = "/login";
  }
}, [token]);
  const navigate = useNavigate();
  const handleLogout = () => {
  localStorage.removeItem("token");
  window.location.href = "/login";
};
  // LOAD USER PROFILE WHEN PAGE OPENS
  useEffect(() => {

    const fetchProfile = async () => {

      try {

        const res = await axios.get(
          "https://smartspend-backend.onrender.com/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setName(res.data.name);
        setEmail(res.data.email);
        setMobile(res.data.mobile || "");
        setLocation(res.data.location || "");

      } catch (error) {

        console.log("Failed to load profile");

      }

    };

    fetchProfile();

  }, [token]);


  // SAVE CHANGES
  const handleSave = async () => {

    try {

      await axios.put(
        "https://smartspend-backend.onrender.com/api/user/update-profile",
        { name, email, mobile, location },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Profile Updated Successfully");

    } catch (error) {

      alert("Profile update failed");

    }

  };

  return (
    <div className="profile-container">

      {/* LEFT PROFILE CARD */}
      <div className="profile-sidebar">

        <div className="user-info">
          <img
  src={defaultAvatar}
  className="w-16 h-16 rounded-full object-cover"
/>

          <div>
            <h4>{name}</h4>
            <p>{email}</p>
          </div>
        </div>

        <ul className="profile-menu">
  <li>👤 My Profile</li>
<li onClick={() => navigate("/bank")}>🏦 Bank</li>
  <li onClick={handleLogout}>🚪 Logout</li>
</ul>

      </div>


      {/* RIGHT EDIT PANEL */}
      <div className="profile-edit">

        <div className="edit-header">
         <img
  src={defaultAvatar}
  className="w-16 h-16 rounded-full object-cover"
/>

          <div>
            <h4>{name}</h4>
            <p className="text-gray-300 break-words text-sm">{email}</p>
          </div>
        </div>

        <div className="form-group">
          <label>Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Email account</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Mobile number</label>
          <input
            placeholder="Add number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Location</label>
          <input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

       <button
  className="save-btn"
  onClick={handleSave}
>
  💾 Save Changes
</button>

      </div>

    </div>
  );
}

export default ProfilePage;