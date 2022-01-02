import React, { useState } from "react";
import { Link } from "react-router-dom";
import SidebarLinkNavigation from "./SidebarLinkNavigation";

interface SidebarProps {
  handleDarkMode: () => void;
}

const MenuIcon: React.FC<{ handleToggle: () => void }> = ({ handleToggle }) => {
  return (
    <button
      className="p-4 focus:outline-none dark:text-green-500"
      onClick={handleToggle}
    >
      <svg
        className="h-5 w-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    </button>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ handleDarkMode }) => {
  const [toggle, setToggle] = useState<boolean>(false);
  const handleToggle = () => {
    setToggle(!toggle);
  };

  return (
    <>
      <div className="bg-blue-600 text-gray-100 flex justify-between md:hidden dark:bg-gray-700">
        <Link
          to="/admin/dashboard"
          className="block p-4 md:ml-0 text-sm sm:text-base md:text-xl text-white font-bold dark:text-green-500"
        >
          eShop Administration
        </Link>
        <MenuIcon handleToggle={handleToggle} />
      </div>

      {toggle ? (
        <SidebarLinkNavigation
          responsive="sidebar-max-md"
          handleToggle={handleToggle}
          handleDarkMode={handleDarkMode}
        />
      ) : (
        <SidebarLinkNavigation
          responsive="sidebar-min-md"
          handleToggle={handleToggle}
          handleDarkMode={handleDarkMode}
        />
      )}
    </>
  );
};

export default Sidebar;
