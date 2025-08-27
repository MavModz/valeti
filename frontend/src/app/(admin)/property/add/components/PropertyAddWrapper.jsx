'use client';

import FileUpload from '@/components/FileUpload';
import { Col, Row } from 'react-bootstrap';
import PropertyAdd from './PropertyAdd';
import PropertyAddCard from './PropertyAddCard';
import usePropertyAdd from './usePropertyAdd';

const PropertyAddWrapper = () => {
  const {
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
  } = usePropertyAdd();

  return (
    <Row>
      <PropertyAddCard 
        formData={watchedValues} 
        propertyCategory={propertyCategory}
        propertyFor={propertyFor}
        city={city} 
        country={country} 
        uploadedImages={uploadedImages}
        isLoading={isLoading} 
      />
      <Col xl={9} lg={8}>
        <FileUpload 
          title="Add Property Photo" 
          onUploadComplete={handleImageUploadComplete}
          onUploadStart={handleImageUploadStart}
          onUploadFinish={handleImageUploadFinish}
          maxFiles={10}
          disabled={isLoading}
        />
        <PropertyAdd 
          handleSubmit={handleSubmit}
          control={control}
          errors={errors}
          isLoading={isLoading || isImageUploading}
          propertyCategory={propertyCategory}
          setPropertyCategory={setPropertyCategory}
          propertyFor={propertyFor}
          setPropertyFor={setPropertyFor}
          city={city}
          setCity={setCity}
          country={country}
          setCountry={setCountry}
          onSubmit={onSubmit}
          handleCancel={handleCancel}
          register={register}
          hasSubmitted={hasSubmitted}
          uploadedImages={uploadedImages}
        />
      </Col>
    </Row>
  );
};

export default PropertyAddWrapper;
