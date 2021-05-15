import { useState, useEffect } from "react";
import Cookie from "js-cookie";
import fetch from "isomorphic-fetch";
import AppContext from "../context/AppContext";
// import withData from "../lib/apollo";

import App from "next/app";
import Head from "next/head";
import ErrorPage from "next/error";
import { useRouter } from "next/router";
import { DefaultSeo } from "next-seo";
import { getGlobalData } from "utils/api";
import Layout from "@/components/layout";
import "@/styles/index.css";

const MyApp = ({ Component, pageProps }) => {
  const [user, setUser] = useState(null);

  // Prevent Next bug when it tries to render the [[...slug]] route
  const router = useRouter();
  if (router.asPath === "/[[...slug]]") {
    return null;
  }

  // Extract the data we need
  const { global } = pageProps;
  if (global == null) {
    return <ErrorPage statusCode={404} />;
  }

  useEffect(() => {
    // grab token value from cookie
    const token = Cookie.get("token");

    if (token) {
      // authenticate the token on the server and place set user object
      fetch(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/users/me`, {
        headers: {
          Authorization: `Bearer ${ token }`,
          'Content-Type': 'application/json'
        },
      }).then(async (res) => {
        // if res comes back not valid, token is not valid
        // delete the token and log the user out on client
        if (!res.ok) {
          Cookie.remove("token");
          setUser(null);
          return null;
        }
        const theUser = await res.json();
        setUser(theUser);
      });
    }
  }, []);

  const { metadata } = global;
  return (
    <AppContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        setUser,
      }}
    >
      {/* Favicon */}
      <Head>
        {/* <link rel="shortcut icon" href={getStrapiMedia(global.favicon.url)} /> */}
      </Head>
      {/* Global site metadata */}
      <DefaultSeo
        titleTemplate={`%s | ${global.metaTitleSuffix}`}
        title={"Page"}
        description={metadata.metaDescription}
      />
      {/* Display the content */}
      <Layout global={global}>
        <Component {...pageProps} />
      </Layout>
    </AppContext.Provider>
  );
};

// getInitialProps disables automatic static optimization for pages that don't
// have getStaticProps. So [[...slug]] pages still get SSG.
// Hopefully we can replace this with getStaticProps once this issue is fixed:
// https://github.com/vercel/next.js/discussions/10949
MyApp.getInitialProps = async (ctx) => {
  // Calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(ctx);
  // Fetch global site settings from Strapi
  const global = await getGlobalData();
  // Pass the data to our page via props
  return { ...appProps, pageProps: { global, path: ctx.pathname } };
};

export default MyApp;
