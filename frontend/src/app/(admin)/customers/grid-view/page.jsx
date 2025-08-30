'use client';

import PageTitle from '@/components/PageTitle';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllCustomer } from '@/helpers/data';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Card, CardBody, CardFooter, Col, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';

export const metadata = {
  title: 'Customer Grid'
};

const CustomerGridCard = ({
  user,
  status,
  propertyOwn,
  propertyView,
  invest
}) => {
  return <Card className="overflow-hidden">
      <CardBody>
        <div className="customer-bg rounded position-relative">
          {user?.avatar && <Image 
            src={user.avatar} 
            alt="avatar2" 
            className="avatar-xl border border-light border-3 rounded-circle position-absolute top-100 start-0 translate-middle ms-5"
            width={80}
            height={80}
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = '/assets/images/users/user-1.jpg';
            }}
          />}
          <span className="position-absolute top-0 end-0 p-1">
            <button type="button" className="btn btn-dark avatar-sm d-inline-flex align-items-center justify-content-center fs-20 rounded text-light">
              {' '}
              <span>
                <IconifyIcon icon="solar:pen-new-square-broken" />
              </span>
            </button>
          </span>
        </div>
        <div className="mt-5 pt-3 ms-1">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div>
              <Link href="" className="text-dark fw-medium fs-16">
                {user?.name}
              </Link>
              <p className="mb-0 text-muted">{user?.email}</p>
            </div>
            <div>
              <span className={`badge bg-${status == 'Active' ? 'success' : 'danger'}-subtle text-${status == 'Active' ? 'success' : 'danger'} py-1 px-2 fs-13`}>
                {status}
              </span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <IconifyIcon icon="solar:phone-broken" className="fs-18 text-primary" />
            <span className="text-muted">{user?.contact}</span>
          </div>
          <div className="d-flex align-items-center gap-2 mb-3">
            <IconifyIcon icon="solar:map-point-wave-bold-duotone" className="fs-18 text-primary" />
            <span className="text-muted">New York, USA</span>
          </div>
          <div className="row g-2">
            <div className="col-4">
              <div className="text-center p-2 bg-light rounded">
                <h6 className="mb-0 text-primary fw-medium">{propertyOwn}</h6>
                <p className="mb-0 text-muted fs-12">Own Properties</p>
              </div>
            </div>
            <div className="col-4">
              <div className="text-center p-2 bg-light rounded">
                <h6 className="mb-0 text-primary fw-medium">{propertyView}</h6>
                <p className="mb-0 text-muted fs-12">View Properties</p>
              </div>
            </div>
            <div className="col-4">
              <div className="text-center p-2 bg-light rounded">
                <h6 className="mb-0 text-primary fw-medium">{invest}</h6>
                <p className="mb-0 text-muted fs-12">Invest Property</p>
              </div>
            </div>
          </div>
        </div>
      </CardBody>
      <CardFooter className="border-top border-dashed gap-1 hstack">
        <Button variant="primary" className="w-100">
          Open Chat
        </Button>
        <Button variant="light" className="w-100">
          Call To Customer
        </Button>
      </CardFooter>
    </Card>;
};

const CustomerGridPage = () => {
  const [customerGridData, setCustomerGridData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllCustomer();
        console.log('🔍 Customer grid data fetched:', data);
        setCustomerGridData(data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <PageTitle subName="Customers" title="Customer Grid" />
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading customers...</p>
        </div>
      </>
    );
  }
  
  return <>
      <PageTitle subName="Customers" title="Customer Grid" />
      <div className="d-flex justify-content-end mb-3">
        <Link href="/customers/add">
          <Button variant="primary">
            <IconifyIcon icon="solar:add-circle-broken" className="me-2" />
            Add New Customer
          </Button>
        </Link>
      </div>
      {customerGridData && customerGridData.length > 0 ? (
        <Row>
          {customerGridData.slice(0, 6).map((item, idx) => <Col md={6} xl={4} key={item.id || idx}>
              <CustomerGridCard {...item} />
            </Col>)}
        </Row>
      ) : (
        <div className="text-center py-5">
          <IconifyIcon icon="solar:user-broken" className="fs-48 text-muted mb-3" />
          <h4 className="text-muted">No Customers Found</h4>
          <p className="text-muted">No customers have been added yet. Add your first customer to get started.</p>
          <Link href="/customers/add" className="btn btn-primary">
            <IconifyIcon icon="solar:add-circle-broken" className="me-2" />
            Add Customer
          </Link>
        </div>
      )}
    </>;
};

export default CustomerGridPage;