import React from "react";
import { FaAngleLeft } from "react-icons/fa";
import { FiEdit3 } from 'react-icons/fi'
import {BsCheck2} from 'react-icons/bs'
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {ref,getDatabase,get, update} from 'firebase/database'
export default function InfoTab({ setScreen, messages, formatDateTime }) {
  const name = "caleb";
  const {chatId} = useParams()
  const [names,setNames] = useState([])
  const [author,setAuthor] = useState('')
  const [editMode, setEditMode] = useState(false)
  const [descInput,setDescInput] = useState('')
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
          console.log("USER ARR:", tempArr);
          setNames(tempArr);
        })
        .catch((err) => {
          console.log(err);
        });
      const authorRef = ref(getDatabase(),'/users/'+messages.author+'/name')  
      get(authorRef)
      .then((snapshot)=>{
        setAuthor(snapshot.val())
      })
    }
  }, [messages.chatName]);
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
        <p className="text-white text-xl">{messages.chatName}</p>
        <p className="text-subColor text-sm">
          {Object.keys(messages.participants).length + " participants"}
        </p>
      </div>
      <div className="bg-zinc-900 w-full py-6 flex flex-col px-7 gap-2">
        <div className={'flex justify-between items-center border-subColor'+(editMode?' border-b-2':'')}>
        <input className="text-white bg-transparent border-none outline-none" value={!editMode?(!messages.chatDesc?'Add a chat description':messages.chatDesc):descInput} readOnly={!editMode} onChange={(event)=>{setDescInput(event.target.value)}} placeholder="Enter your description"></input>
        {!editMode?<FiEdit3 className='text-subColor cursor-pointer' size='20' onClick={()=>{setEditMode(true)}}/>:<BsCheck2 className='text-subColor cursor-pointer' size='20' onClick={()=>{
            setEditMode(false)
            const chatRef = ref(getDatabase(),'/chats/'+chatId)
            if(descInput.trim().length!==0){
                update(chatRef,{
                    chatDesc:descInput
                })
            } 
        }}/>}
        </div>
        <p className="text-subColor text-sm">
          {`Group created by ${author}, on ${formatDateTime(messages.timeCreated)}`}
        </p>
      </div>
      <div className="bg-zinc-900 w-full py-6 flex flex-col pl-7 gap-2">
        <p className="text-subColor mb-3">{Object.keys(messages.participants).length + " participants"}</p>
        <div className="flex flex-col gap-6">
          {names.map((user,index)=>{
            return(<div className="flex gap-2 items-center" key={index}>
              <div
                className={
                  "rounded-3xl w-10 h-10 flex items-center justify-center" +
                  getColorFromLetter(user[0].toUpperCase())
                }
              >
                <p className="text-white">{user[0].toUpperCase()}</p>
              </div>
              <p className="text-white">{user}</p>
            </div>)
          })
            
          }
        </div>
      </div>
    </div>
  );
}
