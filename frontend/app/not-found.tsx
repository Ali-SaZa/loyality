import React from 'react'

import Button from '@/components/formElements/Button'

const NotFound = () => {
  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary">404</h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-text-dark md:text-4xl">یافت نشد.</p>
          <p className="mb-4 text-lg font-light text-text-light-25">صفحه ای که دنبال آن بودید یافت نشد. </p>
          <Button to={'/'}>خانه</Button>
        </div>
      </div>
    </section>
  )
}

export default NotFound
