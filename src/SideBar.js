import { BsPlus, BsFillLightningFill, BsGearFill } from "react-icons/bs";
import { FaFire, FaPoo } from "react-icons/fa";

export default function SideBar() {
  return (
    <>
      <div className="flex bg-bgColor h-screen w-screen">
        <div className="flex flex-col h-screen bg-primary w-16 top-0 m-0 shadow-lg text-white text-secondary">
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
