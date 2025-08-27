'use client';

import { useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import CustomerAddCard from './CustomerAddCard';
import CustomerFileUpload from '@/components/CustomerFileUpload';
import AddCustomer from './AddCustomer';
import useCustomerAdd from './useCustomerAdd';

const CustomerAddWrapper = () => {
  const {
    isLoading,
    uploadedImage,
    isImageUploading,
    handleImageUploadComplete,
    handleImageUploadStart,
    handleImageUploadFinish,
    handleSubmit
  } = useCustomerAdd();

  // State to track form data for preview
  const [formData, setFormData] = useState({});
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');

  // Handle form data changes for preview
  const handleFormDataChange = (data) => {
    setFormData(data);
  };

  return (
    <Row>
      <CustomerAddCard 
        formData={formData}
        city={city}
        country={country}
        uploadedImage={uploadedImage} 
        isLoading={isLoading || isImageUploading}
      />
      <Col xl={9} lg={12}>
        <CustomerFileUpload
          title="Add Customer Photo"
          onUploadComplete={handleImageUploadComplete}
          onUploadStart={handleImageUploadStart}
          onUploadFinish={handleImageUploadFinish}
          disabled={isLoading}
        />
        <AddCustomer 
          onSubmit={handleSubmit} 
          isLoading={isLoading || isImageUploading}
          onFormDataChange={handleFormDataChange}
        />
      </Col>
    </Row>
  );
};

export default CustomerAddWrapper;
