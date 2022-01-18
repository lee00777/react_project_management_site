import React, { useEffect, useState } from 'react'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import { timestamp } from '../firebase/config'
import Avatar from './Avatar'
import './Chat.css'

export default function ChatList({comment, fromComment}) {
  const [allMsg, setAllMsg] = useState([])


  useEffect(()=>{
    if(comment){
      setAllMsg(comment)
    }
    if(fromComment){
      setAllMsg(fromComment)
    }
    // sortMsg(allMsg)
    console.log("allmsg:", typeof allMsg, allMsg)
  },[comment, fromComment, allMsg])

  function sortMsg(msg){
    msg.sort((a,b)=>{
      if(a>b) return 1
      else if(b>a) return -1
      else return 0
    })
  }

  return <>
    {allMsg && 
      <div className='msgParent'>
        <div className='msgCard'>
          <Avatar className="cardAvatar" src={allMsg.talkWithPhotoURL}/>
          <p className='cardName'>{allMsg.talkWith}</p>
          {/* <p className='ago'>{formatDistanceToNow(allMsg.createdAt.toDate(),{addSuffix:true})}</p> */}
        </div>
        <p className='cardMsg'>{allMsg.content}</p>
      </div>
    }
  </>
}
