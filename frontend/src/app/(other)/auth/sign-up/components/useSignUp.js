'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNotificationContext } from '@/context/useNotificationContext';
import { registerUser } from '@/app/lib/Services/api';

const useSignUp = () => {
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const { showNotification } = useNotificationContext();

  const signUpFormSchema = yup.object({
    firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
    lastName: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    password: yup.string()
      .required('Password is required')
      .min(6, 'Password must be at least 6 characters')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    confirmPassword: yup.string()
      .required('Please confirm your password')
      .oneOf([yup.ref('password')], 'Passwords must match'),
    termsAccepted: yup.boolean().oneOf([true], 'You must accept the terms and conditions')
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(signUpFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false
    }
  });

  const signUp = handleSubmit(async (values) => {
    setLoading(true);
    
    try {
      // Call the backend API to register the user
      const response = await registerUser({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        role: 'user' // Default role for new registrations
      });

      if (response.success) {
        showNotification({
          message: 'Account created successfully! Please check your email to verify your account.',
          variant: 'success'
        });

        // Optionally auto-login after successful registration
        const signInResult = await signIn('credentials', {
          redirect: false,
          email: values.email,
          password: values.password
        });

        if (signInResult?.ok) {
          push('/dashboards/customer'); // Redirect to customer dashboard for new users
        } else {
          push('/auth/sign-in'); // Redirect to sign-in if auto-login fails
        }
      } else {
        showNotification({
          message: response.message || 'Registration failed. Please try again.',
          variant: 'danger'
        });
      }
    } catch (error) {
      console.error('Sign up error:', error);
      showNotification({
        message: error.message || 'Registration failed. Please try again.',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  });

  return {
    loading,
    signUp,
    control,
    errors
  };
};

export default useSignUp;
