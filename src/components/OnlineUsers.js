import React, { useState } from 'react'
import { useCollection } from '../hooks/useCollection' 
import Avatar from './Avatar'
import Chat from './Chat'
import './OnlineUsers.css'

export default function OnlineUsers() {
  const { error, documents } = useCollection('users')
  const [chatUserId, setChatUserId] = useState(null)
  const [chatUserName, setChatUserName] = useState(null)
  const [chatUserPic, setChatUserPic] = useState(null)

  function handleChatClick(userId, userName, userPic){
    setChatUserId(userId)
    setChatUserName(userName)
    setChatUserPic(userPic)
  }

  return (
    <div className='user-list-chat'>
      <div className='user-list'>
        <h2>All Users</h2>
        { documents && documents.map( user => {
          return <div key={user.id} className='user-list-item' onClick={()=>{handleChatClick(user.id, user.displayName, user.photoURL)}}>
            { user.online && <span className='online-user'></span> }
            <span>{user.displayName}</span>
            <Avatar src={user.photoURL}/>
          </div>
        })}
        { error && <div className='error'>{error}</div>}
      </div>
      { chatUserId && <Chat userId={chatUserId} userName={chatUserName} userPic={chatUserPic}/>}
    </div>

  )
}
