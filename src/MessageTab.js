import React, {useState,useContext,useEffect,useRef} from 'react'
import { getDatabase, ref, update,push } from 'firebase/database'
import send from './images/send-message.png'
import { MessageContext } from './App'
import { useParams } from 'react-router-dom'
import { getAuth } from 'firebase/auth'
export default function MessageTab() {
  const {messages,setMessages} = useContext(MessageContext)
  const [text,setText] = useState('')
  const containerRef = useRef()
  const {chatId} = useParams()
  console.log(!!messages[chatId].messages)
  //const currentChat = Object.keys(messages).length!==0&&'messages' in messages?messages[chatId].messages:{}
  const currentChat =Object.keys(messages).length&&!!messages[chatId].messages?messages[chatId].messages:{}
  function handleSubmit(){
    if(text.trim()!==''){
        const tempObj = {
            content:text,
            sender:getAuth().currentUser.displayName,
            timestamp:Date.now()
        }
        const chatRef = ref(getDatabase(),`/chats/${chatId}/messages`)
        push(chatRef,tempObj)
        setText('')
    }
    
  }
  useEffect(()=>{
    const container = containerRef.current
    container.scrollTo(0,container.scrollHeight)
  },[messages])

  return (
    <div className='flex-1 flex min-w-messageMin w-1/4 flex-col relative break-words'>
        <div className='flex gap-4 h-20 min-h-20 items-center pl-5 border-t border-borderColor bg-stone-900 mb-5 shadow-md shadow-stone-800'>
                <img src={'https://wallpapers.com/images/hd/shadow-boy-white-eyes-unique-cool-pfp-nft-13yuypusuweug9xn.jpg'} className='rounded-3xl w-10 h-10'></img>
                <div>
                    <p className='text-white'>{messages[chatId]?messages[chatId].chatName:''}</p>
                </div>
        </div>
        <div className='overflow-scroll h-4/6' ref={containerRef}>
        {
            Object.keys(currentChat).map((value,index)=>{
                return(
                    <div key={index}>
                    {
                        index>0?currentChat[value].sender!==currentChat[Object.keys(currentChat)[index-1]].sender?
                            <MessageBox pfp='https://wallpapers.com/images/hd/shadow-boy-white-eyes-unique-cool-pfp-nft-13yuypusuweug9xn.jpg' name={currentChat[value].sender} msg={currentChat[value].content}/>:<p className='text-white pl-5 text-sm font-light mb-2 ml-14'>{currentChat[value].content}</p>
                    :<MessageBox pfp='https://wallpapers.com/images/hd/shadow-boy-white-eyes-unique-cool-pfp-nft-13yuypusuweug9xn.jpg' name={currentChat[value].sender} msg={currentChat[value].content}/>
                    }
                    </div>
                )
            })
        }
        </div>
        <div className=' bg-inputColor rounded-xl py-3 text-white pl-4 outline-none placeholder-borderColor absolute bottom-6 left-5 right-5 shadow-slate-600 shadow-lg flex justify-between'>
         <input className='bg-inputColor outline-none flex-1' placeholder='Type message' onChange={(event)=>{setText(event.target.value)}} value={text} onKeyDown={(event)=>{if(event.key=='Enter'){
            handleSubmit()
         }}}></input>
         <div>
            <img src={send} className='h-6 mr-4 hover:opacity-80 transition-all duration-200' onClick={()=>{
                handleSubmit()
                console.log('clicked')
            }}></img>
         </div>
        </div>
    </div>
  )
}

const MessageBox = ({pfp,name,msg})=>{
    return(
        <div className='flex gap-4 h-16 items-center pl-5'>
        <img src={pfp} className='rounded-3xl w-10 h-10'></img>
        <div>
            <p className='text-white'>{name}</p>
            <p className='text-white text-sm font-light'>{msg}</p>
        </div>
    </div> 
    )
   
}
