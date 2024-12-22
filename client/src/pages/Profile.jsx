import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../../redux/user/userSlice";
import { persistor } from "../../redux/store";
import { User, Mail, KeyRound } from "lucide-react";

export default function Profile() {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [formData, setFormData] = useState(currentUser);

  useEffect(() => {
    console.log("Redux state (currentUser) after reload:", currentUser);
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Form Data Submitted:", formData);
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      console.log("Response from API:", data);

      if (!data.success) {
        dispatch(updateUserFailure(data.message || "Update failed"));
        return;
      }

      dispatch(updateUserSuccess(data)); // Update Redux store

      // Flush persisted state to storage
      await persistor.flush();
      console.log("Persisted state updated successfully");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      dispatch(updateUserFailure(error.message));
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={formData?.username || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            value={formData?.email || ""}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" id="password" onChange={handleChange} />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
