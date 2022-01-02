import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { Link } from "react-router-dom";
import { sidebarItems } from "../../constant";

interface SidebarLinkNavigationProps {
  responsive: string;
  handleToggle: () => void;
  handleDarkMode: () => void;
}

const SidebarLinkNavigation: React.FC<SidebarLinkNavigationProps> = ({
  responsive,
  handleToggle,
  handleDarkMode,
}) => {
  const { logout } = useAuth0();

  const isResponsive = responsive === "sidebar-max-md";

  return (
    <div className={`sidebar ${responsive}`}>
      <Link
        to="/admin/dashboard"
        className="flex items-center space-x-2 px-4  text-white dark:text-green-500"
        onClick={handleToggle}
      >
        <span className="text-base md:text-xl font-extrabold">
          eShop Administration
        </span>
      </Link>
      <nav>
        {sidebarItems.map((item, index) => (
          <Link
            key={index}
            to={`/admin/${item.path}`}
            className="btn-link"
            onClick={isResponsive ? handleToggle : undefined}
          >
            {item.label}
          </Link>
        ))}
        <button
          className="btn-link w-full text-left"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Logout
        </button>
        <label
          htmlFor="toggleB"
          className="flex items-center cursor-pointer pl-3 mt-2"
        >
          <div className="relative">
            <input
              type="checkbox"
              id="toggleB"
              className="sr-only"
              onClick={handleDarkMode}
            />
            <div className="block bg-white w-12 md:w-14 h-6 rounded-full"></div>
            <div className="dot absolute left-1 top-1 bg-blue-500 w-5 h-4 md:w-6 rounded-full transition"></div>
          </div>
          <div className="ml-3 text-white font-medium text-sm sm:text-base">
            Dark mode
          </div>
        </label>
      </nav>
    </div>
  );
};

export default SidebarLinkNavigation;
