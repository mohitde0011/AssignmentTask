import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../organisms/Sidebar";
 

export default function MainLayout() {
  return (
    <div className="relative h-[100vh]  pr-0   flex    overflow-hidden">
      <Sidebar />
 
      <div className="overflow-auto w-full p-1 pt-0 ">
        
      <Outlet />
      </div>
    </div>
  );
}
