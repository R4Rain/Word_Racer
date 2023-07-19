'use client' 
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';

import { AlertContext } from '@components/AlertProvider';
import AuthForm from '@components/AuthForm';

const Signup = () => {
  const router = useRouter();
  const { setAlert, setOpen } = useContext(AlertContext)
  
  const labels = [
    {label: 'Name', name: 'name', type: 'text', placeholder: ''},
    {label: 'Email', name: 'email', type: 'email', placeholder: ''},
    {label: 'Password', name: 'password', type: 'password', placeholder: ''},
    {label: 'Confirm Password', name: 'confirm_password', type: 'password', placeholder: ''}
  ]

  const handleSubmit = async (values) => {
    try{
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          password: values.password
        })
      })
      if(response.ok) {
        setAlert({
          type: "success",
          message: "Registration successful, please login with your account"
        });
        setOpen(true);
        router.replace('/auth/signin');
      } else {
        const { error } = await response.json();
        setAlert({
          type: "error",
          message: error
        });
        setOpen(true);
      }
    } catch(error) {
      setAlert("Internal server error");
      setOpen(true);
    }
  }

  return (
    <section className="w-full relative">
      <div className="px-5 py-12">
        <Formik
          initialValues={{
            name: '',
            email: '',
            password: '',
            confirm_password: ''
          }}
          validate={values => {
            const errors = {};
            if(!values.name) {
              errors.name = 'Name is required';
            }

            if(!values.email) {
              errors.email = 'Email is required';
            } else if(
                !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
            ) {
              errors.email = 'Invalid email address';
            }
          
            if(!values.password){
              errors.password = 'Password is required';
            } else if(values.password.length < 6){
              errors.password = 'Password must be at least 6 characters long';
            }
          
            if(!values.confirm_password) {
              errors.confirm_password = 'Confirmation password is required';
            } else if(values.confirm_password !== values.password) {
              errors.confirm_password = 'Password do not match';
            }

            return errors
          }}
          onSubmit={(values, { setSubmitting }) => {
            setTimeout(() => {
              handleSubmit(values);
              setSubmitting(false);
            }, 400)
          }}
        >
          {({ isSubmitting }) => (
            <AuthForm
              title='Sign up'
              labels={labels}
              isSubmitting={isSubmitting}
            />
          )}
        </Formik>
      </div>
    </section>
  )
}

export default Signup