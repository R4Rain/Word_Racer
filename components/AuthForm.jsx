'use client'
import Link from "next/link";
import Image from "next/image";
import { Button, Typography } from "@material-tailwind/react";
import { Form, Field, ErrorMessage } from 'formik';

const AuthForm = ({ title, labels, isSubmitting }) => {
  return (
    <div className="w-full p-6 bg-white rounded-md shadow-md mx-auto lg:max-w-xl">
      <Typography variant="h1" className="md:text-3xl text-xl font-bold text-center">{title}</Typography>
      <Form className="mt-6">
        { labels.map((item, index) => (
          <div className='mb-4' key={index}>
            <label htmlFor={item.label} className="input_label">
              {item.label}
            </label>
            <Field type={item.type} name={item.name} className="input_block"/>
            <ErrorMessage name={item.name} component="span" className="text-red-500"/>
          </div>
        ))}
        {/* {(title === 'Sign in') &&
          <Link href="/forget" className="text-xs text-blue-600 hover:underline">
            Forget Password?
          </Link>
        } */}
        <div className="mt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            color="blue"
            className="tracking-wider"
            fullWidth
          >
            {isSubmitting ? "Loading..." : title}
          </Button>
        </div>
      </Form>

      <div className="relative flex items-center justify-center w-full mt-6 border border-t">
        <div className="absolute px-5 bg-white">Or</div>
      </div>

      <div className="flex mt-4 gap-x-2">
        <Button className="flex justify-center items-center gap-2" variant="outlined" color="gray" disabled fullWidth>
          Coming soon
          <Image src={'/assets/google.svg'} alt='Google' width={20} height={20} />
        </Button>
      </div>
      {(title === 'Sign in') ? 
        <Typography variant="paragraph" className="mt-4 text-sm text-center text-gray-700">
          Don't have an account?{" "}
          <Link href="/auth/signup" className="font-medium text-blue-600 hover:underline">
            Sign up
          </Link>
        </Typography> :
        <Typography variant="paragraph" className="mt-4 text-sm text-center text-gray-700">
          Already have an account?{" "}
          <Link href="/auth/signin" className="font-medium text-blue-600 hover:underline">
            Sign in
          </Link>
        </Typography>
      }
    </div>
  )
}

export default AuthForm