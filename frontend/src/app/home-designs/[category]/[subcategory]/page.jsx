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
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PublicHeader from '@/components/layout/PublicHeader/page';

// Import card images for fallback
import cardImg from '@/assets/images/small/img-1.jpg';
import cardImg2 from '@/assets/images/small/img-2.jpg';
import cardImg3 from '@/assets/images/small/img-3.jpg';
import cardImg4 from '@/assets/images/small/img-4.jpg';
import cardImg5 from '@/assets/images/small/img-5.jpg';

const HomeDesignSubcategoryPage = ({ params }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBedrooms, setSelectedBedrooms] = useState('All');
  const [selectedBathrooms, setSelectedBathrooms] = useState('All');
  const [selectedDepth, setSelectedDepth] = useState('All');
  const [selectedGarages, setSelectedGarages] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const itemsPerPage = 6;

  // Get category and subcategory from URL params
  const category = params?.category || 'custom';
  const subcategory = params?.subcategory || 'architectural';

  // Subcategory configuration
  const subcategoryConfig = {
    'custom': {
      'architectural': {
        title: 'Architectural Design',
        description: 'Custom architectural home designs',
        breadcrumb: 'Home / Home Designs / Custom Homes / Architectural Design'
      },
      'sloping-lot': {
        title: 'Sloping Lot / Split Level Homes',
        description: 'Designs for sloping and challenging lots',
        breadcrumb: 'Home / Home Designs / Custom Homes / Sloping Lot Homes'
      },
      'uneven-lot': {
        title: 'Uneven Lot',
        description: 'Custom designs for uneven terrain',
        breadcrumb: 'Home / Home Designs / Custom Homes / Uneven Lot'
      },
      'knockdown-rebuild': {
        title: 'Knockdown Rebuild',
        description: 'Knockdown and rebuild projects',
        breadcrumb: 'Home / Home Designs / Custom Homes / Knockdown Rebuild'
      },
      'renovation': {
        title: 'Renovation',
        description: 'Home renovation and remodeling projects',
        breadcrumb: 'Home / Home Designs / Custom Homes / Renovation'
      },
      'rooming-house': {
        title: 'Rooming House',
        description: 'Rooming house and boarding house designs',
        breadcrumb: 'Home / Home Designs / Custom Homes / Rooming House'
      },
      'sustainable': {
        title: 'Sustainable Home',
        description: 'Eco-friendly and sustainable home designs',
        breadcrumb: 'Home / Home Designs / Custom Homes / Sustainable Home'
      }
    },
    'interior': {
      'studio-aspirations': {
        title: 'Studio/Aspirations',
        description: 'Studio and aspirational interior designs',
        breadcrumb: 'Home / Home Designs / Interior / Studio Aspirations'
      }
    },
    'multiunit': {
      'side-by-side': {
        title: 'Side By Side',
        description: 'Side by side multi-unit developments',
        breadcrumb: 'Home / Home Designs / Multiunit Development / Side By Side'
      },
      'back-to-back': {
        title: 'Back To Back',
        description: 'Back to back multi-unit developments',
        breadcrumb: 'Home / Home Designs / Multiunit Development / Back To Back'
      },
      'multi-units': {
        title: 'Multi Units',
        description: 'Multi-unit development projects',
        breadcrumb: 'Home / Home Designs / Multiunit Development / Multi Units'
      }
    },
    'commercial': {
      'apartments': {
        title: 'Apartments',
        description: 'Commercial apartment developments',
        breadcrumb: 'Home / Home Designs / Commercial Design / Apartments'
      },
      'warehouse': {
        title: 'Warehouse',
        description: 'Warehouse and industrial designs',
        breadcrumb: 'Home / Home Designs / Commercial Design / Warehouse'
      },
      'office': {
        title: 'Office',
        description: 'Office building and workspace designs',
        breadcrumb: 'Home / Home Designs / Commercial Design / Office'
      }
    }
  };

  const currentSubcategory = subcategoryConfig[category]?.[subcategory] || {
    title: 'Custom Design',
    description: 'Custom home design solutions',
    breadcrumb: 'Home / Home Designs / Custom'
  };

  // Fetch properties from backend
  useEffect(() => {
    fetchProperties();
  }, [category, subcategory]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/properties?category=${category}&subcategory=${subcategory}&limit=50`);
      const data = await response.json();
      
      if (data.success) {
        setProperties(data.data.properties || []);
      } else {
        setError('Failed to fetch properties');
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError('Failed to fetch properties');
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

  // Get unique values for filters
  const bedrooms = ['All', ...new Set(properties.map(item => item.features?.bedrooms).filter(Boolean))];
  const bathrooms = ['All', ...new Set(properties.map(item => item.features?.bathrooms).filter(Boolean))];
  const depths = ['All', ...new Set(properties.map(item => item.features?.floors).filter(Boolean))];
  const garages = ['All', ...new Set(properties.map(item => item.features?.parking).filter(Boolean))];

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = properties
      .map(transformPropertyData)
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesBedrooms = selectedBedrooms === 'All' || item.bedrooms.toString() === selectedBedrooms;
        const matchesBathrooms = selectedBathrooms === 'All' || item.bathrooms.toString() === selectedBathrooms;
        const matchesDepth = selectedDepth === 'All' || item.depth.includes(selectedDepth);
        const matchesGarages = selectedGarages === 'All' || item.garages.toString() === selectedGarages;
        
        return matchesSearch && matchesBedrooms && matchesBathrooms && matchesDepth && matchesGarages;
      });

    // Sort data
    switch (sortBy) {
      case 'Price Low to High':
        filtered.sort((a, b) => {
          const priceA = a.price === 'Price on request' ? 0 : parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = b.price === 'Price on request' ? 0 : parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceA - priceB;
        });
        break;
      case 'Price High to Low':
        filtered.sort((a, b) => {
          const priceA = a.price === 'Price on request' ? 0 : parseInt(a.price.replace(/[^0-9]/g, ''));
          const priceB = b.price === 'Price on request' ? 0 : parseInt(b.price.replace(/[^0-9]/g, ''));
          return priceB - priceA;
        });
        break;
      case 'Rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'Newest':
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      default:
        // Relevance - keep original order
        break;
    }

    return filtered;
  }, [properties, searchTerm, selectedBedrooms, selectedBathrooms, selectedDepth, selectedGarages, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedBedrooms('All');
    setSelectedBathrooms('All');
    setSelectedDepth('All');
    setSelectedGarages('All');
    setSortBy('Relevance');
    setCurrentPage(1);
  };

  const SearchCard = ({ item }) => (
    <Card className="h-100 shadow-sm hover-shadow">
      <div className="position-relative">
        <Image 
          src={item.image} 
          className="card-img-top" 
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
        <Badge 
          bg="primary" 
          className="position-absolute top-0 start-0 m-2"
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
          <Button variant="outline-primary" size="sm" className="w-100">
            View Details
          </Button>
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
            
            <Button variant="outline-primary" size="sm">
              View Details
            </Button>
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
              <h2 className="mb-1">{currentSubcategory.title}</h2>
              <p className="text-muted">{currentSubcategory.description}</p>
            </Col>
          </Row>
          <div className="text-center py-5">
            <Spinner animation="border" role="status">
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
              <h2 className="mb-1">{currentSubcategory.title}</h2>
              <p className="text-muted">{currentSubcategory.description}</p>
            </Col>
          </Row>
          <Card>
            <CardBody className="text-center py-5">
              <IconifyIcon icon="ri:error-warning-line" className="text-danger" style={{ fontSize: '3rem' }} />
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
            <h2 className="mb-1">{currentSubcategory.title}</h2>
            <p className="text-muted">{currentSubcategory.description}</p>
            <small className="text-muted">{currentSubcategory.breadcrumb}</small>
          </Col>
        </Row>
        
        {/* Search Header */}
        <Card className="mb-4">
          <CardBody>
            <Row className="g-3">
              <Col md={4}>
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
                  value={selectedBedrooms}
                  onChange={(e) => setSelectedBedrooms(e.target.value)}
                >
                  {bedrooms.map(bedroom => (
                    <option key={bedroom} value={bedroom}>
                      {bedroom === 'All' ? 'All Bedrooms' : `${bedroom} Bedrooms`}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={selectedBathrooms}
                  onChange={(e) => setSelectedBathrooms(e.target.value)}
                >
                  {bathrooms.map(bathroom => (
                    <option key={bathroom} value={bathroom}>
                      {bathroom === 'All' ? 'All Bathrooms' : `${bathroom} Bathrooms`}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <Form.Select
                  value={selectedDepth}
                  onChange={(e) => setSelectedDepth(e.target.value)}
                >
                  {depths.map(depth => (
                    <option key={depth} value={depth}>
                      {depth === 'All' ? 'All Depths' : `${depth} Floor${depth > 1 ? 's' : ''}`}
                    </option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={2}>
                <div className="d-flex gap-2">
                  <Button variant="primary" className="flex-grow-1">
                    <IconifyIcon icon="ri:search-line" className="me-1" />
                    Search
                  </Button>
                  <Button variant="outline-secondary" onClick={resetFilters}>
                    Reset
                  </Button>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>

        {/* Filters and Results Header */}
        <Row className="mb-4">
          <Col md={8}>
            <div className="d-flex align-items-center gap-3">
              <span className="text-muted">
                {filteredData.length} properties found
              </span>
              <div className="d-flex gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <IconifyIcon icon="ri:grid-line" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'outline-primary'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <IconifyIcon icon="ri:list-check" />
                </Button>
              </div>
            </div>
          </Col>
          <Col md={4} className="text-end">
            <Dropdown>
              <DropdownToggle variant="outline-secondary" size="sm">
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
                  <Pagination className="justify-content-center">
                    <Pagination.Prev 
                      disabled={currentPage === 1}
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </Pagination.Prev>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Pagination.Item 
                        key={page} 
                        active={page === currentPage}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Pagination.Item>
                    ))}
                    
                    <Pagination.Next 
                      disabled={currentPage === totalPages}
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </Pagination.Next>
                  </Pagination>
                </Col>
              </Row>
            )}
          </>
        ) : (
          <Card>
            <CardBody className="text-center py-5">
              <IconifyIcon icon="ri:search-line" className="text-muted" style={{ fontSize: '3rem' }} />
              <h5 className="mt-3">No properties found</h5>
              <p className="text-muted">
                Try adjusting your search criteria or filters to find more properties.
              </p>
              <Button 
                variant="outline-primary" 
                onClick={resetFilters}
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

export default HomeDesignSubcategoryPage;
