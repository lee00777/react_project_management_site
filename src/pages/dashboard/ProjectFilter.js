import React, { useState } from 'react'

const filterList = ['All', 'Mine', 'Development', 'Design', 'Marketing', 'Sales']

export default function ProjectFilter() {
  const [currentFilter, setCurrentFilter] = useState('all')

  function handleClick(newFilter){
    console.log(newFilter)
    setCurrentFilter(newFilter)
  }
  return (
    <div className='project-filter'>
      <nav>
        { filterList.map(list => {
          return <button key={list} className={currentFilter === list? 'active' : ''} onClick={()=>handleClick(list)}>{list}</button>
        })}
      </nav>
    </div>
  )
}
