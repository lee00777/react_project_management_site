import React from 'react'
import { Link } from 'react-router-dom'
import './ProjectList.css'
import Avatar from './Avatar'

export default function ProjectList({projects}) {

  return (
    <div className='project-list'>
      { projects.length === 0 && <p>No projects yet</p>}
      { projects.map( project => {
        return (
          <Link to={`/projects/${project.id}`}  key={project.id}>
            <h4>{project.name}</h4>
            <p>Due by {project.dueDate.toDate().toDateString()}</p>
            <div className='assigned-to'>
              <ul>
                { project.assignedUsersList.map(assignedUser => {
                  return <li key={assignedUser.photoURL}><Avatar src={assignedUser.photoURL}/></li>
                })}
              </ul>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
