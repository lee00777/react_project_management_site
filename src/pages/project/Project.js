import React from 'react'
import './Project.css'
import { useDocument } from '../../hooks/useDocument'

export default function Project() {
  const {document, error} = useDocument()
  return (
    <div>
      Project
    </div>
  )
}
