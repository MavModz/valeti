'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { createProperty } from '@/app/lib/Services/api';
import { useNotificationContext } from '@/context/useNotificationContext';
import { useRouter } from 'next/navigation';

const usePropertyAdd = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [propertyCategory, setPropertyCategory] = useState('');
  const [propertyFor, setPropertyFor] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const router = useRouter();
  const { showNotification } = useNotificationContext();

  // Validation schema
  const propertySchema = yup.object({
    name: yup.string().required('Property name is required').min(3, 'Property name must be at least 3 characters'),
    description: yup.string().required('Property description is required').min(10, 'Description must be at least 10 characters'),
    price: yup.number().transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    }).positive('Price must be positive').optional(),
    bedrooms: yup.number().min(0, 'Bedrooms must be 0 or greater').required('Number of bedrooms is required'),
    bathrooms: yup.number().min(0, 'Bathrooms must be 0 or greater').required('Number of bathrooms is required'),
    squareFootage: yup.number().positive('Square footage must be positive').required('Square footage is required'),
    floor: yup.number().min(0, 'Floor must be 0 or greater').required('Floor number is required'),
    address: yup.string().transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    }).min(10, 'Address must be at least 10 characters if provided').optional(),
    zipCode: yup.string().transform((value, originalValue) => {
      return originalValue === '' ? undefined : value;
    }).optional()
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
    setValue,
    register
  } = useForm({
    resolver: yupResolver(propertySchema),
    defaultValues: {
      name: '',
      description: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      squareFootage: '',
      floor: '',
      address: '',
      zipCode: ''
    }
  });

  // Watch form values for preview
  const watchedValues = watch();

  const onSubmit = async (data) => {
    setHasSubmitted(true);
    
    if (!propertyCategory || !propertyFor) {
      showNotification({
        message: 'Please select property category and property type',
        variant: 'error'
      });
      return;
    }

    setIsLoading(true);
    try {
      // Prepare property data according to backend schema
      const propertyData = {
        title: data.name,
        description: data.description,
        type: 'sale', // Default to sale since we're using meter values now
        category: propertyCategory, // Use exact values: 'Single Story', 'Double Story'
        propertyFor: propertyFor, // Use exact meter values: '8 meter', '10 meter', etc.
        price: data.price && data.price !== '' ? parseFloat(data.price) : undefined,
        location: {
          address: data.address && data.address.trim() !== '' ? data.address : undefined,
          city: city && city.trim() !== '' ? city : undefined,
          state: 'Default State', // Backend requires state, we'll set a default
          zipCode: data.zipCode && data.zipCode.trim() !== '' ? data.zipCode : undefined,
          country: country && country.trim() !== '' ? country : undefined
        },
        features: {
          bedrooms: parseInt(data.bedrooms),
          bathrooms: parseInt(data.bathrooms),
          area: parseFloat(data.squareFootage),
          floors: parseInt(data.floor)
        },
        status: 'available',
        // Include uploaded images
        images: uploadedImages.map((img, index) => ({
          url: img.fileUrl,
          caption: img.originalName || `Property Image ${index + 1}`,
          isPrimary: index === 0 // First image is primary
        }))
        // agent and owner will be set by the backend based on authenticated user
      };

      // No mapping needed since we're using exact values that match backend enum

      const response = await createProperty(propertyData);
      
      if (response.success) {
        showNotification({
          message: 'Property created successfully!',
          variant: 'success'
        });
        reset();
        setPropertyCategory('');
        setPropertyFor('');
        setCity('');
        setCountry('');
        setUploadedImages([]);
        setHasSubmitted(false);
        // Redirect to properties list view
        router.push('/property/list');
      } else {
        showNotification({
          message: response.message || 'Failed to create property',
          variant: 'error'
        });
      }
    } catch (error) {
      console.error('Error creating property:', error);
      if (error.response?.data?.message) {
        showNotification({
          message: error.response.data.message,
          variant: 'error'
        });
      } else if (error.response?.data?.errors) {
        const errorMessages = error.response.data.errors.map(err => err.msg).join(', ');
        showNotification({
          message: errorMessages,
          variant: 'error'
        });
      } else {
        showNotification({
          message: 'Failed to create property. Please try again.',
          variant: 'error'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    reset();
    setPropertyCategory('');
    setPropertyFor('');
    setCity('');
    setCountry('');
    setUploadedImages([]);
    setHasSubmitted(false);
    router.push('/property/list');
  };

  // Handle image upload completion
  const handleImageUploadComplete = (uploadData) => {
    console.log('usePropertyAdd received uploadData:', uploadData);
    setUploadedImages(uploadData.images || []);
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
    propertyCategory,
    setPropertyCategory,
    propertyFor,
    setPropertyFor,
    city,
    setCity,
    country,
    setCountry,
    onSubmit,
    handleCancel,
    register,
    hasSubmitted,
    watchedValues,
    uploadedImages,
    isImageUploading,
    handleImageUploadComplete,
    handleImageUploadStart,
    handleImageUploadFinish
  };
};

export default usePropertyAdd;
