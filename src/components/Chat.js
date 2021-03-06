import React, { useState } from 'react'
import './Chat.css'
import { timestamp } from '../firebase/config'
import { useAuthContext } from '../hooks/useAuthContext'
import { useFirestore } from '../hooks/useFirestore';
import { useDocument } from '../hooks/useDocument'
import Avatar from './Avatar';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SendIcon from '@mui/icons-material/Send';
import {projectFirestore} from '../firebase/config'
import ChatList from './ChatList';

export default function Chat({userId, userName, userPic, closeChat}) {
  const { user } = useAuthContext()
  const { document, error } = useDocument('chats', userId);
  const { document:myDoc, error:myError } = useDocument('chats', user.uid);
  const [msg, setMsg] = useState('')
  const {updateDocument} = useFirestore('chats')

  function handleInput(message){
    setMsg(message)
  }
  async function handleSubmit(ev){
    ev.preventDefault();
    const commentToAdd = {
      talkWithId: user.uid,
      talkWith: user.displayName,
      talkWithPhotoURL: user.photoURL,
      talkTo: userId,
      content: msg,
      createdAt: timestamp.fromDate(new Date()),
      id: Math.random() 
    }
    if(!document){
      await projectFirestore.collection('chats').doc(userId).set(
        {comments:[commentToAdd]})
      }else{
      updateDocument(userId, {comments: [...document.comments, commentToAdd]})
    }
    setMsg('')
  }

  return (
    <div className='chat'>
      {/* info */}
      <div className='info'>
        <Avatar src={userPic}/>  
        {userName} 
        <CloseOutlinedIcon className="closeBtn" onClick={closeChat}/>
      </div>
      {/* comment */}
      {document === null && <p></p>}
      {document && 
        <div className='chats'>
          {myDoc && myDoc.comments.length >0 && myDoc.comments.map((comment)=>{
            if(comment.talkWithId === userId){
              return <ChatList fromComment={comment} key={comment.id} className='msgParent' />
            }
          })}
          {document.comments.map(comment => {
            if(comment.talkWithId === user.uid){
              return <ChatList comment={comment} key={comment.id} className='msgParent' />
            }
          })}
        </div>
      }
      {/* msg */}
      <div className='chatMsg'>
        <form className='msg' onSubmit={handleSubmit}>
          <input type="text" required value={msg} placeholder='Type your message here' onChange={(ev)=>{handleInput(ev.target.value)}}/>
          <SendIcon className='sendIcon'/>
        </form>
      </div>
      {error && console.log("err", error)}
    </div>
  )
}