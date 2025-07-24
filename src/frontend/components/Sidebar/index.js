import React, { useState } from 'react'
import DesktopSidebar from './DesktopSidebar'
import MobileSidebar from './MobileSidebar'

function Sidebar() {
  const [isSidebarOpen, setSidebarOpen] = useState(false)

  function openSidebar() {
    setSidebarOpen(true)
  }

  function closeSidebar() {
    setSidebarOpen(false)
  }

  return (
    <>
      <DesktopSidebar closeSidebar={closeSidebar} openSidebar={openSidebar} />
      <MobileSidebar isSidebarOpen={isSidebarOpen} closeSidebar={closeSidebar} openSidebar={openSidebar} />
    </>
  )
}

export default Sidebar
