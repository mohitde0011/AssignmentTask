import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import logo from "../../assets/images/logo.svg";
import { Icons } from "../../assets/Icons";

export default function Sidebar() {
  const [openSections, setOpenSections] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const navItems = [
    {
      sectionName: "Systems",
      icon: Icons.systemCode,
      items: [
        {
          to: "/system-code",
          icon: Icons.systemCode,
          filledIcon: Icons.systemCodeFilled,
          name: "SystemCode",
        },
        {
          to: "/properties",
          icon: Icons.prop,
          filledIcon: Icons.propFilled,
          name: "Properties",
        },
        {
          to: "/menus",
          icon: Icons.menu,
          filledIcon: Icons.menuFilled,
          name: "Menus",
        },
        {
          to: "/api-list",
          icon: Icons.appList,
          filledIcon: Icons.appListFilled,
          name: "API List",
        },
      ],
    },
    {
      sectionName: "Users & Group",
      icon: Icons.users,
      items: [
        { to: "/users", icon: Icons.user, name: "Users" },
        { to: "/groups", icon: Icons.group, name: "Groups" },
      ],
    },
    {
      sectionName: "Competition",
      icon: Icons.competition,
      items: [
        { to: "/competitors", icon: Icons.competitor, name: "Competitors" },
        { to: "/analysis", icon: Icons.analysis, name: "Analysis" },
      ],
    },
  ];

  useEffect(() => {
    const activeSection = navItems.find((section) =>
      section.items.some((item) => item.to === location.pathname)
    );
    if (activeSection) {
      setOpenSections([activeSection.sectionName]);
    } else {
      setOpenSections([]);
    }
  }, [location.pathname]);

  const toggleSection = (sectionName) => {
    setOpenSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((name) => name !== sectionName)
        : [sectionName]
    );
    if (isCollapsed) {
      setIsCollapsed(false);
    }
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    if (!isCollapsed) {
      const activeSection = navItems.find((section) =>
        section.items.some((item) => item.to === location.pathname)
      );
      if (activeSection) {
        setOpenSections([activeSection.sectionName]);
      } else {
        setOpenSections([]);
      }
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavItemClick = (sectionName) => {
    if (isCollapsed) {
      setIsCollapsed(false);
      setOpenSections([sectionName]);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile burger icon */}
      <div className="md:hidden fixed top-4 left-4 z-500 bg-white ">
        <img
          src={Icons.openBurgur}
          alt="Menu"
          className="cursor-pointer w-8 h-8"
          onClick={toggleMobileMenu}
        />
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 transform scroll-smooth no-scrollbar overflow-y-auto m-2
                   md:relative md:translate-x-0 transition-all duration-300 ease-in-out z-[900]
                   md:sticky md:h-[98vh] overflow-auto
                   ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-10"}
                   ${isCollapsed ? "md:w-16" : "md:w-64"}
                   ${isMobileMenuOpen ? "w-64" : "w-0"}
                   bg-primary rounded-2xl p-4`}
      >
        <div className="flex items-center justify-between mb-6">
          {(!isCollapsed || isMobileMenuOpen) && (
            <img className="h-7" src={logo} alt="Logo" />
          )}
          <img
            src={isCollapsed ? Icons.openBurgur : Icons.closeBurgur}
            alt="Menu"
            className={`cursor-pointer ${isCollapsed && "invert"}`}
            onClick={() => {
              if (window.innerWidth >= 768) {
                toggleCollapse();
              } else {
                toggleMobileMenu();
              }
            }}
          />
        </div>
        <nav>
          {navItems.map((section, index) => {
            const isSectionOpen = openSections.includes(section.sectionName);
            return (
              <div
                key={index}
                className={`mb-4 p-2 ${
                  isSectionOpen ? "bg-[#1d2939] rounded-md" : ""
                }`}
              >
                <h2
                  className={`text-gray-400 text-sm mb-2 flex items-center font-semibold gap-3 cursor-pointer ${
                    isSectionOpen ? "text-white" : "text-[#667085]"
                  }`}
                  onClick={() => toggleSection(section.sectionName)}
                >
                  <img
                    src={isSectionOpen ? Icons.openFolder : Icons.closeFolder}
                    alt=""
                  />
                  {(!isCollapsed || isMobileMenuOpen) && section.sectionName}
                </h2>
                {isSectionOpen && (
                  <ul
                    className={isCollapsed && !isMobileMenuOpen ? "hidden" : ""}
                  >
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex}>
                        <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                            `flex items-center font-bold p-2 rounded-xl ${
                              isActive
                                ? "bg-[#5ADB5A] text-[#101828]"
                                : "text-[#667085]"
                            }`
                          }
                          onClick={() =>
                            handleNavItemClick(section.sectionName)
                          }
                        >
                          {({ isActive }) => (
                            <>
                              <span className="mr-3">
                                <img
                                  src={isActive ? item.filledIcon : item.icon}
                                  alt=""
                                />
                              </span>
                              {(!isCollapsed || isMobileMenuOpen) && item.name}
                            </>
                          )}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </>
  );
}
