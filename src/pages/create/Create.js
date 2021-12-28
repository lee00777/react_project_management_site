import React, { useState } from 'react'
import './Create.css'

export default function Create() {
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [assignedUsers, setAssignedUsers] = useState([])

  function handleSubmit(ev){
    ev.preventDefault()
    console.log(name,details,dueDate)
  }

  return (
    <div className='create-form'>
      <h2 className='page-title'>Create a new project</h2>
      <form onSubmit={handleSubmit}>
        <label>
          <span>Project name:</span>
          <input required  type="text" onChange={(e) => setName(e.target.value)} value={name} />
        </label>
        <label>
          <span>Project Details:</span>
          <textarea required onChange={(e) => setDetails(e.target.value)} value={details} ></textarea>
        </label>
        <label>
          <span>Set due date:</span>
          <input required type="date" onChange={(e) => setDueDate(e.target.value)}  value={dueDate} />
        </label>

        <label>
          <span>Project category:</span>
          {/* select here later */}
        </label>

        <label>
          <span>Assign to:</span>
          {/* select here later */}
        </label>

        <button className="btn">Add Project</button>
      </form>
    </div>
  )
}
