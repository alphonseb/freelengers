import React, { useState, useContext } from "react";
import { registerUser } from "../../lib/auth";
import AppContext from "../../context/AppContext";

const Register = ({ data }) => {
  const [newUser, setNewUser] = useState({ email: "", username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const appContext = useContext(AppContext);

  return (
    <section>
      <h1>Register</h1>
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
          <label>
            Nom d'utilisateur:
            <input
              type='text'
              name='username'
              disabled={loading}
              onChange={(e) =>
                setNewUser({ ...newUser, username: e.target.value })
              }
              value={newUser.username}
            />
            <br />
          </label>
          <label>
            Email:
            <input
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              value={newUser.email}
              type='email'
              name='email'
            />
            <br />
          </label>
          <label>
            Mot de passe:
            <input
              onChange={(e) =>
                setNewUser({ ...newUser, password: e.target.value })
              }
              value={newUser.password}
              type='password'
              name='password'
            />
            <br />
          </label>
          <input
            type='submit'
            value={loading ? "Loading.." : "Submit"}
            disabled={loading}
            onClick={() => {
              setLoading(true);
              registerUser(newUser.username, newUser.email, newUser.password)
                .then((res) => {
                  // set authed user in global context object
                  appContext.setUser(res.newUser.user);
                  setLoading(false);
                })
                .catch((error) => {
                  setError(error.response.user);
                  setLoading(false);
                });
            }}
          />
        </fieldset>
      </form>
    </section>
  );
};

export default Register;
