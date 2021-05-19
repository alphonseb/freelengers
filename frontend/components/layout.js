import { useState, useContext } from "react";

import Link from "next/link";
import ButtonLink from "./elements/button-link";
import Navbar from "./02-molecules/navbar";
import Footer from "./elements/footer";
import NotificationBanner from "./elements/notification-banner";
import Router from "next/router";

import { logout } from "../lib/auth";
import AppContext from "../context/AppContext";

const Layout = ({ children, global }) => {
  // const { navbar, footer, notificationBanner } = global;
  const { user, setUser } = useContext(AppContext);

  return (
    <div>
      <Navbar />
      <div>{children}</div>
      {/* <Footer footer={footer} /> */}
    </div>
  );
};

export default Layout;
