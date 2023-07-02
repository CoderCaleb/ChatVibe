import logo from "./logo.svg";
import "./App.css";
import SideBar from "./SideBar";
import ContactBar from "./ContactBar";
import MessageTab from "./MessageTab";
import firebase from "firebase/compat/app";
import { onValue, get, getDatabase, ref } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useState, useEffect } from "react";
import SignUp from "./SignUp";
import { Route, Routes, redirect, useNavigate, useParams } from "react-router-dom";
import SignIn from "./SignIn";
import DashBoard from "./Dashboard";
const firebaseConfig = {
  apiKey: "AIzaSyDnsU3f1fH9jPcTHniNrqJJnnV4Gb9pM7U",
  authDomain: "chatvibe-ddfac.firebaseapp.com",
  projectId: "chatvibe-ddfac",
  storageBucket: "chatvibe-ddfac.appspot.com",
  messagingSenderId: "650779234388",
  appId: "1:650779234388:web:11230a932f23837908ddc1",
};
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
export const MessageContext = createContext();

function App() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState({});
  const [userInfo, setUserinfo] = useState({});
  const [showCodeModal, setShowCodeModal] = useState(false)
  useEffect(() => {
    console.log("user:", getAuth().currentUser);
  }, []);
  useEffect(() => {}, [messages]);
  return (
    <MessageContext.Provider
      value={{ messages, setMessages, userInfo, setUserinfo, showCodeModal, setShowCodeModal }}
    >
      <div className="flex bg-bgColor h-screen w-screen">
        <Routes>
          <Route path="/" element={<SignUp />} />
          <Route path="/auth">
            <Route index element={<SignUp />} />
            <Route path="signin" element={<SignIn />} />
          </Route>
          <Route
            path="/homescreen/:chatId"
            element={
              <ProtectedRoute
                setMessages={setMessages}
                setUserinfo={setUserinfo}
                messages={messages}
              >
                <DashBoard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<h1>Not found</h1>}></Route>
        </Routes>
      </div>
    </MessageContext.Provider>
  );
}
function ProtectedRoute({ setMessages, setUserinfo, messages,children }) {
  const navigate = useNavigate();
  const {chatId} = useParams()
  const [isSignedIn, setIsSignedIn] = useState(false)
  useEffect(()=>{
    const participantRef = ref(getDatabase(),`/chats/${chatId}/participants`)
    console.log('condition',messages,chatId)
    onAuthStateChanged(getAuth(),(user)=>{
      if(chatId!=='none'&&Object.keys(messages).includes(chatId)){
        get(participantRef)
        .then((snapshot)=>{
          const keys = Object.keys(snapshot.val())
          if(keys.includes(user.uid)){
            console.log('User in')
          }
          else{
            navigate('/homescreen/none')
          }
        })
      }
    })
    
  },[messages])
  useEffect(() => {
    const chatsRef = ref(getDatabase(), "/chats");
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      console.log(getAuth().currentUser);
      if (!user) {
        navigate("/auth");
      } else {
        onValue(chatsRef, (snapshot) => {
          setMessages(snapshot.val());
        });
        const auth = getAuth();

        const userRef = ref(getDatabase(), `users/${auth.currentUser.uid}`);
        onValue(userRef, (snapshot) => {
          setUserinfo(snapshot.val());
        });

       
      }
    });
    
    // Cleanup function
    return () => unsubscribe();
  }, []);

  return children;
}
export default App;
