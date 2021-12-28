import React from 'react'
import { useCollection } from '../hooks/useCollection' 
import Avatar from './Avatar'
import './OnlineUsers.css'

export default function OnlineUsers() {
  const { error, documents } = useCollection('users')

  return (
    <div className='user-list'>
      <h2>All Users</h2>
      { documents && documents.map( user => {
        return <div key={user.id} className='user-list-item'>
          <span>{user.displayName}</span>
          <Avatar src={user.photoURL}/>
        </div>
      })}
      { error && <div className='error'>{error}</div>}
    </div>
  )
}
