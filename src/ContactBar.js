import React from 'react'

export default function ContactBar() {
  return (
    <div className='flex border-r border-l border-borderColor w-72 flex-col'>
        <div className='mx-5'>
            <input placeholder='Search' className=' z-50 w-full my-5 bg-inputColor rounded py-2 text-white pl-2 outline-none placeholder-borderColor shadow-sm shadow-slate-500'></input>
        </div>
        <div className='flex flex-col'>
            <ContactBox name='Caleb' lastMsg='Sup homie' pfp='https://wallpapers.com/images/hd/shadow-boy-white-eyes-unique-cool-pfp-nft-13yuypusuweug9xn.jpg'/>
            <ContactBox name='Caleb' lastMsg='Sup homie' pfp='https://wallpapers.com/images/hd/shadow-boy-white-eyes-unique-cool-pfp-nft-13yuypusuweug9xn.jpg'/>
        </div>
    </div>
  )
}

const ContactBox = ({name,pfp,lastMsg})=>{
    return(
        <div className='flex gap-2 h-16 items-center pl-5 border-t border-borderColor cursor-pointer hover:bg-slate-800'>
                <img src={pfp} className='rounded-3xl w-10 h-10'></img>
                <div>
                    <p className='text-white'>{name}</p>
                    <p className=' text-subColor text-xs'>{lastMsg}</p>
                </div>

            </div>
    )
}
