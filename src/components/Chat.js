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

  // chat
  const [msg, setMsg] = useState('')

  const { addDocument, updateDocument, response } = useFirestore('chats')
  // const [newComment, setNewComment] = useState('');
  // const { user } = useAuthContext();

  // const {document, error} = useDocument('chats', userId)

  // async function handleSubmit(ev){
  //   ev.preventDefault()
  //   // 주의! 새롭게 document를 만드는게 아니라, 현재 클릭한 (= 존재하는 )document에 update하는 것임. 
  //   const commentToAdd = {
  //     content: newComment,
  //     createdAt: timestamp.fromDate(new Date()),
  //     commentCreatorId: user.uid,
  //     id: Math.random() // 그러므로 따로 id가 자동생성되지 않는데, 나중에 mapping할때 쓸 용도로 그냥 유니크한 key값 만들어 주는 것임.
  //   }
  //   await updateDocument(project.id, {comments: [...project.comments, commentToAdd]})
  //   if(!response.error){
  //     setNewComment('')
  //   }
  // }
  function handleInput(message){
    setMsg(message)
  }
  function handleSubmit(ev){
    ev.preventDefault();
    console.log(msg)

    const commentToAdd = {
      talkWithId: user.uid,
      talkWith: user.displayName,
      talkWithPhotoURL: user.photoURL,
      content: msg,
      createdAt: timestamp.fromDate(new Date()),
      id: Math.random() // 그러므로 따로 id가 자동생성되지 않는데, 나중에 mapping할때 쓸 용도로 그냥 유니크한 key값 만들어 주는 것임.
    }
    updateDocument(userId, {comments: [...document.comments, commentToAdd]})
    // signup(email, password, displayName, thumbnail)
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
      {document && <>
      <div className='chats'>
        {document && document.comments.map(comment => {
          if(comment.talkWithId === user.uid){
            return  <p>{comment.content}</p>
          }})}
      </div>
      </>}
      {/* msg */}
      <div className='chatMsg'>
        <form className='msg' onSubmit={handleSubmit}>
        {/* <input type="text" required value={displayName} onChange={(ev)=>{setDisplayName(ev.target.value)}}/> */}
          <input type="text" required value={msg} placeholder='Type your message here' onChange={(ev)=>{handleInput(ev.target.value)}}/>
          <SendIcon className='sendIcon'/>
        </form>
      </div>
      {error && console.log("err", error)}
    </div>
  )
}