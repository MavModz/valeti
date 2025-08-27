'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNotificationContext } from '@/context/useNotificationContext';
import { forgotPassword } from '@/app/lib/Services/api';

const useResetPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { push } = useRouter();
  const { showNotification } = useNotificationContext();

  const resetPasswordSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Email is required')
  });

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(resetPasswordSchema),
    defaultValues: {
      email: ''
    }
  });

  const resetPassword = handleSubmit(async (values) => {
    setLoading(true);
    
    try {
      // Call the backend API to send reset password email
      const response = await forgotPassword(values.email);

      if (response.success) {
        setEmailSent(true);
        showNotification({
          message: 'Password reset email sent successfully! Please check your email.',
          variant: 'success'
        });
      } else {
        showNotification({
          message: response.message || 'Failed to send reset email. Please try again.',
          variant: 'danger'
        });
      }
    } catch (error) {
      console.error('Reset password error:', error);
      showNotification({
        message: error.message || 'Failed to send reset email. Please try again.',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  });

  const goToSignIn = () => {
    push('/auth/sign-in');
  };

  return {
    loading,
    emailSent,
    resetPassword,
    goToSignIn,
    control,
    errors
  };
};

export default useResetPassword;
