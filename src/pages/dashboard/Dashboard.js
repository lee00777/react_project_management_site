import userEvent from '@testing-library/user-event';
import React, { useState } from 'react'
import ProjectList from '../../components/ProjectList';
import { useCollection } from '../../hooks/useCollection'
import './Dashboard.css'
import ProjectFilter from './ProjectFilter';
import { useAuthContext } from '../../hooks/useAuthContext'

export default function Dashboard() {
  const { documents, error } = useCollection('projects');  // snapshot이기 때문에 documents들이 실시간 업데이트 된다.
  const [currentFilter, setCurrentFilter] = useState('All')
  const { user } = useAuthContext()

  function changeFilter(newFilter){
    setCurrentFilter(newFilter)
  }

  const projects = documents ? documents.filter(document => {
    switch(currentFilter){
      case 'All':
        return true
      case 'Mine':
        let assignedToMe = false
        document.assignedUsersList.forEach(assignedUser=>{
          if(user.uid === assignedUser.id)
          assignedToMe = true;
        })
        return assignedToMe
      case 'Development':
      case 'Design':
      case 'Sales':
      case 'Marketing':
        return document.category === currentFilter
      default:
        return true;
    }
  }) : null

  return (
    <div>
      <h2 className='dashboard-title'>Dashboard</h2>
      { error && <p className='error'>{error}</p>}
      { document && <ProjectFilter currentFilter={currentFilter} changeFilter={changeFilter}/>}
      { projects && <ProjectList projects={projects}/>}
    </div>
  )
}
