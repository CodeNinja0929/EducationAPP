/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo/logo.png";
import MobileMenu from "./MobileMenu";
import { useAuth } from "../context/AuthContext";

const Header = () => {
  const [activeMobileMenu, setActiveMobileMenu] = useState(false);
  const { currentUser, logout } = useAuth();

  const scrollNav = useRef(null);
  useEffect(() => {
    // scrolling nav
    window.addEventListener("scroll", () => {
      let windowScroll = window.scrollY > 100;
      scrollNav.current.classList.toggle("rt-sticky-active", windowScroll);
      scrollNav.current.classList.toggle("sticky", windowScroll);
    });
  }, []);

  return (
    <>
      <header
        className="site-header  home-one-header top-0 w-full z-[999] rt-sticky "
        ref={scrollNav}
      >
        <div className="main-header py-6">
          <div className="container">
            <div className=" flex items-center justify-between">
              <Link
                to={"/schoolai/home"}
                className="brand-logo flex-none lg:mr-10 md:w-auto max-w-[120px] "
              >
                <img src={logo} alt="logo" />
              </Link>
              <div className="flex items-center flex-1">
                <div className="flex-1 main-menu relative mr-[74px]">
                  <ul className="menu-active-classNamees">
                    <li>
                      <Link to={"/schoolai/home"}>Home</Link>
                    </li>
                    <li>
                      <Link to={"/schoolai/about"}>About</Link>
                    </li>
                    <li>
                      <Link to={"/schoolai/courses"}>Courses</Link>
                    </li>
                    <li>
                      <Link to={"/schoolai/blog-standard"}>Blog</Link>
                    </li>
                    <li>
                      <Link to={"/schoolai/contacts"}>Contacts</Link>
                    </li>
                  </ul>
                </div>
                <div className="flex-none flex space-x-[18px]">
                  {currentUser ? (
                    <div className="hidden lg:block">
                      <button
                        onClick={logout}
                        className="btn btn-primary py-[15px] px-8"
                      >
                        Log out
                      </button>
                    </div>
                  ) : (
                    <div className="hidden lg:block">
                      <a href="/schoolai/login" className="btn btn-primary py-[15px] px-8">
                        Start Free Trial
                      </a>
                    </div>
                  )}
                  <div className="block lg:hidden">
                    <button
                      type="button"
                      className="text-3xl md:w-[56px] h-10 w-10 md:h-[56px] rounded bg-[#F8F8F8] flex flex-col items-center justify-center menu-click"
                      onClick={() => setActiveMobileMenu(!activeMobileMenu)}
                    >
                      <iconify-icon icon="cil:hamburger-menu" rotate="180deg"></iconify-icon>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      {activeMobileMenu && (
        <MobileMenu
          activeMenu={activeMobileMenu}
          setActiveMenu={setActiveMobileMenu}
        />
      )}
    </>
  );
};

export default Header;
