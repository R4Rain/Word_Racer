"use client"
import { Button, Typography } from "@material-tailwind/react"
import Link from "next/link"

const Error = () => {
  return (
      <section className="mx-auto my-24 flex flex-col justify-center relative">
        <div className="text-center">
          <Typography variant="paragraph" color="blue" className="font-bold drop-shadow-sm">
            404
          </Typography>
          <Typography variant="h1" color="blue-gray" className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl drop-shadow-sm">
            Page not found
          </Typography>
          <Typography variant="paragraph" color="gray" className="mt-6 text-base leading-7">
            Sorry, we couldn’t find the page you’re looking for.
          </Typography>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/">
              <Button variant="outlined" className="shadow-sm" color="blue">
                Go back to main page
              </Button>
            </Link>
          </div>
        </div>
      </section>
  )
}

export default Error