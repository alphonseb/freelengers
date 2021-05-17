import React, { useState, useContext } from "react";
import { registerUser } from "../../lib/auth";
import AppContext from "../../context/AppContext";
import { fetchAPI } from 'utils/api'
import Router from "next/router";


import ArrowRight from "../../src/assets/icons/arrow-right.svg";
import Button from '../elements/button';

const Register = ({ data }) => {
  const [newUser, setNewUser] = useState({
    email: "",
    username: "",
    password: "",
  });
  
  const [names, setNames] = useState({
    firstName: "",
    lastName: ""
  })
  
  const [availableJobs, setAvailableJobs] = useState([])
  const [searchedJob, setSearchedJob] = useState('')
  
  const [selectedJobs, setSelectedJobs] = useState([])
  
  const [step, setStep] = useState(1)
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({});
  const appContext = useContext(AppContext);
  
  const handleRegister = async () => {
    setLoading(true);
    const userName = `${ names.firstName }_${ names.lastName }#${ Math.floor(Math.random() * 9999) }`
    try {
      const registration = await registerUser(userName, newUser.email, newUser.password)
      console.log(registration);
      const user = await fetchAPI(`/users/${ registration.data.user.id }`, { method: 'PUT', body: JSON.stringify(names) })
      const jobs = await fetchAPI(`/jobs`)
      setAvailableJobs(jobs)
      appContext.setUser(user);
      setLoading(false);
      setStep(2)
      
    } catch (error) {
      setError(error);
      setLoading(false);  
    }
  }
  
  const selectJob = (job) => {
      setSearchedJob('')
      setSelectedJobs([...selectedJobs, {rank: selectedJobs.length + 1, job: job.name ? job : {name: searchedJob}}])
  }
  
  const removeJob = (job) => {
    setSelectedJobs(selectedJobs.filter(_job => _job.job.name !== job.job.name).map((_job, i) => ({..._job, rank: i + 1})))
  }
  
  const sendJobs = async () => {
    const existingJobs = selectedJobs.filter(job => job.job.id)
    const newCreatedJobs = await Promise.all(selectedJobs.filter(job => !job.job.id).map(job => fetchAPI('/jobs', {method: 'POST', body:JSON.stringify({name: job.job.name})})))
    
    const newJobs = newCreatedJobs.map(job => {
      return {rank: selectedJobs.find(_job => _job.job.name === job.name).rank, job}
    })
    const allJobs = [...existingJobs, ...newJobs]
    const getJobByRank = (rank) => {
      return allJobs.find(job => job.rank === rank).job.id
    }
    
    const user = await fetchAPI(`/users/${appContext.user.id}`, {method: 'PUT', body: JSON.stringify({job_1: getJobByRank(1), job_2: getJobByRank(2), job_3: getJobByRank(3)})})
    
    if (user) {
      Router.push('/projects')
    }
  }

  return (
    <section>
      <h1>Rejoindre Freelengers</h1>
      {
        step === 1 ? (
          <>
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
          <form onSubmit={(e) => {e.preventDefault()}}>
            <fieldset disabled={loading}>
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
                  onClick={handleRegister}
                />
                <ArrowRight />
                <button className='btn-primary' onClick={() => null}>Je suis button <ArrowRight/></button>
              </div>
            </fieldset>
          </form>
          </>
        ) : (
            <div>
              <h2>Que faites-vous ?</h2>
              <input type="search" value={ searchedJob } onChange={ (e) => { setSearchedJob(e.target.value) } } />
              <ul>
              {
                availableJobs.filter(job => job.name.toLowerCase().includes(searchedJob.toLowerCase())).length ? (
                    availableJobs.filter(job => searchedJob ? job.name.toLowerCase().includes(searchedJob.toLowerCase()) : job).map(job => (
                      <li key={job.id}><span>{ job.name }</span><Button disabled={selectedJobs.length === 3 || selectedJobs.find(_job => _job.job.name === job.name)} button={{text: 'Sélectionner'}} handleClick={() => {selectJob(job)}} /></li>
                  ))
                  ) : (
                      <>
                        {
                          searchedJob ? (
                            <li><span>{ searchedJob }</span><Button disabled={selectedJobs.length === 3 || selectedJobs.find(job => job.job.name === searchedJob)} button={{text: 'Sélectionner'}} handleClick={selectJob} /></li>
                          ) : ''
                        }
                      </>
                    )
              }
              </ul>
              <h3>Mes métiers</h3>
              <ol>
                {
                  selectedJobs.map((job, i) => (
                    <li key={ i }><span>{ job.job.name }</span><Button button={{text: "Retirer"}} handleClick={() => {removeJob(job)}} /></li>
                  ))
                }
              </ol>
              <Button disabled={selectedJobs.length < 3} button={{text: "Valider"}} handleClick={sendJobs} />
            </div>
        )
      }
    </section>
  );
};

export default Register;
