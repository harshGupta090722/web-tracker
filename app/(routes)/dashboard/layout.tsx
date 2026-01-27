import React from 'react'
import DashboardProvider from './proivder'

function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <DashboardProvider>
        {children}
      </DashboardProvider>
    </div>
  )
}

export default DashboardLayout