'use client';

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllProperty } from '@/helpers/data';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardBody, CardFooter, Col, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const PropertiesCard = ({
  bath,
  beds,
  flor,
  size: ft,
  icon,
  id,
  location,
  name,
  price,
  type,
  variant,
  save,
  image
}) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  return <Card className="overflow-hidden">
      <div className="position-relative">
        {imageLoading && (
          <div className="d-flex align-items-center justify-content-center" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        {!imageError && (
          <Image 
            src={image} 
            alt="properties" 
            className="img-fluid rounded-top"
            width={400}
            height={300}
            style={{ objectFit: 'cover', display: imageLoading ? 'none' : 'block' }}
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
        )}
        {imageError && (
          <div className="d-flex align-items-center justify-content-center" style={{ height: '200px', backgroundColor: '#f8f9fa' }}>
            <IconifyIcon icon="solar:image-broken" className="fs-48 text-muted" />
          </div>
        )}
        <span className="position-absolute top-0 start-0 p-1">
          {save ? <button type="button" className="btn btn-warning avatar-sm d-inline-flex align-items-center justify-content-center fs-20 rounded text-light ">
              {' '}
              <span>
                {' '}
                <IconifyIcon icon="solar:bookmark-broken" />
              </span>
            </button> : <button type="button" className="btn bg-warning-subtle avatar-sm d-inline-flex align-items-center justify-content-center fs-20 rounded text-warning">
              <span>
                <IconifyIcon icon="solar:bookmark-broken" />
              </span>
            </button>}
        </span>
        <span className="position-absolute top-0 end-0 p-1">
          <span className={`badge bg-${variant} text-white fs-13`}>{type}</span>
        </span>
      </div>
      <CardBody>
        <div className="d-flex align-items-center gap-2">
          <div className="avatar bg-light rounded flex-centered">
            <IconifyIcon icon={icon} width={24} height={24} className="fs-24 text-primary" />
          </div>
          <div>
            <Link href="" className="text-dark fw-medium fs-16">
              {name}
            </Link>
            <p className="text-muted mb-0">{location}</p>
          </div>
        </div>
        <Row className="mt-2 g-2">
          <Col lg={4} xs={4}>
            <span className="badge bg-light-subtle text-muted border fs-12">
              <span className="fs-16">
                <IconifyIcon icon="solar:bed-broken" className="align-middle" />
              </span>
              &nbsp;
              {beds} Beds
            </span>
          </Col>
          <Col lg={4} xs={4}>
            <span className="badge bg-light-subtle text-muted border fs-12">
              <span className="fs-16">
                <IconifyIcon icon="solar:bath-broken" className="align-middle" />
              </span>
              &nbsp;
              {bath} Bath
            </span>
          </Col>
          <Col lg={4} xs={4}>
            <span className="badge bg-light-subtle text-muted border fs-12">
              <span className="fs-16">
                <IconifyIcon icon="solar:scale-broken" className="align-middle" />
              </span>
              &nbsp;
              {ft}ft
            </span>
          </Col>
          <Col lg={4} xs={4}>
            <span className="badge bg-light-subtle text-muted border fs-12">
              <span className="fs-16">
                <IconifyIcon icon="solar:double-alt-arrow-up-broken" className="align-middle" />
              </span>
              &nbsp;
              {flor} Floor
            </span>
          </Col>
        </Row>
      </CardBody>
      <CardFooter className="bg-light-subtle d-flex justify-content-between align-items-center border-top">
        {type == 'Sold' ? <p className="fw-medium text-muted text-decoration-line-through fs-16 mb-0">${price}.00 </p> : <p className="fw-medium text-dark fs-16 mb-0">${price}.00 </p>}
        <div>
          <Link href="" className="link-primary fw-medium">
            More Inquiry <IconifyIcon icon="ri:arrow-right-line" className="align-middle" />
          </Link>
        </div>
      </CardFooter>
    </Card>;
};

const PropertiesData = () => {
  const [propertiesData, setPropertiesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProperty();
        setPropertiesData(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Col xl={9} lg={12}>
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading properties...</p>
        </div>
      </Col>
    );
  }
  
  return <Col xl={9} lg={12}>
      {propertiesData && propertiesData.length > 0 ? (
        <>
          <Row>
            {propertiesData.map((item, idx) => <Col lg={4} md={6} key={item.id || idx}>
                <PropertiesCard {...item} />
              </Col>)}
          </Row>
          <div className="p-3 border-top">
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-end mb-0">
                <li className="page-item">
                  <Link className="page-link" href="">
                    Previous
                  </Link>
                </li>
                <li className="page-item active">
                  <Link className="page-link" href="">
                    1
                  </Link>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    2
                  </Link>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    3
                  </Link>
                </li>
                <li className="page-item">
                  <Link className="page-link" href="">
                    Next
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </>
      ) : (
        <div className="text-center py-5">
          <IconifyIcon icon="solar:home-broken" className="fs-48 text-muted mb-3" />
          <h4 className="text-muted">No Properties Found</h4>
          <p className="text-muted">No properties have been added yet. Add your first property to get started.</p>
          <Link href="/property/add" className="btn btn-primary">
            <IconifyIcon icon="solar:add-circle-broken" className="me-2" />
            Add Property
          </Link>
        </div>
      )}
    </Col>;
};

export default PropertiesData;