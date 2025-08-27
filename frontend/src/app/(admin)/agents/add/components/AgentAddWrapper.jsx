'use client';

import AgentFileUpload from '@/components/AgentFileUpload';
import { Col, Row } from 'react-bootstrap';
import AgentAdd from './AgentAdd';
import AgentAddCard from './AgentAddCard';
import useAgentAdd from './useAgentAdd';

const AgentAddWrapper = () => {
  const {
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
  } = useAgentAdd();

  return (
    <Row>
      <AgentAddCard 
        formData={watchedValues} 
        city={city} 
        country={country} 
        uploadedImage={uploadedImage}
        isLoading={isLoading} 
      />
      <Col xl={9} lg={8}>
        <AgentFileUpload 
          title="Add Agent Photo" 
          onUploadComplete={handleImageUploadComplete}
          onUploadStart={handleImageUploadStart}
          onUploadFinish={handleImageUploadFinish}
          disabled={isLoading}
        />
        <AgentAdd 
          handleSubmit={handleSubmit}
          control={control}
          errors={errors}
          isLoading={isLoading || isImageUploading}
          city={city}
          setCity={setCity}
          country={country}
          setCountry={setCountry}
          onSubmit={onSubmit}
        />
      </Col>
    </Row>
  );
};

export default AgentAddWrapper;
