'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getAllProperties } from '@/app/lib/Services/api';

const PropertyRedirect = () => {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id;

  useEffect(() => {
    const redirectToSeoUrl = async () => {
      try {
        const response = await getAllProperties();
        
        if (response.success && response.data.properties) {
          const foundProperty = response.data.properties.find(p => p._id === propertyId);
          if (foundProperty) {
            // Generate SEO-friendly URL
            const seoTitle = foundProperty.title
              .replace(/[^a-zA-Z0-9\s-]/g, '')
              .replace(/\s+/g, '-')
              .toLowerCase()
              .trim();
            
            // Redirect to SEO-friendly URL
            router.replace(`/property/${propertyId}/${seoTitle}`);
          } else {
            // Property not found, redirect to search
            router.replace('/search');
          }
        } else {
          // API error, redirect to search
          router.replace('/search');
        }
      } catch (err) {
        console.error('Error redirecting property:', err);
        // Error occurred, redirect to search
        router.replace('/search');
      }
    };

    if (propertyId) {
      redirectToSeoUrl();
    }
  }, [propertyId, router]);

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Redirecting to property details...</p>
      </div>
    </div>
  );
};

export default PropertyRedirect;
