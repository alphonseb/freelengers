import React, { useState, useContext, useEffect } from "react";
import { registerUser } from "../../lib/auth";
import AppContext from "../../context/AppContext";
import { fetchAPI } from "utils/api";
import Router from "next/router";

import ActiveLink from "../01-atoms/ActiveLink";

import ArrowRight from "../../src/assets/icons/arrow-right.svg";
import Delete from "../../src/assets/icons/delete.svg";
import Plus from "../../src/assets/icons/plus.svg";

const Register = ({ data }) => {
  const [newUser, setNewUser] = useState({
    email: "",
    username: "",
    password: "",
  });

  const [names, setNames] = useState({
    firstName: "",
    lastName: "",
  });

  const [availableJobs, setAvailableJobs] = useState([]);
  const [searchedJob, setSearchedJob] = useState("");

  const [selectedJobs, setSelectedJobs] = useState([]);

  const [step, setStep] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const appContext = useContext(AppContext);

  const handleRegister = async () => {
    setLoading(true);
    const userName = `${names.firstName}_${names.lastName}#${Math.floor(
      Math.random() * 9999
    )}`;
    try {
      const registration = await registerUser(
        userName,
        newUser.email,
        newUser.password
      );
      console.log(registration);
      const user = await fetchAPI(`/users/${registration.data.user.id}`, {
        method: "PUT",
        body: JSON.stringify(names),
      });
      const jobs = await fetchAPI(`/jobs`);
      appContext.setUser(user);
      setLoading(false);
      setAvailableJobs(jobs);
      setStep(2);
    } catch (error) {
      setError(error);
      setLoading(false);
    }
  };

  const selectJob = (job) => {
    setSearchedJob("");
    setSelectedJobs([
      ...selectedJobs,
      {
        rank: selectedJobs.length + 1,
        job: job.name ? job : { name: searchedJob },
      },
    ]);
  };

  const removeJob = (job) => {
    setSelectedJobs(
      selectedJobs
        .filter((_job) => _job.job.name !== job.job.name)
        .map((_job, i) => ({ ..._job, rank: i + 1 }))
    );
  };

  const sendJobs = async () => {
    const existingJobs = selectedJobs.filter((job) => job.job.id);
    const newCreatedJobs = await Promise.all(
      selectedJobs
        .filter((job) => !job.job.id)
        .map((job) =>
          fetchAPI("/jobs", {
            method: "POST",
            body: JSON.stringify({ name: job.job.name }),
          })
        )
    );

    const newJobs = newCreatedJobs.map((job) => {
      return {
        rank: selectedJobs.find((_job) => _job.job.name === job.name).rank,
        job,
      };
    });
    const allJobs = [...existingJobs, ...newJobs];
    const getJobByRank = (rank) => {
      return allJobs.find((job) => job.rank === rank).job.id;
    };

    const user = await fetchAPI(`/users/${appContext.user.id}`, {
      method: "PUT",
      body: JSON.stringify({
        job_1: getJobByRank(1),
        job_2: getJobByRank(2),
        job_3: getJobByRank(3),
      }),
    });

    if (user) {
      Router.push("/projects");
    }
  };

  return (
    <section>
      {step === 1 ? (
        <>
          <div className='main-container-register'>
            <div className='register-image'>
              <img src='/images/register.png' alt='freelancer illustration' />
            </div>
            <div className='register-form'>
              <h1>Rejoindre Freelengers</h1>
              <p className='paragraph'>
                Vous faites déjà parti de notre communauté ?&ensp;
                <ActiveLink href={"/login"} className='accent'>
                  Connectez-vous
                </ActiveLink>
              </p>
              {Object.entries(error).length !== 0 &&
                error.constructor === Object &&
                error.message.map((error) => {
                  return (
                    <div
                      key={error.messages[0].id}
                      style={{ marginBottom: 10 }}
                    >
                      <small style={{ color: "red" }}>
                        {error.messages[0].message}
                      </small>
                    </div>
                  );
                })}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                }}
              >
                <fieldset disabled={loading}>
                  <div className='input-grid-2'>
                    <div className='input-container'>
                      <label className='subtitle'>Prénom</label>
                      <input
                        type='text'
                        name='firstName'
                        disabled={loading}
                        onChange={(e) =>
                          setNames({ ...names, firstName: e.target.value })
                        }
                        value={names.firstName}
                        placeholder='Clark'
                      />
                    </div>
                    <div className='input-container'>
                      <label className='subtitle'>Nom</label>
                      <input
                        type='text'
                        name='lastName'
                        disabled={loading}
                        onChange={(e) =>
                          setNames({ ...names, lastName: e.target.value })
                        }
                        value={names.lastName}
                        placeholder='Kent'
                      />
                    </div>
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
                  <div className='input-grid-2'>
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
                      <label className='subtitle'>
                        Confirmez le mot de passe
                      </label>
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
                  </div>
                  <div className='input-container-checkbox'>
                    <input type='checkbox' name='CGU' />
                    <p className='paragraph'>
                      En créant mon compte j’accepte les Conditions générales
                      d’utilisation et la politique de confidentialité
                    </p>
                  </div>
                  <div className='input-container'>
                    <input
                      type='submit'
                      value={loading ? "Chargement.." : "Créer un compte"}
                      disabled={loading}
                      onClick={handleRegister}
                    />
                    <ArrowRight />
                  </div>
                </fieldset>
              </form>
            </div>
          </div>
        </>
      ) : (
        <div className='main-container-jobs-selection'>
          <div className='jobs-selection'>
            <h1>Que faites-vous ?</h1>
            <p className='paragraph'>
              Votre inscription est presque terminée, nous avons besoin de
              quelques informations sur vous.
            </p>
            <div className='jobs-selection-filter'>
              <div className='input-container'>
                <input
                  type='search'
                  value={searchedJob}
                  onChange={(e) => {
                    setSearchedJob(e.target.value);
                  }}
                  placeholder='Rechercher une profession (3 obligatoires)'
                />
              </div>
              <ul>
                {availableJobs.filter((job) =>
                  job.name.toLowerCase().includes(searchedJob.toLowerCase())
                ).length ? (
                  availableJobs
                    .filter((job) =>
                      searchedJob
                        ? job.name
                            .toLowerCase()
                            .includes(searchedJob.toLowerCase())
                        : job
                    )
                    .map((job) => (
                      <li key={job.id}>
                        <button
                          className='btn-secondary'
                          disabled={
                            selectedJobs.length === 3 ||
                            selectedJobs.find(
                              (_job) => _job.job.name === job.name
                            )
                          }
                          onClick={() => {
                            selectJob(job);
                          }}
                        >
                          {job.name}
                          <Plus className='plus' />
                        </button>
                      </li>
                    ))
                ) : (
                  <>
                    {searchedJob ? (
                      <li>
                        <button
                          className='btn-secondary'
                          disabled={
                            selectedJobs.length === 3 ||
                            selectedJobs.find(
                              (job) => job.job.name === searchedJob
                            )
                          }
                          onClick={selectJob}
                        >
                          {searchedJob}
                          <Plus className='plus' />
                        </button>
                      </li>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </ul>
            </div>
          </div>
          <div className='my-jobs-selection'>
            <h1>&ensp;</h1>
            <p className='paragraph'>
              Trier vos professions en fonction de vos activités principales et
              secondaires.
            </p>
            <ol>
              {selectedJobs.map((job, i) => (
                <li key={i}>
                  <button
                    className='btn-secondary'
                    onClick={() => {
                      removeJob(job);
                    }}
                  >
                    <span>{i + 1}</span>
                    {job.job.name}
                    <Delete />
                  </button>
                </li>
              ))}
            </ol>
            <button
              disabled={selectedJobs.length < 3}
              onClick={sendJobs}
              className='btn-primary'
            >
              Valider
              <ArrowRight />
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default Register;
