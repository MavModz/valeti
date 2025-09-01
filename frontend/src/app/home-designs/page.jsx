'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Card, 
  CardBody, 
  CardTitle, 
  Row, 
  Col, 
  Form, 
  InputGroup, 
  Button, 
  Badge,
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Pagination,
  Container,
  Spinner
} from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PublicHeader from '@/components/layout/PublicHeader/page';
import { generatePropertyUrl } from '@/utils/seo';
import styles from './page.module.css';

// Import card images for fallback
import cardImg from '@/assets/images/small/img-1.jpg';
import cardImg2 from '@/assets/images/small/img-2.jpg';
import cardImg3 from '@/assets/images/small/img-3.jpg';
import cardImg4 from '@/assets/images/small/img-4.jpg';
import cardImg5 from '@/assets/images/small/img-5.jpg';

const HomeDesignsPage = () => {
  const searchParams = useSearchParams();
  const category = searchParams.get('category') || 'All';
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  // Fetch properties from backend
  useEffect(() => {
    fetchProperties();
  }, [category]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      
      // Build query parameters
      const params = new URLSearchParams();
      params.append('limit', '100');
      if (category && category !== 'All') {
        params.append('category', category);
      }
      
      console.log('🔍 Fetching properties from:', `${backendUrl}/api/properties?${params.toString()}`);
      
      const response = await fetch(`${backendUrl}/api/properties?${params.toString()}`);
      console.log('📡 Response status:', response.status);
      
      const data = await response.json();
      console.log('📋 Response data:', data);
      
      if (data.success) {
        console.log('✅ Properties fetched successfully:', data.data.properties?.length || 0, 'properties');
        setProperties(data.data.properties || []);
      } else {
        console.error('❌ API returned error:', data.message);
        setError(`Failed to fetch properties: ${data.message}`);
      }
    } catch (err) {
      console.error('❌ Error fetching properties:', err);
      setError(`Failed to fetch properties: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Transform backend data to match frontend format
  const transformPropertyData = (property) => {
    const fallbackImages = [cardImg, cardImg2, cardImg3, cardImg4, cardImg5];
    const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    
    return {
      id: property._id,
      title: property.title,
      category: property.category || 'Property',
      location: property.location?.city || 'Location not specified',
      price: property.price ? `$${property.price.toLocaleString()}` : 'Price on request',
      bedrooms: property.features?.bedrooms || 0,
      bathrooms: property.features?.bathrooms || 0,
      garages: property.features?.parking || 0,
      area: property.features?.area ? `${property.features.area} sq ft` : 'Area not specified',
      depth: property.features?.floors ? `${property.features.floors} floor${property.features.floors > 1 ? 's' : ''}` : 'Floor info not available',
      image: property.images && property.images.length > 0 ? property.images[0].url : randomImage,
      description: property.description || 'No description available',
      features: property.amenities || ['Basic amenities'],
      rating: 4.5, // Default rating since backend doesn't have this
      reviews: Math.floor(Math.random() * 50) + 10, // Random reviews for demo
      status: property.status || 'Available',
      propertyFor: property.propertyFor || 'Not specified'
    };
  };

  // Get unique locations for filters
  const locations = ['All', ...new Set(properties.map(item => item.location?.city || item.location).filter(Boolean))];

  // Filter and sort data
  const filteredData = useMemo(() => {
    console.log('🔍 Filtering properties with:', {
      searchTerm,
      category,
      selectedLocation,
      totalProperties: properties.length
    });
    
    let filtered = properties
      .map(transformPropertyData)
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesLocation = selectedLocation === 'All' || item.location === selectedLocation;
        
        return matchesSearch && matchesLocation;
      });
    
    console.log('✅ Filtered data result:', filtered.length, 'properties');
    
    // Reset to first page when filters change
    if (currentPage > 1 && filtered.length > 0) {
      setCurrentPage(1);
    }
    
    return filtered;
  }, [properties, searchTerm, category, selectedLocation, currentPage]);

  // Sort data
  const sortedData = useMemo(() => {
    let sorted = [...filteredData];
    
    switch (sortBy) {
      case 'Price Low to High':
        sorted.sort((a, b) => {
          const priceA = a.price === 'Price on request' ? 0 : parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = b.price === 'Price on request' ? 0 : parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceA - priceB;
        });
        break;
      case 'Price High to Low':
        sorted.sort((a, b) => {
          const priceA = a.price === 'Price on request' ? 0 : parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = b.price === 'Price on request' ? 0 : parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceB - priceA;
        });
        break;
      case 'Rating':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'Newest':
        sorted.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        // Relevance - keep original order
        break;
    }
    
    return sorted;
  }, [filteredData, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const currentData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  
  console.log('📄 Pagination info:', {
    totalProperties: sortedData.length,
    itemsPerPage,
    totalPages,
    currentPage,
    currentDataLength: currentData.length,
    startIndex: (currentPage - 1) * itemsPerPage,
    endIndex: currentPage * itemsPerPage
  });

  const handlePageChange = (page) => {
    setCurrentPage(page);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLocation]);

  // Update URL when page changes
  useEffect(() => {
    const url = new URL(window.location);
    if (currentPage > 1) {
      url.searchParams.set('page', currentPage);
    } else {
      url.searchParams.delete('page');
    }
    window.history.replaceState({}, '', url);
  }, [currentPage]);

  // Read page from URL on initial load
  useEffect(() => {
    const url = new URL(window.location);
    const pageFromUrl = parseInt(url.searchParams.get('page'));
    if (pageFromUrl && pageFromUrl > 0) {
      setCurrentPage(pageFromUrl);
    }
  }, []);

  const SearchCard = ({ item }) => (
    <Card className={`h-100 shadow-sm ${styles.hoverShadow}`}>
      <div className="position-relative">
        <Image 
          src={item.image} 
          className={`card-img-top ${styles.cardImage}`}
          width={400}
          height={200} 
          alt={item.title}
        />
        <Badge 
          bg="success" 
          className={`position-absolute top-0 end-0 m-2 ${styles.statusBadge}`}
        >
          {item.status}
        </Badge>
        <Badge 
          bg="primary" 
          className={`position-absolute top-0 start-0 m-2 ${styles.categoryBadge}`}
        >
          {item.category}
        </Badge>
      </div>
      <CardBody className="d-flex flex-column">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <CardTitle as="h6" className="mb-0 flex-grow-1">
            {item.title}
          </CardTitle>
          <div className="text-end">
            <div className="fw-bold text-primary">{item.price}</div>
            <small className="text-muted">{item.area}</small>
          </div>
        </div>
        
        <div className="mb-2">
          <IconifyIcon icon="ri:map-pin-line" className="text-muted me-1" />
          <small className="text-muted">{item.location}</small>
        </div>
        
        <p className="card-text small text-muted mb-3 flex-grow-1">
          {item.description}
        </p>
        
        <div className="mb-3">
          <div className="d-flex justify-content-between mb-2">
            <small className="text-muted">
              <IconifyIcon icon="ri:bed-line" className="me-1" />
              {item.bedrooms} beds
            </small>
            <small className="text-muted">
              <IconifyIcon icon="ri:shower-line" className="me-1" />
              {item.bathrooms} baths
            </small>
            <small className="text-muted">
              <IconifyIcon icon="ri:car-line" className="me-1" />
              {item.garages} garage{item.garages !== 1 ? 's' : ''}
            </small>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              <IconifyIcon icon="ri:building-line" className="me-1" />
              {item.depth}
            </small>
            <div className="d-flex align-items-center">
              <IconifyIcon icon="ri:star-fill" className="text-warning me-1" />
              <small className="text-muted">{item.rating} ({item.reviews})</small>
            </div>
          </div>
        </div>
        
        <div className="mb-3">
          {item.features.slice(0, 3).map((feature, idx) => (
            <Badge key={idx} bg="light" text="dark" className="me-1 mb-1">
              {feature}
            </Badge>
          ))}
          {item.features.length > 3 && (
            <Badge bg="light" text="dark">
              +{item.features.length - 3} more
            </Badge>
          )}
        </div>
        
        <div className="mt-auto">
          <Link href={generatePropertyUrl(item.id, item.title)}>
            <Button variant="outline-primary" size="sm" className="w-100">
              View Details
            </Button>
          </Link>
        </div>
      </CardBody>
    </Card>
  );

  const SearchCardList = ({ item }) => (
    <Card className="mb-3 shadow-sm">
      <Row className="g-0">
        <Col md={4}>
          <div className="position-relative">
            <Image 
              src={item.image} 
              className="img-fluid rounded-start h-100" 
              width={400}
              height={200}
              alt={item.title}
              style={{ objectFit: 'cover' }}
            />
            <Badge 
              bg="success" 
              className="position-absolute top-0 end-0 m-2"
            >
              {item.status}
            </Badge>
          </div>
        </Col>
        <Col md={8}>
          <CardBody>
            <div className="d-flex justify-content-between align-items-start mb-2">
              <div className="flex-grow-1">
                <CardTitle as="h6" className="mb-1">
                  {item.title}
                </CardTitle>
                <div className="mb-2">
                  <IconifyIcon icon="ri:map-pin-line" className="text-muted me-1" />
                  <small className="text-muted">{item.location}</small>
                  <Badge bg="primary" className="ms-2">{item.category}</Badge>
                </div>
              </div>
              <div className="text-end">
                <div className="fw-bold text-primary">{item.price}</div>
                <small className="text-muted">{item.area}</small>
              </div>
            </div>
            
            <p className="card-text small text-muted mb-3">
              {item.description}
            </p>
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div className="d-flex gap-3">
                <small className="text-muted">
                  <IconifyIcon icon="ri:bed-line" className="me-1" />
                  {item.bedrooms} beds
                </small>
                <small className="text-muted">
                  <IconifyIcon icon="ri:shower-line" className="me-1" />
                  {item.bathrooms} baths
                </small>
                <small className="text-muted">
                  <IconifyIcon icon="ri:car-line" className="me-1" />
                  {item.garages} garage{item.garages !== 1 ? 's' : ''}
                </small>
                <small className="text-muted">
                  <IconifyIcon icon="ri:building-line" className="me-1" />
                  {item.depth}
                </small>
              </div>
              <div className="d-flex align-items-center">
                <IconifyIcon icon="ri:star-fill" className="text-warning me-1" />
                <small className="text-muted">{item.rating} ({item.reviews})</small>
              </div>
            </div>
            
            <div className="mb-3">
              {item.features.slice(0, 4).map((feature, idx) => (
                <Badge key={idx} bg="light" text="dark" className="me-1">
                  {feature}
                </Badge>
              ))}
              {item.features.length > 4 && (
                <Badge bg="light" text="dark">
                  +{item.features.length - 4} more
                </Badge>
              )}
            </div>
            
            <Link href={generatePropertyUrl(item.id, item.title)}>
              <Button variant="outline-primary" size="sm">
                View Details
              </Button>
            </Link>
          </CardBody>
        </Col>
      </Row>
    </Card>
  );

  if (loading) {
    return (
      <>
        <PublicHeader />
        <Container fluid>
          <Row className="mb-4">
            <Col>
              <h2 className="mb-1">
                {category === 'All' ? 'All Home Designs' : `${category} Home Designs`}
              </h2>
              <p className="text-muted">Discover our collection of beautiful home designs</p>
            </Col>
          </Row>
          <div className="text-center py-5">
            <Spinner animation="border" role="status" className={styles.loadingSpinner}>
              <span className="visually-hidden">Loading...</span>
            </Spinner>
            <p className="mt-3">Loading properties...</p>
          </div>
        </Container>
      </>
    );
  }

  if (error) {
    return (
      <>
        <PublicHeader />
        <Container fluid>
          <Row className="mb-4">
            <Col>
              <h2 className="mb-1">
                {category === 'All' ? 'All Home Designs' : `${category} Home Designs`}
              </h2>
              <p className="text-muted">Discover our collection of beautiful home designs</p>
            </Col>
          </Row>
          <Card>
            <CardBody className="text-center py-5">
              <IconifyIcon icon="ri:error-warning-line" className={styles.errorIcon} style={{ fontSize: '3rem' }} />
              <h5 className="mt-3">Error loading properties</h5>
              <p className="text-muted">{error}</p>
              <Button variant="primary" onClick={fetchProperties}>
                Try Again
              </Button>
            </CardBody>
          </Card>
        </Container>
      </>
    );
  }

  return (
    <>
      <PublicHeader />

      <Container fluid>
        {/* Page Title */}
        <Row className="mb-4">
          <Col>
            <h2 className="mb-1">
              {category === 'All' ? 'All Home Designs' : `${category} Home Designs`}
            </h2>
            <p className="text-muted">Discover our collection of beautiful home designs</p>
          </Col>
        </Row>
        
        {/* Search Header */}
        <Card className={`mb-4 ${styles.searchHeader}`}>
          <CardBody>
            <Row className="g-3">
              <Col md={8}>
                <InputGroup>
                  <InputGroup.Text>
                    <IconifyIcon icon="ri:search-line" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search properties, locations, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                >
                  {locations.map(location => (
                    <option key={location} value={location}>{location}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Button variant="primary" className="w-100">
                  <IconifyIcon icon="ri:search-line" className="me-1" />
                  Search
                </Button>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Filters and Results Header */}
        <Row className="mb-4">
          <Col md={8}>
            <div className="d-flex align-items-center gap-3">
              <span className={`text-muted ${styles.paginationInfo}`}>
                {sortedData.length} properties found
                {totalPages > 1 && (
                  <span className="ms-2">
                    (Page {currentPage} of {totalPages})
                  </span>
                )}
              </span>
              <div className="d-flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                  size="sm"
                  className={styles.viewToggleButton}
                  onClick={() => setViewMode('grid')}
                >
                  <IconifyIcon icon="ri:grid-line" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                  size="sm"
                  className={styles.viewToggleButton}
                  onClick={() => setViewMode('list')}
                >
                  <IconifyIcon icon="ri:list-check" />
                </Button>
              </div>
            </div>
          </Col>
          <Col md={4} className="text-end">
            <Dropdown>
              <DropdownToggle variant="outline-secondary" size="sm" className={styles.sortDropdown}>
                Sort by: {sortBy}
              </DropdownToggle>
              <DropdownMenu>
                <DropdownItem onClick={() => setSortBy('Relevance')}>Relevance</DropdownItem>
                <DropdownItem onClick={() => setSortBy('Price Low to High')}>Price Low to High</DropdownItem>
                <DropdownItem onClick={() => setSortBy('Price High to Low')}>Price High to Low</DropdownItem>
                <DropdownItem onClick={() => setSortBy('Rating')}>Rating</DropdownItem>
                <DropdownItem onClick={() => setSortBy('Newest')}>Newest</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </Col>
        </Row>

        {/* Search Results */}
        {currentData.length > 0 ? (
          <>
            {viewMode === 'grid' ? (
              <Row className="g-4 mb-4">
                {currentData.map(item => (
                  <Col key={item.id} lg={3} md={6}>
                    <SearchCard item={item} />
                  </Col>
                ))}
              </Row>
            ) : (
              <div className="mb-4">
                {currentData.map(item => (
                  <SearchCardList key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Row>
                <Col>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, sortedData.length)} of {sortedData.length} properties
                    </small>
                    <Pagination className="mb-0">
                      <Pagination.Prev 
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Previous
                      </Pagination.Prev>
                      
                      {/* Show first page */}
                      {currentPage > 3 && (
                        <>
                          <Pagination.Item onClick={() => handlePageChange(1)}>
                            1
                          </Pagination.Item>
                          {currentPage > 4 && <Pagination.Ellipsis />}
                        </>
                      )}
                      
                      {/* Show pages around current page */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => page >= Math.max(1, currentPage - 2) && page <= Math.min(totalPages, currentPage + 2))
                        .map(page => (
                          <Pagination.Item 
                            key={page} 
                            active={page === currentPage}
                            onClick={() => handlePageChange(page)}
                          >
                            {page}
                          </Pagination.Item>
                        ))}
                      
                      {/* Show last page */}
                      {currentPage < totalPages - 2 && (
                        <>
                          {currentPage < totalPages - 3 && <Pagination.Ellipsis />}
                          <Pagination.Item onClick={() => handlePageChange(totalPages)}>
                            {totalPages}
                          </Pagination.Item>
                        </>
                      )}
                      
                      <Pagination.Next 
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Next
                      </Pagination.Next>
                    </Pagination>
                  </div>
                </Col>
              </Row>
            )}
          </>
        ) : (
          <Card>
            <CardBody className="text-center py-5">
              <IconifyIcon icon="ri:search-line" className={styles.searchIcon} style={{ fontSize: '3rem' }} />
              <h5 className="mt-3">No properties found</h5>
              <p className="text-muted">
                Try adjusting your search criteria or filters to find more properties.
              </p>
              <Button 
                variant="outline-primary" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLocation('All');
                }}
              >
                Clear Filters
              </Button>
            </CardBody>
          </Card>
        )}
      </Container>
    </>
  );
};

export default HomeDesignsPage;
