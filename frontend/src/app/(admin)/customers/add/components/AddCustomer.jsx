'use client';

import React from 'react';
import ChoicesFormInput from '@/components/from/ChoicesFormInput';
import TextAreaFormInput from '@/components/from/TextAreaFormInput';
import TextFormInput from '@/components/from/TextFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row, Spinner } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
const AddCustomer = ({ onSubmit, isLoading = false, onFormDataChange }) => {
  const messageSchema = yup.object({
    firstName: yup.string().required('Please enter first name'),
    lastName: yup.string().required('Please enter last name'),
    email: yup.string().email().required('Please enter email'),
    password: yup.string().min(6).required('Please enter password'),
    phoneNumber: yup.string().required('Please enter phone number'),
    description: yup.string().optional(),
    viewProperties: yup.number().min(0).optional(),
    ownProperties: yup.number().min(0).optional(),
    investProperty: yup.number().min(0).optional(),
    zipCode: yup.string().optional(),
    city: yup.string().optional(),
    country: yup.string().optional(),
    facebookUrl: yup.string().url().optional(),
    instagramUrl: yup.string().url().optional(),
    twitterUrl: yup.string().url().optional(),
    status: yup.string().oneOf(['available', 'unavailable']).optional()
  });
  const {
    handleSubmit,
    control,
    watch
  } = useForm({
    resolver: yupResolver(messageSchema)
  });

  const formData = watch();

  // Notify parent component of form data changes
  React.useEffect(() => {
    if (onFormDataChange) {
      onFormDataChange(formData);
    }
  }, [formData, onFormDataChange]);
  const handleFormSubmit = (data) => {
    if (onSubmit) {
      // Structure the data for the API
      const customerData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        phoneNumber: data.phoneNumber,
        description: data.description,
        viewProperties: data.viewProperties || 0,
        ownProperties: data.ownProperties || 0,
        investProperty: data.investProperty || 0,
        address: {
          zipCode: data.zipCode,
          city: data.city,
          country: data.country
        },
        socialMedia: {
          facebook: data.facebookUrl,
          instagram: data.instagramUrl,
          twitter: data.twitterUrl
        },
        status: data.status || 'available'
      };
      
      onSubmit(customerData);
    }
  };

  return <form onSubmit={handleSubmit(handleFormSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle as={'h4'}>Customer Information</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="firstName" placeholder="First Name" label="First Name" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="lastName" placeholder="Last Name" label="Last Name" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="email" placeholder="Enter Email" label="Customer Email" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="password" type="password" placeholder="Enter Password" label="Password" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="phoneNumber" placeholder="Enter Phone Number" label="Phone Number" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="viewProperties" type="number" placeholder="Enter View Properties" label="View Properties" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput control={control} name="ownProperties" type="number" placeholder="Enter Own Properties" label="Own Properties" />
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <label htmlFor="invest-property" className="form-label">
                  Invest Property
                </label>
                <div className="input-group">
                  <span className="input-group-text fs-20 px-2 py-0">
                    <IconifyIcon icon="ri:money-dollar-circle-line" />
                  </span>
                  <TextFormInput control={control} name="investProperty" type="number" placeholder="000" />
                </div>
              </div>
            </Col>
            <Col lg={12}>
              <div className="mb-3">
                <TextAreaFormInput control={control} name="description" type="text" label="Customer Address" className="Customer-address" id="schedule-textarea" rows={3} placeholder="Enter address" />
              </div>
            </Col>
            <Col lg={4}>
              <div className="mb-3">
                <TextFormInput control={control} name="zipCode" type="number" placeholder="Zip-Code" label="Zip-Code" />
              </div>
            </Col>
            <Col lg={4}>
              <div className="mb-3">
                <TextFormInput control={control} name="city" placeholder="Enter City" label="City" />
              </div>
            </Col>
            <Col lg={4}>
              <div className="mb-3">
                <TextFormInput control={control} name="country" placeholder="Enter Country" label="Country" />
              </div>
            </Col>
            <Col lg={4}>
              <div className="mb-3">
                <TextFormInput control={control} name="facebookUrl" placeholder="Enter URL" label="Facebook URL" />
              </div>
            </Col>
            <Col lg={4}>
              <div className="mb-3">
                <TextFormInput control={control} name="instagramUrl" placeholder="Enter URL" label="Instagram URL" />
              </div>
            </Col>
            <Col lg={4}>
              <div className="mb-3">
                <TextFormInput control={control} name="twitterUrl" placeholder="Enter URL" label="Twitter URL" />
              </div>
            </Col>
            <Col lg={4}>
              <div className="mb-3">
                <label htmlFor="choices-status" className="form-label">
                  Status
                </label>
                <ChoicesFormInput 
                  control={control} 
                  name="status" 
                  className="form-control" 
                  data-choices 
                  data-placeholder="Select status"
                >
                  <option value="">Choose a Status</option>
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                </ChoicesFormInput>
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <div className="mb-3 rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button 
              variant="outline-primary" 
              type="submit" 
              className="w-100"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner animation="border" size="sm" className="me-2" />
                  Creating...
                </>
              ) : (
                'Create Customer'
              )}
            </Button>
          </Col>
          <Col lg={2}>
            <Button variant="danger" className="w-100">
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
    </form>;
};
export default AddCustomer;