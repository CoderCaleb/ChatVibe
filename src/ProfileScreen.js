import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { MessageContext } from "./App";
import { MdOutlineCancel } from "react-icons/md";
import { ref, getDatabase, get, update } from "firebase/database";
import { FaUserSecret } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
export default function ProfileScreen() {
  const {
    userInfo,
    messages,
    names,
    userState,
    isSignedIn,
    filteredArr,
    setFilteredArr,
    originalRef,
    profileScreen,
    setProfileScreen,
  } = useContext(MessageContext);
  const [aboutMe, setAboutMe] = useState("");
  useEffect(() => {
    if (userInfo.about) {
      setAboutMe(userInfo.about);
    }
  }, [userInfo.about]);
  const getColorFromLetter = (letter) => {
    const colors = [
      " bg-gradient-to-r from-red-500 to-pink-500",
      " bg-gradient-to-r from-yellow-500 to-green-500",
      " bg-gradient-to-r from-green-500 to-blue-500",
      " bg-gradient-to-r from-blue-500 to-indigo-500",
      " bg-gradient-to-r from-indigo-500 to-purple-500",
      " bg-gradient-to-r from-purple-500 to-pink-500",
      " bg-gradient-to-r from-pink-500 to-red-500",
      " bg-gradient-to-r from-gray-500 to-gray-700",
    ];

    // Get the index based on the letter's char code
    const index = letter.charCodeAt(0) % colors.length;
    return colors[index];
  };
  const navigate = useNavigate();
  return (
    <div className=" m-8 text-white flex-1 relative overflow-scroll">
      <MdOutlineCancel
        className="absolute top-10 right-7 text-4xl text-subColor cursor-pointer"
        onClick={() => {
          setProfileScreen(false);
        }}
      />
      <div className="flex gap-3 h-min items-center">
        <div
          className={
            "flex w-32 h-32 justify-center items-center rounded-xl bg-stone-800 text-2xl" +
            getColorFromLetter(isSignedIn.displayName)
          }
          onClick={() => {}}
        >
          {
            <p className={"text-7xl"}>
              {isSignedIn.displayName[0].toUpperCase()}
            </p>
          }
        </div>
        <div className=" h-min">
          <p className=" text-4xl font-bold">{isSignedIn.displayName}</p>
          <p className="text-subColor">
            {isSignedIn.displayName + "#" + userInfo.userCode}
          </p>
        </div>
        <div className="group relative">
          <FiLogOut className="text-gray-400 text-lg cursor-pointer ml-2" />
          <div
            className="flex justify-center items-center bg-slate-800 px-2 py-1 rounded-md absolute w-max top-6 scale-0 group-hover:scale-100 transition-all duration-300 cursor-pointer"
            onClick={() => {
              signOut(getAuth())
                .then(() => {
                  navigate("/auth/signin");
                })
                .catch(() => {
                  toast.error("Failed in sign out. Please try again...");
                });
            }}
          >
            <p>Log Out</p>
          </div>
        </div>
      </div>
      <div className="mt-6 mb-5">
        <p className="font-semibold text-xl">Your profile</p>
        <p className="text-subColor text-sm">
          Edit and view your profile details here
        </p>
      </div>
      <div className="bg-subColor h-onePixel w-full mb-5"></div>
      <div className="block gap-32 items-center md:flex">
        <div className="flex flex-col w-44 mb-4 md:mb-0">
          <p>User Credidentials</p>
          <p className="text-subColor text-sm">
            All your user info will be displayed here
          </p>
        </div>
        <div className="bg-primary rounded-lg p-4 flex flex-col gap-3 shadow-slate-800 w-full md:w-8/12">
          <div className="">
            <p className=" text-slate-500 font-semibold">Username</p>
            <p>
              {isSignedIn.displayName}
              <span className="text-subColor">{"#" + userInfo.userCode}</span>
            </p>
          </div>
          <div>
            <p className=" text-slate-500 font-semibold">Email</p>
            <p>{isSignedIn.email}</p>
          </div>
        </div>
      </div>
      <div className="bg-subColor h-onePixel w-full mb-5 mt-5"></div>
      <div className="gap-32 items-center block md:flex">
        <div className="flex flex-col w-44 mb-4 md:mb-0">
          <p>About Me</p>
          <p className="text-subColor text-sm">Edit your About Me here</p>
        </div>
        <div>
          <div>
            <textarea
              className="bg-primary resize-none w-full md:w-80 h-28 rounded-lg outline-none p-3 mb-4"
              placeholder="Tell us a bit about yourself..."
              value={aboutMe}
              onChange={(event) => {
                setAboutMe(event.target.value);
              }}
            />
          </div>
          <button
            className={
              "done-button w-20 h-9" +
              (aboutMe.length > 0 &&
              aboutMe.length <= 180 &&
              aboutMe !== userInfo.about
                ? ""
                : " bg-gray-600 pointer-events-none")
            }
            onClick={() => {
              const userRef = ref(getDatabase(), `users/${isSignedIn.uid}`);
              const aboutLength = aboutMe.length;
              if (aboutLength > 0 && aboutLength <= 180) {
                update(userRef, {
                  about: aboutMe,
                })
                  .then(() => toast.success("About me successfully updated!"))
                  .catch(() =>
                    toast.error("Failed in update about me. Try again")
                  );
              }
            }}
          >
            Submit
          </button>
        </div>
      </div>
      <ToastContainer theme={"dark"} position={"top-center"} />
    </div>
  );
}
