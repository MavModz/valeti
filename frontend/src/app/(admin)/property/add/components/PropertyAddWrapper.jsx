'use client';

import FileUpload from '@/components/FileUpload';
import { Card, CardBody, CardHeader, CardTitle, Col, FormControl, FormLabel, Row } from 'react-bootstrap';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
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
    handleImageUploadFinish,
    uploadedFloorPlans,
    isFloorPlanUploading,
    handleFloorPlanUploadComplete,
    handleFloorPlanUploadStart,
    handleFloorPlanUploadFinish,
    updateFloorPlanName
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
          title="Add Property Photo (Optional)" 
          onUploadComplete={handleImageUploadComplete}
          onUploadStart={handleImageUploadStart}
          onUploadFinish={handleImageUploadFinish}
          maxFiles={10}
          disabled={isLoading}
        />
        {/* Floor plan upload with names */}
        <Card className="mt-3">
          <CardHeader>
            <CardTitle as={'h4'}>Add Floor Plans</CardTitle>
          </CardHeader>
          <CardBody>
            <FileUpload 
              title="Upload Floor Plan Images" 
              onUploadComplete={handleFloorPlanUploadComplete}
              onUploadStart={handleFloorPlanUploadStart}
              onUploadFinish={handleFloorPlanUploadFinish}
              maxFiles={10}
              disabled={isLoading || isFloorPlanUploading}
            />

            {uploadedFloorPlans?.length > 0 && (
              <div className="mt-3">
                <FormLabel>Floor Plan Names (used for filters)</FormLabel>
                {uploadedFloorPlans.map((plan, index) => (
                  <Row className="align-items-center mb-2" key={plan.fileKey || plan.fileUrl || index}>
                    <Col xs="auto">
                      <div className="avatar-sm">
                        <img
                          src={plan.fileUrl}
                          alt={plan.originalName || `Floor Plan ${index + 1}`}
                          className="avatar-sm rounded bg-light"
                        />
                      </div>
                    </Col>
                    <Col>
                      <FormControl
                        type="text"
                        value={plan.name || ''}
                        placeholder="Enter floor plan name (e.g. Ground Floor, First Floor)"
                        onChange={(e) => updateFloorPlanName(index, e.target.value)}
                      />
                    </Col>
                  </Row>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
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
