import { BsPlus, BsFillLightningFill, BsGearFill } from "react-icons/bs";
import { FaFire, FaPoo } from "react-icons/fa";
import fire from './fire-gif.gif'
import { useState } from "react";
export default function SideBar() {
  const [hover,setHover] = useState(false)
  return (
    <>
        <div className="flex flex-col h-screen bg-bgColor w-16 top-0 m-0 shadow-lg text-white text-secondary justify-center gap-1 relative ">
            <div className='absolute top-5' onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}>
                {hover?<img src={fire} className=''></img>:<FaFire size='25' className="ml-5 mt-4 text-fireColor"/>}
            </div>
          <SidebarIcon
            icon={<FaFire size="28" />}
            text="toolip💡"
          ></SidebarIcon>
          <SidebarIcon icon={<FaPoo size="28" />} text="toolip💡"></SidebarIcon>
          <SidebarIcon
            icon={<BsPlus size="28" />}
            text={"toolip💡"}
          ></SidebarIcon>
          <SidebarIcon
            icon={<BsFillLightningFill size="28" />}
            text={"toolip💡"}
          ></SidebarIcon>
        </div>
    </>
  );
}

const SidebarIcon = ({ icon, text }) => {
  return (
    <div className="sidebar-icon group">
      {icon}
      <span className="toolip group-hover:scale-100">
        <p>{text}</p>
      </span>
    </div>
  );
};
