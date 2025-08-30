'use client';

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllAgent } from '@/helpers/data';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Card, CardBody, CardFooter, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const AgentCard = ({
  address,
  properties,
  user
}) => {
  return <Card>
      <CardBody>
        <div className="d-flex flex-wrap align-items-center gap-2 border-bottom pb-3">
          {user?.avatar && <Image 
            src={user.avatar} 
            alt="avatar" 
            className="avatar-lg rounded-3 border border-light border-3"
            width={80}
            height={80}
            style={{ objectFit: 'cover' }}
            onError={(e) => {
              e.target.src = '/assets/images/users/user-1.jpg';
            }}
          />}
          <div className="d-block">
            <Link href="" className="text-dark fw-medium fs-16">
              {user?.name}
            </Link>
            <p className="mb-0">{user?.email}</p>
            <p className="mb-0 text-primary"># {user?.id}</p>
          </div>
          <div className="ms-auto">
            <Dropdown>
              <DropdownToggle as={'a'} className="btn btn-sm btn-outline-light rounded arrow-none fs-16" data-bs-toggle="dropdown" aria-expanded="false">
                <IconifyIcon icon="ri:more-2-fill" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>Download</DropdownItem>
                <DropdownItem>Export</DropdownItem>
                <DropdownItem>Import</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
        <p className="mt-3 d-flex align-items-center gap-2 mb-2">
          <IconifyIcon icon="solar:home-bold-duotone" className="fs-18 text-primary" />
          {properties} Properties
        </p>
        <p className="d-flex align-items-center gap-2 mt-2">
          <IconifyIcon icon="solar:map-point-wave-bold-duotone" className="fs-18 text-primary" />
          {address}
        </p>
        <h5 className="my-3">Social Media :</h5>
        <ul className="list-inline d-flex gap-1 mb-0 align-items-center">
          <li className="list-inline-item">
            <Link href="" className="btn btn-sm btn-outline-primary rounded-circle">
              <IconifyIcon icon="ri:facebook-fill" />
            </Link>
          </li>
          <li className="list-inline-item">
            <Link href="" className="btn btn-sm btn-outline-info rounded-circle">
              <IconifyIcon icon="ri:twitter-fill" />
            </Link>
          </li>
          <li className="list-inline-item">
            <Link href="" className="btn btn-sm btn-outline-danger rounded-circle">
              <IconifyIcon icon="ri:instagram-fill" />
            </Link>
          </li>
          <li className="list-inline-item">
            <Link href="" className="btn btn-sm btn-outline-primary rounded-circle">
              <IconifyIcon icon="ri:linkedin-fill" />
            </Link>
          </li>
        </ul>
      </CardBody>
      <CardFooter className="border-top">
        <Row className="g-2">
          <Col lg={6}>
            <Button variant="primary" className="w-100">
              <IconifyIcon icon="solar:outgoing-call-rounded-broken" className="align-middle fs-18" /> Call Us
            </Button>
          </Col>
          <Col lg={6}>
            <Button variant="light" className="w-100">
              <IconifyIcon icon="solar:chat-round-dots-broken" className="align-middle fs-16" /> Message
            </Button>
          </Col>
        </Row>
      </CardFooter>
    </Card>;
};

const AgentData = () => {
  const [agentCardData, setAgentCardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllAgent();
        console.log('🔍 Agent grid data fetched:', data);
        setAgentCardData(data);
      } catch (error) {
        console.error('Error fetching agents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading agents...</p>
      </div>
    );
  }
  
  return <>
      {agentCardData && agentCardData.length > 0 ? (
        <Row>
          {agentCardData.map((item, idx) => <Col xl={4} lg={6} key={item.id || idx}>
              <AgentCard {...item} />
            </Col>)}
        </Row>
      ) : (
        <div className="text-center py-5">
          <IconifyIcon icon="solar:user-broken" className="fs-48 text-muted mb-3" />
          <h4 className="text-muted">No Agents Found</h4>
          <p className="text-muted">No agents have been added yet. Add your first agent to get started.</p>
          <Link href="/agents/add" className="btn btn-primary">
            <IconifyIcon icon="solar:add-circle-broken" className="me-2" />
            Add Agent
          </Link>
        </div>
      )}
    </>;
};

export default AgentData;