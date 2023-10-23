import React, { useState, useContext, useEffect, useRef } from "react";
import {
  getDatabase,
  ref,
  update,
  push,
  get,
  set,
  onValue,
  off,
} from "firebase/database";
import { Link, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { HiOutlineUserGroup, HiOutlineArrowNarrowRight } from "react-icons/hi";
import { AiOutlineUserDelete, AiOutlineArrowDown } from "react-icons/ai";
import { FiLink, FiEdit2 } from "react-icons/fi";
import { FaAngleLeft } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { MdReply } from "react-icons/md";
import { IoMdExit } from "react-icons/io";
import { RiAdminLine } from "react-icons/ri";
import cross from "./images/close.png";
import InfoTab from "./InfoTab";
import { MessageContext } from "./App";
import send from "./images/send-message.png";
import nochatimg from "./images/nochat-img.png";

export default function MessageTab() {
  const { messages, setShowCodeModal, names, userState, isSignedIn } =
    useContext(MessageContext);
  const [text, setText] = useState("");
  const [screen, setScreen] = useState("message");
  const [replyInfo, setReplyInfo] = useState({});
  const [metaInfo, setMetaInfo] = useState({});
  const [showDownArrow, setShowDownArrow] = useState(false);
  const [typingState, setTypingState] = useState({});
  const containerRef = useRef();
  const { chatId } = useParams();
  const [pfpList, setPfpList] = useState({});
  const timeoutId = useRef("");
  const replyRefs = useRef({});
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
      const mainUnreadRef = ref(getDatabase(), `unreadData/${userState.uid}`);
      push(chatRef, tempObj).then((value) => {
        update(metaDataRef, {
          lastMsg: text,
          lastMsgTime: Date.now(),
        }).then(() => {
          if (messages.type == "duo") {
            get(mainUnreadRef).then((snapshot) => {
              update(mainUnreadRef, {
                [chatId]: snapshot.exists() ? snapshot.val()[chatId] + 1 : 1,
              });
            });
          } else {
            names.map((userInfo, index) => {
              if (isSignedIn && userInfo.uid !== isSignedIn.uid) {
                const groupUnreadRef = ref(
                  getDatabase(),
                  `/unreadData/${userInfo.uid}`
                );
                get(groupUnreadRef).then((snapshot) => {
                  update(groupUnreadRef, {
                    [chatId]: snapshot.exists()
                      ? snapshot.val()[chatId] + 1
                      : 1,
                  });
                });
              }
            });
          }
        });
      });
      setText("");
    }
  }
  function makeNewRef(uid, ref) {
    replyRefs.current[uid] = ref;
  }
  function scrollToMsg(uid) {
    if (containerRef.current && replyRefs.current) {
      replyRefs.current[uid].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center",
      });
      replyRefs.current[uid].classList.add("grey-animation");
      setTimeout(() => {
        replyRefs.current[uid].classList.remove("grey-animation");
      }, 1000);
    }
  }
  useEffect(() => {
    const scrollContainer = containerRef.current;
    if (containerRef.current) {
      const handleScroll = () => {
        if (
          scrollContainer.scrollTop + scrollContainer.clientHeight <
          scrollContainer.scrollHeight
        ) {
          setShowDownArrow(true);
        } else {
          setShowDownArrow(false);
        }
      };
      scrollContainer.addEventListener("scroll", handleScroll);

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [containerRef.current]);
  useEffect(() => {
    const newPfpList = {};
    names.map((user, index) => {
      if (user.pfp) {
        newPfpList[user.uid] = user.pfp;
      }
    });
    setPfpList(newPfpList);
  }, [names]);

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
    hours %= 12;
    hours = hours || 12; // Handle midnight (0 hours)

    // Add leading zeros to minutes if needed
    minutes = minutes < 10 ? `0${minutes}` : minutes;

    // Format the date and time
    const formattedDateTime = `${month}/${day}/${year} ${hours}:${minutes} ${ampm}`;

    return formattedDateTime;
  }
  useEffect(() => {
    if (Object.keys(messages).length !== 0 && !!containerRef.current) {
      const container = containerRef.current;
      container.scrollTo(0, container.scrollHeight);
    }
  }, [messages, replyInfo]);
  useEffect(() => {
    setReplyInfo({});
  }, [chatId, messages]);
  useEffect(() => {
    const typingRef = ref(getDatabase(), `typingStatus/${chatId}/`);
    const callback = (snapshot) => {
      if (snapshot.exists()) {
        setTypingState(snapshot.val()[Object.keys(snapshot.val())]);
      }
    };
    const listener = onValue(typingRef, callback);
    return () => {
      off(typingRef, "value", callback);
    };
  }, []);
  useEffect(() => {
    const metaRef = ref(getDatabase(), `/chatMetaData/${chatId}/admin`);
    const callback = (snapshot) => {
      if (snapshot.exists()) {
        setMetaInfo(snapshot.val());
      } else {
        setMetaInfo({});
      }
    };
    const unsubscribe = onValue(metaRef, callback);
    return () => {
      off(metaRef, "value", callback);
      unsubscribe();
    };
  }, [chatId]);

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

  return Object.keys(messages).length !== 0 && chatId !== "none" ? (
    <div
      className={`flex-1 min-w-messageMin w-1/4 flex-col relative break-words md:flex border-borderColor border-l md:border-none${
        Object.keys(messages).length !== 0 ? " flex" : " hidden"
      }`}
    >
      {screen == "message" ? (
        <>
          <div className="flex gap-2 h-24 min-h-20 items-center pl-5  bg-stone-900 mb-3 md:shadow-md shadow-slate-700 text-white">
            {showDownArrow ? (
              <div
                className="w-7 h-7 rounded-xl flex justify-center items-center bg-slate-700 absolute right-7 bottom-24 z-40 cursor-pointer"
                onClick={() => {
                  if (containerRef.current) {
                    const container = containerRef.current;
                    container.scrollTo({
                      top: container.scrollHeight,
                      behavior: "smooth",
                    });
                  }
                }}
              >
                <AiOutlineArrowDown className="" />
              </div>
            ) : (
              <></>
            )}
            <Link to="/homescreen/none">
              <FaAngleLeft className="md:hidden text-white text-2xl mr-3 cursor-pointer" />
            </Link>
            <button
              className={` rounded-xl w-10 h-10 flex items-center justify-center bg-stone-800 text-2xl${
                messages.type == "duo"
                  ? ` text-base${getColorFromLetter(
                      messages.type == "duo"
                        ? userState.name && userState.name.length > 0
                          ? userState.name[0].toUpperCase()
                          : ""
                        : messages.pfp
                    )}`
                  : ""
              }`}
              onClick={() => {
                setScreen("info");
              }}
            >
              <p className={userState.pfp&&messages.type == "duo"?"w-full h-full":""}>
                {" "}
                {messages.type == "duo" ? (
                  !userState.pfp ? (
                    userState.name && userState.name.length > 0 ? (
                      userState.name[0].toUpperCase()
                    ) : (
                      ""
                    )
                  ) : (
                    <img
                      src={userState.pfp}
                      className="w-full h-full rounded-xl flex-1"
                      alt="pfp"
                    />
                  )
                ) : (
                  messages.pfp
                )}
              </p>
            </button>
            <div className="flex items-center justify-between flex-1 mr-5">
              <div
                className="flex flex-col cursor-pointer"
                onClick={() => {
                  setScreen("info");
                }}
              >
                <p className="text-white">
                  {" "}
                  {messages.type == "duo" ? userState.name : messages.chatName}
                </p>
                {messages.type !== "duo" ? (
                  <div className="flex flex-row">
                    {names.map((username, index) => (
                      <p className="text-xs text-subColor" key={index}>
                        {names.length - 1 === index
                          ? username.name
                          : `${username.name},\u00A0`}
                      </p>
                    ))}
                  </div>
                ) : typingState && Object.keys(typingState).length !== 0 ? (
                  <p className="text-sm text-subColor">
                    {typingState.status
                      ? `${typingState.name} is typing...`
                      : ""}
                  </p>
                ) : (
                  <></>
                )}
              </div>
              <FiLink
                size={20}
                className={`text-white cursor-pointer${
                  messages.type == "duo" ? " hidden" : ""
                }`}
                onClick={() => {
                  setShowCodeModal(true);
                }}
              />
            </div>
          </div>
          <div
            className={` h-full overflow-y-scroll${
              Object.keys(replyInfo).length !== 0 ? " mb-44" : " mb-20"
            }`}
            ref={containerRef}
          >
            {Object.values(messages.messages ? messages.messages : {}).map(
              (value, index) => (
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
                    value.replyInfo ||
                    !value.content ? (
                      <MessageBox
                        pfp="https://wallpapers.com/images/hd/shadow-boy-white-eyes-unique-cool-pfp-nft-13yuypusuweug9xn.jpg"
                        name={value.sender}
                        msg={value.content}
                        date={formatDateTime(value.timestamp)}
                        setReplyInfo={setReplyInfo}
                        msgType={value.replyInfo}
                        chatUid={Object.keys(messages.messages)[index]}
                        makeNewRef={makeNewRef}
                        scrollToMsg={scrollToMsg}
                        data={value}
                        pfpList={pfpList}
                      />
                    ) : (
                      <div
                        className="relative hover:bg-slate-800 group flex items-center"
                        ref={(ref) =>
                          makeNewRef(Object.keys(messages.messages)[index], ref)
                        }
                      >
                        <div
                          className="absolute right-10 text-white hidden cursor-pointer group-hover:block"
                          onClick={() =>
                            setReplyInfo({
                              name: value.sender,
                              msg: value.content,
                              msgUID: Object.keys(messages.messages)[index],
                            })
                          }
                        >
                          <MdReply size="22" />
                        </div>
                        <p className="text-white pl-5 pr-8 text-sm font-light ml-14 break-all">
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
                      chatUid={Object.keys(messages.messages)[index]}
                      makeNewRef={makeNewRef}
                      scrollToMsg={scrollToMsg}
                      data={value}
                      pfpList={pfpList}
                    />
                  )}
                </div>
              )
            )}
          </div>
          <div className=" bg-inputColor rounded-xl py-3 text-white pl-4 outline-none placeholder-borderColor absolute bottom-6 left-5 right-5 shadow-slate-600 shadow-lg flex flex-col">
            {Object.keys(replyInfo).length !== 0 ? (
              <div className="bg-slate-800 py-2 rounded-lg mr-4 pl-4 mb-4 relative animate-fade-up">
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
                  clearTimeout(timeoutId.current);
                  const typingRef = ref(
                    getDatabase(),
                    `typingStatus/${chatId}`
                  );
                  if (event.target.value == "") {
                    set(typingRef, {
                      [isSignedIn.uid]: {
                        status: false,
                        name: isSignedIn.displayName,
                      },
                    });
                  } else {
                    set(typingRef, {
                      [isSignedIn.uid]: {
                        status: true,
                        name: isSignedIn.displayName,
                      },
                    });
                    timeoutId.current = setTimeout(() => {
                      set(typingRef, {
                        [isSignedIn.uid]: {
                          status: false,
                          name: isSignedIn.displayName,
                        },
                      });
                      console.log(
                        event.target.value,
                        timeoutId.current,
                        "timeout ran"
                      );
                    }, 2000);
                  }
                }}
                value={text}
                onKeyDown={(event) => {
                  if (event.key == "Enter") {
                    handleSubmit();
                  }
                }}
              />
              <div>
                <img
                  src={send}
                  className="h-6 mr-4 hover:opacity-80 transition-all duration-200 cursor-pointer"
                  onClick={() => {
                    handleSubmit();
                  }}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <InfoTab
          setScreen={setScreen}
          messages={messages}
          formatDateTime={formatDateTime}
          metaInfo={metaInfo}
        />
      )}
    </div>
  ) : (
    <div className="hidden items-center justify-center flex-1 md:flex flex-col">
      <img src={nochatimg} className="w-5/12 min-w-messageMin max-w-sm" />
      <h1 className="text-white text-xl">Start chatting with people!</h1>
    </div>
  );
}

