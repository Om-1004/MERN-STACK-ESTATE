import React, { useState } from "react";
import {
  Camera,
  User,
  KeyRound,
  Mail,
  Trash2,
  LogOut,
  Menu,
} from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserSuccess,
  updateUserStart,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  signOutUserStart,
  signOutUserFailure,
} from "../redux/user/userSlice";

export default function Profile() {
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
      });
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const res = await fetch('/api/auth/signout');
      const data = res.json()
      if (data.success  === false) {
        dispatch(signOutUserFailure(data.message));
      }
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }

  return (
    <div className="text-center mt-8 mx-auto sm:text-left sm:max-w-2xl">
      <h2 className="font-bold text-3xl sm:text-4xl text-gray-900 mb-6">
        Profile
      </h2>

      {updateSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> Your profile has been updated successfully.</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-8">
          <div className="bg-blue-100 p-4 rounded-lg flex items-center justify-center">
            <User size={24} />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold">Username</p>
            <input
              type="text"
              className="text-sm text-gray-600 text-center sm:text-left"
              placeholder="Username"
              id="username"
              defaultValue={currentUser.username}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-8">
          <div className="bg-blue-100 p-4 rounded-lg flex items-center justify-center">
            <Mail size={24} />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold">Email</p>
            <input
              type="email"
              className="text-sm text-gray-600 text-center sm:text-left"
              placeholder="Email"
              id="email"
              defaultValue={currentUser.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 mb-10">
          <div className="bg-blue-100 p-4 rounded-lg flex items-center justify-center">
            <KeyRound size={24} />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-lg font-semibold">Change Password</p>
            <input
              type="password"
              className="text-sm text-gray-600 text-center sm:text-left"
              placeholder="Password"
              id="password"
              defaultValue={currentUser.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <button
          disabled={loading}
          className="block w-full sm:w-auto bg-blue-500 text-white text-lg font-medium py-2 px-5 rounded-lg hover:bg-blue-600 mb-10"
        >
          {loading ? "Loading" : "Update"}
        </button>
      </form>

      <h2 className="font-bold text-3xl sm:text-4xl text-red-600 mb-6">
        Danger Zone
      </h2>

      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mb-8">
        <div className="bg-red-100 p-4 rounded-lg flex items-center justify-center">
          <Trash2 size={24} />
        </div>
        <button onClick={handleDeleteUser} className="text-lg font-semibold text-gray-900 hover:underline">Delete Account</button>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mb-8">
        <div className="bg-yellow-100 p-4 rounded-lg flex items-center justify-center">
          <LogOut size={24} />
        </div>
        <button onClick={handleSignOut} className="text-lg font-semibold text-gray-900 hover:underline">Sign Out</button>
      </div>

      <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 mb-10">
        <div className="bg-green-100 p-4 rounded-lg flex items-center justify-center">
          <Menu size={24} />
        </div>
        <p className="text-lg font-semibold text-gray-900">Show Listings</p>
      </div>

      <button className="block w-full sm:w-96 bg-gray-200 text-gray-800 text-lg font-medium py-3 px-6 rounded-lg hover:bg-gray-300">
        Create New Listing
      </button>
    </div>
  );
}
