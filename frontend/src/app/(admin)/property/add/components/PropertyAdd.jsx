'use client';

import ChoicesFormInput from '@/components/from/ChoicesFormInput';
import TextAreaFormInput from '@/components/from/TextAreaFormInput';
import TextFormInput from '@/components/from/TextFormInput';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';
const PropertyAdd = ({
  handleSubmit,
  control,
  register,
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
  hasSubmitted
}) => {

  return <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <CardTitle as={'h4'}>Property Information</CardTitle>
          </CardHeader>
          <CardBody>
            <Row>
              <Col lg={6}>
                <div className="mb-3">
                  <TextFormInput 
                    control={control} 
                    name="name" 
                    placeholder="Enter property name" 
                    label="Property Name" 
                    error={errors.name?.message}
                  />
                </div>
              </Col>
              <Col lg={6}>
                <label htmlFor="property-categories" className="form-label">
                  Property Categories <span className="text-danger">*</span>
                </label>
                <select 
                  className={`form-control ${hasSubmitted && !propertyCategory ? 'is-invalid' : ''}`}
                  id="property-categories"
                  value={propertyCategory}
                  onChange={(e) => setPropertyCategory(e.target.value)}
                >
                  <option value="">Select Categories</option>
                  <option value="Single Story">Single Story</option>
                  <option value="Double Story">Double Story</option>
                </select>
                {hasSubmitted && !propertyCategory && <div className="invalid-feedback">Please select a property category</div>}
              </Col>
              <Col lg={4}>
                <label htmlFor="property-price" className="form-label">
                  Price
                </label>
                <div className="input-group mb-3">
                  <span className="input-group-text fs-20 px-2 py-0">
                    <IconifyIcon icon="ri:money-dollar-circle-line" />
                  </span>
                  <input 
                    type="number" 
                    id="property-price" 
                    className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                    placeholder="000"
                    {...register('price')}
                  />
                  {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
                </div>
              </Col>
              <Col lg={4}>
                <label htmlFor="property-for" className="form-label">
                  Property For <span className="text-danger">*</span>
                </label>
                <select 
                  className={`form-control ${hasSubmitted && !propertyFor ? 'is-invalid' : ''}`}
                  id="property-for"
                  value={propertyFor}
                  onChange={(e) => setPropertyFor(e.target.value)}
                >
                  <option value="">Select Type</option>
                  <option value="8 meter">8 meter</option>
                  <option value="10 meter">10 meter</option>
                  <option value="12 meter">12 meter</option>
                  <option value="13 meter">13 meter</option>
                  <option value="14 meter">14 meter</option>
                  <option value="16 meter">16 meter</option>
                  <option value="18 meter">18 meter</option>
                  <option value="20 meter">20 meter</option>
                </select>
                {hasSubmitted && !propertyFor && <div className="invalid-feedback">Please select property type</div>}
              </Col>
              <Col lg={4}>
                <label htmlFor="property-bedroom" className="form-label">
                  Bedroom <span className="text-danger">*</span>
                </label>
                <div className="input-group mb-3">
                  <span className="input-group-text fs-20">
                    <IconifyIcon icon="solar:bed-broken" className="align-middle" />
                  </span>
                  <input 
                    type="number" 
                    id="property-bedroom" 
                    className={`form-control ${errors.bedrooms ? 'is-invalid' : ''}`}
                    placeholder="0"
                    {...register('bedrooms')}
                  />
                  {errors.bedrooms && <div className="invalid-feedback">{errors.bedrooms.message}</div>}
                </div>
              </Col>
              <Col lg={4}>
                <label htmlFor="property-bathroom" className="form-label">
                  Bathroom <span className="text-danger">*</span>
                </label>
                <div className="input-group mb-3">
                  <span className="input-group-text fs-20">
                    <IconifyIcon icon="solar:bath-broken" className="align-middle" />
                  </span>
                  <input 
                    type="number" 
                    id="property-bathroom" 
                    className={`form-control ${errors.bathrooms ? 'is-invalid' : ''}`}
                    placeholder="0"
                    {...register('bathrooms')}
                  />
                  {errors.bathrooms && <div className="invalid-feedback">{errors.bathrooms.message}</div>}
                </div>
              </Col>
              <Col lg={4}>
                <label htmlFor="property-square-foot" className="form-label">
                  Square Foot <span className="text-danger">*</span>
                </label>
                <div className="input-group mb-3">
                  <span className="input-group-text fs-20">
                    <IconifyIcon icon="solar:scale-broken" className="align-middle" />
                  </span>
                  <input 
                    type="number" 
                    id="property-square-foot" 
                    className={`form-control ${errors.squareFootage ? 'is-invalid' : ''}`}
                    placeholder="0"
                    {...register('squareFootage')}
                  />
                  {errors.squareFootage && <div className="invalid-feedback">{errors.squareFootage.message}</div>}
                </div>
              </Col>
              <Col lg={4}>
                <label htmlFor="property-floor" className="form-label">
                  Floor <span className="text-danger">*</span>
                </label>
                <div className="input-group mb-3">
                  <span className="input-group-text fs-20">
                    <IconifyIcon icon="solar:double-alt-arrow-up-broken" className="align-middle" />
                  </span>
                  <input 
                    type="number" 
                    id="property-floor" 
                    className={`form-control ${errors.floor ? 'is-invalid' : ''}`}
                    placeholder="0"
                    {...register('floor')}
                  />
                  {errors.floor && <div className="invalid-feedback">{errors.floor.message}</div>}
                </div>
              </Col>
              <Col lg={12}>
                <div className="mb-3">
                  <TextAreaFormInput 
                    control={control} 
                    name="description" 
                    type="text" 
                    label="Property Description" 
                    className="form-control" 
                    id="description-textarea" 
                    rows={3} 
                    placeholder="Enter detailed property description" 
                    error={errors.description?.message}
                  />
                </div>
              </Col>
              <Col lg={12}>
                <div className="mb-3">
                  <TextAreaFormInput 
                    control={control} 
                    name="address" 
                    type="text" 
                    label="Property Address (Optional)" 
                    className="form-control" 
                    id="schedule-textarea" 
                    rows={3} 
                    placeholder="Enter complete address (optional)" 
                    error={errors.address?.message}
                  />
                </div>
              </Col>
              <Col lg={4}>
                <div className="mb-3">
                  <TextFormInput 
                    control={control} 
                    name="zipCode" 
                    type="text" 
                    placeholder="Enter zip code (optional)" 
                    label="Zip-Code (Optional)" 
                    error={errors.zipCode?.message}
                  />
                </div>
              </Col>
              <Col lg={4}>
                <label htmlFor="choices-city" className="form-label">
                  City (Optional)
                </label>
                <select 
                  className={`form-control`}
                  id="choices-city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Select City (Optional)</option>
                  <optgroup label="UK">
                    <option value="London">London</option>
                    <option value="Manchester">Manchester</option>
                    <option value="Liverpool">Liverpool</option>
                  </optgroup>
                  <optgroup label="FR">
                    <option value="Paris">Paris</option>
                    <option value="Lyon">Lyon</option>
                    <option value="Marseille">Marseille</option>
                  </optgroup>
                  <optgroup label="DE">
                    <option value="Hamburg">Hamburg</option>
                    <option value="Munich">Munich</option>
                    <option value="Berlin">Berlin</option>
                  </optgroup>
                  <optgroup label="US">
                    <option value="New York">New York</option>
                    <option value="Washington">Washington</option>
                    <option value="Michigan">Michigan</option>
                  </optgroup>
                  <optgroup label="SP">
                    <option value="Madrid">Madrid</option>
                    <option value="Barcelona">Barcelona</option>
                    <option value="Malaga">Malaga</option>
                  </optgroup>
                  <optgroup label="CA">
                    <option value="Montreal">Montreal</option>
                    <option value="Toronto">Toronto</option>
                    <option value="Vancouver">Vancouver</option>
                  </optgroup>
                </select>
              </Col>
              <Col lg={4}>
                <label htmlFor="choices-country" className="form-label">
                  Country (Optional)
                </label>
                <select 
                  className={`form-control`}
                  id="choices-country"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">Select Country (Optional)</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="France">France</option>
                  <option value="Netherlands">Netherlands</option>
                  <option value="U.S.A">U.S.A</option>
                  <option value="Denmark">Denmark</option>
                  <option value="Canada">Canada</option>
                  <option value="Australia">Australia</option>
                  <option value="India">India</option>
                  <option value="Germany">Germany</option>
                  <option value="Spain">Spain</option>
                  <option value="United Arab Emirates">United Arab Emirates</option>
                </select>
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
                {isLoading ? 'Creating...' : 'Create Property'}
              </Button>
            </Col>
            <Col lg={2}>
              <Button 
                variant="danger" 
                className="w-100"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </Col>
          </Row>
        </div>
      </form>
    </>;
};

export default PropertyAdd;