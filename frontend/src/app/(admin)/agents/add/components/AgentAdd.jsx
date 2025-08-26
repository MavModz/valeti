'use client';

import ChoicesFormInput from '@/components/from/ChoicesFormInput';
import TextAreaFormInput from '@/components/from/TextAreaFormInput';
import TextFormInput from '@/components/from/TextFormInput';
import { Button, Card, CardBody, CardHeader, CardTitle, Col, Row } from 'react-bootstrap';

const AgentAdd = ({
  handleSubmit,
  control,
  errors,
  isLoading,
  city,
  setCity,
  country,
  setCountry,
  onSubmit
}) => {

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle as={'h4'}>Agent Information</CardTitle>
        </CardHeader>
        <CardBody>
          <Row>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput 
                  control={control} 
                  name="firstName" 
                  placeholder="First Name" 
                  label="First Name" 
                />
                {errors.firstName && (
                  <div className="text-danger small mt-1">{errors.firstName.message}</div>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput 
                  control={control} 
                  name="lastName" 
                  placeholder="Last Name" 
                  label="Last Name" 
                />
                {errors.lastName && (
                  <div className="text-danger small mt-1">{errors.lastName.message}</div>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput 
                  control={control} 
                  name="email" 
                  placeholder="Enter Email" 
                  label="Agent Email" 
                />
                {errors.email && (
                  <div className="text-danger small mt-1">{errors.email.message}</div>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput 
                  control={control} 
                  name="password" 
                  type="password"
                  placeholder="Enter Password" 
                  label="Password" 
                />
                {errors.password && (
                  <div className="text-danger small mt-1">{errors.password.message}</div>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput 
                  control={control} 
                  name="phoneNumber" 
                  placeholder="Enter Phone Number" 
                  label="Phone Number" 
                />
                {errors.phoneNumber && (
                  <div className="text-danger small mt-1">{errors.phoneNumber.message}</div>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div className="mb-3">
                <TextFormInput 
                  control={control} 
                  name="propertiesNumber" 
                  type="number" 
                  placeholder="Enter Properties Number" 
                  label="Properties Number" 
                />
                {errors.propertiesNumber && (
                  <div className="text-danger small mt-1">{errors.propertiesNumber.message}</div>
                )}
              </div>
            </Col>
            <Col lg={12}>
              <div className="mb-3">
                <TextAreaFormInput 
                  control={control} 
                  name="description" 
                  label="Agent Address" 
                  className="agent-address" 
                  id="schedule-textarea" 
                  rows={3} 
                  placeholder="Enter address" 
                />
                {errors.description && (
                  <div className="text-danger small mt-1">{errors.description.message}</div>
                )}
              </div>
            </Col>
            <Col lg={4}>
              <div className="mb-3">
                <TextFormInput 
                  control={control} 
                  name="zipCode" 
                  placeholder="Zip-Code" 
                  label="Zip-Code" 
                />
                {errors.zipCode && (
                  <div className="text-danger small mt-1">{errors.zipCode.message}</div>
                )}
              </div>
            </Col>
            <Col lg={4}>
              <div className="mb-3">
                <label htmlFor="choices-city" className="form-label">
                  City <span className="text-danger">*</span>
                </label>
                <select 
                  className="form-control" 
                  id="choices-city" 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                >
                  <option value="">Choose a city</option>
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
                  <optgroup label="DE" disabled>
                    <option value="Hamburg">Hamburg</option>
                    <option value="Munich">Munich</option>
                    <option value="Berlin">Berlin</option>
                  </optgroup>
                  <optgroup label="US">
                    <option value="New York">New York</option>
                    <option value="Washington" disabled>
                      Washington
                    </option>
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
              </div>
            </Col>
            <Col lg={4}>
              <div className="mb-3">
                <label htmlFor="choices-country" className="form-label">
                  Country <span className="text-danger">*</span>
                </label>
                <select 
                  className="form-control" 
                  id="choices-country" 
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                >
                  <option value="">Choose a country</option>
                  <optgroup>
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
                  </optgroup>
                </select>
              </div>
            </Col>
            <Col lg={4}>
              <div className="mb-3">
                <TextFormInput 
                  control={control} 
                  name="facebookUrl" 
                  placeholder="Enter Facebook URL" 
                  label="Facebook URL" 
                />
                {errors.facebookUrl && (
                  <div className="text-danger small mt-1">{errors.facebookUrl.message}</div>
                )}
              </div>
            </Col>
            <Col lg={4}>
              <div className="mb-3">
                <TextFormInput 
                  control={control} 
                  name="instagramUrl" 
                  placeholder="Enter Instagram URL" 
                  label="Instagram URL" 
                />
                {errors.instagramUrl && (
                  <div className="text-danger small mt-1">{errors.instagramUrl.message}</div>
                )}
              </div>
            </Col>
            <Col lg={4}>
              <div className="mb-3">
                <TextFormInput 
                  control={control} 
                  name="twitterUrl" 
                  placeholder="Enter Twitter URL" 
                  label="Twitter URL" 
                />
                {errors.twitterUrl && (
                  <div className="text-danger small mt-1">{errors.twitterUrl.message}</div>
                )}
              </div>
            </Col>
          </Row>
        </CardBody>
      </Card>
      <div className="mb-3 rounded">
        <Row className="justify-content-end g-2">
          <Col lg={2}>
            <Button 
              type="submit" 
              variant="outline-primary" 
              className="w-100"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Agent'}
            </Button>
          </Col>
          <Col lg={2}>
            <Button 
              variant="danger" 
              className="w-100"
              type="button"
              onClick={() => window.history.back()}
            >
              Cancel
            </Button>
          </Col>
        </Row>
      </div>
    </form>
  );
};

export default AgentAdd;