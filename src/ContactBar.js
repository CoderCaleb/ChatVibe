import React from "react";
import { getAuth } from "firebase/auth";
import { useState, useEffect, useContext, useRef } from "react";
import { MessageContext } from "./App";
import { getDatabase, ref, get, onValue, off } from "firebase/database";
import { Link, useParams } from "react-router-dom";
export default function ContactBar() {
  const { userInfo, messages } = useContext(MessageContext);
  const { chatId } = useParams();
  const [lastMsg, setLastMsg] = useState("");
  const originalRef = useRef([]);
  const [filteredArr, setFilteredArr] = useState([]);
  const tempArr = [];

  useEffect(() => {
    const listenerRefs = []; // Array to store the listener references

    if (userInfo.chats) {
      Object.keys(userInfo.chats).forEach((value, index) => {
        const chatsRef = ref(getDatabase(), `/chatMetaData/${value}`);
        const callback = (snapshot) => {
          tempArr.some((obj) => Object.values(obj).includes(value))
            ? (tempArr[index] = { ...snapshot.val(), chatId: snapshot.key })
            : tempArr.push({ ...snapshot.val(), chatId: value });
          console.log("tempArr:", tempArr[0], "value", snapshot.key);
          originalRef.current = tempArr;
          setFilteredArr([...tempArr]);
        };
        const listenerRef = onValue(chatsRef, callback);
        listenerRefs.push({
          ref: chatsRef,
          callback: callback,
          unsubscribe: listenerRef,
        }); // Add the listener reference to the array
      });
    }
    // Cleanup function to unsubscribe the listeners
    return () => {
      listenerRefs.forEach((listenerRef) => {
        off(listenerRef.ref, "value", listenerRef.callback);
        listenerRef.unsubscribe();
      });
    };
  }, [userInfo]);

  return (
    <div className={"flex-1 border-r border-l border-borderColor w-72 flex-col md:flex-none md:flex"+(Object.keys(messages).length!==0?' hidden':' flex')}>
      <div className="mx-5">
        <input
          placeholder="Search"
          className=" z-50 w-full my-5 bg-inputColor rounded py-2 text-white pl-2 outline-none placeholder-borderColor shadow-sm shadow-slate-500"
          onChange={(event) => {
            console.log(event.target.value);
            if (event.target.value !== "") {
              const filteredResult = originalRef.current.filter(
                (value, index) => {
                  console.log(value.chatName);
                  return value.chatName.includes(event.target.value);
                }
              );
              console.log(
                "🚀 ~ file: ContactBar.js:46 ~ ContactBar ~ console.log(filteredArr):",
                filteredArr
              );
              setFilteredArr([...filteredResult]);
            } else {
              setFilteredArr([...originalRef.current]);
            }
          }}
        ></input>
      </div>
      {true ? (
        <div className="flex flex-col">
          {filteredArr.map((value, index) => {
            return (
              <ContactBox
                name={value.chatName}
                key={index}
                lastMsg={value.lastMsg ? value.lastMsg : " "}
                pfp={value.pfp}
                chatId={value.chatId}
              />
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

const ContactBox = ({ name, pfp, lastMsg, chatId }) => {
  return (
    <Link to={`/homescreen/${chatId}`}>
      <div className="flex gap-2 h-16 items-center pl-5 border-t border-borderColor cursor-pointer hover:bg-slate-800">
        <button
          className=" rounded-xl w-10 h-10 flex items-center justify-center bg-stone-800"
          onClick={() => {}}
        >
          {<p className=" text-2xl">{pfp}</p>}
        </button>
        <div>
          <p className="text-white">{name}</p>
          <p className=" text-subColor text-xs">
            {lastMsg.length >= 27 ? lastMsg.slice(0, 27) + "..." : lastMsg}
          </p>
        </div>
      </div>
    </Link>
  );
};
