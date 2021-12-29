import React, { useState } from 'react'
import Avatar from '../../components/Avatar';
import { timestamp } from '../../firebase/config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

export default function ProjectComments({project}) {
  const { updateDocument, response } = useFirestore('projects')
  const [newComment, setNewComment] = useState('');
  const { user } = useAuthContext();

  async function handleSubmit(ev){
    ev.preventDefault()
    // 주의! 새롭게 document를 만드는게 아니라, 현재 클릭한 (= 존재하는 )document에 update하는 것임. 
    const commentToAdd = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      content: newComment,
      createdAt: timestamp.fromDate(new Date()),
      id: Math.random() // 그러므로 따로 id가 자동생성되지 않는데, 나중에 mapping할때 쓸 용도로 그냥 유니크한 key값 만들어 주는 것임.
    }
    await updateDocument(project.id, {comments: [...project.comments, commentToAdd]})

    if(!response.error){
      setNewComment('')
    }
  }
  return (
    <div className='project-comments'>
      <h4>Project Comments</h4>
      <ul>
        {project.comments.length > 0 && project.comments.map(comment => {
          return <li key={comment.id}>
            <div className='comment-author'>
              <Avatar src={comment.photoURL}/>
              <p>{comment.displayName}</p>
            </div>
            <div className='comment-date'>
              <p>{formatDistanceToNow(comment.createdAt.toDate(),{addSuffix:true})}</p>
            </div>
            <div className='comment-content'>
              <p>{comment.content}</p>
            </div>
          </li>
        })}
      </ul>

      <form className='add-comment' onSubmit={handleSubmit}>
        <label>
          <span>Add new comment : </span>
          <textarea required onChange={(ev) => setNewComment(ev.target.value)} value={newComment}></textarea>
        </label>
        <button className='btn'>Add Comment</button>
      </form>
    </div>
  )
}
