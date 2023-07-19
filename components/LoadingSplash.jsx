import { Spinner } from '@material-tailwind/react'
import React from 'react'

const LoadingSplash = () => {
  return (
    <section className="mx-auto my-32 flex justify-center">
      <div>
        <Spinner className="h-10 w-10 text-blue-500/10" />
      </div>
     </section>
  )
}

export default LoadingSplash