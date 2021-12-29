import React from 'react'
import Avatar from '../../components/Avatar'

export default function ProjectSummary({project}) {
  return (
    <div>
      <div className='project-summary'>
        <h2 className='page-title'>{project.name}</h2>
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
    </div>
  )
}
