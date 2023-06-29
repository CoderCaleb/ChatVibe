import { BsPlus, BsFillLightningFill, BsGearFill } from "react-icons/bs";
import { FaFire, FaPoo } from "react-icons/fa";
import { getDatabase, ref, push, update } from "firebase/database";
import fire from "./fire-gif.gif";
import peace from "./images/peace-sign.png";
import solo from "./images/chat-icon.png";
import cross from "./images/close.png";
import rightArrow from "./images/right-arrow.png";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { useParams } from "react-router-dom";
export default function SideBar() {
  const [hover, setHover] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formIndex, setFormIndex] = useState(1);
  const [chatName, setChatName] = useState("");
  const auth = getAuth()
  const SidebarIcon = ({ icon, text, type }) => {
    return (
      <div
        className="sidebar-icon group"
        onClick={() => {
          if (type == "plus") {
            setShowModal(true);
            console.log("plus");
          }
        }}
      >
        {icon}
        <span className="toolip group-hover:scale-100">
          <p>{text}</p>
        </span>
      </div>
    );
  };
  function handleChange(event) {
    setChatName(event.target.value);
  }
  function ChoiceBox({ message, img, type }) {
    return (
      <div
        className="flex relative justify-between items-center w-full border rounded-lg mt-3 px-3 hover:bg-slate-100 cursor-pointer transition-all duration-300"
        onClick={() => {
          if (type == "duo") {
            setFormIndex((prev) => (prev += 1));
          }
        }}
      >
        <div className="flex items-center gap-2">
          <img src={img} className="w-12"></img>
          <p className="font-semibold">{message}</p>
        </div>
        <img src={rightArrow} className="w-4 mr-3"></img>
      </div>
    );
  }

  return (
    <>
      <div
        className={
          "flex items-center justify-center w-screen h-screen absolute transition-all duration-100 z-50" +
          (showModal ? "" : " hidden")
        }
      >
        <CreateForm
          formIndex={formIndex}
          setShowModal={setShowModal}
          handleChange={handleChange}
          chatName={chatName}
          setFormIndex={setFormIndex}
          ChoiceBox={ChoiceBox}
          setCloseModal={setShowModal}
        />
      </div>
      <div className="flex flex-col h-screen bg-bgColor w-16 top-0 m-0 shadow-lg text-white justify-center gap-1 relative ">
        <div
          className="absolute left-1/2 transform -translate-x-1/2
          top-5"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {hover ? (
            <img src={fire} className=""></img>
          ) : (
            <FaFire size="25" className="text-fireColor" />
          )}
        </div>
        <SidebarIcon icon={<FaFire size="28" />} text="toolip💡"></SidebarIcon>
        <SidebarIcon icon={<FaPoo size="28" />} text="toolip💡"></SidebarIcon>
        <SidebarIcon
          icon={<BsPlus size="28" />}
          text={"toolip💡"}
          type="plus"
        ></SidebarIcon>
        <SidebarIcon
          icon={<BsFillLightningFill size="28" />}
          text={"toolip💡"}
        ></SidebarIcon>
      </div>
    </>
  );
}

function CreateForm({
  formIndex,
  setShowModal,
  handleChange,
  chatName,
  setFormIndex,
  ChoiceBox,
  setCloseModal,
}) {
  const auth = getAuth()
  if (formIndex == 1) {
    return (
      <div className={"text-center bg-white rounded-lg p-5 w-96 relative"}>
        <img
          src={cross}
          className="absolute w-4 right-5 cursor-pointer"
          onClick={() => {
            setShowModal(false);
          }}
        ></img>
        <div className="">
          <img src={peace} className="w-20 m-auto"></img>
          <p className="font-semibold text-xl mb-2">Create a VibeChat</p>
          <p className="font-normal text-neutral-500 text-sm mb-10">
            Create a VibeChat – Hangout with Friends! Start your chat for 2 or a
            group and enjoy lively conversations.
          </p>
        </div>
        <ChoiceBox message="Initiate a Chat for Two" img={solo} type="duo" />
        <ChoiceBox message="Start a Group Chat" img={solo} type="group" />

        <div></div>
      </div>
    );
  } else if (formIndex == 2) {
    return (
      <div className={"text-center bg-white rounded-lg p-5 w-96 relative"}>
        <img
          src={cross}
          className="absolute w-4 right-5 cursor-pointer"
          onClick={() => {
            setShowModal(false);
          }}
        ></img>
        <div className="">
          <img src={peace} className="w-20 m-auto"></img>
          <p className="font-semibold text-xl mb-2">Create your VibeChat</p>
          <p className="font-normal text-neutral-500 text-sm mb-5">
            Give your chat a personality with a unique name
          </p>
        </div>
        <p className="text-start text-sm mb-2">Chat Name</p>
        <input
          className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none"
          placeholder="John's chat"
          onChange={(event) => handleChange(event)}
          value={chatName}
        ></input>
        <div className="flex gap-2 mt-5">
          <button
            className="flex-1 rounded-lg border-gray-200 border h-10 text-stone-600"
            onClick={() => {
              setFormIndex((prev) => prev - 1);
            }}
          >
            Previous
          </button>
          <button
            className="flex-1 rounded-lg h-10 text-white bg-blue-600"
            onClick={() => {
              const chatRef = ref(getDatabase(), "/chats");
              const userRef = ref(getDatabase(), `/users/${auth.currentUser.uid}/chats`)
              push(chatRef, {
                author: auth.currentUser.uid,
                chatName: chatName,
                participants:{
                  [auth.currentUser.uid]:true
                }
              }).then((value) => {
                setCloseModal(false);
                update(userRef,{
                  [value.key]:true
                })
              });
            }}
          >
            Create
          </button>
        </div>
        <div></div>
      </div>
    );
  }
}
