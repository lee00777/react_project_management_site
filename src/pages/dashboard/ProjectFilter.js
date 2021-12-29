import React from 'react'

const filterList = ['All', 'Mine', 'Development', 'Design', 'Marketing', 'Sales']

export default function ProjectFilter({currentFilter, changeFilter}) {
  function handleClick(newFilter){
    changeFilter(newFilter)
  }
  return (
    <div className='project-filter'>
      <nav>
        <p>Filter by : </p>
        { filterList.map(list => {
          return <button key={list} className={currentFilter === list? 'active' : ''} onClick={()=>handleClick(list)}>{list}</button>
        })}
      </nav>
    </div>
  )
}
