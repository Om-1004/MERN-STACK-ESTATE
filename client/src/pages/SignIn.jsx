import React from "react";
import loginIMG from "../assets/img/loginImg.png";
import googleIcon from "../assets/img/googleIcon.png";
import { Eye } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import OAuth from "../components/OAuth";

export default function SignIn() {
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(signInStart());
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        dispatch(signInFailure(data.message));
        return;
      }
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-grey-100 flex rounded-2xl shadow-2xl max-w-6xl p-5 gap-x-8">
        <div className="w-1/2 hidden md:block">
          <img
            className="rounded-2xl h-full object-cover"
            src={loginIMG}
            alt=""
          />
        </div>
        <div className="md:w-1/2">
          <h2 className="font-bold text-2xl">Sign In</h2>
          <p className="text-sm mt-4">If you are not a user, sign up here</p>

          <form onSubmit={handleSubmit} className="flex flex-col px-8 gap-4">
            <input
              className="p-2 mt-8 rounded-xl border"
              type="email"
              name="email"
              id="email"
              placeholder="Email"
              onChange={handleChange}
            />
            <div className="relative">
              <input
                className="p-2 rounded-xl border w-full"
                type="password"
                name="password"
                id="password"
                placeholder="Password"
                onChange={handleChange}
              />
              <Eye
                className="absolute top-1/2 right-3 -translate-y-1/2"
                size={18}
              />
            </div>
            <button
              disabled={loading}
              className="bg-[#14171A] text-white rounded-xl py-2"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
          </form>

          <div className="mt-10 grid grid-cols-3 items-center text-gray-500">
            <hr className="border-gray-300" />
            <p className="text-center text-sm">OR</p>
            <hr className="border-gray-300" />
          </div>

          <OAuth />

          <p className="mt-5 text-xs border-b py-4">Forgot Password</p>
          <div className="text-sm flex justify-between mt-3 items-center">
            <p>If you do not have an account</p>
            <Link to="/sign-up">
              <button className="py-2 px-5 bg-white rounded-xl border">
                Sign Up
              </button>
            </Link>
          </div>
          {error && <p className="text-red-400">{error}</p>}
        </div>
      </div>
    </div>
  );
}
