import React, {useState,useContext,useEffect,useRef} from 'react'
import send from './images/send-message.png'
import { MessageContext } from './App'
export default function MessageTab() {
  const {messages,setMessages} = useContext(MessageContext)
  const [text,setText] = useState('')
  const containerRef = useRef()
  useEffect(()=>{
    console.log(messages)
    console.log(messages.length)
  },[messages])
  function handleSubmit(){
    if(text.trim()!==''){
        setMessages(prev=>{
            const tempObj = {
                pfp:'https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP-1200x1200.jpg',
                name:'Caleb',
                msg:text,
            }
            return [...prev,tempObj]
        })
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
                    <p className='text-white'>Caleb</p>
                    <p className=' text-subColor text-xs'>suka</p>
                </div>
        </div>
        <div className='overflow-scroll h-4/6' ref={containerRef}>
        {
            messages.map((value,index)=>{
                return(
                    <div>
                    {
                        index>0?messages[index-1].name!==messages[index].name?
                            <MessageBox pfp='https://wallpapers.com/images/hd/shadow-boy-white-eyes-unique-cool-pfp-nft-13yuypusuweug9xn.jpg' name={value.name} msg={value.msg}/>:<p className='text-white pl-5 h-7 text-sm font-light ml-14'>{value.msg}</p>
                    :<MessageBox pfp='https://wallpapers.com/images/hd/shadow-boy-white-eyes-unique-cool-pfp-nft-13yuypusuweug9xn.jpg' name='John' msg={value.msg}/>
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
