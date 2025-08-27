'use client';

import React, { useState, useMemo } from 'react';
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
  Container
} from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import PublicHeader from '@/components/layout/PublicHeader/page';

// Import card images
import cardImg from '@/assets/images/small/img-1.jpg';
import cardImg2 from '@/assets/images/small/img-2.jpg';
import cardImg3 from '@/assets/images/small/img-3.jpg';
import cardImg4 from '@/assets/images/small/img-4.jpg';
import cardImg5 from '@/assets/images/small/img-5.jpg';

// Sample search data
const searchData = [
  {
    id: 1,
    title: 'Modern Apartment in Downtown',
    category: 'Apartment',
    location: 'Downtown',
    price: '$2,500/month',
    bedrooms: 2,
    bathrooms: 2,
    garages: 1,
    area: '1,200 sq ft',
    depth: '2 floors',
    image: cardImg,
    description: 'Beautiful modern apartment with stunning city views. Recently renovated with high-end finishes.',
    features: ['Balcony', 'Gym', 'Pool', 'Parking'],
    rating: 4.5,
    reviews: 28,
    status: 'Available'
  },
  {
    id: 2,
    title: 'Luxury Villa with Ocean View',
    category: 'Villa',
    location: 'Beachfront',
    price: '$5,200/month',
    bedrooms: 4,
    bathrooms: 3,
    garages: 2,
    area: '2,800 sq ft',
    depth: '3 floors',
    image: cardImg2,
    description: 'Stunning luxury villa with panoramic ocean views. Private pool and beach access included.',
    features: ['Ocean View', 'Private Pool', 'Beach Access', 'Garden'],
    rating: 4.8,
    reviews: 45,
    status: 'Available'
  },
  {
    id: 3,
    title: 'Cozy Studio in Arts District',
    category: 'Studio',
    location: 'Arts District',
    price: '$1,800/month',
    bedrooms: 1,
    bathrooms: 1,
    garages: 0,
    area: '650 sq ft',
    depth: '1 floor',
    image: cardImg3,
    description: 'Perfect studio apartment in the vibrant arts district. Walking distance to galleries and cafes.',
    features: ['Arts District', 'Walkable', 'Modern Kitchen', 'Storage'],
    rating: 4.2,
    reviews: 32,
    status: 'Available'
  },
  {
    id: 4,
    title: 'Family Home in Suburbs',
    category: 'House',
    location: 'Suburbs',
    price: '$3,800/month',
    bedrooms: 3,
    bathrooms: 2,
    garages: 2,
    area: '1,800 sq ft',
    depth: '2 floors',
    image: cardImg4,
    description: 'Spacious family home in quiet suburban neighborhood. Large backyard and excellent schools nearby.',
    features: ['Backyard', 'Garage', 'Good Schools', 'Quiet Area'],
    rating: 4.6,
    reviews: 38,
    status: 'Available'
  },
  {
    id: 5,
    title: 'Penthouse with City Views',
    category: 'Penthouse',
    location: 'City Center',
    price: '$8,500/month',
    bedrooms: 3,
    bathrooms: 3,
    garages: 1,
    area: '3,200 sq ft',
    depth: '2 floors',
    image: cardImg5,
    description: 'Exclusive penthouse with breathtaking city skyline views. Luxury amenities and 24/7 concierge.',
    features: ['City Views', 'Concierge', 'Rooftop Terrace', 'Luxury'],
    rating: 4.9,
    reviews: 52,
    status: 'Available'
  },
  {
    id: 6,
    title: 'Loft in Industrial District',
    category: 'Loft',
    location: 'Industrial District',
    price: '$2,200/month',
    bedrooms: 2,
    bathrooms: 1,
    garages: 1,
    area: '1,100 sq ft',
    depth: '1 floor',
    image: cardImg,
    description: 'Converted industrial loft with high ceilings and exposed brick. Perfect for artists and creatives.',
    features: ['High Ceilings', 'Exposed Brick', 'Industrial Style', 'Creative Space'],
    rating: 4.3,
    reviews: 25,
    status: 'Available'
  }
];

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [priceRange, setPriceRange] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Get unique categories and locations for filters
  const categories = ['All', ...new Set(searchData.map(item => item.category))];
  const locations = ['All', ...new Set(searchData.map(item => item.location))];

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = searchData.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.location.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
      const matchesLocation = selectedLocation === 'All' || item.location === selectedLocation;
      
      return matchesSearch && matchesCategory && matchesLocation;
    });

    // Sort data
    switch (sortBy) {
      case 'Price Low to High':
        filtered.sort((a, b) => parseInt(a.price.replace(/[^0-9]/g, '')) - parseInt(b.price.replace(/[^0-9]/g, '')));
        break;
      case 'Price High to Low':
        filtered.sort((a, b) => parseInt(b.price.replace(/[^0-9]/g, '')) - parseInt(a.price.replace(/[^0-9]/g, '')));
        break;
      case 'Rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'Newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        // Relevance - keep original order
        break;
    }

    return filtered;
  }, [searchTerm, selectedCategory, selectedLocation, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const SearchCard = ({ item }) => (
    <Card className="h-100 shadow-sm hover-shadow">
      <div className="position-relative">
        <Image 
          src={item.image} 
          className="card-img-top" 
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

  return (
    <>
      <PublicHeader />

      <Container fluid>
        {/* Page Title */}
        <Row className="mb-4">
          <Col>
            <h2 className="mb-1">Property Search</h2>
            <p className="text-muted">Find your perfect property from our extensive collection</p>
          </Col>
        </Row>
        
        {/* Search Header */}
        <Card className="mb-4">
          <CardBody>
            <Row className="g-3">
              <Col md={6}>
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
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </Form.Select>
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
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
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

export default SearchPage;
