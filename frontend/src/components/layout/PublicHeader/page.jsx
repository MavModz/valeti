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

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown')) {
        const allMenus = document.querySelectorAll('.dropdown-menu.show');
        allMenus.forEach(menu => {
          if (menu && document.contains(menu)) {
            menu.classList.remove('show');
          }
        });
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const isActive = (path) => {
    return pathname === path;
  };

  const navItems = [
    {
      label: 'Home Designs',
      href: '#',
      dropdown: [
        {
          label: 'Standard Home Design',
          href: '/home-designs/standard', // Main category page
          subDropdown: [
            { label: 'Singles', href: '/home-designs/standard?category=Single%20Story', category: 'Singles' },
            { label: 'Doubles', href: '/home-designs/standard?category=Double%20Story', category: 'Doubles' },
            { label: 'Farm House', href: '/home-designs/standard?category=Farm%20House', category: 'Farm House' },
            { label: 'NDIS', href: '/home-designs/standard?category=NDIS', category: 'NDIS' },
            { label: 'Small Lot Design', href: '/home-designs/standard?category=Small%20Lot%20Design', category: 'Small Lot Design' },
            { label: 'Corner Lot', href: '/home-designs/standard?category=Corner%20Lot', category: 'Corner Lot' }
          ]
        },
        {
          label: 'Custom Homes',
          href: '/home-designs/custom', // Main category page
          subDropdown: [
            { label: 'Architectural Design', href: '/home-designs/custom?category=Architectural%20Design', category: 'Architectural Design' },
            { label: 'Sloping Lot /Split Level Homes', href: '/home-designs/custom?category=Sloping%20Lot%20Split%20Level%20Homes', category: 'Sloping Lot Split Level Homes' },
            { label: 'Uneven Lot', href: '/home-designs/custom?category=Uneven%20Lot', category: 'Uneven Lot' },
            { label: 'Knockdown Rebuild', href: '/home-designs/custom?category=Knockdown%20Rebuild', category: 'Knockdown Rebuild' },
            { label: 'Renovation', href: '/home-designs/custom?category=Renovation', category: 'Renovation' },
            { label: 'Rooming House', href: '/home-designs/custom?category=Rooming%20House', category: 'Rooming House' },
            { label: 'Sustainable Home', href: '/home-designs/custom?category=Sustainable%20Home', category: 'Sustainable Home' }
          ]
        },
        {
          label: 'Interior',
          href: '/home-designs/interior', // Main category page
          subDropdown: [
            { label: 'Studio/Aspirations', href: '/home-designs/interior?category=Studio%20Aspirations', category: 'Studio Aspirations' }
          ]
        },
        {
          label: 'Multiunit Development',
          href: '/home-designs/multiunit', // Main category page
          subDropdown: [
            { label: 'Side By Side', href: '/home-designs/multiunit?category=Side%20By%20Side', category: 'Side By Side' },
            { label: 'Back To Back', href: '/home-designs/multiunit?category=Back%20To%20Back', category: 'Back To Back' },
            { label: 'Multi Units', href: '/home-designs/multiunit?category=Multi%20Units', category: 'Multi Units' }
          ]
        },
        {
          label: 'Commercial Design',
          href: '/home-designs/commercial', // Main category page
          subDropdown: [
            { label: 'Apartments', href: '/home-designs/commercial?category=Apartments', category: 'Apartments' },
            { label: 'Warehouse', href: '/home-designs/commercial?category=Warehouse', category: 'Warehouse' },
            { label: 'Office', href: '/home-designs/commercial?category=Office', category: 'Office' }
          ]
        }
      ]
    },
    {
      label: 'House & Land',
      href: '#',
      dropdown: [
        { label: 'Home For Sales', href: '/house-land/home-for-sales' },
        { label: 'Build With Us', href: '/house-land/build-with-us' },
        { label: 'Offers', href: '/house-land/offers' }
      ]
    },
    {
      label: 'Client Journey',
      href: '#',
      dropdown: [
        {
          label: 'Portfolio',
          href: '#', // No direct link, only subdropdown items have links
          subDropdown: [
            { label: 'Completed Project', href: '/client-journey/completed-project' },
            { label: 'Virtual 360 Tour', href: '/client-journey/virtual-360-tour' },
            { label: 'Display Homes', href: '/client-journey/display-homes' }
          ]
        },
        { label: 'Step By Step Process', href: '/client-journey/step-by-step-process' },
        { label: 'Buyers Advocate', href: '/client-journey/buyers-advocate' }
      ]
    },
    {
      label: 'Partners',
      href: '#',
      dropdown: [
        { label: 'Consultants', href: '/partners/consultants' },
        { label: 'Loan', href: '/partners/loan' },
        { label: 'Insurances', href: '/partners/insurances' },
        { label: 'Conveyancer', href: '/partners/conveyancer' },
        { label: '3d', href: '/partners/3d' },
        { label: 'Sales', href: '/partners/sales' },
        { label: 'Rentals', href: '/partners/rentals' }
      ]
    },
    {
      label: 'Testimonials',
      href: '#',
    }
  ];

  const renderNavItem = (item) => {
    const linkClass = `fw-medium ${isScrolled ? 'text-dark' : 'text-white'} ${isActive(item.href) ? 'active' : ''}`;

    if (item.dropdown) {
      return (
        <div
          key={item.label}
          className="nav-item dropdown"
          onMouseEnter={(e) => {
            // Close all other dropdowns first
            const allMenus = document.querySelectorAll('.dropdown-menu.show');
            allMenus.forEach(menu => {
              if (menu && menu !== e.currentTarget.querySelector('.dropdown-menu')) {
                menu.classList.remove('show');
              }
            });

            const dropdownMenu = e.currentTarget.querySelector('.dropdown-menu');
            if (dropdownMenu) {
              dropdownMenu.classList.add('show');
            }
          }}
          onMouseLeave={(e) => {
            const currentTarget = e.currentTarget;
            setTimeout(() => {
              if (currentTarget && document.contains(currentTarget)) {
                const dropdownMenu = currentTarget.querySelector('.dropdown-menu');
                if (dropdownMenu && !currentTarget.matches(':hover') && !dropdownMenu.matches(':hover')) {
                  dropdownMenu.classList.remove('show');
                }
              }
            }, 150);
          }}
        >
          <a
            className={`nav-link dropdown-toggle ${linkClass}`}
            href="#"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            onClick={(e) => e.preventDefault()}
          >
            {item.label}
          </a>
          <ul
            className="dropdown-menu"
            onMouseEnter={(e) => {
              e.currentTarget.classList.add('show');
            }}
            onMouseLeave={(e) => {
              const currentTarget = e.currentTarget;
              setTimeout(() => {
                if (currentTarget && document.contains(currentTarget) && !currentTarget.matches(':hover')) {
                  currentTarget.classList.remove('show');
                }
              }, 150);
            }}
          >
            {item.dropdown.map((dropdownItem) => {
              if (dropdownItem.subDropdown && dropdownItem.subDropdown.length > 0) {
                return (
                  <li
                    key={dropdownItem.label}
                    className="dropdown-item dropdown-submenu"
                    onMouseEnter={(e) => {
                      // Close all other sub-dropdowns first
                      const allSubMenus = document.querySelectorAll('.sub-dropdown-menu.show');
                      allSubMenus.forEach(subMenu => {
                        if (subMenu && subMenu !== e.currentTarget.querySelector('.sub-dropdown-menu')) {
                          subMenu.classList.remove('show');
                        }
                      });

                      const subDropdownMenu = e.currentTarget.querySelector('.sub-dropdown-menu');
                      if (subDropdownMenu) {
                        subDropdownMenu.classList.add('show');
                      }
                    }}
                    onMouseLeave={(e) => {
                      const currentTarget = e.currentTarget;
                      setTimeout(() => {
                        if (currentTarget && document.contains(currentTarget)) {
                          const subDropdownMenu = currentTarget.querySelector('.sub-dropdown-menu');
                          if (subDropdownMenu && !currentTarget.matches(':hover') && !subDropdownMenu.matches(':hover')) {
                            subDropdownMenu.classList.remove('show');
                          }
                        }
                      }, 150);
                    }}
                  >
                    <a
                      className="dropdown-link"
                      href={dropdownItem.href}
                      onClick={(e) => e.preventDefault()}
                    >
                      {dropdownItem.label}
                      <IconifyIcon icon="ri:arrow-right-s-line" className="ms-auto" />
                    </a>
                    <ul
                      className="dropdown-menu sub-dropdown-menu"
                      onMouseEnter={(e) => {
                        e.currentTarget.classList.add('show');
                      }}
                      onMouseLeave={(e) => {
                        const currentTarget = e.currentTarget;
                        setTimeout(() => {
                          if (currentTarget && document.contains(currentTarget) && !currentTarget.matches(':hover')) {
                            currentTarget.classList.remove('show');
                          }
                        }, 150);
                      }}
                    >
                      {dropdownItem.subDropdown.map((subDropdownItem) => (
                        <li key={subDropdownItem.label}>
                          <a
                            className="dropdown-item"
                            href={subDropdownItem.href}
                          >
                            {subDropdownItem.label}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </li>
                );
              }

              return (
                <li key={dropdownItem.label}>
                  <a
                    className="dropdown-item"
                    href={dropdownItem.href}
                  >
                    {dropdownItem.label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
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
      <style jsx global>{`
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
        
        /* Dropdown Styles */
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
           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
           border-radius: 8px;
           padding: 0.5rem 0;
           min-width: 220px;
           margin-top: 0;
           opacity: 0;
           visibility: hidden;
           transform: translateY(-10px);
           position: absolute;
           top: 100%;
           left: 0;
           background: #343a40;
           border: 1px solid rgba(255,255,255,0.1);
         }
        
        .dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        
        .nav-item.dropdown {
          position: relative;
        }
        
        .nav-item.dropdown::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          height: 10px;
          background: transparent;
        }
        
                 .dropdown-item {
           transition: all 0.2s ease;
           padding: 0.75rem 1.25rem;
           border-radius: 0;
           color: white;
         }
         
         /* Ensure consistent padding for all dropdown items */
         .dropdown-item .dropdown-link,
         .dropdown-submenu .dropdown-link {
           padding: 0.75rem 1.25rem !important;
           margin: 0 !important;
         }
        
        .dropdown-item:hover {
          background-color: var(--bs-primary);
          color: white;
          transform: translateX(5px);
        }
        
        /* Sub-dropdown Styles */
                 .dropdown-submenu {
           position: relative !important;
           display: block !important;
           padding: 0 !important;
         }
        
                 /* Override Bootstrap's default dropdown positioning */
         .dropdown-menu .dropdown-submenu .dropdown-menu {
           position: absolute !important;
           top: 0 !important;
           left: 100% !important;
           margin-top: 0 !important;
           margin-left: 2px !important;
           opacity: 0;
           visibility: hidden;
           transform: translateX(-10px);
           min-width: 220px;
           z-index: 1001;
           background: #343a40;
           border: 1px solid rgba(255,255,255,0.1);
           border-radius: 8px;
           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
           padding: 0.5rem 0;
           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
           display: block !important;
           transform-origin: left center;
         }
        
        .dropdown-menu .dropdown-submenu .dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }
        
                 .dropdown-link {
           display: flex;
           align-items: center;
           justify-content: space-between;
           text-decoration: none;
           color: inherit;
           padding: 0.75rem 1.25rem;
           width: 100%;
           transition: all 0.2s ease;
           border-radius: 0;
         }
        
        .dropdown-link:hover {
          background-color: var(--bs-primary);
          color: white;
          text-decoration: none;
          transform: translateX(5px);
        }
        
                 .dropdown-submenu .sub-dropdown-menu {
           position: absolute !important;
           top: 0 !important;
           left: 100% !important;
           margin-top: 0 !important;
           margin-left: 2px !important;
           opacity: 0;
           visibility: hidden;
           transform: translateX(-10px);
           min-width: 220px;
           z-index: 1001;
           background: #343a40;
           border: 1px solid rgba(255,255,255,0.1);
           border-radius: 8px;
           box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
           padding: 0.5rem 0;
           transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
           display: block !important;
           transform-origin: left center;
         }
        
        .dropdown-submenu .sub-dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateX(0);
        }
        
                 .dropdown-submenu .sub-dropdown-menu .dropdown-item {
           padding: 0.75rem 1.25rem;
           border-radius: 0;
           transition: all 0.2s ease;
           color: white;
         }
        
        .dropdown-submenu .sub-dropdown-menu .dropdown-item:hover {
          background-color: var(--bs-primary);
          color: white;
          transform: translateX(5px);
        }
        
        /* Force sub-dropdown to appear to the right */
        .dropdown-submenu .sub-dropdown-menu,
        .dropdown-menu .dropdown-submenu .dropdown-menu {
          position: absolute !important;
          top: 0 !important;
          left: 100% !important;
          right: auto !important;
          bottom: auto !important;
          margin-top: 0 !important;
          margin-left: 2px !important;
          margin-right: auto !important;
          margin-bottom: auto !important;
          transform: translateX(-10px) !important;
        }
        
        .dropdown-submenu .sub-dropdown-menu.show,
        .dropdown-menu .dropdown-submenu .dropdown-menu.show {
          transform: translateX(0) !important;
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
