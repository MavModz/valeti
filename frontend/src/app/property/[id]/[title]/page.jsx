'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Head from 'next/head';
import { Container, Row, Col, Card, CardBody, Spinner, Alert, Modal, Button } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PublicHeader from '@/components/layout/PublicHeader/page';
import { getAllProperties } from '@/app/lib/Services/api';

const PublicPropertyDetailsPage = () => {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id;
  const propertyTitle = params.title;
  
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await getAllProperties();
        
        if (response.success && response.data.properties) {
          const foundProperty = response.data.properties.find(p => p._id === propertyId);
          if (foundProperty) {
            setProperty(foundProperty);
            
            // Validate that the title in URL matches the property title
            const expectedTitle = encodeURIComponent(foundProperty.title || 'property')
              .replace(/[^a-zA-Z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .toLowerCase();
            
            if (propertyTitle !== expectedTitle) {
              // Redirect to correct SEO-friendly URL
              router.replace(`/property/${propertyId}/${expectedTitle}`);
            }
          } else {
            setError('Property not found');
          }
        } else {
          setError('Failed to fetch property data');
        }
      } catch (err) {
        console.error('Error fetching property:', err);
        setError('Error loading property details');
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId, propertyTitle, router]);

  // Reset zoom when image changes
  useEffect(() => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  }, [currentImageIndex]);

  // Keyboard shortcuts for zoom
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showImageModal) return;
      
      switch (e.key) {
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case '0':
          e.preventDefault();
          handleResetZoom();
          break;
        case 'Escape':
          handleCloseModal();
          break;
        case 'ArrowLeft':
          if (property?.images && property.images.length > 1) {
            e.preventDefault();
            handlePreviousImage();
          }
          break;
        case 'ArrowRight':
          if (property?.images && property.images.length > 1) {
            e.preventDefault();
            handleNextImage();
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [showImageModal, property?.images]);

  if (loading) {
    return (
      <>
        <PublicHeader />
        <Container className="py-5">
          <div className="text-center">
            <Spinner animation="border" role="status" className="text-primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading property details...</p>
          </div>
        </Container>
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <PublicHeader />
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>{error || 'Property not found'}</p>
            <Link href="/search" className="btn btn-primary">
              Back to Search
            </Link>
          </Alert>
        </Container>
      </>
    );
  }

  // Image modal functions
  const handleImageClick = (index = 0) => {
    setCurrentImageIndex(index);
    setShowImageModal(true);
  };

  const handlePreviousImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? (property?.images?.length || 1) - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === (property?.images?.length || 1) - 1 ? 0 : prev + 1
    );
  };

  const handleCloseModal = () => {
    setShowImageModal(false);
    setCurrentImageIndex(0);
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Zoom functions
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 5));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanPosition({ x: 0, y: 0 });
  };

  // Pan functions
  const handleMouseDown = (e) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - panPosition.x,
        y: e.clientY - panPosition.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && zoomLevel > 1) {
      setPanPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Early returns for loading and error states
  if (loading) {
    return (
      <>
        <PublicHeader />
        <Container className="py-5">
          <div className="text-center">
            <Spinner animation="border" role="status" className="text-primary">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading property details...</p>
          </div>
        </Container>
      </>
    );
  }

  if (error || !property) {
    return (
      <>
        <PublicHeader />
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>Error</Alert.Heading>
            <p>{error || 'Property not found'}</p>
            <Link href="/search" className="btn btn-primary">
              Back to Search
            </Link>
          </Alert>
        </Container>
      </>
    );
  }

  // Transform API data to match the expected format
  const transformedProperty = {
    ...property,
    price: property.price || 0,
    currency: property.currency || 'USD',
    features: property.features || {},
    amenities: property.amenities || [],
    images: property.images || [],
    location: property.location || {}
  };

  // Render main content
  return (
    <>
      <Head>
        <title>{transformedProperty.title || 'Property Details'} - Valeti Properties</title>
        <meta name="description" content={transformedProperty.description || 'View detailed information about this property including features, amenities, and location.'} />
        <meta name="keywords" content={`${transformedProperty.category || 'property'}, ${transformedProperty.location?.city || 'location'}, real estate, property for ${transformedProperty.type || 'sale'}`} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="og:title" content={transformedProperty.title || 'Property Details'} />
        <meta property="og:description" content={transformedProperty.description || 'View detailed information about this property including features, amenities, and location.'} />
        <meta property="og:image" content={transformedProperty.images?.[0]?.url || '/assets/images/logo.png'} />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={typeof window !== 'undefined' ? window.location.href : ''} />
        <meta property="twitter:title" content={transformedProperty.title || 'Property Details'} />
        <meta property="twitter:description" content={transformedProperty.description || 'View detailed information about this property including features, amenities, and location.'} />
        <meta property="twitter:image" content={transformedProperty.images?.[0]?.url || '/assets/images/logo.png'} />
        
        {/* Canonical URL */}
        <link rel="canonical" href={typeof window !== 'undefined' ? window.location.href : ''} />
      </Head>
      <PublicHeader />
      <Container className="py-5">
        <Row>
          {/* Property Images and Main Details */}
          <Col lg={9} md={8}>
            <Card>
              <CardBody>
                <div className="position-relative">
                  {transformedProperty.images && transformedProperty.images.length > 0 ? (
                    <div 
                      className="position-relative cursor-pointer"
                      onClick={() => handleImageClick(0)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Image 
                        src={transformedProperty.images[0].url} 
                        alt={transformedProperty.title || 'Property'} 
                        width={800}
                        height={500}
                        className="img-fluid rounded w-100"
                        style={{ objectFit: 'cover', height: '400px' }}
                      />
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-dark bg-opacity-75 text-white px-2 py-1 fs-12">
                          <IconifyIcon icon="bx:expand" className="me-1" />
                          Click to view
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-light rounded d-flex align-items-center justify-content-center" style={{ height: '400px' }}>
                      <IconifyIcon icon="ri:image-line" className="fs-1 text-muted" />
                    </div>
                  )}
                  <span className="position-absolute top-0 start-0 p-2">
                    <span className="badge bg-warning text-light px-2 py-1 fs-13">
                      {transformedProperty.type === 'new' ? 'New' : 'Featured'}
                    </span>
                  </span>
                </div>

                {/* Thumbnail gallery */}
                {transformedProperty.images && transformedProperty.images.length > 1 && (
                  <div className="d-flex gap-2 mt-3 overflow-auto">
                    {transformedProperty.images.map((image, index) => (
                      <div 
                        key={index}
                        className="position-relative cursor-pointer"
                        onClick={() => handleImageClick(index)}
                        style={{ cursor: 'pointer', minWidth: '80px' }}
                      >
                        <Image 
                          src={image.url} 
                          alt={`${transformedProperty.title || 'Property'} - Image ${index + 1}`}
                          width={80}
                          height={60}
                          className="img-fluid rounded border"
                          style={{ objectFit: 'cover', height: '60px' }}
                        />
                        {index === 0 && (
                          <span className="position-absolute top-0 start-0 m-1">
                            <span className="badge bg-primary bg-opacity-75 text-white px-1 py-0 fs-10">
                              Main
                            </span>
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="d-flex flex-wrap justify-content-between my-3 gap-2">
                  <div>
                    <h3 className="fs-18 text-dark fw-medium mb-2">
                      {transformedProperty.title || 'Property Title'}
                    </h3>
                    <p className="d-flex align-items-center gap-1 mt-1 mb-0">
                      <IconifyIcon icon="solar:map-point-wave-bold-duotone" className="fs-18 text-primary" />
                      {transformedProperty.location?.address || 'Address not available'}
                    </p>
                  </div>
                  <div>
                    <ul className="list-inline float-end d-flex gap-1 mb-0 align-items-center">
                      <li className="list-inline-item fs-20">
                        <button className="btn btn-light avatar-sm d-flex align-items-center justify-content-center text-dark fs-20">
                          <IconifyIcon icon="solar:share-bold-duotone" />
                        </button>
                      </li>
                      <li className="list-inline-item fs-20">
                        <button className="btn btn-light avatar-sm d-flex align-items-center justify-content-center text-danger fs-20">
                          <IconifyIcon icon="solar:heart-angle-bold-duotone" />
                        </button>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-2">
                  <div className="avatar-sm bg-success-subtle rounded d-flex align-items-center justify-content-center">
                    <IconifyIcon icon="solar:wallet-money-bold-duotone" width={24} height={24} className="fs-24 text-success" />
                  </div>
                  <p className="fw-medium text-dark fs-18 mb-0">
                    {transformedProperty.price && transformedProperty.price > 0 
                      ? `${transformedProperty.currency} ${transformedProperty.price.toLocaleString()}`
                      : 'Price on Request'
                    }
                  </p>
                </div>

                <div className="bg-light-subtle p-2 mt-3 rounded border border-dashed">
                  <Row className="align-items-center text-center g-2">
                    <Col xl={2} lg={3} md={6} xs={6} className="border-end">
                      <p className="text-muted mb-0 fs-15 fw-medium d-flex align-items-center justify-content-center gap-1">
                        <IconifyIcon icon="solar:bed-broken" className="fs-18 text-primary" /> 
                        {transformedProperty.features?.bedrooms || 0} Bedroom
                      </p>
                    </Col>
                    <Col xl={2} lg={3} md={6} xs={6} className="border-end">
                      <p className="text-muted mb-0 fs-15 fw-medium d-flex align-items-center justify-content-center gap-1">
                        <IconifyIcon icon="solar:bath-broken" className="fs-18 text-primary" /> 
                        {transformedProperty.features?.bathrooms || 0} Bathrooms
                      </p>
                    </Col>
                    <Col xl={2} lg={3} md={6} xs={6} className="border-end">
                      <p className="text-muted mb-0 fs-15 fw-medium d-flex align-items-center justify-content-center gap-1">
                        <IconifyIcon icon="solar:scale-broken" className="fs-18 text-primary" /> 
                        {transformedProperty.features?.area || 0} {transformedProperty.features?.areaUnit || 'sqft'}
                      </p>
                    </Col>
                    <Col xl={2} lg={3} md={6} xs={6} className="border-end">
                      <p className="text-muted mb-0 fs-15 fw-medium d-flex align-items-center justify-content-center gap-1">
                        <IconifyIcon icon="solar:double-alt-arrow-up-broken" className="fs-18 text-primary" /> 
                        {transformedProperty.features?.floors || 1} Floor
                      </p>
                    </Col>
                    <Col xl={2} lg={3} md={6} xs={6} className="border-end">
                      <p className="text-muted mb-0 fs-15 fw-medium d-flex align-items-center justify-content-center gap-1">
                        <span className="badge p-1 bg-light fs-12 text-dark">
                          <IconifyIcon icon="ri:star-fill" className="align-text-top fs-14 text-warning me-1" /> 4.4
                        </span> Review
                      </p>
                    </Col>
                    <Col xl={2} lg={3} md={6} xs={6}>
                      <p className="text-muted mb-0 fs-15 fw-medium d-flex align-items-center justify-content-center gap-1">
                        <IconifyIcon icon="solar:check-circle-broken" className="fs-18 text-primary" /> 
                        {transformedProperty.type === 'new' ? 'New' : 'Featured'}
                      </p>
                    </Col>
                  </Row>
                </div>

                {transformedProperty.amenities && transformedProperty.amenities.length > 0 && (
                  <>
                    <h5 className="text-dark fw-medium mt-3">Amenities:</h5>
                    <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
                      {transformedProperty.amenities.map((amenity, index) => (
                        <span key={index} className="badge bg-light-subtle text-muted border fw-medium fs-13 px-2 py-1">
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                <h5 className="text-dark fw-medium mt-3">Property Details:</h5>
                <p className="mt-2">
                  {transformedProperty.description || 'No description available for this property.'}
                </p>

                <div className="d-flex align-items-center justify-content-between">
                  <Link href="/search" className="link-primary fw-medium">
                    <IconifyIcon icon="ri:arrow-left-line" /> Back to Search
                  </Link>
                  <div>
                    <p className="mb-0 d-flex align-items-center gap-1">
                      <IconifyIcon icon="solar:calendar-date-broken" className="fs-18 text-primary" /> 
                      {new Date(transformedProperty.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>

          {/* Owner Details Sidebar */}
          <Col lg={3} md={4}>
            <Card>
              <CardBody>
                <h5 className="text-dark fw-medium mb-3">Property Information</h5>
                <div className="mb-3">
                  <p className="text-muted mb-1">Category</p>
                  <p className="fw-medium">{transformedProperty.category || 'N/A'}</p>
                </div>
                <div className="mb-3">
                  <p className="text-muted mb-1">Property For</p>
                  <p className="fw-medium">{transformedProperty.propertyFor || 'N/A'}</p>
                </div>
                <div className="mb-3">
                  <p className="text-muted mb-1">Status</p>
                  <p className="fw-medium">{transformedProperty.status || 'N/A'}</p>
                </div>
                <div className="mb-3">
                  <p className="text-muted mb-1">Views</p>
                  <p className="fw-medium">{transformedProperty.views || 0}</p>
                </div>
              </CardBody>
            </Card>

            <Card className="mt-3">
              <CardBody>
                <h5 className="text-dark fw-medium mb-3">Contact Information</h5>
                <div className="text-center">
                  <div className="avatar-xl bg-primary rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3">
                    <IconifyIcon icon="ri:user-line" className="text-white fs-1" />
                  </div>
                  <p className="fw-medium text-dark fs-16 mb-1">Property Agent</p>
                  <p className="text-muted mb-3">Contact for more details</p>
                  
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary">
                      <IconifyIcon icon="solar:phone-calling-bold-duotone" className="me-2" />
                      Call Us
                    </button>
                    <button className="btn btn-success">
                      <IconifyIcon icon="solar:chat-round-dots-bold-duotone" className="me-2" />
                      Message
                    </button>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>

        {/* Map Section */}
        <Row className="mt-4">
          <Col lg={12}>
            <Card>
              <CardBody>
                <h5 className="text-dark fw-medium mb-3">Location</h5>
                <div className="mapouter">
                  <div className="gmap_canvas">
                    <iframe 
                      className="gmap_iframe rounded w-100" 
                      width="100%" 
                      style={{ height: 400 }} 
                      frameBorder={0} 
                      scrolling="no" 
                      marginHeight={0} 
                      marginWidth={0} 
                      src="https://maps.google.com/maps?width=100%&height=400&hl=en&q=University of Oxford&t=&z=14&ie=UTF8&iwloc=B&output=embed" 
                    />
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Full Screen Image Modal */}
      <Modal 
        show={showImageModal} 
        onHide={handleCloseModal}
        size="xl"
        centered
        className="image-preview-modal"
      >
        <Modal.Header closeButton className="border-0 text-white">
          <div className="d-flex align-items-center justify-content-between w-100">
            <Modal.Title className="text-white">
              {transformedProperty.title || 'Property'} - Image {currentImageIndex + 1} of {transformedProperty.images?.length || 1}
            </Modal.Title>
            <div className="d-flex gap-2">
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
                title="Zoom Out"
              >
                <IconifyIcon icon="bx:minus" />
              </Button>
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleResetZoom}
                title="Reset Zoom"
              >
                <IconifyIcon icon="bx:refresh" />
              </Button>
              <Button
                variant="outline-light"
                size="sm"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 5}
                title="Zoom In"
              >
                <IconifyIcon icon="bx:plus" />
              </Button>
              <span className="text-white-50 d-flex align-items-center px-2">
                {Math.round(zoomLevel * 100)}%
              </span>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body className="p-0">
          <div 
            className="position-relative overflow-hidden"
            style={{ 
              height: '80vh',
              cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {transformedProperty.images && transformedProperty.images[currentImageIndex] ? (
              <div
                className="d-flex align-items-center justify-content-center h-100"
                style={{
                  transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
                  transformOrigin: 'center center',
                  transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                }}
              >
                <Image 
                  src={transformedProperty.images[currentImageIndex].url} 
                  alt={`${transformedProperty.title || 'Property'} - Image ${currentImageIndex + 1}`}
                  width={1200}
                  height={800}
                  className="img-fluid"
                  style={{ 
                    objectFit: 'contain',
                    maxWidth: '100%',
                    maxHeight: '100%',
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }}
                />
              </div>
            ) : (
              <div className="d-flex align-items-center justify-content-center h-100">
                <IconifyIcon icon="ri:image-line" className="fs-1 text-muted" />
              </div>
            )}
            
            {/* Navigation arrows */}
            {transformedProperty.images && transformedProperty.images.length > 1 && (
              <>
                <Button
                  variant="dark"
                  className="position-absolute top-50 start-0 translate-middle-y ms-3 bg-dark bg-opacity-75 border-0"
                  onClick={handlePreviousImage}
                  style={{ zIndex: 10 }}
                >
                  <IconifyIcon icon="bx:chevron-left" />
                </Button>
                <Button
                  variant="dark"
                  className="position-absolute top-50 end-0 translate-middle-y me-3 bg-dark bg-opacity-75 border-0"
                  onClick={handleNextImage}
                  style={{ zIndex: 10 }}
                >
                  <IconifyIcon icon="bx:chevron-right" />
                </Button>
              </>
            )}

            {/* Zoom indicator */}
            {zoomLevel > 1 && (
              <div className="position-absolute bottom-0 start-0 m-3">
                <span className="badge bg-dark bg-opacity-75 text-white px-2 py-1">
                  <IconifyIcon icon="bx:move" className="me-1" />
                  Drag to pan
                </span>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 text-white justify-content-center">
          <div className="d-flex flex-column align-items-center gap-3 w-100">
            {/* Thumbnail navigation */}
            <div className="d-flex gap-2">
              {transformedProperty.images && transformedProperty.images.map((image, index) => (
                <div 
                  key={index}
                  className={`position-relative cursor-pointer ${index === currentImageIndex ? 'border border-white' : ''}`}
                  onClick={() => setCurrentImageIndex(index)}
                  style={{ cursor: 'pointer' }}
                >
                  <Image 
                    src={image.url} 
                    alt={`Thumbnail ${index + 1}`}
                    width={60}
                    height={40}
                    className="img-fluid rounded"
                    style={{ objectFit: 'cover', height: '40px', width: '60px' }}
                  />
                  {index === currentImageIndex && (
                    <div className="position-absolute top-50 start-50 translate-middle">
                      <IconifyIcon icon="bx:check" className="text-white fs-5" />
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Keyboard shortcuts help */}
            <div className="text-center">
              <small className="text-white-50">
                <strong>Keyboard Shortcuts:</strong> 
                <span className="ms-2">
                  <kbd className="bg-secondary">+</kbd> Zoom In • 
                  <kbd className="bg-secondary">-</kbd> Zoom Out • 
                  <kbd className="bg-secondary">0</kbd> Reset • 
                  <kbd className="bg-secondary">←→</kbd> Navigate • 
                  <kbd className="bg-secondary">ESC</kbd> Close
                </span>
              </small>
            </div>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PublicPropertyDetailsPage;
