import React, { useEffect, useState } from 'react'
import Select from 'react-select'
import { useCollection } from '../../hooks/useCollection'
import './Create.css'

// 안바뀔애들은 function밖에다가 넣어주면됨.
const categories = [
  { value: 'development', label: 'Development' },
  { value: 'design', label: 'Design' },
  { value: 'sales', label: 'Sales' },
  { value: 'marketing', label: 'Marketing' },
]

export default function Create() {
  const [name, setName] = useState('')
  const [details, setDetails] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [category, setCategory] = useState('')
  const [assignedUsers, setAssignedUsers] = useState([])
  const { documents } = useCollection('users')
  const [ users, setUsers] = useState([]);
  const [formError, setFormError] = useState(null)

  useEffect(()=>{
    if(documents){
      const options = documents.map(user=>{
        return {value:user, label:user.displayName}
      })
      setUsers(options)
    }
  },[documents])

  function handleSubmit(ev){
    ev.preventDefault()
    setFormError(null)
    if( !category ){
      setFormError('Please select a project category')
      return;
    }
    if( assignedUsers.length < 1 ){
      setFormError('Please assign the project to at least 1 user')
      return;
    }


    console.log(name,details,dueDate, category.value, assignedUsers)
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
          {/* npm install react-select 사용할건데, options에는 [{label: xx, value:zz},{label:aa, value:bb}]이런형태로 넣어준다.*/}
          <Select options={categories} onChange={(option)=>{setCategory(option)}}/>
        </label>

        <label>
          <span>Assign to:</span>
          {/* select here later */}
          <Select options={users} onChange={(option) => setAssignedUsers(option)} isMulti/>
        </label>

        <button className="btn">Add Project</button>
        { formError && <p className='error'>{formError}</p> }
      </form>
    </div>
  )
}
