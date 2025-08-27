'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createAgent } from '@/app/lib/Services/api';
import { useNotificationContext } from '@/context/useNotificationContext';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

const useAgentAdd = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotificationContext();
  const { data: session } = useSession();

  // Validation schema
  const agentSchema = yup.object({
    firstName: yup.string().required('First name is required').min(2, 'First name must be at least 2 characters'),
    lastName: yup.string().required('Last name is required').min(2, 'Last name must be at least 2 characters'),
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    phoneNumber: yup.string().required('Phone number is required'),
    description: yup.string().required('Description is required'),
    zipCode: yup.string().required('Zip code is required'),
    propertiesNumber: yup.number().min(0, 'Properties number must be 0 or greater').required('Properties number is required'),
    facebookUrl: yup.string().url('Please enter a valid Facebook URL').optional(),
    instagramUrl: yup.string().url('Please enter a valid Instagram URL').optional(),
    twitterUrl: yup.string().url('Please enter a valid Twitter URL').optional()
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset
  } = useForm({
    resolver: yupResolver(agentSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      phoneNumber: '',
      description: '',
      zipCode: '',
      propertiesNumber: 0,
      facebookUrl: '',
      instagramUrl: '',
      twitterUrl: ''
    }
  });

  // Watch form values for preview
  const watchedValues = watch();

  const onSubmit = async (data) => {
    if (!city || !country) {
      showNotification({
        message: 'Please select both city and country',
        variant: 'error'
      });
      return;
    }

    // Debug: Check if user is authenticated
    if (!session?.backendToken) {
      showNotification({
        message: 'You are not authenticated. Please log in again.',
        variant: 'error'
      });
      return;
    }

    // Check if user is admin
    if (session?.user?.role !== 'admin') {
      showNotification({
        message: 'You do not have permission to create agents. Admin access required.',
        variant: 'error'
      });
      return;
    }

    console.log('Session data:', session);
    console.log('Backend token:', session.backendToken);
    console.log('User role:', session.user.role);

    setIsLoading(true);
    try {
      // Prepare agent data
      const agentData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        description: data.description,
        propertiesNumber: parseInt(data.propertiesNumber),
        address: {
          zipCode: data.zipCode,
          city: city,
          country: country
        },
        socialMedia: {},
        // Include profile image URL if uploaded
        profilePicture: uploadedImage ? uploadedImage.fileUrl : undefined
      };

      // Only add social media URLs if they're provided and not empty
      if (data.facebookUrl && data.facebookUrl.trim()) {
        agentData.socialMedia.facebook = data.facebookUrl;
      }
      if (data.instagramUrl && data.instagramUrl.trim()) {
        agentData.socialMedia.instagram = data.instagramUrl;
      }
      if (data.twitterUrl && data.twitterUrl.trim()) {
        agentData.socialMedia.twitter = data.twitterUrl;
      }

      console.log('Agent data being sent:', agentData);

      // Create a custom API call with the token
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000'}/api/users/agents`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.backendToken}`
        },
        body: JSON.stringify(agentData)
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }
      
      if (responseData.success) {
        showNotification({
          message: 'Agent created successfully!',
          variant: 'success'
        });
        reset();
        setCity('');
        setCountry('');
        setUploadedImage(null);
        // Redirect to agents list view
        router.push('/agents/list-view');
      } else {
        showNotification({
          message: responseData.message || 'Failed to create agent',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating agent:', error);
      
      // Try to get error message from response
      let errorMessage = 'Failed to create agent. Please try again.';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.status === 401) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.status === 403) {
        errorMessage = 'You do not have permission to create agents.';
      } else if (error.status === 400) {
        errorMessage = 'Invalid data provided. Please check your input.';
      }
      
      showNotification({
        message: errorMessage,
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle image upload completion
  const handleImageUploadComplete = (uploadData) => {
    console.log('useAgentAdd received uploadData:', uploadData);
    setUploadedImage(uploadData.image || null);
  };

  // Handle image upload start
  const handleImageUploadStart = () => {
    setIsImageUploading(true);
  };

  // Handle image upload finish (whether success or error)
  const handleImageUploadFinish = () => {
    setIsImageUploading(false);
  };

  return {
    handleSubmit,
    control,
    errors,
    isLoading,
    city,
    setCity,
    country,
    setCountry,
    onSubmit,
    watchedValues,
    uploadedImage,
    isImageUploading,
    handleImageUploadComplete,
    handleImageUploadStart,
    handleImageUploadFinish
  };
};

export default useAgentAdd;