function MessageBox({
  pfp,
  name,
  msg,
  date,
  setReplyInfo,
  msgType,
  chatUid,
  makeNewRef,
  scrollToMsg,
  data,
  pfpList,
}) {
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
  return !data.type ? (
    <div
      className="flex flex-col justify-center py-2 pl-5 relative group hover:bg-slate-800"
      ref={(ref) => makeNewRef(chatUid, ref)}
    >
      <div
        className="absolute right-10 text-white hidden cursor-pointer group-hover:block"
        onClick={() => {
          setReplyInfo({
            name,
            msg,
            msgUID: chatUid,
          });
        }}
      >
        <MdReply size="25" />
      </div>
      {msgType ? (
        <div
          className="flex ml-14 text-subColor gap-2 text-sm items-center cursor-pointer overflow-hidden"
          onClick={() => scrollToMsg(msgType ? msgType.msgUID : null)}
        >
          <div className="flex gap-2 items-center">
            <div
              className={`rounded-3xl w-4 h-4 flex items-center justify-center${getColorFromLetter(
                msgType ? msgType.name[0] : ""
              )}`}
            >
              <p className="text-white">{msgType ? msgType.name[0] : ""}</p>
            </div>
            <p className=" font-semibold">{msgType ? msgType.name : ""}</p>
          </div>
          <p className=" font-light">{msgType ? msgType.msg : ""}</p>
        </div>
      ) : (
        <></>
      )}
      <div className="flex gap-4 w-full break-all mr-8">
        <div
          className={`rounded-3xl flex-shrink-0 w-10 h-10 flex items-center justify-center${getColorFromLetter(
            name[0].toUpperCase()
          )}`}
        >
          {!Object.keys(pfpList).includes(data.senderUID) ? (
            <p className="text-white">{name[0].toUpperCase()}</p>
          ) : (
            <img
              src={pfpList[data.senderUID]}
              className="w-full h-full rounded-3xl"
            />
          )}
        </div>
        <div className=' pr-8'>
          <div className="flex gap-3 items-center flex-1">
            <p className="text-white">{name}</p>
            <p className=" text-subColor text-xs">{date}</p>
          </div>
          <p className="text-white text-sm font-light">{msg}</p>
        </div>
      </div>
    </div>
  ) : data.infoType == "remove" ? (
    <InfoMsg
      causeUser={data.causeUser}
      affectUser={data.affectUser}
      actionType="removed"
      content="from the group"
      icon={<AiOutlineUserDelete className="text-slate-400" size={22} />}
    />
  ) : data.infoType == "leave" ? (
    <InfoMsg
      causeUser={data.causeUser}
      affectUser={data.affectUser}
      actionType="left"
      content="the group"
      icon={<HiOutlineArrowNarrowRight className="text-slate-400" size={22} />}
    />
  ) : data.infoType == "dismiss" ? (
    <InfoMsg
      causeUser={data.causeUser}
      affectUser={data.affectUser}
      actionType="dismissed"
      content="as admin"
      icon={<HiOutlineArrowNarrowRight className="text-slate-400" size={22} />}
    />
  ) : data.infoType == "admin" ? (
    <InfoMsg
      causeUser={data.causeUser}
      affectUser={data.affectUser}
      actionType="made"
      content="the admin"
      icon={<RiAdminLine className="text-green-600" size={22} />}
    />
  ) : data.infoType == "descEdit" ? (
    <InfoMsg
      causeUser={data.causeUser}
      affectUser={data.affectUser}
      actionType="edited"
      content="the group description"
      icon={<FiEdit2 className="text-green-600" size={22} />}
    />
  ) : data.infoType == "join" ? (
    <InfoMsg
      causeUser={data.causeUser}
      affectUser={data.affectUser}
      actionType="joined"
      content="the chat!"
      icon={<HiOutlineArrowNarrowRight className="text-green-600" size={22} />}
    />
  ) : (
    <InfoMsg
      causeUser={data.causeUser}
      affectUser={data.affectUser}
      actionType="edited"
      content="the chat name"
      icon={<FiEdit2 className="text-green-600" size={22} />}
    />
  );
}

function InfoMsg({ causeUser, affectUser, actionType, content, icon }) {
  return (
    <div className="flex gap-7 py-2 pl-6 mt-3 items-center">
      {causeUser ? (
        <>
          {icon}
          <p className="text-subColor font-light">
            <span className="text-white">{`${causeUser} `}</span>
            {`${actionType} `}
            <span className="text-white">
              {affectUser ? `${affectUser} ` : ""}
            </span>
            {content}
          </p>
        </>
      ) : (
        <>
          {icon}
          <p className="text-subColor font-light">
            <span className="text-white">{`${affectUser} `}</span>
            {`${actionType} `}
            {content}
          </p>
        </>
      )}
    </div>
  );
}
