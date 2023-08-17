import React, { useContext } from 'react';
import { Link, Outlet } from 'react-router-dom';
import SideBar from './SideBar';
import ContactBar from './ContactBar';
import MessageTab from './MessageTab';
import { MessageContext } from './App';
import ProfileScreen from './ProfileScreen';

export default function DashBoard() {
  const { profileScreen, setProfileScreen, isSignedIn } = useContext(MessageContext);
  return (
    <div className="flex bg-bgColor h-screen w-screen overflow-hidden">
      {isSignedIn ? (!profileScreen ? (
        <>
          <SideBar />
          <ContactBar />
          <MessageTab />
        </>
      ) : <ProfileScreen />) : <></>}
    </div>
  );
}
