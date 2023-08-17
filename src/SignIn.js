import React, { useState, useEffect } from 'react';
import { Tilt } from 'react-tilt';
import {
  CreateUserWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { update, ref, getDatabase } from 'firebase/database';
import { Link, useNavigate } from 'react-router-dom';
import abstractBg from './images/abstract-img.jpeg';
import loadingAni from './images/spinner-loader.gif';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    setShowError(false);
  }, [password, email]);
  return (
    <div className="w-full h-full flex items-center justify-center bg-neutral-800 bg-gradient-to-r from-purpleGrad to-blueGrad">
      <div className="absolute top-5 right-10 flex gap-3">
        <Link to="/auth/signin">
          <button className=" w-20 h-9 rounded-lg bg-transparent text-white font-semibold">
            Login
          </button>
        </Link>
        <Link to="/auth">
          <button className="w-20 h-9 rounded-xl bg-indigo-600 text-white shadow-md transition-all duration-200 hover:shadow-indigo-400">
            Sign Up
          </button>
        </Link>
      </div>
      <div className="flex max-w-maxSignUp h-96 w-10/12 md:min-w-signUpMin rounded-lg overflow-hidden m-auto shadow-lg shadow-slate-600">
        <div className="relative justify-center items-center flex-1 hidden md:flex">
          <p className="absolute text-3xl z-50 font-bold text-blue-700 text-center mx-5">
            Immerse Yourself in Interaction
          </p>
          <img src={abstractBg} className="h-full w-full" />
        </div>
        <div className=" bg-neutral-900 w-full px-5 py-7 flex flex-col justify-center md:w-96">
          <p className="text-white text-xl mb-1">Login to your account</p>
          <p className="text-white text-xs font-light text-neutral-400 mb-3">
            Welcome back! Please enter your details
          </p>

          <p className="text-white text-xs font-light text-neutral-400 mt-4">
            Your email
          </p>
          <input
            placeholder="kebob@gmail.com"
            className="w-full rounded-lg h-9 bg-stone-900 mt-1 placeholder-neutral-500 pl-2 text-xs text-white outline-none border-neutral-600 border"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            value={email}
          />
          <p className="text-white text-xs font-light text-neutral-400 mt-4">
            Your password
          </p>
          <input
            placeholder="7+ characters"
            className="w-full rounded-lg h-9 bg-stone-900 mt-1 placeholder-neutral-500 pl-2 text-xs text-white outline-none border-neutral-600 border"
            onChange={(event) => {
              setPassword(event.target.value);
            }}
            value={password}
            type="password"
          />
          <div
            className={
                `w-full h-12 bg-red-200 rounded-lg flex items-center p-3 mt-3${
                  showError ? ' flex' : ' hidden'}`
              }
          >
            <p className="text-red-500 text-xs">
              Invalid email or password. Please try again.
            </p>
          </div>
          <button
            className="w-full h-9 text-sm mt-5 mb-3 bg-btnColor rounded-lg hover:opacity-80 transition:all duration-200"
            disabled={isSigningIn}
            onClick={() => {
              const auth = getAuth();
              setIsSigningIn(true);
              signInWithEmailAndPassword(auth, email, password)
                .then((value) => {
                  const { user } = value;
                  navigate('/homescreen/none');
                })
                .catch((err) => {
                  setShowError(true);
                })
                .finally(() => {
                  setIsSigningIn(false);
                });
            }}
          >
            {!isSigningIn ? <p>Login</p> : <img src={loadingAni} className="w-6 h-6 m-auto" />}
          </button>

          <p className="text-xs text-white text-center">
            Dont have a account?
            {' '}
            <Link to="/auth">
              <span className=" text-btnColor cursor-pointer">Sign Up</span>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
