import React from "react";
import { useState, useEffect, useContext, useRef } from "react";
import { MessageContext } from "./App";
import { MdOutlineCancel } from "react-icons/md";
import { ref, getDatabase, get, update } from "firebase/database";

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
  const [aboutMe,setAboutMe] = useState('')
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
      </div>
      <div className="mt-6 mb-5">
        <p className="font-semibold text-xl">Your profile</p>
        <p className="text-subColor text-sm">
          Edit and view your profile details here
        </p>
      </div>
      <div className="bg-subColor h-onePixel w-full mb-5"></div>
      <div className="flex gap-32 items-center">
        <div className="flex flex-col w-44">
          <p>User Credidentials</p>
          <p className="text-subColor text-sm">
            All your user info will be displayed here
          </p>
        </div>
        <div className="bg-primary rounded-lg p-4 flex flex-col w-8/12 gap-3 shadow-slate-800">
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
      <div className="flex gap-32 items-center">
        <div className="flex flex-col w-44">
          <p>About Me</p>
          <p className="text-subColor text-sm">Edit your About Me here</p>
        </div>
        <div>
            <div>
          <textarea className="bg-primary resize-none w-80 h-28 rounded-lg outline-none p-3 mb-4" placeholder="Tell us a bit about yourself..." onChange={(event)=>{
            setAboutMe(event.target.value)
          }}/>
          </div>
          <button className={"done-button w-20 h-9"+(aboutMe.length>0&&aboutMe.length<=180?'':' bg-gray-600 pointer-events-none')} onClick={()=>{
            const userRef = ref(getDatabase(),`users/${isSignedIn.uid}`)
            const aboutLength = aboutMe.length
            if(aboutLength>0&&aboutLength<=180){
                update(userRef,{
                    about:aboutMe
                })
            }
          }}>Submit</button>
        </div>
      </div>
    </div>
  );
}
