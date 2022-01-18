import React from 'react'
import { Link } from 'react-router-dom'
import { useLogout } from '../hooks/useLogout'
import { useAuthContext } from '../hooks/useAuthContext'
import './Navbar.css'

export default function Navbar() {
  const { logout, isPending } = useLogout()
  const { user } = useAuthContext()

  return (
    <div className='navbar'>
      <ul>
        <li className='logo'>
          <p>PROJECT PLANNER</p>
        </li>
        { !user && (<>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/signup">Signup</Link>
            </li>
          </>)}
        { user && (<>
          <li>
            { !isPending && <button className='btn logout' onClick={logout}>Logout</button> }
            { isPending && <button className='btn logout' disabled>Logging out...</button> }
          </li>
        </>)}
      </ul>
    </div>
  )
}
