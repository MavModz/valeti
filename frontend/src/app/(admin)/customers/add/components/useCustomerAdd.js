import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCustomer } from '@/app/lib/Services/api';
import { useNotificationContext } from '@/context/useNotificationContext';

const useCustomerAdd = () => {
  const router = useRouter();
  const { showNotification } = useNotificationContext();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);

  const handleImageUploadComplete = (uploadData) => {
    console.log('useCustomerAdd received uploadData:', uploadData);
    setUploadedImage(uploadData.image || null);
  };

  const handleImageUploadStart = () => {
    setIsImageUploading(true);
  };

  const handleImageUploadFinish = () => {
    setIsImageUploading(false);
  };

  const handleSubmit = async (customerData) => {
    try {
      setIsLoading(true);

      console.log('Customer data before adding profile picture:', customerData);
      console.log('Uploaded image data:', uploadedImage);

      // Add profile picture URL if image was uploaded
      const finalCustomerData = {
        ...customerData,
        profilePicture: uploadedImage ? uploadedImage.fileUrl : null
      };

      console.log('Final customer data being sent:', finalCustomerData);

      const response = await createCustomer(finalCustomerData);

      if (response.success) {
        showNotification({
          message: 'Customer created successfully!',
          variant: 'success'
        });
        router.push('/customers/list-view');
      }
    } catch (error) {
      console.error('Customer creation error:', error);
      showNotification({
        message: error.response?.data?.message || 'Failed to create customer',
        variant: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    uploadedImage,
    isImageUploading,
    handleImageUploadComplete,
    handleImageUploadStart,
    handleImageUploadFinish,
    handleSubmit
  };
};

export default useCustomerAdd;
