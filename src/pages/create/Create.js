import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import Select from 'react-select'
import { useAuthContext } from '../../hooks/useAuthContext'
import { timestamp } from '../../firebase/config'
import { useFirestore } from '../../hooks/useFirestore'
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
  const { user } = useAuthContext()
  const { addDocument, response } = useFirestore('projects') 
  const history = useHistory();

  useEffect(()=>{
    // assignedUsers에 들어갈 option, value 만들어주기
    if(documents){  // users collection에 있는 모든 docs
      const options = documents.map(user=>{
        return {value:user, label:user.displayName}
      })
      setUsers(options)
    }
  },[documents])

  async function handleSubmit(ev){
    ev.preventDefault()
    setFormError(null)
    // third part library를 사용함으로 실제 input이 아닌 div들로 되어있어서 따로 additional error check해줘야 함.
    if( !category ){
      setFormError('Please select a project category')
      return;
    }
    if( assignedUsers.length < 1 ){
      setFormError('Please assign the project to at least 1 user')
      return;
    }

    const createdBy = {  //지금 로그인해 있는 유저 정보
      displayName: user.displayName,
      photoURL: user.photoURL,
      id: user.uid,
    }

    const assignedUsersList = assignedUsers.map( assignedUser => {
      return {
        displayName: assignedUser.value.displayName,
        photoURL : assignedUser.value.photoURL,
        id: assignedUser.value.id
      }
    })

    const project = {
      name,
      details,
      dueDate: timestamp.fromDate(new Date(dueDate)),
      category:category.value,
      comments:[],
      createdBy,
      assignedUsersList,
    }
    
    await addDocument(project)
    
    if(!response.error){
      history.push('/')
    }
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
        { formError && <p className='error'>{formError}</p> }
        <button className="btn">Add Project</button>

      </form>
    </div>
  )
}
