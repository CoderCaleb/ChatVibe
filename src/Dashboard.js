import React from "react";
import { Link, Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import ContactBar from "./ContactBar";
import MessageTab from "./MessageTab";
export default function DashBoard() {
  return (
    <div className="flex bg-bgColor h-screen w-screen">
      <SideBar />
      <ContactBar />
      <MessageTab />
    </div>
  );
}
