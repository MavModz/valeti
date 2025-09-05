'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState, useMemo } from 'react';
// import logoDark from '@/assets/images/logo-dark.png';
import logoDark from '@/assets/images/valeti-logo-white.png';
import p1 from '@/assets/images/properties/p-1.jpg';
import p2 from '@/assets/images/properties/p-2.jpg';
import p3 from '@/assets/images/properties/p-3.jpg';
import p4 from '@/assets/images/properties/p-4.jpg';
import p13 from '@/assets/images/properties/p-13.jpg';
import { getFeaturedProperties } from '@/app/lib/Services/api';
import { generatePropertyUrl } from '@/utils/seo';
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
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import styles from './page.module.css';

// Import card images for fallback
import cardImg from '@/assets/images/small/img-1.jpg';
import cardImg2 from '@/assets/images/small/img-2.jpg';
import cardImg3 from '@/assets/images/small/img-3.jpg';
import cardImg4 from '@/assets/images/small/img-4.jpg';
import cardImg5 from '@/assets/images/small/img-5.jpg';

export default function HomePage() {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search functionality state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedBeds, setSelectedBeds] = useState('All');
  const [selectedBaths, setSelectedBaths] = useState('All');
  const [selectedGarages, setSelectedGarages] = useState('All');
  const [selectedTheater, setSelectedTheater] = useState('All');
  const [selectedLotSize, setSelectedLotSize] = useState('All');
  const [sortBy, setSortBy] = useState('Relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const itemsPerPage = 6; // Show fewer items on home page

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set(prev).add(entry.target.id));
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const sections = document.querySelectorAll('.section-transition');
    sections.forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Fetch featured properties
  useEffect(() => {
    const fetchFeaturedProperties = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getFeaturedProperties(3);
        const properties = response.data?.properties || response.properties || [];
        
        setFeaturedProperties(properties);
        
      } catch (err) {
        console.error('Error fetching featured properties:', err);
        setError(`Failed to load featured properties: ${err.message || 'Unknown error'}`);
        
        // For development, show some sample data if API fails
        if (process.env.NODE_ENV === 'development') {
          setFeaturedProperties([
            {
              _id: '1',
              title: 'A20S24',
              category: 'SINGLE STOREY',
              features: {
                bedrooms: 2,
                bathrooms: 2,
                area: 1270,
                areaUnit: 'm²'
              },
              images: [{ url: p2, isPrimary: true }]
            },
            {
              _id: '2',
              title: 'A20S24',
              category: 'SINGLE STOREY',
              features: {
                bedrooms: 3,
                bathrooms: 2,
                area: 1450,
                areaUnit: 'm²'
              },
              images: [{ url: p3, isPrimary: true }]
            },
            {
              _id: '3',
              title: 'A22S24',
              category: 'SINGLE STOREY',
              features: {
                bedrooms: 4,
                bathrooms: 3,
                area: 1850,
                areaUnit: 'm²'
              },
              images: [{ url: p4, isPrimary: true }]
            }
          ]);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProperties();
    fetchAllProperties();
  }, []);

  // Fetch all properties for search
  const fetchAllProperties = async () => {
    try {
      setSearchLoading(true);
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/properties?limit=100`);
      const data = await response.json();
      
      if (data.success) {
        setProperties(data.data.properties || []);
      } else {
        setSearchError(`Failed to fetch properties: ${data.message}`);
      }
    } catch (err) {
      console.error('Error fetching properties:', err);
      setSearchError(`Failed to fetch properties: ${err.message}`);
    } finally {
      setSearchLoading(false);
    }
  };

  // Transform backend data to match frontend format
  const transformPropertyData = (property) => {
    const fallbackImages = [cardImg, cardImg2, cardImg3, cardImg4, cardImg5];
    const randomImage = fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
    
    // Generate lot size based on category or random
    const lotSizes = ['8 meter', '10 meter', '12 meter', '13 meter', '14 meter', '16 meter', '17.5 meter', '18 meter', 'uneven'];
    const lotSize = property.features?.lotSize || lotSizes[Math.floor(Math.random() * lotSizes.length)];
    
    return {
      id: property._id,
      title: property.title,
      category: property.category || 'Property',
      location: property.location?.city || 'Location not specified',
      price: property.price ? `$${property.price.toLocaleString()}` : 'Price on request',
      bedrooms: property.features?.bedrooms || 0,
      bathrooms: property.features?.bathrooms || 0,
      garages: property.features?.garages || 0,
      theater: property.features?.theater || 0,
      area: property.features?.area ? `${property.features.area} sq ft` : 'Area not specified',
      depth: property.features?.floors ? `${property.features.floors} floor${property.features.floors > 1 ? 's' : ''}` : 'Floor info not available',
      lotSize: lotSize,
      image: property.images && property.images.length > 0 ? property.images[0].url : randomImage,
      description: property.description || 'No description available',
      features: property.amenities || ['Basic amenities'],
      rating: 4.5,
      reviews: Math.floor(Math.random() * 50) + 10,
      status: property.status || 'Available',
      propertyFor: property.propertyFor || 'Not specified'
    };
  };

  // Get unique categories and locations for filters
  const categories = ['All', ...new Set(properties.map(item => item.category).filter(Boolean))];
  const locations = ['All', ...new Set(properties.map(item => {
    if (item.location?.city) return item.location.city;
    if (item.location?.country) return item.location.country;
    return 'Unknown';
  }).filter(Boolean))];

  // Filter and sort data
  const filteredData = useMemo(() => {
    let filtered = properties
      .map(transformPropertyData)
      .filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             item.location.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        const matchesLocation = selectedLocation === 'All' || item.location === selectedLocation;
        const matchesBeds = selectedBeds === 'All' || item.bedrooms.toString() === selectedBeds;
        const matchesBaths = selectedBaths === 'All' || item.bathrooms.toString() === selectedBaths;
        const matchesGarages = selectedGarages === 'All' || item.garages.toString() === selectedGarages;
        const matchesTheater = selectedTheater === 'All' || item.theater.toString() === selectedTheater;
        const matchesLotSize = selectedLotSize === 'All' || item.lotSize.toLowerCase() === selectedLotSize.toLowerCase();
        
        return matchesSearch && matchesCategory && matchesLocation && matchesBeds && matchesBaths && matchesGarages && matchesTheater && matchesLotSize;
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
        break;
    }

    return filtered;
  }, [properties, searchTerm, selectedCategory, selectedLocation, selectedBeds, selectedBaths, selectedGarages, selectedTheater, selectedLotSize, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Get primary image URL for a property
  const getPrimaryImage = (property) => {
    if (property?.images && property.images.length > 0) {
      const primaryImage = property.images.find(img => img.isPrimary);
      const imageUrl = primaryImage ? primaryImage.url : property.images[0].url;
      
      // Check if the image URL is a full URL or relative path
      if (imageUrl && (imageUrl.startsWith('http') || imageUrl.startsWith('https'))) {
        return imageUrl;
      } else if (imageUrl && imageUrl.startsWith('/')) {
        // If it's a relative path, we'll use fallback for now
        return p2; // Fallback to local image
      }
    }
    // Fallback to property images if no images array
    return p2; // Default fallback image
  };

  // Format area with unit
  const formatArea = (area, unit = 'm²') => {
    if (!area) return 'N/A';
    return `${area.toLocaleString()} ${unit}`;
  };

  // Search Card Component
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
              <IconifyIcon icon="bx:bed" className="me-1" />
              {item.bedrooms} beds
            </small>
            <small className="text-muted">
              <IconifyIcon icon="bx:shower" className="me-1" />
              {item.bathrooms} baths
            </small>
            <small className="text-muted">
              <IconifyIcon icon="ri:car-line" className="me-1" />
              {item.garages} garage{item.garages !== 1 ? 's' : ''}
            </small>
            <small className="text-muted">
              <IconifyIcon icon="ri:tv-line" className="me-1" />
              {item.theater} theater{item.theater !== 1 ? 's' : ''}
            </small>
          </div>
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              <IconifyIcon icon="ri:building-line" className="me-1" />
              {item.depth}
            </small>
            <small className="text-muted">
              <IconifyIcon icon="ri:ruler-line" className="me-1" />
              {item.lotSize}
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

  return (
    <div className="min-vh-100">
      {/* Hero Section - Static */}
      <section className={`${styles['hero-section']} position-relative`}>
        <div className={styles['hero-image-container']}>
          <Image 
            src={p13} 
            alt="Luxury Property" 
            fill 
            className={styles['hero-image']}
            sizes="100vw"
            priority
            quality={90}
          />
        </div>
        <div className={`${styles['hero-overlay']} position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center`}>
          <div className={`${styles['hero-content']} text-center text-white`}>
            <div className="mb-4">
              <Image 
                alt="Logo" 
                width={300} 
                height={150} 
                src={logoDark} 
                className="mx-auto mb-3"
                style={{ filter: 'brightness(0) invert(1)' }}
                priority
              />
            </div>
            <h1 className={`display-2 fw-bold mb-3 ${styles['text-shadow']}`}>
              Innovative Designs,<br />
              Quality Construction.
            </h1>
            <p className={`lead mb-4 ${styles['text-shadow']}`}>
              We've crafted more than 1,000+ homes.
            </p>
            <div className="d-flex flex-column flex-sm-row gap-3 justify-content-center">
              <Link 
                href="/search" 
                className="btn btn-primary btn-lg px-5 py-3 fw-semibold shadow"
              >
                Explore Properties
              </Link>
              <Link 
                href="/auth/sign-in" 
                className="btn btn-outline-light btn-lg px-5 py-3 fw-semibold shadow"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lot Size Tags Section */}
      <section id="lot-sizes" className={`py-5 bg-white section-transition ${visibleSections.has('lot-sizes') ? styles['visible'] : ''}`}>
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className={`h3 fw-bold mb-0 ${styles['section-heading']}`}>Popular Lot Sizes</h2>
            <Link href="/search" className={`text-decoration-none ${styles['explore-link']}`}>
              <span className="fw-semibold">Explore More</span>
              <span className="ms-1">{'>'}</span>
            </Link>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="d-flex flex-wrap gap-3">
                <Link 
                  href="/search?lotSize=8 meter" 
                  className={`${styles['lot-tag']} px-4 py-3 rounded-pill shadow-sm d-flex align-items-center text-decoration-none`}
                  style={{ cursor: 'pointer' }}
                >
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="fw-semibold">8 Meter Lot</span>
                </Link>
                <Link 
                  href="/search?lotSize=10 meter" 
                  className={`${styles['lot-tag']} px-4 py-3 rounded-pill shadow-sm d-flex align-items-center text-decoration-none`}
                  style={{ cursor: 'pointer' }}
                >
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="fw-semibold">10 Meter Lot</span>
                </Link>
                <Link 
                  href="/search?lotSize=12 meter" 
                  className={`${styles['lot-tag']} px-4 py-3 rounded-pill shadow-sm d-flex align-items-center text-decoration-none`}
                  style={{ cursor: 'pointer' }}
                >
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="fw-semibold">12 Meter Lot</span>
                </Link>
                <Link 
                  href="/search?lotSize=13 meter" 
                  className={`${styles['lot-tag']} px-4 py-3 rounded-pill shadow-sm d-flex align-items-center text-decoration-none`}
                  style={{ cursor: 'pointer' }}
                >
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="fw-semibold">13 Meter Lot</span>
                </Link>
                <Link 
                  href="/search?lotSize=14 meter" 
                  className={`${styles['lot-tag']} px-4 py-3 rounded-pill shadow-sm d-flex align-items-center text-decoration-none`}
                  style={{ cursor: 'pointer' }}
                >
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="fw-semibold">14 Meter Lot</span>
                </Link>
                <Link 
                  href="/search?lotSize=16 meter" 
                  className={`${styles['lot-tag']} px-4 py-3 rounded-pill shadow-sm d-flex align-items-center text-decoration-none`}
                  style={{ cursor: 'pointer' }}
                >
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="fw-semibold">16 Meter Lot</span>
                </Link>
                <Link 
                  href="/search?lotSize=18 meter" 
                  className={`${styles['lot-tag']} px-4 py-3 rounded-pill shadow-sm d-flex align-items-center text-decoration-none`}
                  style={{ cursor: 'pointer' }}
                >
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="fw-semibold">18 Meter Lot</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Floor Plans Section */}
      {featuredProperties.length > 0 && (
        <section id="featured-plans" className={`py-5 bg-light section-transition ${visibleSections.has('featured-plans') ? styles['visible'] : ''}`}>
          <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="h3 fw-bold mb-1 text-white">
                  Featured Floor Plans
                  <span className="text-warning ms-1">*</span>
                </h2>
                <p className="text-muted mb-0">Explore the top featured floor plans</p>
              </div>
              <Link href="/property/floor-plans" className={`btn btn-dark px-4 py-2 ${styles['explore-all-btn']}`}>
                <span className="fw-semibold">Explore All</span>
                <svg className="ms-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                </svg>
              </Link>
            </div>
            
            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-3 text-muted">Loading featured properties...</p>
              </div>
            ) : error ? (
              <div className="text-center py-5">
                <div className="alert alert-warning" role="alert">
                  {error}
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {/* Large Featured Floor Plan */}
                <div className="col-lg-8">
                  <div className={`${styles['floor-plan-card']} ${styles['featured-plan']} position-relative`}>
                    <div className={`${styles['plan-tag']} position-absolute top-0 start-0 m-3`}>
                      <span className="badge bg-light text-dark px-3 py-2">{featuredProperties[0]?.category || 'SINGLE STOREY'}</span>
                    </div>
                    
                    {/* Floor Plan Image */}
                    <div className={`${styles['floor-plan-image']} position-relative`}>
                      <Image 
                        src={getPrimaryImage(featuredProperties[0])} 
                        alt={featuredProperties[0]?.title || 'Featured Property'} 
                        fill 
                        className={styles['plan-image']}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        quality={90}
                      />
                    </div>
                    
                    {/* Bottom Overlay */}
                    <div className={`${styles['plan-overlay']} position-absolute bottom-0 start-0 w-100 p-3`}>
                      <div className="d-flex justify-content-between align-items-end">
                        <div className="text-white">
                          <h6 className="mb-0 fw-bold">{featuredProperties[0]?.title || 'Featured Property'}</h6>
                        </div>
                        <div className={`${styles['plan-details']} bg-white rounded p-3 shadow`}>
                          <div className="d-flex align-items-center mb-2">
                            <span className="fw-bold text-dark me-3">
                              {formatArea(featuredProperties[0]?.features?.area, featuredProperties[0]?.features?.areaUnit)}
                            </span>
                            <div className="d-flex gap-1">
                              <svg className="text-muted" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <svg className="text-muted" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                          </div>
                          <div className="row text-center mb-2">
                            <div className="col-6">
                              <small className="text-muted d-block">{featuredProperties[0]?.features?.bedrooms || 0} Beds</small>
                            </div>
                            <div className="col-6">
                              <small className="text-muted d-block">{featuredProperties[0]?.features?.bathrooms || 0} Baths</small>
                            </div>
                          </div>
                          <Link href={`/property/${featuredProperties[0]?._id}`} className={`btn btn-sm btn-dark w-100 ${styles['full-details-btn']}`}>
                            <span className="fw-semibold">Full Details</span>
                            <svg className="ms-1" width="12" height="12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                            </svg>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Smaller Floor Plan Cards */}
                <div className="col-lg-4">
                  <div className="d-flex flex-column gap-4">
                    {featuredProperties.slice(1, 3).map((property, index) => (
                      <div key={property._id} className={`${styles['floor-plan-card']} ${styles['small-plan']} position-relative`}>
                        <div className={`${styles['plan-tag']} position-absolute top-0 start-0 m-2`}>
                          <span className="badge bg-light text-dark px-2 py-1 small">{property.category || 'SINGLE STOREY'}</span>
                        </div>
                        
                        {/* Floor Plan Image */}
                        <div className={`${styles['floor-plan-image']} ${styles['small-image']} position-relative`}>
                          <Image 
                            src={getPrimaryImage(property)} 
                            alt={property.title || `Property ${index + 2}`} 
                            fill 
                            className={styles['plan-image']}
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                            quality={90}
                          />
                        </div>
                        
                        {/* Blue Button */}
                        <Link href={`/property/${property._id}`} className={`${styles['blue-btn']} position-absolute bottom-0 end-0 m-2`}>
                          <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                          </svg>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Features Section */}
      <section id="features" className={`py-5 bg-white section-transition ${visibleSections.has('features') ? styles['visible'] : ''}`}>
        <div className="container">
          <div className="row align-items-center">
            {/* Left Section */}
            <div className="col-lg-6 mb-5 mb-lg-0">
              <div className="position-relative">
                {/* Main Headline */}
                <h2 className="display-4 fw-bold mb-4" style={{ fontFamily: 'serif', color: '#212529' }}>
                  Explore & Build your<br />
                  <em className="text-primary">Dream home</em> <span className="text-primary">*</span>
                </h2>

                {/* Main Image */}
                <div className="position-relative mb-4">
                  <div className="rounded-4 overflow-hidden shadow-lg" style={{ height: '400px' }}>
                    <Image
                      src={p1}
                      alt="Happy couple with keys"
                      width={600}
                      height={400}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  
                  {/* Client Overlay Card */}
                  <div className="position-absolute bottom-0 start-0 bg-white rounded-3 shadow-lg p-3 m-3" style={{ zIndex: 10 }}>
                    <div className="d-flex align-items-center mb-2">
                      <span className="fw-bold" style={{ color: '#212529' }}>120k+ Happy Client</span>
                    </div>
                    <div className="d-flex">
                      <div className="rounded-circle border border-2 border-white me-2" style={{ width: '32px', height: '32px', overflow: 'hidden' }}>
                        <Image src={p2} alt="Client" width={32} height={32} style={{ objectFit: 'cover' }} />
                      </div>
                      <div className="rounded-circle border border-2 border-white me-2" style={{ width: '32px', height: '32px', overflow: 'hidden' }}>
                        <Image src={p3} alt="Client" width={32} height={32} style={{ objectFit: 'cover' }} />
                      </div>
                      <div className="rounded-circle border border-2 border-white me-2" style={{ width: '32px', height: '32px', overflow: 'hidden' }}>
                        <Image src={p4} alt="Client" width={32} height={32} style={{ objectFit: 'cover' }} />
                      </div>
                      <div className="rounded-circle border border-2 border-white me-2" style={{ width: '32px', height: '32px', overflow: 'hidden' }}>
                        <Image src={p13} alt="Client" width={32} height={32} style={{ objectFit: 'cover' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-lg-6">
              <div className="position-relative">
                {/* Abstract Decorative Lines */}
                <div className="position-absolute top-0 end-0" style={{ zIndex: 1 }}>
                  <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
                    <path d="M10 10 Q30 20, 50 10 Q70 0, 80 20" stroke="#0d6efd" strokeWidth="2" fill="none" opacity="0.6" />
                    <path d="M5 30 Q25 40, 45 30 Q65 20, 75 40" stroke="#0d6efd" strokeWidth="2" fill="none" opacity="0.4" />
                  </svg>
                </div>

                {/* Quote */}
                <blockquote className="fst-italic mb-4" style={{ fontSize: '1.1rem', lineHeight: '1.6', color: '#212529' }}>
                  "Your premier partner in transforming & bringing dreams into life. Let us guide you home with expertise."
                </blockquote>

                {/* Statistics */}
                <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                  <div className="text-center">
                    <div className="display-6 fw-bold" style={{ color: '#212529' }}>$100+</div>
                    <div style={{ color: '#212529' }}>Project Handover</div>
                  </div>
                  <div className="text-center">
                    <div className="display-6 fw-bold" style={{ color: '#212529' }}>1.9k+</div>
                    <div style={{ color: '#212529' }}>Happy Customers</div>
                  </div>
                </div>

                {/* Benefits List */}
                <div className="mb-4 pb-3 border-bottom">
                  <div className="d-flex align-items-center mb-2">
                    <span className="text-success me-2" style={{ fontSize: '1.2rem' }}>✓</span>
                    <span style={{ color: '#212529' }}>Expertise grounded in local knowledge.</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <span className="text-success me-2" style={{ fontSize: '1.2rem' }}>✓</span>
                    <span style={{ color: '#212529' }}>Unique, thoughtful home designs</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="text-success me-2" style={{ fontSize: '1.2rem' }}>✓</span>
                    <span style={{ color: '#212529' }}>From concept to completion, we're with you.</span>
                  </div>
                </div>

                {/* Call to Action Button */}
                <Link href="/search" className="btn btn-dark btn-lg rounded-3 px-4 py-3 d-inline-flex align-items-center">
                  <span className="me-2">Read More</span>
                  <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
                  </svg>
                </Link>

                {/* Second Image - Interior */}
                <div className="position-absolute" style={{ 
                  bottom: '-55px', 
                  right: '650px', 
                  zIndex: 2,
                  // transform: 'rotate(-5deg)'
                }}>
                  <div className="rounded-4 overflow-hidden shadow-lg" style={{ width: '300px', height: '200px' }}>
                    <Image
                      src={p2}
                      alt="Beautiful interior"
                      width={300}
                      height={200}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Property Search Section */}
      <section id="property-search" className={`py-5 bg-light section-transition ${visibleSections.has('property-search') ? styles['visible'] : ''}`}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="h3 fw-bold mb-3 text-white">Find Your Perfect Property</h2>
            <p className="text-muted">Search through our extensive collection of properties with advanced filters</p>
          </div>

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

          {/* Advanced Filters */}
          <Card className="mb-4">
            <CardBody>
              <Row className="g-3">
                <Col md={2}>
                  <Form.Label className="fw-medium">Beds</Form.Label>
                  <Form.Select
                    value={selectedBeds}
                    onChange={(e) => setSelectedBeds(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Label className="fw-medium">Baths</Form.Label>
                  <Form.Select
                    value={selectedBaths}
                    onChange={(e) => setSelectedBaths(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Label className="fw-medium">Garages</Form.Label>
                  <Form.Select
                    value={selectedGarages}
                    onChange={(e) => setSelectedGarages(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="0">0</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Label className="fw-medium">Theater</Form.Label>
                  <Form.Select
                    value={selectedTheater}
                    onChange={(e) => setSelectedTheater(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="0">0</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Label className="fw-medium">Lot Size</Form.Label>
                  <Form.Select
                    value={selectedLotSize}
                    onChange={(e) => setSelectedLotSize(e.target.value)}
                  >
                    <option value="All">All</option>
                    <option value="8 meter">8 meter</option>
                    <option value="10 meter">10 meter</option>
                    <option value="12 meter">12 meter</option>
                    <option value="13 meter">13 meter</option>
                    <option value="14 meter">14 meter</option>
                    <option value="16 meter">16 meter</option>
                    <option value="17.5 meter">17.5 meter</option>
                    <option value="18 meter">18 meter</option>
                    <option value="uneven">Uneven</option>
                  </Form.Select>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button 
                    variant="outline-secondary" 
                    className="w-100"
                    onClick={() => {
                      setSelectedBeds('All');
                      setSelectedBaths('All');
                      setSelectedGarages('All');
                      setSelectedTheater('All');
                      setSelectedLotSize('All');
                    }}
                  >
                    <IconifyIcon icon="ri:refresh-line" className="me-1" />
                    Clear Filters
                  </Button>
                </Col>
              </Row>
            </CardBody>
          </Card>

          {/* Results Header */}
          <Row className="mb-4">
            <Col md={8}>
              <div className="d-flex align-items-center gap-3">
                <span className="text-muted">
                  {filteredData.length} properties found
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
          {searchLoading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p className="mt-3">Loading properties...</p>
            </div>
          ) : searchError ? (
            <Card>
              <CardBody className="text-center py-5">
                <IconifyIcon icon="ri:error-warning-line" className="text-danger" style={{ fontSize: '3rem' }} />
                <h5 className="mt-3">Error loading properties</h5>
                <p className="text-muted">{searchError}</p>
                <Button variant="primary" onClick={fetchAllProperties}>
                  Try Again
                </Button>
              </CardBody>
            </Card>
          ) : currentData.length > 0 ? (
            <>
              <Row className="g-4 mb-4">
                {currentData.map(item => (
                  <Col key={item.id} lg={4} md={6}>
                    <SearchCard item={item} />
                  </Col>
                ))}
              </Row>

              {/* Pagination */}
              {totalPages > 1 && (
                <Row>
                  <Col>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} properties
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

              {/* View All Properties Link */}
              <div className="text-center mt-4">
                <Link href="/search" className="btn btn-primary btn-lg">
                  <IconifyIcon icon="ri:search-line" className="me-2" />
                  View All Properties
                </Link>
              </div>
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
                    setSelectedBeds('All');
                    setSelectedBaths('All');
                    setSelectedGarages('All');
                    setSelectedTheater('All');
                    setSelectedLotSize('All');
                  }}
                >
                  Clear Filters
                </Button>
              </CardBody>
            </Card>
          )}
        </Container>
      </section>

      {/* Footer */}
      <footer id="footer" className={`py-4 bg-dark text-white text-center section-transition ${visibleSections.has('footer') ? styles['visible'] : ''}`}>
        <div className="container">
          <p className="mb-0">
            © 2024 Lahomes. All rights reserved. Premium Real Estate Management Admin Template.
          </p>
        </div>
      </footer>
    </div>
  );
}
