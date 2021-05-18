import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/router";

import { login } from "../../lib/auth";
import AppContext from "context/AppContext";

import ActiveLink from "../01-atoms/ActiveLink";

import ArrowRight from "../../src/assets/icons/arrow-right.svg";

const Login = ({ data }) => {
  const [user, updateUser] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const router = useRouter();
  const appContext = useContext(AppContext);

  useEffect(() => {
    if (appContext.isAuthenticated) {
      router.push("/"); // redirect if you're already logged in
    }
  }, []);

  function onChange(event) {
    updateData({ ...data, [event.target.name]: event.target.value });
  }

  return (
    <section>
      <div className='main-container-login'>
        <div className='login-image'>
          <img
            src='/images/saly-1.png'
            alt='freelancer illustration'
          />
          <img src="/images/saly-2.png" alt="" />
        </div>
        <div className='login-form'>
          <h1>Me connecter</h1>
          <p className='paragraph'>
            Vous n’avez pas encore de compte ?&ensp;
            <ActiveLink href={"/register"} className='accent'>
              Inscrivez-vous
            </ActiveLink>
          </p>
          <div className='error'>
            {Object.entries(error).length !== 0 &&
              error.constructor === Object &&
              error.message.map((error) => {
                return (
                  <div key={error.messages[0].id} style={{ marginBottom: 10 }}>
                    <small style={{ color: "red" }}>
                      {error.messages[0].message}
                    </small>
                  </div>
                );
              })}
          </div>
          <form>
            <fieldset disabled={loading}>
              <div className='input-container'>
                <label className='subtitle'>Email</label>
                <input
                  type='email'
                  name='identifier'
                  onChange={(e) =>
                    updateUser({ ...user, [e.target.name]: e.target.value })
                  }
                  value={user.username}
                  placeholder='hulkhogan@freelengers.com'
                />
              </div>
              <div className='input-container'>
                <label className='subtitle'>Mot de passe</label>
                <input
                  onChange={(e) =>
                    updateUser({ ...user, [e.target.name]: e.target.value })
                  }
                  value={user.password}
                  type='password'
                  name='password'
                  placeholder='*****'
                />
              </div>
              <div className='input-container'>
                <input
                  type='submit'
                  value={loading ? "Chargement.." : "Me connecter"}
                  disabled={loading}
                  onClick={() => {
                    setLoading(true);
                    login(user.identifier, user.password)
                      .then((res) => {
                        setLoading(false);
                        // set authed User in global context to update header/app state
                        appContext.setUser(res.data.user);
                      })
                      .catch((error) => {
                        setError(error.response.user);
                        setLoading(false);
                      });
                  }}
                />
                <ArrowRight />
              </div>
            </fieldset>
          </form>
          <p className='paragraph'>
            Vous avez oublié votre mot de passe ?&ensp;
            <ActiveLink
              href={"https://www.youtube.com/watch?v=xvFZjo5PgG0"}
              className='accent'
              newTab={true}
            >
              Réinitialisez-le
            </ActiveLink>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
