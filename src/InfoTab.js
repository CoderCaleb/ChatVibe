import React, { useEffect, useState, useContext } from "react";
import { FaAngleLeft, FaUserTimes } from "react-icons/fa";
import { FiEdit3, FiChevronDown, FiLink } from "react-icons/fi";
import { BsCheck2, BsFillPersonCheckFill } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { ref, getDatabase, get, update, push } from "firebase/database";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { VscVerifiedFilled } from "react-icons/vsc";
import { MdDelete } from "react-icons/md";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FiEdit2 } from "react-icons/fi";
import {MdOutlineCancel} from "react-icons/md"
import { MessageContext } from "./App";
import EmojiPicker from "emoji-picker-react";
import cross from "./images/close.png";
import peace from "./images/peace-sign.png";

export default function InfoTab({
  setScreen,
  messages,
  formatDateTime,
  metaInfo,
}) {
  const { chatId } = useParams();
  const [editMode, setEditMode] = useState(false);
  const [descInput, setDescInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const [nameEditMode, setNameEditMode] = useState(false);
  const [nameDesc, setNameDesc] = useState("");
  const [showChangePfpEmojis, setShowChangePfpEmojis] = useState(false);
  const { setShowCodeModal, setShowRemoveModal, names, author, userState } =
    useContext(MessageContext);
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
    if (letter) {
      const index = letter.charCodeAt(0) % colors.length;
      return colors[index];
    }
  };
  function handleChangePfp(emoji) {
    const emojiPfpRef = ref(getDatabase(), `chats/${chatId}`);
    const metaEmojiPfpRef = ref(getDatabase(),`chatMetaData/${chatId}`)
    update(emojiPfpRef, {
      pfp: emoji,
    })
    .then(()=>{
      update(metaEmojiPfpRef,{
        pfp: emoji,
      })
    });
  }
  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      setUserObj(user);
    });
  }, []);

  useEffect(() => {}, [messages]);
  return (
    <div className="flex flex-col gap-3 overflow-y-scroll relative">
      <FaAngleLeft
        className="text-white absolute left-4 top-4 cursor-pointer"
        size="30"
        onClick={() => {
          setScreen("message");
        }}
      />

      <div className="bg-zinc-900 w-full py-6 flex flex-col justify-center items-center gap-2">
        <div
          className={`w-36 h-36 rounded-3xl bg-stone-800 relative text-white group cursor-pointer${
            messages.type === "duo"
              ? ` text-base${getColorFromLetter(
                  messages.type == "duo"
                    ? userState.name && userState.name.length > 0
                      ? userState.name[0].toUpperCase()
                      : ""
                    : messages.pfp
                )}`
              : ""
          }`}
          onClick={(e) => {
            e.stopPropagation()
            if(messages.type!=="duo"){
              setShowChangePfpEmojis(!showChangePfpEmojis);
            }
          }}
        >
          <div className="w-full h-full flex items-center justify-center absolute z-40">
            <FiEdit2
              className={`text-white hidden text-center${messages.type!=="duo"?" group-hover:block":""}`}
              size={50}
            />
          </div>
          {showChangePfpEmojis ? (
            <div className="absolute top-20 right-20 z-50 cursor-default" onClick={(e)=>e.stopPropagation()}>
              <EmojiPicker
                height="350px"
                onEmojiClick={(emojiData) => {
                  setShowChangePfpEmojis(false);
                  handleChangePfp(emojiData.emoji);
                }}
                lazyLoadEmojis
                skinTonesDisabled
              />
              <MdOutlineCancel
                      className="absolute top-1 right-1 text-4xl text-subColor cursor-pointer"
                      onClick={() => {
                        setShowChangePfpEmojis(false)
                      }}
              />
            </div>
          ) : (
            <></>
          )}
          <div
            className={`w-full h-full rounded-3xl z-10 flex justify-center items-center absolute hover:bg-blackRgba group transition-all duration-150`}
          >
            <p
              className={
                "text-7xl group-hover:opacity-70 transition-all duration-150"
              }
            >
              {messages.type === "duo" ? (
                !userState.pfp ? (
                  userState.name && userState.name.length > 0 ? (
                    userState.name[0].toUpperCase()
                  ) : (
                    ""
                  )
                ) : (
                  <img
                    src={userState.pfp}
                    className="w-full h-full rounded-3xl"
                  />
                )
              ) : (
                messages.pfp
              )}
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-2${
            nameEditMode ? " border-b-2 border-subColor" : ""
          }`}
        >
          <div className={`${nameEditMode ? "  w-40" : ""}`}>
            {nameEditMode ? (
              <input
                className={`text-white text-xl bg-transparent border-none outline-none w-full${
                  !nameEditMode ? " w-min" : ""
                }`}
                value={nameDesc}
                onChange={(event) => {
                  setNameDesc(event.target.value);
                }}
              />
            ) : (
              <p className="text-white text-xl">
                {messages.type == "duo" ? userState.name : messages.chatName}
              </p>
            )}
          </div>
          {messages.type !== "duo" ? (
            !nameEditMode ? (
              <FiEdit3
                className="text-subColor cursor-pointer"
                size="20"
                onClick={() => {
                  setNameEditMode(true);
                }}
              />
            ) : (
              <BsCheck2
                className="text-subColor cursor-pointer"
                size="20"
                onClick={() => {
                  setNameEditMode(false);
                  if (nameDesc.length !== 0 && messages.chatName !== nameDesc) {
                    const groupNameRef = ref(getDatabase(), `/chats/${chatId}`);
                    const metaDataRef = ref(
                      getDatabase(),
                      `/chatMetaData/${chatId}`
                    );
                    update(groupNameRef, {
                      chatName: nameDesc,
                    }).then(() => {
                      update(metaDataRef, {
                        chatName: nameDesc,
                      }).then(() => {
                        const messageRef = ref(
                          getDatabase(),
                          `/chats/${chatId}/messages`
                        );
                        push(messageRef, {
                          causeUser: userObj.displayName,
                          type: "info",
                          infoType: "nameEdit",
                        });
                      });
                    });
                  }
                }}
              />
            )
          ) : (
            <></>
          )}
        </div>
        <div>
          <p
            className={`text-subColor text-sm${
              messages.type == "duo" ? " hidden" : ""
            }`}
          >
            {messages.participants
              ? `${Object.keys(messages.participants).length} participants`
              : "Loading..."}
          </p>

          <p
            className={`text-subColor text-sm${
              messages.type !== "duo" ? " hidden" : ""
            }`}
          >
            {messages.type == "duo" ? `#${userState.userCode}` : ""}
          </p>
        </div>
      </div>
      <div className="bg-zinc-900 w-full py-6 flex flex-col px-7 gap-2">
        {messages.type !== "duo" ? (
          <div
            className={`flex justify-between items-center border-subColor${
              editMode ? " border-b-2" : ""
            }`}
          >
            <input
              className="text-white bg-transparent border-none outline-none w-full"
              value={
                !editMode
                  ? !messages.chatDesc
                    ? "Add a chat description"
                    : messages.chatDesc
                  : descInput
              }
              readOnly={!editMode}
              onChange={(event) => {
                setDescInput(event.target.value);
              }}
              placeholder="Enter your description"
            />
            {!editMode ? (
              <FiEdit3
                className="text-subColor cursor-pointer"
                size="20"
                onClick={() => {
                  setEditMode(true);
                }}
              />
            ) : (
              <BsCheck2
                className="text-subColor cursor-pointer"
                size="20"
                onClick={() => {
                  setEditMode(false);
                  const chatRef = ref(getDatabase(), `/chats/${chatId}`);
                  const messageRef = ref(
                    getDatabase(),
                    `/chats/${chatId}/messages`
                  );
                  if (messages.type !== "duo") {
                    if (descInput.trim().length !== 0) {
                      update(chatRef, {
                        chatDesc: descInput,
                      }).then(() => {
                        push(messageRef, {
                          causeUser: userObj.displayName,
                          type: "info",
                          infoType: "descEdit",
                        });
                      });
                    }
                  } else {
                  }
                }}
              />
            )}
          </div>
        ) : (
          <div className="text-white">
            <p className="text-subColor text-sm mb-1">About</p>
            <p>{userState.about}</p>
          </div>
        )}
        <p className="text-subColor text-sm">
          {`Group created by ${author}, on ${formatDateTime(
            messages.timeCreated
          )}`}
        </p>
      </div>
      {messages.type !== "duo" ? (
        <div className="bg-zinc-900 w-full py-6 flex flex-col pl-7 gap-2">
          <div className="flex gap-2 items-center mb-3">
            <p className="text-subColor">
              {`${Object.keys(messages.participants).length} participants`}
            </p>
            <AiOutlineUserAdd
              size={20}
              className={`cursor-pointer text-green-600${
                messages.type == "duo" ? " hidden" : ""
              }`}
              onClick={() => {
                setShowCodeModal(true);
              }}
            />
          </div>
          <div className="flex flex-col gap-6">
            {names.map((user, index) => (
              <ContactBar index={index} user={user} key={index} />
            ))}
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="bg-zinc-900 w-full py-6 flex flex-col pl-7 gap-2 mb-8">
        <div
          className="flex gap-2 text-red-400 h-10 items-center hover:bg-slate-800 cursor-pointer"
          onClick={() => {
            if (messages.type !== "duo") {
              setShowRemoveModal({
                user: userObj.uid,
                chat: chatId,
                type: "leave",
                chatType: "group",
                affectUser: userObj.displayName,
              });
            } else {
              setShowRemoveModal({
                user: userObj.uid,
                chat: chatId,
                type: "leave",
                chatType: "duo",
                username: userState.name + userState.userCode,
                affectUser: userObj.displayName,
              });
            }
          }}
        >
          <MdDelete className="" size={22} />
          <p>Leave chat</p>
        </div>
      </div>
    </div>
  );
  function ContactBar({ index, user }) {
    const [showDropdown, setShowDropdown] = useState(false);
    return (
      <div className="flex gap-2 items-center group relative" key={index}>
        <div
          className={` rounded-lg bg-slate-800 flex w-44 flex-col p-3 text-white transition-all duration-300 absolute z-30 right-5 top-12${
            showDropdown ? " scale-100" : " scale-0"
          }`}
        >
          <p
            className="rounded-lg hover:bg-slate-600 py-1 pl-2 cursor-pointer"
            onClick={() => {
              setShowRemoveModal({
                user: user.uid,
                affectUser: user.name,
                causeUser: userObj.displayName,
                type: Object.keys(metaInfo).includes(user.uid)
                  ? "dismiss"
                  : "admin",
              });
            }}
          >
            {Object.keys(metaInfo).includes(user.uid)
              ? "Dismiss as admin"
              : "Make admin"}
          </p>
          <p
            className="rounded-lg hover:bg-slate-600 py-1 pl-2 cursor-pointer"
            onClick={() => {
              setShowRemoveModal({
                user: user.uid,
                type: "remove",
                affectUser: user.name,
                causeUser: userObj.displayName,
              });
            }}
          >
            Remove
          </p>
        </div>
        <div onClick={() => setShowDropdown(!showDropdown)}>
          <FiChevronDown
            className={`text-white font-bold absolute right-5 hidden cursor-pointer${
              userObj &&
              user.uid !== userObj.uid &&
              Object.keys(metaInfo).includes(userObj.uid)
                ? " group-hover:block"
                : ""
            }`}
            size={20}
          />
        </div>
        <div
          className={`rounded-3xl w-10 h-10 flex items-center justify-center relative${getColorFromLetter(
            user.name[0].toUpperCase()
          )}`}
        >
          {!user.pfp ? (
            <p className="text-white">{user.name[0].toUpperCase()}</p>
          ) : (
            <img src={user.pfp} className="w-full h-full rounded-3xl" />
          )}
        </div>
        <div>
          <p className="text-white text-base inline-block mr-1">
            {user.name}
            <span className="text-sm">
              {user.userCode ? `#${user.userCode}` : ""}
            </span>
          </p>
          <p className="text-sm text-subColor inline-block">
            {userObj && user.uid == userObj.uid ? "(You)" : ""}
          </p>
          <span
            className={`flex gap-1 items-center${
              Object.keys(metaInfo).includes(user.uid) ? "" : " hidden"
            }`}
          >
            <p className="text-sm text-gray-400">Group admin</p>
            <VscVerifiedFilled className=" text-blue-500" />
          </span>
        </div>
      </div>
    );
  }
}
