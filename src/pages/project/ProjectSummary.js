import React from 'react'
import Avatar from '../../components/Avatar'
import { useHistory } from 'react-router-dom'
import { useFirestore } from '../../hooks/useFirestore'
import { useAuthContext } from '../../hooks/useAuthContext'

export default function ProjectSummary({project}) {
  const { deleteDocument } = useFirestore('projects')
  const { user } = useAuthContext()
  const history = useHistory()

  function handleClick(ev){
    deleteDocument(project.id)
    history.push('/')
  }
  return (
    <div>
      <div className='project-summary'>
        <h2 className='page-title'>{project.name}</h2>
        <p>By {project.createdBy.displayName}</p>
        <p className='due-date'>
          Project due by {project.dueDate.toDate().toDateString()}
        </p>
        <p className='details'>{project.details}</p>
        <h4>Project is assigned to : </h4>
        <div className='assigned-users'>
          {project.assignedUsersList.map(assignedUser =>{
            return <div key={assignedUser.id} >
              <Avatar src={assignedUser.photoURL} />
            </div>
          })}
        </div>
      </div>
      {/* giving an authority to delete the project to creators ONLY */}
      { project.createdBy.id === user.uid &&  <button className='btn' onClick={handleClick}>Mark as Complete</button> }
    </div>
  )
}
