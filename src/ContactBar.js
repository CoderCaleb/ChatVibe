import React from "react";
import { getAuth } from "firebase/auth";
import { useState, useEffect, useContext } from "react";
import { MessageContext } from "./App";
import { getDatabase, ref, get, onValue } from "firebase/database";
import { Link, useParams } from "react-router-dom";
export default function ContactBar() {
  const { userInfo, messages } = useContext(MessageContext);
  const { chatId } = useParams();
  const [lastMsg,setLastMsg] = useState('')
  const [chatKeys, setChatKeys] = useState([]);
  const tempArr = [];

  useEffect(() => {
    if (userInfo.chats) {
      const promises = Object.keys(userInfo.chats).map(async (value, index) => {
        const chatsRef = ref(getDatabase(), `/chatMetaData/${value}`);
        return onValue(chatsRef,((snapshot) => {
          tempArr.some(obj => Object.values(obj).includes(value))
          ? (tempArr[index] = { ...snapshot.val(), chatId: snapshot.key })
          : tempArr.push({ ...snapshot.val(), chatId: value });
                  console.log('tempArr:',tempArr[0],'value',snapshot.key)
          setChatKeys([...tempArr])
        }));
      });
    }

    console.log(userInfo.chats ? Object.keys(userInfo.chats) : []);
  }, [userInfo]);
  useEffect(() => {
    console.log('chatkeystate',chatKeys)
  }, [chatKeys]);
  return (
    <div className="flex border-r border-l border-borderColor w-72 flex-col">
      
      <div className="mx-5">
        <input
          placeholder="Search"
          className=" z-50 w-full my-5 bg-inputColor rounded py-2 text-white pl-2 outline-none placeholder-borderColor shadow-sm shadow-slate-500"
        ></input>
      </div>
      {Object.keys(messages).length!==0?
      <div className="flex flex-col">
        {chatKeys.map((value, index) => {
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
      </div>:null}
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
          <p className=" text-subColor text-xs">{lastMsg.length>=27?lastMsg.slice(0,27)+'...':lastMsg}</p>
        </div>
      </div>
    </Link>
  );
};
