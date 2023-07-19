'use client'
import { Formik } from 'formik';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { signIn } from "next-auth/react";

import AuthForm from '@components/AuthForm';
import { AlertContext } from '@components/AlertProvider';

const Signin = () => {
	const router = useRouter();
	const { setAlert, setOpen } = useContext(AlertContext);

	const labels = [
    {label: 'Email', name: 'email', type: 'email', placeholder: ''},
    {label: 'Password', name: 'password', type: 'password', placeholder: ''}
  ]

  const handleSubmit = async ({ email, password }) => {
		try{
			const response = await signIn('credentials', {
				email: email,
				password: password,
				redirect: false,
				callbackUrl: '/'
			});
			if(response.error) {
				setAlert({
          type: "error",
          message: response.error
        });
				setOpen(true);
			} else{
				router.replace(response.url);
			}
		} catch(error) {
			setAlert("Internal server error");
			setOpen(true);
		}
  }

  return (
		<section className="w-full relative">
			<div className="px-5 py-32">
				<Formik
					initialValues={{
						email: '',
						password: ''
					}}
					validate={values => {
						const errors = {};
						if(!values.email) {
							errors.email = 'Email is required';
						} else if(
								!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
						) {
							errors.email = 'Invalid email address';
						}
						
						if(!values.password){
							errors.password = 'Password is required';
						}

						return errors
					}}
					onSubmit={(values, { setSubmitting }) => {
						setTimeout(async () => {
								await handleSubmit(values);
								setSubmitting(false);
						}, 400)
					}}
				>
					{({ isSubmitting }) => (
						<AuthForm
							title='Sign in'
							labels={labels}
							isSubmitting={isSubmitting}
						/>
					)}
				</Formik>
			</div>
		</section>
  )
}

export default Signin