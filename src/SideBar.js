import { BsPlus, BsFillLightningFill, BsGearFill } from 'react-icons/bs';
import { FaFire, FaPoo, FaKey } from 'react-icons/fa';
import {
  getDatabase,
  ref,
  push,
  update,
  equalTo,
  get,
  query,
  orderByValue,
  remove,
} from 'firebase/database';
import EmojiPicker from 'emoji-picker-react';
import { MdOutlineEmojiEmotions, MdOutlineCancel } from 'react-icons/md';
import { RxCross2 } from 'react-icons/rx';
import { useEffect, useState, useContext } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useNavigate, useParams } from 'react-router-dom';
import fire from './fire-gif.gif';
import peace from './images/peace-sign.png';
import smileyFace from './images/smiley-face.png';
import alien from './images/alien-face.png';
import solo from './images/chat-icon.png';
import cross from './images/close.png';
import group from './images/debate.png';
import yingyang from './images/yingyang.png';
import stero from './images/streo.png';
import rightArrow from './images/right-arrow.png';
import { MessageContext } from './App';
import tickgif from './images/blue-tick.gif';
import discordGroupIcon from './images/discord-group-icon.png';
import discordIcon2 from './images/discordIcon2.png';
import loadingAni from './images/loading-croppered.gif';

export default function SideBar() {
  const [hover, setHover] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [formIndex, setFormIndex] = useState(1);
  const [modalType, setModalType] = useState('duo');
  const [chatName, setChatName] = useState('');
  const {
    showCodeModal,
    setShowCodeModal,
    setShowRemoveModal,
    showRemoveModal,
    userInfo,
    messages,
    setProfileScreen,
  } = useContext(MessageContext);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  function SidebarIcon({ icon, text, type }) {
    return (
      <div
        className="sidebar-icon group"
        onClick={() => {
          if (type == 'plus') {
            setShowModal(true);
          } else if (type == 'join') {
            setShowJoinModal(true);
          }
        }}
      >
        {icon}
        <span className="toolip group-hover:scale-100 w-max">
          <p>{text}</p>
        </span>
      </div>
    );
  }
  function handleChange(event, setError) {
    setChatName(event.target.value);
    setError('');
  }
  const getColorFromLetter = (letter) => {
    const colors = [
      ' bg-gradient-to-r from-red-500 to-pink-500',
      ' bg-gradient-to-r from-yellow-500 to-green-500',
      ' bg-gradient-to-r from-green-500 to-blue-500',
      ' bg-gradient-to-r from-blue-500 to-indigo-500',
      ' bg-gradient-to-r from-indigo-500 to-purple-500',
      ' bg-gradient-to-r from-purple-500 to-pink-500',
      ' bg-gradient-to-r from-pink-500 to-red-500',
      ' bg-gradient-to-r from-gray-500 to-gray-700',
    ];

    // Get the index based on the letter's char code
    const index = letter.charCodeAt(0) % colors.length;
    return colors[index];
  };

  useEffect(() => {}, [showRemoveModal]);
  function ChoiceBox({ message, img, type }) {
    return (
      <div
        className="flex relative justify-between items-center w-full border border-slate-300 rounded-lg mt-3 px-3 hover:bg-slate-200 cursor-pointer transition-all duration-100 h-16"
        onClick={() => {
          setFormIndex((prev) => (prev += 1));
          setModalType(type);
        }}
      >
        <div className="flex items-center gap-2">
          <img src={img} className={type == group ? 'w-10' : 'w-12'} />
          <p className="font-semibold">{message}</p>
        </div>
        <img src={rightArrow} className="w-4 mr-3" />
      </div>
    );
  }

  return (
    <>
      <div
        className={
          `flex items-center justify-center w-screen h-screen absolute transition-all duration-100 z-50 bg-blackRgba${
            showModal ? '' : ' hidden'}`
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
          modalType={modalType}
          user={user}
          userInfo={userInfo}
        />
      </div>
      <div
        className={
          `flex items-center justify-center w-screen h-screen absolute transition-all duration-100 z-50 bg-blackRgba${
            showJoinModal ? '' : ' hidden'}`
        }
      >
        <JoinModal
          showJoinModal={showJoinModal}
          setShowJoinModal={setShowJoinModal}
          userInfo={userInfo}
        />
      </div>
      <div
        className={
          `flex items-center justify-center w-screen h-screen absolute transition-all duration-100 z-50 bg-blackRgba${
            showCodeModal ? '' : ' hidden'}`
        }
      >
        <CodeModal
          setShowCodeModal={setShowCodeModal}
          showCodeModal={showCodeModal}
        />
      </div>
      <div
        className={
          `flex items-center justify-center w-screen h-screen absolute transition-all duration-100 z-50 bg-blackRgba${
            Object.keys(showRemoveModal).length !== 0 ? '' : ' hidden'}`
        }
      >
        <ConfirmModal
          setShowRemoveModal={setShowRemoveModal}
          showRemoveModal={showRemoveModal}
          participants={messages.participants}
        />
      </div>
      <div className="flex flex-col h-screen bg-bgColor w-16 top-0 m-0 shadow-lg text-white justify-center gap-1 relative ">
        <div
          className="absolute left-1/2 transform -translate-x-1/2
          top-5"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        />
        {user && (
          <div
            className={
              `w-12 h-12 mx-auto my-3 flex items-center justify-center cursor-pointer rounded-3xl hover:rounded-xl transition-all duration-300${
                getColorFromLetter(user.displayName[0].toUpperCase())}`
            }
            onClick={() => {
              setProfileScreen(true);
            }}
          >
            {!userInfo.pfpInfo ? <p className="text-white">{user.displayName[0].toUpperCase()}</p> : <img src={userInfo.pfpInfo.pfpLink} className="w-full h-full rounded-3xl hover:rounded-xl transition-all duration-300" />}
          </div>
        )}
        <SidebarIcon
          icon={<FaKey size="28" />}
          text="Join chat 🚀"
          type="join"
        />
        <SidebarIcon
          icon={<BsPlus size="28" />}
          text="Create chat 💬"
          type="plus"
        />
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
  modalType,
  user,
  userInfo,
}) {
  const auth = getAuth();
  const [uid, setUid] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [showTick, setShowTick] = useState(false);
  const { chatId } = useParams();
  const [duoError, setDuoError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  function generateUID() {
    const string = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890';
    const uid = [];
    for (let i = 0; i <= 8; i++) {
      uid.push(string[Math.floor(Math.random() * string.length)]);
    }
    setUid(uid.join(''));
    return uid.join('');
  }
  function handleClose() {
    setShowModal(false);
    setFormIndex(1);
    setShowEmoji(false);
    setSelectedEmoji('');
    setError('');
    setDuoError('');
    setUsername('');
    setIsLoading(false);
  }
  if (formIndex == 1) {
    return (
      <div
        className="text-center bg-white rounded-lg p-5 w-96 relative animate-fade-up"
      >
        <img
          src={cross}
          className="absolute w-4 right-5 cursor-pointer"
          onClick={() => {
            handleClose();
          }}
        />
        <div className="">
          <img src={peace} className="w-20 m-auto" />
          <p className="font-semibold text-xl mb-2">Create a VibeChat</p>
          <p className="font-normal text-neutral-500 text-sm mb-5">
            Create a VibeChat – Hangout with Friends! Start your chat for 2 or a
            group and enjoy lively conversations.
          </p>
        </div>
        <ChoiceBox
          message="Initiate a Chat for Two"
          img={discordIcon2}
          type="duo"
        />
        <ChoiceBox
          message="Start a Group Chat"
          img={discordGroupIcon}
          type="group"
        />

        <div />
      </div>
    );
  } if (formIndex == 2) {
    return (
      <div
        className="text-center bg-white rounded-lg p-5 w-96 relative animate-fade-up"
      >
        <img
          src={cross}
          className="absolute w-4 right-5 cursor-pointer z-40"
          onClick={() => {
            handleClose();
          }}
        />
        {modalType == 'group' ? (
          <>
            {!isLoading ? (
              <>
                <div className="relative">
                  <img src={smileyFace} className="w-14 m-auto" />
                  <p className="font-semibold text-xl mb-2">
                    Create your VibeChat
                  </p>
                  <p className="font-normal text-neutral-500 text-sm mb-5">
                    Personalize your chat with a unique name and emoji profile
                    picture.
                  </p>
                </div>
                <div className="">
                  <div
                    className={
                      `absolute min-h-emojiMin max-h-emojiMax h-halfHeight overflow-y-auto${
                        showEmoji
                          ? ' top-1 md:right-64 md:-top-28 z-50'
                          : ' hidden'}`
                    }
                  >
                    <EmojiPicker
                      height="100%"
                      onEmojiClick={(emojiData) => {
                        setSelectedEmoji(emojiData.emoji);
                        setShowEmoji(false);
                      }}
                      lazyLoadEmojis
                      skinTonesDisabled
                    />
                    <MdOutlineCancel
                      className="absolute top-1 right-1 text-4xl text-subColor cursor-pointer md:hidden"
                      onClick={() => {
                        setShowEmoji(false);
                      }}
                    />
                  </div>
                  <button
                    className=" rounded-full w-20 h-20 flex items-center justify-center bg-gray-100 m-auto"
                    onClick={() => {
                      setShowEmoji(!showEmoji);
                    }}
                  >
                    {showEmoji ? (
                      <RxCross2 size={30} className="text-subColor" />
                    ) : selectedEmoji ? (
                      <div className="flex items-center justify-center">
                        <p className=" text-4xl">{selectedEmoji}</p>
                      </div>
                    ) : (
                      <MdOutlineEmojiEmotions
                        size={30}
                        className="text-subColor"
                      />
                    )}
                  </button>
                </div>
                <p className="text-start text-sm mb-2">Chat Name</p>
                <input
                  className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none"
                  placeholder="John's chat"
                  onChange={(event) => (event.target.value.length <= 25
                    ? handleChange(event, setError)
                    : null)}
                  value={chatName}
                />
                <p className="text-sm text-red-500">{error}</p>
              </>
            ) : (
              <div className=" w-6/12 m-auto">
                <img src={loadingAni} />
              </div>
            )}
          </>
        ) : (
          <>
            {!isLoading ? (
              <>
                <div className="">
                  <img src={smileyFace} className="w-14 m-auto" />
                  <p className="font-semibold text-xl mb-2">
                    Create your VibeChat
                  </p>
                  <p className="font-normal text-neutral-500 text-sm mb-5">
                    Connect with a friend using their username and create your
                    exclusive chat experience
                  </p>
                </div>
                <div>
                  <p className="text-start text-sm mb-2">Friend's username</p>
                  <div className="w-full border border-gray-300 rounded-lg flex justify-between items-center">
                    <input
                      placeholder="eg kelob#4838"
                      className="w-full rounded-lg p-2 text-sm outline-none"
                      value={username}
                      onChange={(event) => {
                        setUsername(event.target.value);
                        setDuoError('');
                        if (
                          /^[a-zA-Z0-9]+\#[0-9]{4}$/.test(event.target.value)
                        ) {
                          const splitName = event.target.value.split('#');
                          const codeRef = ref(
                            getDatabase(),
                            `userCodes/${splitName[0]}/${splitName[1]}`,
                          );
                          get(codeRef).then((snapshot) => {
                            if (snapshot.exists()) {
                              setShowTick(true);
                            } else {
                              setShowTick(false);
                            }
                          });
                        } else {
                          setShowTick(false);
                        }
                      }}
                    />
                    {showTick ? (
                      <div className="relative flex justify-center group">
                        <img src={tickgif} className="w-5 h-5 mr-4" />
                        <div className="absolute bottom-7 flex justify-center items-center w-28 h-5 rounded-md bg-stone-800 scale-0 group-hover:scale-100 transition-all duration-300">
                          <p className="text-white text-sm">User is found</p>
                        </div>
                      </div>
                    ) : (
                      <></>
                    )}
                  </div>
                  <p className="text-sm text-red-400">{duoError}</p>
                </div>
              </>
            ) : (
              <div className=" w-6/12 m-auto">
                <img src={loadingAni} />
              </div>
            )}
          </>
        )}
        <div className="flex gap-2 mt-5">
          <button
            className="back-button"
            disabled={isLoading}
            onClick={() => {
              setFormIndex((prev) => prev - 1);
            }}
          >
            Previous
          </button>
          <button
            className="done-button "
            disabled={isLoading}
            onClick={() => {
              if (modalType == 'group') {
                if (
                  chatName.trim().length !== 0
                  && selectedEmoji.trim().length !== 0
                ) {
                  setIsLoading(true);
                  const chatRef = ref(getDatabase(), '/chats');

                  const userRef = ref(
                    getDatabase(),
                    `/users/${auth.currentUser.uid}/chats`,
                  );
                  const codesRef = ref(getDatabase(), '/codes');
                  const metaData = ref(getDatabase(), '/chatMetaData');
                  setShowEmoji(false);
                  push(chatRef, {
                    author: auth.currentUser.uid,
                    chatName,
                    pfp: selectedEmoji,
                    timeCreated: Date.now(),
                    participants: {
                      [auth.currentUser.uid]: true,
                    },
                  }).then((value) => {
                    update(userRef, {
                      [value.key]: true,
                    }).then((result) => {
                      const uid = generateUID();
                      update(codesRef, {
                        [uid]: value.key,
                      }).then((result) => {
                        update(metaData, {
                          [value.key]: {
                            chatName,
                            pfp: selectedEmoji,
                            admin: {
                              [auth.currentUser.uid]: true,
                            },
                          },
                        }).then(() => {
                          setFormIndex((prev) => prev + 1);
                          setIsLoading(false);
                        });
                      });
                    });
                  });
                } else if (selectedEmoji.trim().length == 0) {
                  setError('Please choose an emoji for group pfp');
                } else {
                  setError('Please enter a valid chat name');
                }
              } else if (showTick) {
                const chatRef = ref(getDatabase(), '/chats');
                const userRef = ref(
                  getDatabase(),
                  `/users/${user.uid}/chats`,
                );
                if (/^[a-zA-Z0-9]+\#[0-9]{4}$/.test(username)) {
                  const splitName = username.split('#');
                  const codeRef = ref(
                    getDatabase(),
                    `userCodes/${splitName[0]}/${splitName[1]}`,
                  );
                  setIsLoading(true);
                  get(codeRef).then((snapshot) => {
                    if (snapshot.exists() && user) {
                      const nameRef = ref(
                        getDatabase(),
                        `users/${snapshot.val()}/name`,
                      );
                      const codeRef = ref(
                        getDatabase(),
                        `users/${snapshot.val()}/userCode`,
                      );
                      const otherUserRef = ref(
                        getDatabase(),
                        `users/${snapshot.val()}/chats`,
                      );
                      const contactRef = ref(
                        getDatabase(),
                        `/users/${user.uid}/contacts`,
                      );
                      const cleanedUsername = username
                        ? username.replace(/#/g, '')
                        : '';

                      const checkContactRef = ref(
                        getDatabase(),
                        `/users/${user.uid}/contacts/${cleanedUsername}`,
                      );
                      const otherContactRef = ref(
                        getDatabase(),
                        `/users/${snapshot.val()}/contacts`,
                      );

                      get(checkContactRef).then((contact) => {
                        if (!contact.exists()) {
                          get(nameRef).then((name) => {
                            if (name.exists()) {
                              get(codeRef).then((code) => {
                                if (
                                  code.exists()
                                    && username.replace(/#/g, '')
                                      !== userInfo.name + userInfo.userCode
                                ) {
                                  get(otherContactRef).then(
                                    (targetContact) => {
                                      const contactArr = targetContact.val()
                                        ? Object.keys(targetContact.val())
                                        : null;
                                      const completeUsername = userInfo.name + userInfo.userCode;

                                      if (
                                        contactArr
                                          && contactArr.includes(completeUsername)
                                      ) {
                                        update(contactRef, {
                                          [username.replace(/#/g, '')]:
                                              targetContact.val()[
                                                completeUsername
                                              ],
                                        })
                                          .then(() => {
                                            update(userRef, {
                                              [targetContact.val()[
                                                completeUsername
                                              ]]: true,
                                            });
                                          })
                                          .then(() => {
                                            const participantRef = ref(
                                              getDatabase(),
                                              `/chats/${
                                                targetContact.val()[
                                                  completeUsername
                                                ]
                                              }/participants`,
                                            );
                                            update(participantRef, {
                                              [user.uid]: true,
                                            }).then(() => {
                                              setFormIndex(
                                                (prev) => prev + 1,
                                              );
                                              setIsLoading(false);
                                            });
                                          });
                                      } else {
                                        const fullUsername = `${name.val()}#${code.val()}`;
                                        push(chatRef, {
                                          author: user.uid,
                                          timeCreated: Date.now(),
                                          type: 'duo',
                                          participants: {
                                            [user.uid]: true,
                                            [snapshot.val()]: true,
                                          },
                                          originalParticipants: {
                                            [user.uid]: true,
                                            [snapshot.val()]: true,
                                          },
                                        }).then((value) => {
                                          update(userRef, {
                                            [value.key]: true,
                                          }).then(() => {
                                            update(otherUserRef, {
                                              [value.key]: true,
                                            }).then((result) => {
                                              const metaData = ref(
                                                getDatabase(),
                                                '/chatMetaData',
                                              );
                                              update(metaData, {
                                                [value.key]: {
                                                  chatName: name.val(),
                                                  pfp: name
                                                    .val()[0]
                                                    .toUpperCase(),
                                                  type: 'duo',
                                                  participants: {
                                                    [user.uid]:
                                                        user.displayName,
                                                    [snapshot.val()]:
                                                        name.val(),
                                                  },
                                                },
                                              }).then(() => {
                                                update(contactRef, {
                                                  [username.replace(
                                                    /#/g,
                                                    '',
                                                  )]: value.key,
                                                })
                                                  .then(() => {
                                                    update(otherContactRef, {
                                                      [(
                                                        `${userInfo.name
                                                        }#${
                                                          userInfo.userCode}`
                                                      ).replace(/#/g, '')]:
                                                          value.key,
                                                    });
                                                  })
                                                  .then(() => {
                                                    setFormIndex(
                                                      (prev) => prev + 1,
                                                    );
                                                    setIsLoading(false);
                                                  });
                                              });
                                            });
                                          });
                                        });
                                      }
                                    },
                                  );
                                } else {
                                  setDuoError('Oops! Username not found.');
                                  setIsLoading(false);
                                }
                              });
                            } else {
                              setDuoError('Oops! Username not found');
                              setIsLoading(false);
                            }
                          });
                        } else {
                          setDuoError('Oops! You already added this user');
                          setShowTick(false);
                          setIsLoading(false);
                        }
                      });
                    } else {
                      setDuoError(
                        'Oops! Something went wrong. Please try again',
                      );
                    }
                  });
                } else {
                  setDuoError(
                    'Invalid username format. Use [username] + #[4-digit number]. For example: bob#5837.',
                  );
                }
              } else if (!/^[a-zA-Z0-9]+\#[0-9]{4}$/.test(username)) {
                setDuoError(
                  'Invalid username format. Use [username] + #[4-digit number]. For example: bob#5837.',
                );
              } else {
                setDuoError(
                  'Oops. User not found. Try double checking the username',
                );
              }
            }}
          >
            Create
          </button>
        </div>
        <div />
      </div>
    );
  } if (formIndex == 3) {
    return (
      <div className="text-center bg-white rounded-lg p-5 w-96 relative">
        <img
          src={cross}
          className="absolute w-4 right-5 cursor-pointer"
          onClick={() => {
            handleClose();
          }}
        />
        <div className="">
          <img src={alien} className=" w-14 m-auto" />
          <p className="font-semibold text-xl mb-2">
            {modalType == 'group'
              ? 'Chat Code Unleashed!'
              : 'VibeChat Created!'}
          </p>
          <p className="font-normal text-neutral-500 text-sm mb-5">
            {modalType == 'group'
              ? 'Share this code with friends to invite them to the chat'
              : `Your private chat with ${username} has been successfully created!`}
          </p>
        </div>
        {modalType == 'group' ? (
          <div className="w-5/6 h-20 bg-gray-100 m-auto rounded-lg flex justify-center items-center">
            <p className=" text-2xl tracking-widest font-light">{uid}</p>
          </div>
        ) : (
          <></>
        )}
        <div className="flex gap-2 mt-5">
          <button
            className="done-button"
            onClick={() => {
              setFormIndex(1);
              setShowModal(false);
            }}
          >
            Done
          </button>
        </div>
        <div />
      </div>
    );
  }
}
function JoinModal({ setShowJoinModal, showJoinModal, userInfo }) {
  const [joinModalIndex, setJoinModalIndex] = useState(1);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  let userRef = null;
  const { chatId } = useParams();
  onAuthStateChanged(getAuth(), (user) => {
    userRef = user ? ref(getDatabase(), `/users/${user.uid}/chats`) : null;
  });
  return (
    <div
      className="text-center bg-white rounded-lg p-5 w-96 relative animate-jump-in"
    >
      <img
        src={cross}
        className="absolute w-4 right-5 cursor-pointer"
        onClick={() => {
          setShowJoinModal(false);
        }}
      />
      <div className="">
        <img src={yingyang} className="w-14 m-auto" />
        <p className="font-semibold text-xl mb-2">Join Chat with Code</p>
        <p className="font-normal text-neutral-500 text-sm mb-5">
          Enter the unique code provided by the group participants to join the
          chat and connect with others
          {' '}
        </p>
      </div>
      <input
        className="w-5/6 h-20 bg-gray-100 m-auto rounded-lg flex justify-center items-center text-2xl tracking-widest font-light text-center placeholder:tracking-normal"
        placeholder="Enter your code"
        value={code}
        onChange={(event) => {
          setCode(event.target.value);
          setError('');
        }}
      />
      <p className="text-red-400 text-sm">{error}</p>
      <div className="flex gap-2 mt-5">
        <button
          className="done-button"
          onClick={() => {
            if (code.trim().length !== 0 && !/[.$#[\]]/.test(code.trim())) {
              const codesRef = ref(getDatabase(), `/codes/${code.trim()}`);
              get(codesRef).then((snapshot) => {
                if (snapshot.exists()) {
                  if (
                    snapshot.val()
                    && (userInfo.chats
                      || !Object.keys(
                        userInfo.chats ? userInfo.chats : {},
                      ).includes(snapshot.val()))
                  ) {
                    const chatRef = ref(
                      getDatabase(),
                      `/chats/${snapshot.val()}/participants`,
                    );
                    update(chatRef, {
                      [getAuth().currentUser.uid]: true,
                    }).then((value) => {
                      update(userRef, {
                        [snapshot.val()]: true,
                      }).then((value) => {
                        const messageRef = ref(
                          getDatabase(),
                          `/chats/${snapshot.val()}/messages`,
                        );
                        push(messageRef, {
                          type: 'info',
                          infoType: 'join',
                          affectUser: getAuth().currentUser.displayName,
                        });
                      });
                    });

                    setJoinModalIndex(1);
                    setShowJoinModal(false);
                  } else {
                    setError(
                      'You have already joined this chat. Please check your contacts',
                    );
                  }
                } else {
                  setError('Code does not exist. Try again');
                }
              });
            } else {
              setError('Please enter a valid code');
            }
          }}
        >
          Done
        </button>
      </div>
      <div />
    </div>
  );
}

function CodeModal({ setShowCodeModal, showCodeModal }) {
  const [code, setCode] = useState('');
  const { chatId } = useParams();
  const codesRef = ref(getDatabase(), '/codes');
  const queryRef = query(
    codesRef,
    orderByValue(), // 👈
    equalTo(chatId),
  );
  useEffect(() => {
    if (showCodeModal == true) {
      setCode('');
      get(queryRef).then((snapshot) => {
        if (snapshot.exists()) {
          setCode(Object.keys(snapshot.val())[0]);
        } else {
          setCode('Chat code failed');
        }
      });
    }
  }, [showCodeModal]);

  return (
    <div
      className="text-center bg-white rounded-lg p-5 w-96 relative animate-fade-right"
    >
      <img
        src={cross}
        className="absolute w-4 right-5 cursor-pointer"
        onClick={() => {
          setShowCodeModal(false);
        }}
      />
      <div className="">
        <img src={stero} className=" w-16 m-auto" />
        <p className="font-semibold text-xl mb-2">The Chat Code Revealed</p>
        <p className="font-normal text-neutral-500 text-sm mb-5">
          Invite others to the chat by sharing this unique code
          {' '}
        </p>
      </div>
      <div className="w-5/6 h-20 bg-gray-100 m-auto rounded-lg flex justify-center items-center">
        <p className=" text-2xl tracking-widest font-light">
          {code !== '' ? code : 'Loading...'}
        </p>
      </div>
      <div className="flex gap-2 mt-5">
        <button
          className="done-button"
          onClick={() => {
            setShowCodeModal(false);
          }}
        >
          Done
        </button>
      </div>
      <div />
    </div>
  );
}

function ConfirmModal({
  setShowRemoveModal,
  showRemoveModal,
  participants,
}) {
  const { chatId } = useParams();
  const auth = getAuth();
  return (
    <div className="text-center bg-white rounded-lg p-5 w-96 relative animate-jump-in">
      <img
        src={cross}
        className="absolute w-4 right-5 cursor-pointer"
        onClick={() => {
          setShowRemoveModal({});
        }}
      />
      <div className="">
        <img src={peace} className="w-20 m-auto" />
        <p className="font-semibold text-xl mb-2">
          {showRemoveModal.type === 'remove'
            ? 'Remove User'
            : showRemoveModal.type === 'dismiss'
              ? 'Dismiss as admin'
              : showRemoveModal.type === 'leave'
                ? 'Leave Chat'
                : 'Make admin'}
        </p>
        <p className="font-normal text-neutral-500 text-sm mb-5">
          {showRemoveModal.type === 'remove'
            ? 'Are you sure you want to remove this user from the chat?'
            : showRemoveModal.type === 'dismiss'
              ? 'Are you sure you want to dismiss this user as admin'
              : showRemoveModal.type === 'leave'
                ? 'Are you sure you want to leave this chat?'
                : 'Are you sure you want to make this user an admin'}
        </p>
      </div>
      <div className="flex gap-2 mt-5">
        <button
          className="back-button"
          onClick={() => {
            setShowRemoveModal({});
          }}
        >
          Cancel
        </button>
        <button
          className=" done-button"
          onClick={() => {
            const messageRef = ref(getDatabase(), `/chats/${chatId}/messages`);
            const tempObj = {
              type: 'info',
              infoType: showRemoveModal.type,
              ...(showRemoveModal.causeUser
                ? { causeUser: showRemoveModal.causeUser }
                : {}),
              affectUser: showRemoveModal.affectUser,
            };
            if (showRemoveModal.type == 'remove') {
              const chatRef = ref(
                getDatabase(),
                `chats/${chatId}/participants/${showRemoveModal.user}`,
              );
              remove(chatRef)
                .then(() => {
                  setShowRemoveModal({});
                  onAuthStateChanged(auth, (user) => {
                    if (user) {
                      const userRef = ref(
                        getDatabase(),
                        `users/${showRemoveModal.user}/chats/${chatId}`,
                      );
                      remove(userRef)
                        .then(() => {
                          push(messageRef, tempObj);
                        })
                        .catch((err) => {});
                    }
                  });
                })
                .catch((err) => {});
            } else if (showRemoveModal.type == 'admin') {
              const adminRef = ref(
                getDatabase(),
                `chatMetaData/${chatId}/admin`,
              );
              update(adminRef, {
                [showRemoveModal.user]: true,
              }).then(() => {
                push(messageRef, tempObj).then(() => {
                  setShowRemoveModal({});
                });
              });
            } else if (showRemoveModal.type == 'leave') {
              const chatRef = ref(
                getDatabase(),
                `/chats/${showRemoveModal.chat}/participants/${showRemoveModal.user}`,
              );
              const originalChatRef = ref(
                getDatabase(),
                `/chats/${showRemoveModal.chat}/originalParticipants/${showRemoveModal.user}`,
              );
              const mainChatRef = ref(
                getDatabase(),
                `/chats/${showRemoveModal.chat}`,
              );
              const userRef = ref(
                getDatabase(),
                `/users/${auth.currentUser.uid}/chats/${showRemoveModal.chat}`,
              );
              const codesRef = ref(getDatabase(), '/codes');
              const metaData = ref(
                getDatabase(),
                `/chatMetaData/${showRemoveModal.chat}`,
              );
              const queryRef = query(
                codesRef,
                orderByValue(), // 👈
                equalTo(showRemoveModal.chat),
              );
              const groupSize = Object.keys(participants).length;
              const contactRef = ref(
                getDatabase(),
                `/users/${auth.currentUser.uid}/contacts/${showRemoveModal.username}`,
              );
              if (showRemoveModal.chatType == 'group') {
                remove(userRef).then(() => {
                  if (groupSize > 1) {
                    remove(chatRef).then(() => {
                      push(messageRef, tempObj).then(() => {
                        setShowRemoveModal({});
                      });
                    });
                  } else {
                    remove(mainChatRef).then(() => {
                      remove(chatRef).then(() => {
                        remove(metaData).then(() => {
                          push(messageRef, tempObj).then(() => {
                            setShowRemoveModal({});
                          });
                        });
                      });
                    });
                  }
                });
              } else {
                remove(userRef).then(() => {
                  remove(contactRef).then(() => {
                    if (groupSize <= 1) {
                      remove(mainChatRef).then(() => {
                        remove(metaData).then(() => {
                          push(messageRef, tempObj).then(() => {
                            setShowRemoveModal({});
                          });
                        });
                      });
                    } else {
                      remove(chatRef).then(() => {
                        push(messageRef, tempObj).then(() => {
                          setShowRemoveModal({});
                        });
                      });
                    }
                  });
                });
              }
            } else {
              const adminRef = ref(
                getDatabase(),
                `chatMetaData/${chatId}/admin/${showRemoveModal.user}`,
              );
              remove(adminRef).then(() => push(messageRef, tempObj).then(() => {
                setShowRemoveModal({});
              }));
            }
          }}
        >
          {showRemoveModal.type == 'remove' ? 'Remove' : 'Confirm'}
        </button>
      </div>
      <div />
    </div>
  );
}
