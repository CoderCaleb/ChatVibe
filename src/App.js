import logo from "./logo.svg";
import "./App.css";
import SideBar from "./SideBar";
import ContactBar from "./ContactBar";
import MessageTab from "./MessageTab";
import firebase from "firebase/compat/app";
import { onValue, get, getDatabase, ref, off } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, { createContext, useState, useEffect } from "react";
import SignUp from "./SignUp";
import {
  Route,
  Routes,
  redirect,
  useNavigate,
  useParams,
} from "react-router-dom";
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
  const [showCodeModal, setShowCodeModal] = useState(false);
  useEffect(() => {
    console.log("user:", getAuth().currentUser);
  }, []);
  useEffect(() => {}, [messages]);
  return (
    <MessageContext.Provider
      value={{
        messages,
        setMessages,
        userInfo,
        setUserinfo,
        showCodeModal,
        setShowCodeModal,
      }}
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
function ProtectedRoute({ setMessages, setUserinfo, messages, children }) {
  const navigate = useNavigate();
  const { chatId } = useParams();
  const [isSignedIn, setIsSignedIn] = useState(false);
  useEffect(() => {
    const participantRef = ref(getDatabase(), `/chats/${chatId}/participants`);
    console.log("condition", messages);
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (chatId !== "none" && Object.keys(messages).length !== 0) {
        get(participantRef).then((snapshot) => {
          const keys = Object.keys(snapshot.val());
          console.log(snapshot.val(), user.uid);
          if (Object.keys(messages.participants).includes(user.uid)) {
            console.log("User in");
          } else {
            navigate("/homescreen/none");
          }
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, [messages]);
  useEffect(() => {
    const chatsRef = ref(getDatabase(), "/chats/" + chatId);
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (!user) {
        navigate("/auth");
      } else {
        onValue(chatsRef, (snapshot) => {
          console.log("data pulled");
          if (snapshot.exists()) {
            console.log("SNAPSHOT:", snapshot.val().messages);
            setMessages(snapshot.val());
          } else {
            setMessages({});
            console.log("Data doesnt exist");
          }
        });
        const auth = getAuth();
      }
    });

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, [chatId]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (!user) {
        navigate("/auth");
      } else {
        const auth = getAuth();
        const userRef = ref(getDatabase(), `users/${auth.currentUser.uid}`);
        onValue(userRef, (snapshot) => {
          setUserinfo(snapshot.val());
        });
      }
    });
    return () => unsubscribe();
  }, []);

  return children;
}
export default App;
