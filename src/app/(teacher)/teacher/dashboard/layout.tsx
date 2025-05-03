import React from 'react'
import { DashbardHeaderNavBar } from '../../_components/header/dashboard_header_nav_bar/DashbardHeaderNavBar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DashbardHeaderNavBar />
      {children}
    </>
  )
}

export default DashboardLayout
