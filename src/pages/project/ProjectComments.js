import React, { useState } from 'react'
import Avatar from '../../components/Avatar';
import { timestamp } from '../../firebase/config'
import { useAuthContext } from '../../hooks/useAuthContext'
import { useFirestore } from '../../hooks/useFirestore';
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import DeleteIcon from '../../assets/delete.svg'
import EditIcon from '../../assets/edit.svg'

export default function ProjectComments({project}) {
  const { updateDocument, response } = useFirestore('projects')
  const [newComment, setNewComment] = useState('');
  const { user } = useAuthContext();

  const [oldComment, setOldComment] = useState(null);
  const [editedComment, setEditedComment] = useState(null)
  const [isEditIconClicked, setIsEditIconClicked] = useState(false)

  async function handleSubmit(ev){
    ev.preventDefault()
    const commentToAdd = {
      displayName: user.displayName,
      photoURL: user.photoURL,
      content: newComment,
      createdAt: timestamp.fromDate(new Date()),
      commentCreatorId: user.uid,
      id: Math.random() 
    }
    await updateDocument(project.id, {comments: [...project.comments, commentToAdd]})
    if(!response.error){
      setNewComment('')
    }
  }

  function handleEditComment(comment){
    setEditedComment(comment.content)
    setIsEditIconClicked(true) 
    setOldComment(comment) // comment object
  }

  async function updateComment(){
    let newContent = editedComment
    let newComments = project.comments.map(comment => {
      if(comment.id === oldComment.id){
        let commentToUpdate = {
          ...oldComment,
          content: newContent,
          isEdited: true
        }
        return commentToUpdate
      }else {
        return comment;
      }
    })
    await updateDocument(project.id, {comments: newComments})
    setIsEditIconClicked(false)
  }

  async function handleDeleteComment(target){
    let commentsAfterDeleted = project.comments.filter(comment => {
      return comment.id !== target.id
    })
    await updateDocument(project.id, {comments: commentsAfterDeleted})
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
              { user.uid === comment.commentCreatorId && (
                <div className='comment-edit-options'>
                  <img src={EditIcon} alt="edit icon" onClick={()=>{handleEditComment(comment)}}/>
                  <img src={DeleteIcon} alt="delete icon"onClick={()=>{handleDeleteComment(comment)}}/>
                </div>
              )}
            </div>
            <div className='comment-date'>
              <p>{formatDistanceToNow(comment.createdAt.toDate(),{addSuffix:true})}</p>
            </div>
            { ! isEditIconClicked && (
              <div className='comment-content'>
                { comment.isEdited && <p>{comment.content} (edited) </p> }
                { !comment.isEdited && <p>{comment.content}</p> }
              </div>
            )}
            { isEditIconClicked && oldComment.id !== comment.id && (
              <div className='comment-content'>
                <p>{comment.content}</p> 
              </div>
            )}
            { isEditIconClicked && oldComment.id === comment.id && (
              <div className='comment-content'>
                <label htmlFor='updatedComment'></label>
                <input name="updatedComment" type="textarea" value={editedComment} onChange={(ev)=>{setEditedComment(ev.target.value)}}/>
                <div className="btnParent">
                  <button className='cancelBtn' onClick={()=>{setIsEditIconClicked(false)}}>Cancel</button>
                  <button className='saveBtn' onClick={updateComment}>Save</button>
                </div>
              </div>
            )} 
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
