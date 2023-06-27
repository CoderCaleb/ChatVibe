import logo from './logo.svg';
import './App.css';
import SideBar from './SideBar';
import ContactBar from './ContactBar';
import MessageTab from './MessageTab';
import firebase from 'firebase/compat/app'
import {onValue,get,getDatabase,ref} from 'firebase/database'
import React, {createContext,useState,useEffect} from 'react';
import SignUp from './SignUp';
const firebaseConfig = {
  apiKey: "AIzaSyDnsU3f1fH9jPcTHniNrqJJnnV4Gb9pM7U",
  authDomain: "chatvibe-ddfac.firebaseapp.com",
  projectId: "chatvibe-ddfac",
  storageBucket: "chatvibe-ddfac.appspot.com",
  messagingSenderId: "650779234388",
  appId: "1:650779234388:web:11230a932f23837908ddc1"
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const MessageContext = createContext()

function App() {
  const [messages, setMessages] = useState({})
  useEffect(()=>{
    const chatsRef = ref(getDatabase(),'/chats')
    onValue(chatsRef,(snapshot)=>{
      setMessages(snapshot.val())
      console.log(snapshot.val())
    })
  },[])
  useEffect(()=>{
    if(Object.keys(messages).length!==0){
      console.log(messages['-MgHj2heLKjKJ75vGsaW'].messages)
    }
    console.log(messages)
  },[messages])
  return (
    <MessageContext.Provider value={{messages,setMessages}}>
      
      <div className="flex bg-bgColor h-screen w-screen">
            <SignUp/>
      </div>
      
    </MessageContext.Provider>
  );
}

export default App;
