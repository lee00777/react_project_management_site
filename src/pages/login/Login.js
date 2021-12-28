import React, { useState } from 'react'
import { useLogin } from '../../hooks/useLogin'
import './Login.css'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, error, isPending } = useLogin()

  function handleSubmit(ev){
    ev.preventDefault();
    login(email, password)
  }
  return (
    <form className='auth-form' onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>
        <span>Email : </span>
        <input type="email" required value={email} onChange={(ev)=>{setEmail(ev.target.value)}}/>
      </label>
      <label>
        <span>Password : </span>
        <input type="password" required value={password} onChange={(ev)=>{setPassword(ev.target.value)}}/>
      </label>
      
      { !isPending && <button className='btn'>Login</button> }
      { isPending && <button className='btn' disabled>Loading...</button> }
      { error && <div className='error'> {error} </div>}
  </form>
  )
}
