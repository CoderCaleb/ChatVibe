import './App.css';
import firebase from 'firebase/compat/app';
import {
  onValue, get, getDatabase, ref, off, update,
} from 'firebase/database';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import React, {
  createContext,
  useState,
  useEffect,
  useRef,
} from 'react';
import {
  Route,
  Routes,
  useNavigate,
  useParams,
  createBrowserRouter,
} from 'react-router-dom';
import SignUp from './SignUp';
import SignIn from './SignIn';
import DashBoard from './Dashboard';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};
let app = null;
if (!firebase.apps.length) {
  app = firebase.initializeApp(firebaseConfig);
}
export const storage = getStorage(app);
export const MessageContext = createContext();

function App() {
  const [messages, setMessages] = useState({});
  const [userInfo, setUserinfo] = useState({});
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState({});
  const [userState, setUserState] = useState({}); //The other user in duo chat
  const [profileScreen, setProfileScreen] = useState(false);
  const [names, setNames] = useState([]);
  const [author, setAuthor] = useState('');
  const [isSignedIn, setIsSignedIn] = useState(null);
  const [filteredArr, setFilteredArr] = useState([]);
  const [unreadData, setUnreadData] = useState({});
  const previousState = useRef(messages);
  const firstRender = useRef(true);
  const originalRef = useRef([]);
  const navigate = useNavigate()
  useEffect(() => {
    let isSignedIn = false;

    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      setIsSignedIn(user);
      if (user && !isSignedIn) {
        // User is signed in, navigate to homescreen/none
        navigate("/homescreen/none");
      }
      isSignedIn = true;
    });
    return () => unsubscribe();
  }, []); 
  
  function participantMap(mapData) {
    Promise.all(
      Object.keys(mapData).map((uid, index) => {
        const nameRef = ref(getDatabase(), `/users/${uid}/name`);
        return get(nameRef);
      }),
    )
      .then((names) => {
        let tempArr = [];
        Promise.all(
          Object.keys(mapData).map((uid, index) => {
            const codeRef = ref(
              getDatabase(),
              `/users/${uid}/userCode`,
            );
            return get(codeRef);
          }),
        ).then((codes) => {
          Promise.all(
            Object.keys(mapData).map((uid, index) => {
              const pfpRef = ref(getDatabase(), `/users/${uid}/pfpInfo/pfpLink`);
              return get(pfpRef);
            }),
          ).then((pfps) => {
            tempArr = names.map((snapshot, index) => ({
              name: snapshot.val(),
              uid: Object.keys(mapData)[index],
              pfp: pfps[index].val(),
            }));
            const codeArr = codes.map((code, index) => ({
              userCode: code.val(),
            }));
            Promise.all(
              Object.keys(mapData).map((uid, index) => {
                const aboutRef = ref(
                  getDatabase(),
                  `/users/${uid}/about`,
                );
                return get(aboutRef);
              }),
            ).then((aboutInfo) => {
              const finalArr = aboutInfo.map((aboutSnapshot, index) => ({
                ...tempArr[index],
                ...codeArr[index],
                about: aboutSnapshot.val(),
              }));
              setNames(finalArr);
            });
          });
        });
      })
      .catch((err) => {
      });
  }
  useEffect(() => {
    if (
      Object.keys(messages).length !== 0
      && (JSON.stringify(messages.participants)
        !== JSON.stringify(previousState.current.participants)
        || JSON.stringify(messages.chatName)
          !== JSON.stringify(previousState.current.chatName)
        || firstRender.current)
    ) {
      firstRender.current = false;
      
      if (messages.participants) {
        if (messages.type === 'duo') {
          participantMap(messages.originalParticipants);
        } else {
          participantMap(messages.participants);
        }
      }

      const authorRef = ref(
        getDatabase(),
        `/users/${messages.author}/name`,
      );
      get(authorRef).then((snapshot) => {
        setAuthor(snapshot.val());
      });
    }
    let unreadListenerInfo = {};
    if (isSignedIn) {
      const unreadRef = ref(getDatabase(), `unreadData/${isSignedIn.uid}`);
      const callback = (unreadChats) => {
        if (unreadChats.exists()) {
          setUnreadData(unreadChats.val());
        } else {
          setUnreadData({});
        }
      };
      const listener = onValue(unreadRef, callback);
      unreadListenerInfo = {
        ref: unreadRef,
        callback,
        listener,
      };
    }
    return () => {
      if (Object.keys(unreadListenerInfo).length !== 0) {
        off(unreadListenerInfo.ref, 'value', unreadListenerInfo.callback);
      }
    };
  }, [messages.chatName, messages.participants]);
  useEffect(() => {
    setUserState(
      isSignedIn && names[0] && names[1]
        ? names[0].uid !== isSignedIn.uid
          ? names[0]
          : names[1]
        : '',
    );
  }, [names]);
  return (
    <MessageContext.Provider
      value={{
        messages,
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
        setProfileScreen,
        unreadData,
        setUnreadData,
      }}
    >
      <div className="flex bg-bgColor h-screen w-screen">
        <Routes>
          <Route path="/" element={<SignUp />}/>
          <Route path="/auth">
            <Route index element={<SignUp />} />
            <Route path="signin" element={<SignIn />} />
          </Route>
          <Route
            path="/homescreen/:chatId"
            element={(
              <ProtectedRoute
                setMessages={setMessages}
                setUserinfo={setUserinfo}
                messages={messages}
                previousState={previousState}
                setFilteredArr={setFilteredArr}
                userInfo={userInfo}
                originalRef={originalRef}
                currentUser={isSignedIn}
              >
                <DashBoard />
              </ProtectedRoute>
            )}
          />
          <Route path="*" element={<h1>Not found</h1>} />
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
  originalRef,
  currentUser,
}) {
  const navigate = useNavigate();
  const { chatId } = useParams();
  useEffect(() => {
    const participantRef = ref(getDatabase(), `/chats/${chatId}/participants`);
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (chatId !== 'none' && Object.keys(messages).length !== 0) {
        get(participantRef).then((snapshot) => {
          if (user&&Object.keys(messages.participants).includes(user.uid)) {
          } else {
            navigate('/homescreen/none');
          }
        });
      }
    });
    return () => {
      unsubscribe();
    };
  }, [messages.participants]);
  useEffect(() => {
    let listenerInfo = {};
    if (currentUser && chatId !== 'none') {
      const unreadRef = ref(
        getDatabase(),
        `/unreadData/${currentUser.uid}/${chatId}`,
      );
      const updateRef = ref(getDatabase(), `/unreadData/${currentUser.uid}`);
      const updateUnread = () => {
        update(updateRef, {
          [chatId]: 0,
        });
      };
      const listenerRef = onValue(unreadRef, updateUnread);
      listenerInfo = {
        ref: unreadRef,
        listener: listenerRef,
        callback: updateUnread,
      };
    }
    return () => {
      if (Object.keys(listenerInfo).length !== 0) {
        off(listenerInfo.ref, 'value', listenerInfo.callback);
      }
    };
  }, [currentUser, chatId]);
  useEffect(() => { //useEffect to update messages
    const chatsRef = ref(getDatabase(), `/chats/${chatId}`);
    let listenerInfo = {};
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (!user) {
        navigate('/auth');
      } else {
        const callback = (snapshot) => {
          if (snapshot.exists()) {
            setMessages((prev) => {
              previousState.current = prev;
              return snapshot.val();
            });
          } else {
            setMessages({});
          }
        };
        const listener = onValue(chatsRef, callback);
        listenerInfo = {
          ref: chatsRef,
          callback,
          listener,
        };
      }
    });

    // Cleanup function
    return () => {
      unsubscribe();
      if (Object.keys(listenerInfo).length !== 0) {
        off(listenerInfo.ref, 'value', listenerInfo.callback);
      }
    };
  }, [chatId]);

  useEffect(() => {
    let userListenerInfo = {};
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (!user) {
        navigate('/auth');
      } else {
        const auth = getAuth();
        const userRef = ref(getDatabase(), `users/${auth.currentUser.uid}`);
        const callback = (snapshot) => {
          setUserinfo(snapshot.val());
        };
        const listener = onValue(userRef, callback);
        userListenerInfo = {
          ref: userRef,
          callback,
          listener,
        };
      }
    });
    return () => {
      unsubscribe();
      if (Object.keys(userListenerInfo).length !== 0) {
        off(userListenerInfo.ref, 'value', userListenerInfo.callback);
      }
    };
  }, []);

  useEffect(() => { //useEffect to update contact bar
    const tempArr = [];

    const listenerRefs = []; // Array to store the listener references
    if (userInfo.chats) {
      Object.keys(userInfo.chats).forEach((value, index) => {
        const chatsRef = ref(getDatabase(), `/chatMetaData/${value}`);
        const callback = (snapshot) => {
          if (snapshot.exists()) {
            const newData = { ...snapshot.val(), chatId: snapshot.key };

            const existingChat = tempArr.find((obj) => obj.chatId === value);

            if (existingChat) {
              // If it exists, update the corresponding object in `tempArr`
              Object.assign(existingChat, newData);
            } else {
              // If it doesn't exist, add the new data to `tempArr`
              tempArr.push(newData);
            }

            // Update the reference and sort `tempArr`
            originalRef.current = tempArr;
            tempArr.sort((a, b) => b.lastMsgTime - a.lastMsgTime);

            // Update `filteredArr` with sorted `tempArr`
            setFilteredArr([...tempArr]);
          } else {
            setFilteredArr([]);
          }
        };

        const listenerRef = onValue(chatsRef, callback);
        listenerRefs.push({
          ref: chatsRef,
          callback,
          unsubscribe: listenerRef,
        }); // Add the listener reference to the array
      });
    } else {
      setFilteredArr([]);
    }

    // Cleanup function to unsubscribe the listeners
    return () => {
      listenerRefs.forEach((listenerRef) => {
        off(listenerRef.ref, 'value', listenerRef.callback);
        listenerRef.unsubscribe();
      });
    };
  }, [userInfo]);
  return children;
}
export default App;
