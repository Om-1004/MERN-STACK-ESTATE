import React from "react";
import googleIcon from "../assets/img/googleIcon.png";
import { GoogleAuthProvider, signInWithPopup, getAuth } from 'firebase/auth'
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

export default function OAuth() {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app);

            const result = await signInWithPopup(auth, provider);
            
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({name: result.user.displayName, email: result.user.email, photo: result.user.photoURL})
            })

            const data = await res.json();
            dispatch(signInSuccess(data));
            navigate('/');


        } catch (error) {
            console.log("Cannot sign in with google", error);
        }
    }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={handleGoogleClick}
        className="bg-white border py-2 w-full rounded-xl mt-5 text-sm"
      >
        Login With Google
      </button>
      <img
        className="absolute top-1/2 left-3 -translate-y-[3px] w-7"
        src={googleIcon}
        alt=""
      />
    </div>
  );
}
