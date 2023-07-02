import React from "react";
import { getAuth } from "firebase/auth";
import { useState, useEffect, useContext } from "react";
import { MessageContext } from "./App";
import { getDatabase, ref, get } from "firebase/database";
import { Link } from "react-router-dom";
export default function ContactBar() {
  const { userInfo, messages } = useContext(MessageContext);

  const [chatKeys, setChatKeys] = useState([]);
  useEffect(() => {
    const tempArr = [];
    if (userInfo.chats) {
      const promises = Object.keys(userInfo.chats).map((value, index) => {
        const chatsRef = ref(getDatabase(), `/chats/${value}`);
        return get(chatsRef).then((snapshot) => {
          tempArr.push({...snapshot.val(),chatId:value});
        });
      });
      Promise.all(promises).then(() => {
        setChatKeys(tempArr);
      });
      //console.log("chatkeys:", tempArr[0].messages);
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
      <div className="flex flex-col">
        {chatKeys.map((value, index) => {
          return (
            <ContactBox
              name={value.chatName}
              key={index}
              lastMsg={value.messages ? "suiii" : "‎"}
              pfp="https://wallpapers.com/images/hd/shadow-boy-white-eyes-unique-cool-pfp-nft-13yuypusuweug9xn.jpg"
              chatId={value.chatId}
            />
          );
        })}
      </div>
    </div>
  );
}

const ContactBox = ({ name, pfp, lastMsg, chatId }) => {
  const { userInfo, messages } = useContext(MessageContext);

  return (
    <Link to={`/homescreen/${chatId}`}>
      <div className="flex gap-2 h-16 items-center pl-5 border-t border-borderColor cursor-pointer hover:bg-slate-800">
        <button
          className=" rounded-xl w-10 h-10 flex items-center justify-center bg-stone-800"
          onClick={() => {}}
        >
          {<p className=" text-2xl">{messages[chatId].pfp}</p>}
        </button>
        <div>
          <p className="text-white">{name}</p>
          <p className=" text-subColor text-xs">{lastMsg}</p>
        </div>
      </div>
    </Link>
  );
};
