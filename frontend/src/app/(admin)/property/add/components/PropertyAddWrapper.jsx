'use client';

import FileUpload from '@/components/FileUpload';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, FormControl, FormLabel, Row } from 'react-bootstrap';
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
    updateFloorPlanName,
    addFloorPlanSubPlan,
    updateFloorPlanSubPlan,
    removeFloorPlanSubPlan
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
                  <Card className="mb-3" key={plan.fileKey || plan.fileUrl || index}>
                    <CardBody>
                      <Row className="align-items-center mb-2">
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

                      <div className="mt-2">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <FormLabel className="mb-0">Sub Plans (optional variants)</FormLabel>
                          <Button
                            type="button"
                            variant="outline-primary"
                            size="sm"
                            onClick={() => addFloorPlanSubPlan(index)}
                          >
                            Add Sub Plan
                          </Button>
                        </div>

                        {(plan.subPlans || []).map((subPlan, subPlanIndex) => (
                          <Row className="g-2 mb-2" key={`${index}-sub-${subPlanIndex}`}>
                            <Col md={4}>
                              <FormControl
                                type="text"
                                value={subPlan.name || ''}
                                placeholder="Sub plan name (e.g. Kitchen Right)"
                                onChange={(e) => updateFloorPlanSubPlan(index, subPlanIndex, 'name', e.target.value)}
                              />
                            </Col>
                            <Col md={6}>
                              <FormControl
                                type="text"
                                value={subPlan.url || ''}
                                placeholder="Sub plan image URL"
                                onChange={(e) => updateFloorPlanSubPlan(index, subPlanIndex, 'url', e.target.value)}
                              />
                            </Col>
                            <Col md={2}>
                              <Button
                                type="button"
                                variant="outline-danger"
                                className="w-100"
                                onClick={() => removeFloorPlanSubPlan(index, subPlanIndex)}
                              >
                                Remove
                              </Button>
                            </Col>
                          </Row>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
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
