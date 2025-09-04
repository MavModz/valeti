import properties1 from '@/assets/images/properties/p-1.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { currency } from '@/context/constants';
import Image from 'next/image';
import { Card, CardBody, Col, Row } from 'react-bootstrap';

const PropertyAddCard = ({ formData, propertyCategory, propertyFor, city, country, uploadedImages = [], isLoading = false }) => {
  // Default values for preview
  const previewData = {
    name: formData?.name || '',
    description: formData?.description || '',
    price: formData?.price || '',
    bedrooms: formData?.bedrooms || '',
    bathrooms: formData?.bathrooms || '',
    squareFootage: formData?.squareFootage || '',
    floor: formData?.floor || '',
    garages: formData?.garages || '',
    theater: formData?.theater || '',
    address: formData?.address || '',
    zipCode: formData?.zipCode || ''
  };

  // Generate property title
  const propertyTitle = previewData.name || 'Property Name';
  const propertySubtitle = propertyCategory ? `(${propertyCategory})` : '(Category)';
  
  // Generate address
  const address = [previewData.address, city, country].filter(Boolean).join(', ') || 'Address will appear here';
  
  // Format price
  const formattedPrice = previewData.price ? `${currency}${parseFloat(previewData.price).toLocaleString()}` : `${currency}0.00`;
  
  // Get property type badge
  const getPropertyTypeBadge = () => {
    if (!propertyFor) return { text: 'New', color: 'bg-primary' };
    
    switch (propertyFor.toLowerCase()) {
      case 'new':
        return { text: 'New', color: 'bg-success' };
      case 'featured':
        return { text: 'Featured', color: 'bg-primary' };
      default:
        return { text: 'New', color: 'bg-warning' };
    }
  };

  const propertyTypeBadge = getPropertyTypeBadge();

  // Get the primary (first) uploaded image
  const primaryImage = uploadedImages && uploadedImages.length > 0 ? uploadedImages[0] : null;
  const imageSrc = primaryImage?.fileUrl || properties1;
  const imageAlt = primaryImage?.originalName || 'Property Image';

  return (
    <Col xl={3} lg={4}>
      <Card className={isLoading ? 'opacity-75' : ''}>
        <CardBody>
          {isLoading && (
            <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-white bg-opacity-75" style={{ zIndex: 10 }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}
          
          <div className="position-relative">
            {isLoading && uploadedImages.length === 0 && (
              <div className="d-flex align-items-center justify-content-center bg-light rounded" style={{ height: '200px' }}>
                <div className="text-center">
                  <div className="spinner-border spinner-border-sm text-primary mb-2" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <small className="text-muted d-block">Uploading images...</small>
                </div>
              </div>
            )}
            {(!isLoading || uploadedImages.length > 0) && (
              <Image 
                src={imageSrc} 
                alt={imageAlt} 
                className="img-fluid rounded bg-light" 
                width={300}
                height={200}
                style={{ objectFit: 'cover', width: '100%', height: '200px' }}
                onError={(e) => {
                  // Fallback to default image if uploaded image fails to load
                  e.target.src = properties1;
                }}
              />
            )}
            <span className="position-absolute top-0 end-0 p-1">
              <span className={`badge ${propertyTypeBadge.color} text-light fs-13`}>
                {propertyTypeBadge.text}
              </span>
            </span>
            {primaryImage && (
              <span className="position-absolute top-0 start-0 p-1">
                <span className="badge bg-success text-light fs-13">
                  Primary Image
                </span>
              </span>
            )}
            {uploadedImages.length > 1 && (
              <span className="position-absolute bottom-0 end-0 p-1">
                <span className="badge bg-info text-light fs-13">
                  +{uploadedImages.length - 1} more
                </span>
              </span>
            )}
          </div>
          
          <div className="mt-3">
            <h4 className={`mb-1 ${previewData.name ? 'text-dark' : 'text-muted'}`}>
              {propertyTitle}
              <span className="fs-14 text-muted ms-1">{propertySubtitle}</span>
            </h4>
            <p className={`mb-1 ${address !== 'Address will appear here' ? 'text-dark' : 'text-muted'}`}>
              {address}
            </p>
            
            {previewData.description && (
              <p className="small text-muted mt-2">
                {previewData.description.length > 80 
                  ? `${previewData.description.substring(0, 80)}...` 
                  : previewData.description
                }
              </p>
            )}
            
            <h5 className="text-dark fw-medium mt-3">Price :</h5>
            <h4 className={`fw-semibold mt-2 ${previewData.price ? 'text-primary' : 'text-muted'}`}>
              {formattedPrice}
            </h4>
          </div>
          
          <Row className="mt-2 g-2">
            <Col lg={3} xs={3}>
              <span className={`badge ${previewData.bedrooms ? 'bg-light-subtle text-dark' : 'bg-light-subtle text-muted'} border fs-12`}>
                <span className="fs-16">
                  <IconifyIcon icon="solar:bed-broken" className="align-middle" />
                </span>
                &nbsp;{previewData.bedrooms || '0'} Beds
              </span>
            </Col>
            <Col lg={3} xs={3}>
              <span className={`badge ${previewData.bathrooms ? 'bg-light-subtle text-dark' : 'bg-light-subtle text-muted'} border fs-12`}>
                <span className="fs-16">
                  <IconifyIcon icon="solar:bath-broken" className="align-middle" />
                </span>
                &nbsp;{previewData.bathrooms || '0'} Bath
              </span>
            </Col>
            <Col lg={3} xs={3}>
              <span className={`badge ${previewData.squareFootage ? 'bg-light-subtle text-dark' : 'bg-light-subtle text-dark'} border fs-12`}>
                <span className="fs-16">
                  <IconifyIcon icon="solar:scale-broken" className="align-middle" />
                </span>
                &nbsp;{previewData.squareFootage || '0'}ft
              </span>
            </Col>
            <Col lg={3} xs={3}>
              <span className={`badge ${previewData.floor ? 'bg-light-subtle text-dark' : 'bg-light-subtle text-muted'} border fs-12`}>
                <span className="fs-16">
                  <IconifyIcon icon="solar:double-alt-arrow-up-broken" className="align-middle" />
                </span>
                &nbsp;{previewData.floor || '0'} Floor
              </span>
            </Col>
          </Row>
          
          {/* Additional Features Row */}
          <Row className="mt-2 g-2">
            <Col lg={3} xs={3}>
              <span className={`badge ${previewData.garages ? 'bg-light-subtle text-dark' : 'bg-light-subtle text-muted'} border fs-12`}>
                <span className="fs-16">
                  <IconifyIcon icon="solar:car-broken" className="align-middle" />
                </span>
                &nbsp;{previewData.garages || '0'} Garage
              </span>
            </Col>
            <Col lg={3} xs={3}>
              <span className={`badge ${previewData.theater ? 'bg-light-subtle text-dark' : 'bg-light-subtle text-muted'} border fs-12`}>
                <span className="fs-16">
                  <IconifyIcon icon="solar:tv-broken" className="align-middle" />
                </span>
                &nbsp;{previewData.theater || '0'} Theater
              </span>
            </Col>
          </Row>
          
          {/* Progress indicator */}
          <div className="mt-4 pt-3 border-top">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <small className="text-muted">Form Progress</small>
              <small className="text-primary">
                {[
                  previewData.name,
                  previewData.price,
                  previewData.bedrooms,
                  previewData.bathrooms,
                  previewData.squareFootage,
                  previewData.floor,
                  previewData.garages,
                  previewData.theater,
                  previewData.address,
                  propertyCategory,
                  propertyFor,
                  city && country
                ].filter(Boolean).length}/12
              </small>
            </div>
            <div className="progress" style={{ height: '6px' }}>
              <div 
                className="progress-bar bg-primary" 
                style={{ 
                  width: `${([
                    previewData.name,
                    previewData.price,
                    previewData.bedrooms,
                    previewData.bathrooms,
                    previewData.squareFootage,
                    previewData.floor,
                    previewData.garages,
                    previewData.theater,
                    previewData.address,
                    propertyCategory,
                    propertyFor,
                    city && country
                  ].filter(Boolean).length / 12) * 100}%` 
                }}
              ></div>
            </div>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default PropertyAddCard;