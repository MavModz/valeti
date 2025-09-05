'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
// import logoDark from '@/assets/images/logo-dark.png';
import logoDark from '@/assets/images/valeti-logo-white.png';
import p1 from '@/assets/images/properties/p-1.jpg';
import p2 from '@/assets/images/properties/p-2.jpg';
import p3 from '@/assets/images/properties/p-3.jpg';
import p4 from '@/assets/images/properties/p-4.jpg';
import p13 from '@/assets/images/properties/p-13.jpg';
import { getFeaturedProperties } from '@/app/lib/Services/api';
import styles from './page.module.css';

export default function HomePage() {
  const [visibleSections, setVisibleSections] = useState(new Set());
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

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
            <Link href="/property/property-list" className={`text-decoration-none ${styles['explore-link']}`}>
              <span className="fw-semibold">Explore More</span>
              <span className="ms-1">{'>'}</span>
            </Link>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="d-flex flex-wrap gap-3">
                <div className={`${styles['lot-tag']} px-4 py-3 rounded-pill shadow-sm d-flex align-items-center`}>
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="fw-semibold">8 Meter Lot</span>
                </div>
                <div className={`${styles['lot-tag']} px-4 py-3 rounded-pill shadow-sm d-flex align-items-center`}>
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="fw-semibold">10 Meter Lot</span>
                </div>
                <div className={`${styles['lot-tag']} px-4 py-3 rounded-pill shadow-sm d-flex align-items-center`}>
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="fw-semibold">12 Meter Lot</span>
                </div>
                <div className={`${styles['lot-tag']} px-4 py-3 rounded-pill shadow-sm d-flex align-items-center`}>
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="fw-semibold">13 Meter Lot</span>
                </div>
                <div className={`${styles['lot-tag']} px-4 py-3 rounded-pill shadow-sm d-flex align-items-center`}>
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="fw-semibold">14 Meter Lot</span>
                </div>
                <div className={`${styles['lot-tag']} px-4 py-3 rounded-pill shadow-sm d-flex align-items-center`}>
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="fw-semibold">16 Meter Lot</span>
                </div>
                <div className={`${styles['lot-tag']} px-4 py-3 rounded-pill shadow-sm d-flex align-items-center`}>
                  <svg className="me-2" width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  <span className="fw-semibold">18 Meter Lot</span>
                </div>
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
                <h2 className={`h3 fw-bold mb-1 ${styles['section-heading']}`}>
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
                        
                        {/* Orange Button */}
                        <Link href={`/property/${property._id}`} className={`${styles['orange-btn']} position-absolute bottom-0 end-0 m-2`}>
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
      <section id="features" className={`py-5 bg-light section-transition ${visibleSections.has('features') ? styles['visible'] : ''}`}>
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow">
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <svg className="text-primary" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h5 className="fw-semibold text-dark mb-2">Analytics Dashboard</h5>
                  <p className="text-muted mb-0">Comprehensive insights and metrics for your real estate business</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow">
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <svg className="text-primary" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <h5 className="fw-semibold text-dark mb-2">User Management</h5>
                  <p className="text-muted mb-0">Efficiently manage agents, customers, and team members</p>
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow">
                <div className="card-body text-center p-4">
                  <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                       style={{ width: '60px', height: '60px' }}>
                    <svg className="text-primary" width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h5 className="fw-semibold text-dark mb-2">Property Management</h5>
                  <p className="text-muted mb-0">Complete property listing and management system</p>
                </div>
              </div>
            </div>
          </div>
        </div>
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
