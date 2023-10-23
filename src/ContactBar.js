import React, { useState, useEffect, useContext } from "react";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { Link, useParams } from "react-router-dom";
import { MessageContext } from "./App";
import nocontact from "./images/no-contact-img.png";

export default function ContactBar() {
  const {
    messages,
    isSignedIn,
    filteredArr,
    setFilteredArr,
    originalRef,
    unreadData,
    userInfo,
  } = useContext(MessageContext);
  useEffect(() => {
    console.log("Contacts", filteredArr);
  }, [filteredArr]);
  return (
    <div
      className={`flex-1 border-r border-l border-borderColor w-72 flex-col md:flex-none md:flex${
        Object.keys(messages).length !== 0 ? " hidden" : " flex"
      }`}
    >
      <div className="mx-5">
        <input
          placeholder="Search"
          className=" z-50 w-full my-5 bg-inputColor rounded py-2 text-white pl-2 outline-none placeholder-borderColor shadow-sm shadow-slate-500"
          onChange={(event) => {
            if (event.target.value !== "") {
              const filteredResult = originalRef.current.filter(
                (value, index) => value.chatName.includes(event.target.value)
              );
              setFilteredArr([...filteredResult]);
            } else {
              setFilteredArr([...originalRef.current]);
            }
          }}
        />
      </div>
      {filteredArr.length > 0 ? (
        <div className="flex flex-col overflow-y-scroll">
          {filteredArr.map((value, index) => {
            const userKeys = value.participants
              ? Object.keys(value.participants)
              : {};
            const userValues = value.participants
              ? Object.values(value.participants)
              : {};
            return (
              <ContactBox
                name={
                  value.type == "duo"
                    ? userValues[1] && userValues[0]
                      ? userKeys[0] == isSignedIn.uid //check if contact is duo or gc
                        ? userValues[1]
                        : userValues[0]
                      : ""
                    : value.chatName
                }
                uid={
                  value.type == "duo"
                    ? userKeys[1] && userKeys[0]
                      ? userKeys[0] == isSignedIn.uid
                        ? userKeys[1]
                        : userKeys[0]
                      : ""
                    : null
                }
                key={index}
                lastMsg={value.lastMsg ? value.lastMsg : " "}
                pfp={
                  value.type == "duo"
                    ? userValues[1] && userValues[0]
                      ? userKeys[0] == isSignedIn.uid
                        ? userValues[1][0].toUpperCase()
                        : userValues[0][0].toUpperCase()
                      : ""
                    : value.pfp
                }
                chatKey={value.chatId}
                type={value.type}
                unreadData={unreadData[value.chatId]}
                filteredArr={filteredArr}
                userInfo={userInfo}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center text-white justify-center gap-4 mt-16">
          <img src={nocontact} className=" w-36" />
          <div className="m-auto text-center">
            <p className="text-xl">No chats available</p>
            <p className="text-subColor text-sm">
              Create contacts and chats by clicking on the plus button at the
              side
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function ContactBox({
  name,
  pfp,
  lastMsg,
  chatKey,
  type,
  unreadData,
  uid,
  filteredArr,
  userInfo,
}) {
  const { chatId } = useParams();
  const [userPfp, setUserPfp] = useState(null);
  useEffect(() => {
    console.log(name, uid);
  }, [lastMsg]);
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
  useEffect(() => {
    if(Object.keys(filteredArr).length===Object.keys(userInfo.chats).length){
      if (uid) {
        const pfpRef = ref(getDatabase(), `/users/${uid}/pfpInfo/pfpLink`);
        get(pfpRef).then((snapshot) => {
          if (snapshot.exists()) {
            console.log(type, uid,name, "User pfp", snapshot.val());
            setUserPfp(snapshot.val());
          } else {
            console.log(type,name, uid, "User pfp", snapshot.val(), "Doesnt exist");
            setUserPfp(null);
          }
        });
      } else {
        setUserPfp(null);
        console.log(uid,name, userPfp, "User pfp", "returning null");
      }
    }
  }, [filteredArr]);

  return (
    <Link to={`/homescreen/${chatKey}`}>
      <div
        className={`flex gap-2 h-16 items-center pl-5 border-t border-borderColor cursor-pointer hover:bg-slate-700 relative${
          chatId == chatKey ? " bg-slate-800" : ""
        }`}
        onClick={()=>{}}
      >
        <div />
        <button
          className={`flex w-10 h-10 justify-center items-center rounded-xl bg-stone-800 text-2xl${
            type == "duo" ? ` text-base${getColorFromLetter(name)}` : ""
          }`}
          onClick={() => {}}
        >
          {!userPfp ? (
            <p className="text-white">{pfp}</p>
          ) : (
            <img src={userPfp} className="w-full h-full rounded-xl" />
          )}
        </button>
        <div>
          <p className={`text-white${unreadData ? " font-semibold" : ""}`}>
            {name}
          </p>
          <p
            className={` text-subColor text-xs${
              unreadData ? " font-semibold text-sm text-white" : ""
            }`}
          >
            {lastMsg.length >= 27 ? `${lastMsg.slice(0, 27)}...` : lastMsg}
          </p>
        </div>
        <div
          className={`w-5 h-5 flex justify-center items-center rounded-3xl bg-secondary text-white ml-20  absolute right-3${
            unreadData && unreadData !== 0 ? "" : " hidden"
          }`}
        >
          <p>{unreadData || ""}</p>
        </div>
      </div>
    </Link>
  );
}
