'use client';

import React, { useState, useEffect } from 'react';
import { 
  Navbar, 
  Nav, 
  NavDropdown, 
  Container, 
  Button,
  Offcanvas
} from 'react-bootstrap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import IconifyIcon from '@/components/wrappers/IconifyIcon';

const PublicHeader = () => {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  const handleClose = () => setShowOffcanvas(false);
  const handleShow = () => setShowOffcanvas(true);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => {
    return pathname === path;
  };

  const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Search', href: '/search' },
    { 
      label: 'Properties', 
      href: '#',
      dropdown: [
        { label: 'For Rent', href: '/properties/rent' },
        { label: 'For Sale', href: '/properties/sale' },
        { label: 'New Projects', href: '/properties/new' },
        { label: 'Commercial', href: '/properties/commercial' }
      ]
    },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' }
  ];

  const renderNavItem = (item) => {
    const linkClass = `fw-medium ${isScrolled ? 'text-dark' : 'text-white'} ${isActive(item.href) ? 'active' : ''}`;
    
    if (item.dropdown) {
      return (
        <NavDropdown 
          key={item.label}
          title={item.label} 
          id={`nav-dropdown-${item.label}`}
          className={linkClass}
        >
          {item.dropdown.map((dropdownItem) => (
            <NavDropdown.Item 
              key={dropdownItem.label}
              as={Link} 
              href={dropdownItem.href}
            >
              {dropdownItem.label}
            </NavDropdown.Item>
          ))}
        </NavDropdown>
      );
    }

    return (
      <Nav.Link 
        key={item.label}
        as={Link} 
        href={item.href}
        className={linkClass}
      >
        {item.label}
      </Nav.Link>
    );
  };

  return (
    <>
      <style jsx>{`
        .navbar {
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          background: linear-gradient(135deg, transparent 0%, transparent 100%);
          position: relative;
        }
        .navbar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
          opacity: 0;
          transition: opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          backdrop-filter: blur(0px);
          z-index: -1;
        }
        .navbar.scrolled {
          background: transparent !important;
        }
        .navbar.scrolled::before {
          opacity: 1;
          backdrop-filter: blur(15px);
        }
        .navbar.scrolled {
          box-shadow: 
            0 4px 20px rgba(0, 0, 0, 0.08),
            0 1px 3px rgba(0, 0, 0, 0.05);
        }
        .nav-link {
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          position: relative;
          transition-delay: 0.1s;
        }
        .nav-link:hover {
          color: var(--bs-primary) !important;
          transform: translateY(-1px);
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 2px;
          background: var(--bs-primary);
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transform: translateX(-50%);
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .navbar-brand {
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transition-delay: 0.15s;
        }
        .navbar-brand:hover {
          transform: scale(1.05);
        }
        .btn {
          transition: all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transition-delay: 0.2s;
        }
        .btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }
        .dropdown-toggle {
          transition: all 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          transition-delay: 0.1s;
        }
        .dropdown-toggle:hover {
          color: var(--bs-primary) !important;
        }
        .dropdown-menu {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }
        .dropdown-item {
          transition: all 0.2s ease;
        }
        .dropdown-item:hover {
          background-color: var(--bs-primary);
          color: white;
          transform: translateX(5px);
        }
      `}</style>
      <Navbar 
        bg={isScrolled ? "white" : "transparent"}
        expand="lg" 
        className={`${isScrolled ? 'shadow-sm border-bottom scrolled' : ''}`}
        sticky="top"
      >
        <Container>
          {/* Logo */}
          <Navbar.Brand as={Link} href="/" className="fw-bold d-flex align-items-center">
            <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                 style={{ width: '40px', height: '40px' }}>
              <IconifyIcon icon="ri:home-line" className="text-white fs-5" />
            </div>
            <span className={`fs-4 ${isScrolled ? 'text-primary' : 'text-white'}`}>PropertyFinder</span>
          </Navbar.Brand>

          {/* Desktop Navigation - Centered */}
          <div className="d-none d-lg-flex align-items-center flex-grow-1 justify-content-center">
            <Nav className="mx-auto">
              {navItems.map(renderNavItem)}
            </Nav>
          </div>
          
          {/* Auth Buttons */}
          <div className="d-none d-lg-flex gap-2">
            <Button 
              as={Link} 
              href="/auth/sign-in" 
              variant={isScrolled ? "outline-primary" : "outline-light"}
              size="sm"
            >
              <IconifyIcon icon="ri:login-box-line" className="me-1" />
              Sign In
            </Button>
            <Button 
              as={Link} 
              href="/auth/sign-up" 
              variant="primary" 
              size="sm"
            >
              <IconifyIcon icon="ri:user-add-line" className="me-1" />
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant={isScrolled ? "outline-secondary" : "outline-light"}
            size="sm"
            className="d-lg-none"
            onClick={handleShow}
          >
            <IconifyIcon icon="ri:menu-line" />
          </Button>
        </Container>
      </Navbar>

      {/* Mobile Offcanvas Menu */}
      <Offcanvas show={showOffcanvas} onHide={handleClose} placement="end">
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>
            <div className="d-flex align-items-center">
              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-2" 
                   style={{ width: '32px', height: '32px' }}>
                <IconifyIcon icon="ri:home-line" className="text-white" />
              </div>
              <span className="text-primary fw-bold">PropertyFinder</span>
            </div>
          </Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <Nav className="flex-column">
            {navItems.map((item) => {
              if (item.dropdown) {
                return (
                  <div key={item.label} className="mb-3">
                    <h6 className="text-muted mb-2">{item.label}</h6>
                    {item.dropdown.map((dropdownItem) => (
                      <Nav.Link 
                        key={dropdownItem.label}
                        as={Link} 
                        href={dropdownItem.href}
                        className={`ps-3 ${isActive(dropdownItem.href) ? 'active' : ''}`}
                        onClick={handleClose}
                      >
                        {dropdownItem.label}
                      </Nav.Link>
                    ))}
                  </div>
                );
              }

              return (
                <Nav.Link 
                  key={item.label}
                  as={Link} 
                  href={item.href}
                  className={`mb-2 ${isActive(item.href) ? 'active' : ''}`}
                  onClick={handleClose}
                >
                  {item.label}
                </Nav.Link>
              );
            })}
          </Nav>
          
          <hr className="my-4" />
          
          {/* Mobile Auth Buttons */}
          <div className="d-flex flex-column gap-2">
            <Button 
              as={Link} 
              href="/auth/sign-in" 
              variant="outline-primary" 
              size="lg"
              onClick={handleClose}
            >
              <IconifyIcon icon="ri:login-box-line" className="me-2" />
              Sign In
            </Button>
            <Button 
              as={Link} 
              href="/auth/sign-up" 
              variant="primary" 
              size="lg"
              onClick={handleClose}
            >
              <IconifyIcon icon="ri:user-add-line" className="me-2" />
              Sign Up
            </Button>
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  );
};

export default PublicHeader;
