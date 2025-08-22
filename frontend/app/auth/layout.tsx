import React from 'react'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="h-[100dvh] md:py-10 bg-background-primary overflow-hidden">
      <div className="mx-auto bg-white p-8 rounded-xl h-full container overflow-auto">{children}</div>
    </section>
  )
}

export default AuthLayout
