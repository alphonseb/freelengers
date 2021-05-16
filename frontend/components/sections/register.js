import React, { useState, useContext } from "react";
import { registerUser } from "../../lib/auth";
import AppContext from "../../context/AppContext";

import ArrowRight from "../../src/assets/icons/arrow-right.svg";

const Register = ({ data }) => {
  const [newUser, setNewUser] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const appContext = useContext(AppContext);

  return (
    <section>
      <h1>Rejoindre Freelengers</h1>
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
      <form>
        <fieldset disabled={loading}>
          <div className='input-container'>
            <label className='subtitle'>Nom d'utilisateur</label>
            <input
              type='text'
              name='username'
              disabled={loading}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              value={newUser.username}
              placeholder='Clark'
            />
          </div>
          <div className='input-container'>
            <label className='subtitle'>Email</label>
            <input
              onChange={(e) =>
                setNewUser({ ...newUser, email: e.target.value })
              }
              value={newUser.email}
              type='email'
              name='email'
              placeholder='hulkhogan@freelengers.io'
            />
          </div>
          <div className='input-container'>
            <label className='subtitle'>Mot de passe</label>
            <input
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              value={newUser.password}
              type='password'
              name='password'
              placeholder='*****'
            />
          </div>
          <div className='input-container'>
            <input
              type='submit'
              value={loading ? "Chargement.." : "Je suis input submit"}
              disabled={loading}
              onClick={() => {
                setLoading(true);
                registerUser(newUser.username, newUser.email, newUser.password)
                  .then((res) => {
                    console.log(res);
                    // set authed user in global context object
                    appContext.setUser(res.newUser);
                    setLoading(false);
                  })
                  .catch((error) => {
                    setError(error);
                    setLoading(false);
                  });
              }}
            />
            <ArrowRight />
            <button className='btn-primary' onClick={() => null}>Je suis button <ArrowRight/></button>
          </div>
        </fieldset>
      </form>
    </section>
  );
};

export default Register;
