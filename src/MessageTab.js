import React from 'react'

export default function MessageTab() {
  return (
    <div className='flex-1 flex flex-col relative'>
        <div className='flex gap-4 h-20 items-center pl-5 border-t border-borderColor cursor-pointer bg-gray-900  mb-5'>
                <img src={'https://wallpapers.com/images/hd/shadow-boy-white-eyes-unique-cool-pfp-nft-13yuypusuweug9xn.jpg'} className='rounded-3xl w-10 h-10'></img>
                <div>
                    <p className='text-white'>Caleb</p>
                    <p className=' text-subColor text-xs'>suka</p>
                </div>
        </div>
        <MessageBox pfp='https://wallpapers.com/images/hd/shadow-boy-white-eyes-unique-cool-pfp-nft-13yuypusuweug9xn.jpg' name='John' msg='How are you!'/>
        <MessageBox pfp='https://www.asiamediajournal.com/wp-content/uploads/2022/10/Dog-Cool-PFP-1200x1200.jpg' name='Caleb' msg='Im good wbu.'/>
        <div className=' bg-inputColor rounded-xl py-3 text-white pl-2 outline-none placeholder-borderColor absolute bottom-6 left-5 right-5 shadow-slate-600 shadow-lg '>
         <input className='bg-inputColor outline-none' placeholder='Type message'></input>
         <div></div>
        </div>
    </div>
  )
}

const MessageBox = ({pfp,name,msg})=>{
    return(
        <div className='flex gap-4 h-16 items-center pl-5 cursor-pointer'>
        <img src={pfp} className='rounded-3xl w-10 h-10'></img>
        <div>
            <p className='text-white'>{name}</p>
            <p className='text-white text-sm font-light'>{msg}</p>
        </div>
    </div> 
    )
   
}
