import Link from "next/link";
import ButtonLink from "./elements/button-link";
import Navbar from "./elements/navbar";
import Footer from "./elements/footer";
import NotificationBanner from "./elements/notification-banner";
import { useState, useContext } from "react";

import { logout } from "../lib/auth";
import AppContext from "../context/AppContext";

const Layout = ({ children, global }) => {
  // const { navbar, footer, notificationBanner } = global;

  const { user, setUser } = useContext(AppContext);

  return (
    <div>
      {/* Aligned to the top */}
      {/* <Navbar navbar={navbar} /> */}
      <div>{children}</div>
      <div>
        {user ? (
          <h5>{user.username}</h5>
        ) : (
          <Link href='/register'>
            <a className='nav-link'> Sign up</a>
          </Link>
        )}
      </div>
      <div>
        {user ? (
          <Link href='/'>
            <a
              className=''
              onClick={() => {
                logout();
                setUser(null);
              }}
            >
              Logout
            </a>
          </Link>
        ) : (
          <Link href='/login'>
            <a className='nav-link'>Sign in</a>
          </Link>
        )}
      </div>
      {/* Aligned to the bottom */}
      {/* <Footer footer={footer} /> */}
    </div>
  );
};

export default Layout;
