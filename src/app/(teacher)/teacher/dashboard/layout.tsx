import React from 'react'
import { DashboardHeaderNavBar } from '../../_components/header/dashboard_header_nav_bar/DashboardHeaderNavBar'

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <DashboardHeaderNavBar />
      {children}
    </>
  )
}

export default DashboardLayout
