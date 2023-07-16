import React from "react";
import { FaAngleLeft } from "react-icons/fa";
import { FiEdit3 } from "react-icons/fi";
import { BsCheck2 } from "react-icons/bs";
import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { ref, getDatabase, get, update } from "firebase/database";
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { FaUserTimes } from "react-icons/fa";
import { MessageContext } from "./App";
import { VscVerifiedFilled } from "react-icons/vsc";
import { BsFillPersonCheckFill } from "react-icons/bs";
import { FiChevronDown } from "react-icons/fi";
import { FiLink } from "react-icons/fi";
import cross from "./images/close.png";
import peace from "./images/peace-sign.png";
export default function InfoTab({
  setScreen,
  messages,
  formatDateTime,
  metaInfo,
}) {
  const name = "caleb";
  const { chatId } = useParams();
  const [names, setNames] = useState([]);
  const [author, setAuthor] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [descInput, setDescInput] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [userObj, setUserObj] = useState(null);
  const { setShowCodeModal,    setShowRemoveModal,
  } = useContext(MessageContext);
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
  useEffect(() => {
    console.log("metaInfo:", Object.keys(metaInfo));
  }, []);
  useEffect(() => {
    if (Object.keys(messages).length !== 0) {
      Promise.all(
        Object.keys(messages.participants).map((uid, index) => {
          const nameRef = ref(getDatabase(), "/users/" + uid + "/name");
          return get(nameRef);
        })
      )
        .then((names) => {
          let tempArr = []
          Promise.all(
            Object.keys(messages.participants).map((uid, index) => {
              const codeRef = ref(getDatabase(), "/users/" + uid + "/userCode");
              return get(codeRef);
            })
          )
          .then((codes)=>{
            tempArr = names.map((snapshot, index) => {
              console.log(snapshot.val());
              console.log(Object.keys(messages.participants)[index]);
              return {
                name: snapshot.val(),
                uid: Object.keys(messages.participants)[index],
              };
            });
            const finalArr = codes.map((snapshot,index)=>{
              return({...tempArr[index],userCode:snapshot.val()})
            })
            setNames(finalArr)
          })
          
          setNames(tempArr);
        })
        .catch((err) => {
          console.log(err);
        });
      const authorRef = ref(
        getDatabase(),
        "/users/" + messages.author + "/name"
      );
      get(authorRef).then((snapshot) => {
        setAuthor(snapshot.val());
      });
    }
  }, [messages.chatName, messages.participants]);
  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      setUserObj(user);
    });
  }, []);
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
        <div className=" rounded-3xl w-36 h-36 bg-stone-800 flex justify-center items-center">
          <p className="text-7xl">{messages.pfp}</p>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-white text-xl">{messages.chatName}</p>
          <FiLink
            size={20}
            className="cursor-pointer text-subColor"
            onClick={() => {
              setShowCodeModal(true);
            }}
          />
        </div>
        <p className="text-subColor text-sm">
          {Object.keys(messages.participants).length + " participants"}
        </p>
      </div>
      <div className="bg-zinc-900 w-full py-6 flex flex-col px-7 gap-2">
        <div
          className={
            "flex justify-between items-center border-subColor" +
            (editMode ? " border-b-2" : "")
          }
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
          ></input>
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
                const chatRef = ref(getDatabase(), "/chats/" + chatId);
                if (descInput.trim().length !== 0) {
                  update(chatRef, {
                    chatDesc: descInput,
                  });
                }
              }}
            />
          )}
        </div>
        <p className="text-subColor text-sm">
          {`Group created by ${author}, on ${formatDateTime(
            messages.timeCreated
          )}`}
        </p>
      </div>
      <div className="bg-zinc-900 w-full py-6 flex flex-col pl-7 gap-2 mb-8">
        <p className="text-subColor mb-3">
          {Object.keys(messages.participants).length + " participants"}
        </p>
        <div className="flex flex-col gap-6">
          {names.map((user, index) => {
            return <ContactBar index={index} user={user}/>;
          })}
        </div>
      </div>
    </div>
  );
  function ContactBar({index,user}) {
    const [showDropdown, setShowDropdown] = useState(false)
    return (
      <div className="flex gap-2 items-center group relative" key={index}>
        <div
          className={
            " rounded-lg bg-slate-800 flex w-44 flex-col p-3 text-white transition-all duration-300 absolute z-30 right-5 top-12" +
            (showDropdown ? " scale-100" : " scale-0")
          }
        >
          <p className="rounded-lg hover:bg-slate-600 py-1 pl-2 cursor-pointer" onClick={()=>{
            setShowRemoveModal({user:user.uid,type:Object.keys(metaInfo).includes(user.uid)?'dismiss':'admin'})
          }}>{Object.keys(metaInfo).includes(user.uid)?'Dismiss as admin':'Make admin'}</p>
          <p className="rounded-lg hover:bg-slate-600 py-1 pl-2 cursor-pointer" onClick={()=>{
            setShowRemoveModal({user:user.uid,type:'remove'})
          }}>Remove</p>
        </div>
        <div onClick={() => setShowDropdown(!showDropdown)}>
          <FiChevronDown
            className={
              "text-white font-bold absolute right-5 hidden cursor-pointer" +
              (user.uid !== userObj.uid &&
              Object.keys(metaInfo).includes(userObj.uid)
                ? " group-hover:block"
                : "")
            }
            size={20}
          />
        </div>
        <div
          className={
            "rounded-3xl w-10 h-10 flex items-center justify-center relative" +
            getColorFromLetter(user.name[0].toUpperCase())
          }
        >
          <p className="text-white">{user.name[0].toUpperCase()}</p>
        </div>
        <div>
          <p className="text-white text-base inline-block mr-1">{user.name}<span className='text-sm'>{user.userCode?('#'+user.userCode):''}</span></p>
          <p className={"text-sm text-subColor inline-block"}>
            {user.uid == userObj.uid ? "(You)" : ""}
          </p>
          <span
            className={
              "flex gap-1 items-center" +
              (Object.keys(metaInfo).includes(user.uid) ? "" : " hidden")
            }
          >
            <p className={"text-sm text-gray-400"}>{"Group admin"}</p>
            <VscVerifiedFilled className=" text-blue-500" />
          </span>
        </div>
      </div>
    );
  }
}
