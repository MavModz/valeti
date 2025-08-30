'use client';

import IconifyIcon from '@/components/wrappers/IconifyIcon';
import { getAllProperty } from '@/helpers/data';
import Image from 'next/image';
import Link from 'next/link';
import { Button, Card, CardFooter, CardHeader, CardTitle, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Row } from 'react-bootstrap';
import { useState, useEffect } from 'react';

const PropertyList = () => {
  const [propertyListData, setPropertyListData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getAllProperty();
        setPropertyListData(data);
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
      <Row>
        <Col xl={12}>
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Loading properties...</p>
          </div>
        </Col>
      </Row>
    );
  }
  
  return <Row>
      <Col xl={12}>
        <Card>
          <CardHeader className="d-flex justify-content-between align-items-center border-bottom">
            <div>
              <CardTitle as={'h4'} className="mb-0">
                All Properties List
              </CardTitle>
            </div>
            <Dropdown>
              <DropdownToggle as={'a'} className="btn btn-sm btn-outline-light rounded content-none icons-center" data-bs-toggle="dropdown" aria-expanded="false">
                This Month <IconifyIcon className="ms-1" width={16} height={16} icon="ri:arrow-down-s-line" />
              </DropdownToggle>
              <DropdownMenu className="dropdown-menu-end">
                <DropdownItem>Download</DropdownItem>
                <DropdownItem>Export</DropdownItem>
                <DropdownItem>Import</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </CardHeader>
          {propertyListData && propertyListData.length > 0 ? (
            <>
              <div className="table-responsive">
                <table className="table align-middle text-nowrap table-hover table-centered mb-0">
                  <thead className="bg-light-subtle">
                    <tr>
                      <th style={{
                      width: 20
                    }}>
                        <div className="form-check">
                          <input type="checkbox" className="form-check-input" id="customCheck1" />
                          <label className="form-check-label" htmlFor="customCheck1" />
                        </div>
                      </th>
                      <th>Properties Photo &amp; Name</th>
                      <th>Size</th>
                      <th>Property Type</th>
                      <th>Rent/Sale</th>
                      <th>Bedrooms</th>
                      <th>Location</th>
                      <th>Price</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {propertyListData.map((item, idx) => <tr key={item.id || idx}>
                        <td>
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" id="customCheck2" />
                            <label className="form-check-label" htmlFor="customCheck2">
                              &nbsp;
                            </label>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div>
                              <Image 
                                src={item.image} 
                                alt="properties" 
                                className="avatar-md rounded border border-light border-3"
                                width={60}
                                height={60}
                                style={{ objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.src = '/assets/images/properties/p-1.jpg';
                                }}
                              />
                            </div>
                            <div>
                              <Link href="" className="text-dark fw-medium fs-15">
                                {item.name}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td>{item.size}ft</td>
                        <td>{item.propertyType}</td>
                        <td>
                          {' '}
                          <span className={`badge bg-${item.type == 'Rent' ? 'success' : item.type == 'Sold' ? 'danger' : 'warning'}-subtle text-${item.type == 'Rent' ? 'success' : item.type == 'Sold' ? 'danger' : 'warning'} py-1 px-2 fs-13`}>
                            {item.type}
                          </span>
                        </td>
                        <td>
                          <p className="mb-0">
                            <IconifyIcon icon="solar:bed-broken" className="align-middle fs-16" /> {item.beds}
                          </p>
                        </td>
                        <td>{item.country}</td>
                        <td>${item.price}.00</td>
                        <td>
                          <div className="d-flex gap-2">
                            <Button variant="light" size="sm">
                              <IconifyIcon icon="solar:eye-broken" className="align-middle fs-18" />
                            </Button>
                            <Button variant="soft-primary" size="sm">
                              <IconifyIcon icon="solar:pen-2-broken" className="align-middle fs-18" />
                            </Button>
                            <Button variant="soft-danger" size="sm">
                              <IconifyIcon icon="solar:trash-bin-minimalistic-2-broken" className="align-middle fs-18" />
                            </Button>
                          </div>
                        </td>
                      </tr>)}
                  </tbody>
                </table>
              </div>
              <CardFooter>
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
              </CardFooter>
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
        </Card>
      </Col>
    </Row>;
};

export default PropertyList;