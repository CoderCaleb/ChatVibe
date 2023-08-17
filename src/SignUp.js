import React, { useState, useEffect } from 'react';
import { Tilt } from 'react-tilt';
import {
  CreateUserWithEmailAndPassword,
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from 'firebase/auth';
import {
  update, ref, getDatabase, get,
} from 'firebase/database';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import loadingAni from './images/spinner-loader.gif';
import abstractBg from './images/abstract-img.jpeg';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [showError, setShowError] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  function generateRandomCode() {
    const code = Math.floor(Math.random() * 9000) + 1000;
    return code.toString();
  }

  function checkUsername() {
    if (!username.length > 0) {
      setNameError('Please enter your name');
      return false;
    }
    setNameError('');
    return true;
  }
  function checkEmail() {
    if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
      setEmailError('Please enter a valid email');
      return false;
    }
    setEmailError('');
    return true;
  }
  function checkPassword() {
    const hasNumber = /\d/;
    if (password.length == 0) {
      setPasswordError('Password cannot be empty');
    } else if (password.length <= 7 && password.length > 0) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    } else if (!hasNumber.test(password)) {
      setPasswordError('Password needs to have at least 1 number');
      return false;
    } else if (!/[a-zA-Z]/.test(password)) {
      setPasswordError('Password needs to have at least 1 letter');
      return false;
    } else {
      setPasswordError('');
      return true;
    }
  }
  useEffect(() => {
    checkPassword();
    checkEmail();
    checkUsername();
    setShowError(false);
  }, [username, password, email]);
  function checkAndSaveCode(user, userCode) {
    const codesRef = ref(
      getDatabase(),
      `userCodes/${user.displayName}/${userCode}`,
    );
    const usersRef = ref(getDatabase(), 'users');

    get(codesRef).then((snapshot) => {
      if (!snapshot.exists()) {
        update(usersRef, {
          [user.uid]: {
            name: user.displayName,
            email: user.email,
            userCode,
          },
        }).then(() => {
          const userCodesRef = ref(
            getDatabase(),
            `userCodes/${user.displayName}`,
          );
          update(userCodesRef, {
            [userCode]: user.uid,
          });
        }).then(() => {
          toast.success('Sign up successful!. Try signing in.');
        }).catch(() => {
          toast.error('Failed to sign up. Try again...');
        });
      } else {
        checkAndSaveCode(user, generateRandomCode());
      }
    });
  }
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
      <div className="flex max-w-si h-signUpHeight md:w-10/12 w-11/12 md:min-w-signUpMin max-w-maxSignUp rounded-lg overflow-hidden m-auto shadow-lg shadow-slate-600">
        <div className="relative justify-center items-center flex-1 hidden md:flex">
          <p className="absolute text-3xl z-50 font-bold text-blue-700 text-center">
            Immerse Yourself in Interaction
          </p>
          <img src={abstractBg} className="h-full w-full" />
        </div>
        <div className=" md:w-96 w-full bg-neutral-900 px-5 py-7">
          <p className="text-white text-xl mb-1">Sign up</p>
          <p className="text-white text-xs font-light mb-3">
            Discover a new way to communicate - sign up for our innovative chat
            app
          </p>
          <p className="text-white text-xs font-light text-neutral-400 mt-4">
            Your name
          </p>
          <input
            placeholder="Kebob Tan"
            className="w-full rounded-lg h-9 bg-stone-900 mt-1 placeholder-neutral-500 pl-2 text-xs text-white outline-none border-neutral-600 border"
            onChange={(event) => {
              setUsername(event.target.value);
            }}
            value={username}
          />
          <p
            className={
              `text-red-400 text-xs${showError ? ' block' : ' hidden'}`
            }
          >
            {nameError}
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
          <p
            className={
              `text-red-400 text-xs${showError ? ' block' : ' hidden'}`
            }
          >
            {emailError}
          </p>
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
          <p
            className={
              `text-red-400 text-xs${showError ? ' block' : ' hidden'}`
            }
          >
            {passwordError}
          </p>

          <button
            className="w-full h-9 text-sm mt-3 mb-2 bg-btnColor rounded-lg hover:opacity-80 transition:all duration-200"
            disabled={isSigningUp}
            onClick={() => {
              if (checkEmail() && checkPassword && checkUsername()) {
                setIsSigningUp(true);
                const auth = getAuth();
                createUserWithEmailAndPassword(auth, email, password)
                  .then((value) => {
                    const { user } = value;
                    updateProfile(user, {
                      displayName: username,
                      photoURL:
                        'https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg',
                    }).then((value) => {
                      checkAndSaveCode(user, generateRandomCode());
                    });
                  })
                  .catch((err) => {
                    if (err == 'FirebaseError: Firebase: Error (auth/email-already-in-use).'
                    ) {
                      toast.error('Email already in use. Try another one.');
                    } else {
                      toast.error('Something went wrong. Try again...');
                    }
                  }).finally((value) => {
                    setIsSigningUp(false);
                  });
              } else {
                setShowError(true);
              }
            }}
          >
            {!isSigningUp ? <p>Sign Up</p> : <img src={loadingAni} className="w-6 h-6 m-auto" />}
          </button>
          <p className="text-xs text-white text-center">
            Already have an account?
            {' '}
            <Link to="/auth/signin">
              <span className=" text-btnColor cursor-pointer">Sign In</span>
            </Link>
          </p>
        </div>
      </div>
      <ToastContainer theme="dark" position="top-center" />
    </div>
  );
}
