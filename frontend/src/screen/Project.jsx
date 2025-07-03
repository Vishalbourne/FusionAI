import React, { useEffect } from 'react'
import ProjectSidebar from './project/ProjectSidebar'
import { useLocation } from 'react-router-dom'

const Project = () => {

  const {state}=useLocation()

  return (
    <>
    <ProjectSidebar data={state}/>
    </>
  )
}

export default Project