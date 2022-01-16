import React, { useState } from 'react'
import './Chat.css'
import { timestamp } from '../firebase/config'
import { useAuthContext } from '../hooks/useAuthContext'
import { useFirestore } from '../hooks/useFirestore';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { useDocument } from '../hooks/useDocument'
import { useCollection } from '../hooks/useCollection'
import Avatar from './Avatar';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SendIcon from '@mui/icons-material/Send';

export default function Chat({userId, userName, userPic}) {
  // chat내용들 가져오기
  const { user } = useAuthContext()
  const { document, error } = useDocument('chats', userId);
  // chat 새롭게 추가하기
  const [msg, setMsg] = useState('')
  const { addDocument, updateDocument, response } = useFirestore('chats')

  function handleInput(message){
    setMsg(message)
  }
  function handleSubmit(ev){
    ev.preventDefault();
    const commentToAdd = {
      talkWithId: user.uid,
      talkWith: user.displayName,
      talkWithPhotoURL: user.photoURL,
      content: msg,
      createdAt: timestamp.fromDate(new Date()),
      id: Math.random() 
    }
    // if(!document){}
    updateDocument(userId, {comments: [...document.comments, commentToAdd]})
    setMsg('')
  }

  return (
    <div className='chat'>
      {/* info */}
      <div className='info'>
        <Avatar src={userPic}/>  
        {userName} 
        <CloseOutlinedIcon className="closeBtn" />
      </div>
      {/* comment */}
      {document === null && <p></p>}
      {document && 
        <div className='chats'>
          {document.comments.map(comment => {
            if(comment.talkWithId === user.uid){
              console.log('=======================')
              return <div key={comment.id} className='msgParent' >
                  <div className='msgCard'>
                    <Avatar className="cardAvatar" src={comment.talkWithPhotoURL}/>
                    <p className='cardName'>{comment.talkWith}</p>
                    {/* <p className='cardDate'>{comment.createdAt.toDate().toString().slice(0,10)}</p> */}
                    <p className='ago'>{formatDistanceToNow(comment.createdAt.toDate(),{addSuffix:true})}</p>
                  </div>
                  <p className='cardMsg'>{comment.content}</p>
                
                </div>

            }})}
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