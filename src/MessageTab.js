import React, { useState, useContext, useEffect, useRef } from "react";
import { getDatabase, ref, update, push, get, set } from "firebase/database";
import send from "./images/send-message.png";
import { MessageContext } from "./App";
import { Link, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { HiOutlineUserGroup } from "react-icons/hi";
import { FiLink } from "react-icons/fi";
import { FaAngleLeft } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import InfoTab from "./InfoTab";
import { MdReply } from "react-icons/md";
import cross from "./images/close.png";
export default function MessageTab() {
  const { messages, setMessages, showCodeModal, setShowCodeModal, userInfo } =
    useContext(MessageContext);
  const [text, setText] = useState("");
  const [names, setNames] = useState([]);
  const [screen, setScreen] = useState("message");
  const [replyInfo, setReplyInfo] = useState({});
  const containerRef = useRef();
  const { chatId } = useParams();
  const currentChat =
    Object.keys(messages).includes(chatId) && !!messages[chatId].messages
      ? messages[chatId].messages
      : {};
  function handleSubmit() {
    const msgType = Object.keys(replyInfo).length !== 0 ? "reply" : "normal";
    if (text.trim() !== "") {
      const tempObj = {
        content: text,
        sender: getAuth().currentUser.displayName,
        senderUID: getAuth().currentUser.uid,
        timestamp: Date.now(),
        replyInfo: msgType == "reply" ? replyInfo : false,
      };
      const chatRef = ref(getDatabase(), `/chats/${chatId}/messages`);
      const metaDataRef = ref(getDatabase(), `/chatMetaData/${chatId}`);
      push(chatRef, tempObj).then((value) => {
        update(metaDataRef, {
          lastMsg: text,
        });
      });
      setText("");
    }
  }
  function formatDateTime(timestamp) {
    const date = new Date(timestamp);

    // Extract date components
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based, so we add 1
    const year = date.getFullYear();

    // Extract time components
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    // Add leading zeros to minutes if needed
    minutes = minutes < 10 ? "0" + minutes : minutes;

    // Format the date and time
    const formattedDateTime = `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;

    return formattedDateTime;
  }
  useEffect(() => {
    if (Object.keys(messages).length !== 0 && !!containerRef.current) {
      const container = containerRef.current;
      container.scrollTo(0, container.scrollHeight);
    }
    setReplyInfo({});
  }, [messages]);
  useEffect(() => {
    setReplyInfo({});
  }, [chatId]);
  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);
  useEffect(() => {
    let namesArr = [];
    if (Object.keys(messages).length !== 0) {
      Promise.all(
        Object.keys(messages.participants).map((uid, index) => {
          const nameRef = ref(getDatabase(), "/users/" + uid + "/name");
          return get(nameRef);
        })
      )
        .then((names) => {
          const tempArr = names.map((snapshot, index) => {
            console.log(snapshot.val());
            return snapshot.val();
          });
          namesArr = tempArr.slice();
          console.log("NAME ARR:", tempArr);
          setNames(tempArr);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [messages.chatName]);

  return Object.keys(messages).length !== 0 && chatId !== "none" ? (
    <div
      className={
        "flex-1 min-w-messageMin w-1/4 flex-col relative break-words md:flex border-borderColor border-l md:border-none" +
        (Object.keys(messages).length !== 0 ? " flex" : " hidden")
      }
    >
      {screen == "message" ? (
        <>
          <div className="flex gap-2 h-24 min-h-20 items-center pl-5  bg-stone-900 mb-3 md:shadow-md shadow-slate-700">
            <Link to={"/homescreen/none"}>
              <FaAngleLeft className="md:hidden text-white text-2xl mr-3 cursor-pointer"></FaAngleLeft>
            </Link>
            <button
              className=" rounded-xl w-10 h-10 flex items-center justify-center m-auto bg-stone-800"
              onClick={() => {
                setScreen("info");
              }}
            >
              {<p className=" text-2xl">{messages.pfp}</p>}
            </button>
            <div className="flex items-center justify-between flex-1 mr-5">
              <div
                className="flex flex-col cursor-pointer"
                onClick={() => {
                  setScreen("info");
                }}
              >
                <p className="text-white">{messages.chatName}</p>
                <div className="flex flex-row">
                  {names.map((name, index) => {
                    return (
                      <p className="text-xs text-subColor" key={index}>
                        {names.length - 1 === index ? name : name + ", "}
                      </p>
                    );
                  })}
                </div>
              </div>
              <FiLink
                size={20}
                className="text-white cursor-pointer"
                onClick={() => {
                  setShowCodeModal(true);
                }}
              />
            </div>
          </div>
          <div className=" h-full mb-20 overflow-y-scroll" ref={containerRef}>
            {Object.values(!!messages.messages ? messages.messages : {}).map(
              (value, index) => {
                return (
                  <div key={index}>
                    {index > 0 ? (
                      value.senderUID !==
                        messages.messages[
                          Object.keys(messages.messages)[index - 1]
                        ].senderUID ||
                      value.timestamp -
                        messages.messages[
                          Object.keys(messages.messages)[index - 1]
                        ].timestamp >
                        60000 ||
                      value.replyInfo ? (
                        <MessageBox
                          pfp="https://wallpapers.com/images/hd/shadow-boy-white-eyes-unique-cool-pfp-nft-13yuypusuweug9xn.jpg"
                          name={value.sender}
                          msg={value.content}
                          date={formatDateTime(value.timestamp)}
                          setReplyInfo={setReplyInfo}
                          msgType={value.replyInfo}
                        />
                      ) : (
                        <div className="relative hover:bg-stone-800 h-6 group flex items-center">
                          <div
                            className="absolute right-10 text-white hidden cursor-pointer group-hover:block"
                            onClick={() =>
                              setReplyInfo({
                                name: value.sender,
                                msg: value.content,
                              })
                            }
                          >
                            <MdReply size="22" />
                          </div>
                          <p className="text-white pl-5 text-sm font-light ml-14">
                            {value.content}
                          </p>
                        </div>
                      )
                    ) : (
                      <MessageBox
                        pfp="https://wallpapers.com/images/hd/shadow-boy-white-eyes-unique-cool-pfp-nft-13yuypusuweug9xn.jpg"
                        name={value.sender}
                        msg={value.content}
                        date={formatDateTime(value.timestamp)}
                        setReplyInfo={setReplyInfo}
                        msgType={value.replyInfo}
                      />
                    )}
                  </div>
                );
              }
            )}
          </div>
          <div className=" bg-inputColor rounded-xl py-3 text-white pl-4 outline-none placeholder-borderColor absolute bottom-6 left-5 right-5 shadow-slate-600 shadow-lg flex flex-col">
            {Object.keys(replyInfo).length !== 0 ? (
              <div className="bg-slate-800 py-2 rounded-lg mr-4 pl-4 mb-4 relative">
                <img
                  src={cross}
                  className="w-3 h-3 absolute top-3 right-3 cursor-pointer"
                  onClick={() => {
                    setReplyInfo({});
                  }}
                />
                <p className="text-subColor text-sm">
                  Replying to {replyInfo.name}
                </p>
                <p>{replyInfo.msg}</p>
              </div>
            ) : (
              <></>
            )}
            <div className="flex justify-between">
              <input
                className="bg-inputColor outline-none flex-1"
                placeholder="Type message"
                onChange={(event) => {
                  setText(event.target.value);
                }}
                value={text}
                onKeyDown={(event) => {
                  if (event.key == "Enter") {
                    handleSubmit();
                  }
                }}
              ></input>
              <div>
                <img
                  src={send}
                  className="h-6 mr-4 hover:opacity-80 transition-all duration-200"
                  onClick={() => {
                    handleSubmit();
                    console.log("clicked");
                  }}
                ></img>
              </div>
            </div>
          </div>
        </>
      ) : (
        <InfoTab
          setScreen={setScreen}
          messages={messages}
          formatDateTime={formatDateTime}
        />
      )}
    </div>
  ) : (
    <div className="hidden items-center justify-center flex-1 md:flex">
      <h1 className="text-white text-xl">Start chatting with people!</h1>
    </div>
  );
}

const MessageBox = ({ pfp, name, msg, date, setReplyInfo, msgType }) => {
  const getColorFromLetter = (letter) => {
    const colors = [
      " bg-red-500",
      " bg-yellow-500",
      " bg-green-500",
      " bg-blue-500",
      " bg-indigo-500",
      " bg-purple-500",
      " bg-pink-500",
      " bg-gray-500",
    ];

    // Get the index based on the letter's char code
    const index = letter.charCodeAt(0) % colors.length;
    return colors[index];
  };
  return (
    <div className="flex flex-col justify-center py-2 pl-5 relative group hover:bg-stone-800">
      <div
        className="absolute right-10 text-white hidden cursor-pointer group-hover:block"
        onClick={() => {
          setReplyInfo({
            name: name,
            msg: msg,
          });
        }}
      >
        <MdReply size="25" />
      </div>
      {!!msgType ? (
        <div className="flex ml-14 text-subColor gap-2 text-sm items-center">
          <div className="flex gap-2 items-center">
            <div
              className={
                "rounded-3xl w-4 h-4 flex items-center justify-center" +
                getColorFromLetter(!!msgType ? msgType.name[0] : "")
              }
            >
              <p className="text-white">{!!msgType ? msgType.name[0] : ""}</p>
            </div>
            <p className=" font-semibold">{!!msgType ? msgType.name : ""}</p>
          </div>
          <p className=" font-light">{!!msgType ? msgType.msg : ""}</p>
        </div>
      ) : (
        <></>
      )}
      <div className="flex gap-4">
        <div
          className={
            "rounded-3xl w-10 h-10 flex items-center justify-center" +
            getColorFromLetter(name[0].toUpperCase())
          }
        >
          <p className="text-white">{name[0].toUpperCase()}</p>
        </div>
        <div>
          <div className="flex gap-3 items-center">
            <p className="text-white">{name}</p>
            <p className=" text-subColor text-xs">{date}</p>
          </div>
          <p className="text-white text-sm font-light">{msg}</p>
        </div>
      </div>
    </div>
  );
};
