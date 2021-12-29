import React from 'react'
import './Project.css'
import { useDocument } from '../../hooks/useDocument'
import { useParams } from 'react-router-dom'
import ProjectSummary from './ProjectSummary'
import ProjectComments from './ProjectComments'

export default function Project() {
  const { id } = useParams()
  const {document, error} = useDocument('projects', id)

  return (
    <div className='project-details'>
      { error && <p className='error'>{error}</p> }
      { !error && !document && <p className='loading'>Loading....</p>}
      { document && 
        <>
          <ProjectSummary project={document} /> 
          <ProjectComments />
        </>
      }
    </div>
  )
}
