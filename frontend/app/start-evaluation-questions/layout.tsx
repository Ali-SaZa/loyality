import React from 'react'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <section className="w-full h-[100dvh] bg-white md:pt-16 container md:pb-[104px] py-9 overflow-auto">{children}</section>
}

export default Layout
