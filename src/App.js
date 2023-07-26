import logo from "./logo.svg";
import "./App.css";
import SideBar from "./SideBar";
import ContactBar from "./ContactBar";
import MessageTab from "./MessageTab";
import firebase from "firebase/compat/app";
import { onValue, get, getDatabase, ref, off } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import React, {
  createContext,
  useState,
  useEffect,
  useMemo,
  useRef,
} from "react";
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
  const [showRemoveModal, setShowRemoveModal] = useState({});
  const [userState, setUserState] = useState({});
  const [profileScreen, setProfileScreen] = useState(true)
  const [names, setNames] = useState([]);
  const [author, setAuthor] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [filteredArr,setFilteredArr] = useState([])
  const previousState = useRef(messages);
  const firstRender = useRef(true)
  const originalRef = useRef([]);

  useEffect(() => {
    onAuthStateChanged(getAuth(), (user) => {
      setIsSignedIn(user);
    });
  }, []);
  useEffect(() => {
    if (Object.keys(messages).length !== 0&&(JSON.stringify(messages.participants)!==JSON.stringify(previousState.current.participants)||JSON.stringify(messages.chatName)!==JSON.stringify(previousState.current.chatName)||firstRender.current)) {
      firstRender.current=false
      function participantMap(mapData){
        Promise.all(
          Object.keys(mapData).map((uid, index) => {
            const nameRef = ref(getDatabase(), "/users/" + uid + "/name");
            return get(nameRef);
          })
        )
          .then((names) => {
            let tempArr = [];
            Promise.all(
              Object.keys(mapData).map((uid, index) => {
                const codeRef = ref(getDatabase(), "/users/" + uid + "/userCode");
                return get(codeRef);
              })
            ).then((codes) => {
              tempArr = names.map((snapshot, index) => {
                console.log(snapshot.val());
                console.log(Object.keys(mapData)[index]);
                return {
                  name: snapshot.val(),
                  uid: Object.keys(mapData)[index],
                };
              });
              const codeArr = codes.map((code,index)=>{
                return {
                  userCode: code.val()
                }
              }) 
              Promise.all(
                Object.keys(mapData).map((uid, index) => {
                  const aboutRef = ref(getDatabase(), "/users/" + uid + "/about");
                  return get(aboutRef);
                })
              )
              .then((aboutInfo)=>{
                const finalArr = aboutInfo.map((aboutSnapshot, index) => {
                  return { ...tempArr[index], ...codeArr[index],about:aboutSnapshot.val() };
                });
                setNames(finalArr);
                console.log("TEMP ARR NAMES", finalArr);
              })
            });
  
          })
          .catch((err) => {
            console.log(err);
          });
      }
      if(messages.type=='duo'){
        participantMap(messages.originalParticipants)
        console.log('MAPPING OUT DUO CHAT PARTICIPANTAS',messages.originalParticipants)
      }
      else{
        participantMap(messages.participants)
        console.log('MAPPING OUT GROUP CHAT PARTICIPANTAS')
      }
      
      const authorRef = ref(
        getDatabase(),
        "/users/" + messages.author + "/name"
      );
      get(authorRef).then((snapshot) => {
        setAuthor(snapshot.val());
      });
    }
    console.log("CHAT INFO", messages.chatName, previousState.current.chatName);
    console.log("CHAT INFO", messages.participants, previousState.current.participants);
  }, [messages.chatName, messages.participants]);
  useEffect(() => {
    console.log("NAMES", !!names[1]);
    setUserState(
      isSignedIn && names[0] && names[1]
        ? names[0].uid !== isSignedIn.uid
          ? names[0]
          : names[1]
        : ""
    );
  }, [names]);
  useEffect(() => {
    console.log("namessssssijcsvoj", names);
  }, [names]);
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
        showRemoveModal,
        setShowRemoveModal,
        names,
        author,
        userState,
        isSignedIn,
        filteredArr,
        setFilteredArr,
        originalRef,
        profileScreen,
        setProfileScreen
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
                previousState={previousState}
                setFilteredArr={setFilteredArr}
                userInfo={userInfo}
                originalRef={originalRef}
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
function ProtectedRoute({
  setMessages,
  setUserinfo,
  messages,
  previousState,
  children,
  setFilteredArr,
  userInfo,
  originalRef
}) {
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
            setMessages((prev) => {
              previousState.current = prev;
              return snapshot.val();
            });
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
  const tempArr = [];


  useEffect(() => {
    
    const listenerRefs = []; // Array to store the listener references

    if (userInfo.chats) {
      Object.keys(userInfo.chats).forEach((value, index) => {
        const chatsRef = ref(getDatabase(), `/chatMetaData/${value}`);
        const callback = (snapshot) => {
          tempArr.some((obj) => Object.values(obj).includes(value))
            ? (tempArr[index] = { ...snapshot.val(), chatId: snapshot.key })
            : tempArr.push({ ...snapshot.val(), chatId: value });
          console.log("tempArr:", tempArr[0], "value", snapshot.key);
          originalRef.current = tempArr;
          setFilteredArr([...tempArr]);
          console.log(tempArr);
        };
        const listenerRef = onValue(chatsRef, callback);
        listenerRefs.push({
          ref: chatsRef,
          callback: callback,
          unsubscribe: listenerRef,
        }); // Add the listener reference to the array
      });
    }
    // Cleanup function to unsubscribe the listeners
    return () => {
      listenerRefs.forEach((listenerRef) => {
        off(listenerRef.ref, "value", listenerRef.callback);
        listenerRef.unsubscribe();
      });
    };
  }, [userInfo]);
  return children;
}
export default App;
