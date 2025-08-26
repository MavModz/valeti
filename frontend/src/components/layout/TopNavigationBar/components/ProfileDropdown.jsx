'use client';

import avatar1 from '@/assets/images/users/avatar-1.jpg';
import IconifyIcon from '@/components/wrappers/IconifyIcon';
import Image from 'next/image';
import Link from 'next/link';
import { Dropdown, DropdownHeader, DropdownItem, DropdownMenu, DropdownToggle } from 'react-bootstrap';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const ProfileDropdown = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const userRole = session?.user?.role || 'admin';

  const getAvailableDashboards = () => {
    switch (userRole) {
      case 'admin':
        return [
          { label: 'Analytics Dashboard', url: '/dashboards/analytics' },
          { label: 'Agent Dashboard', url: '/dashboards/agent' },
          { label: 'Customer Dashboard', url: '/dashboards/customer' }
        ];
      case 'agent':
        return [
          { label: 'Agent Dashboard', url: '/dashboards/agent' }
        ];
      case 'user':
        return [
          { label: 'Customer Dashboard', url: '/dashboards/customer' }
        ];
      default:
        return [];
    }
  };

  const getRoleDisplayName = (role) => {
    switch (role) {
      case 'admin':
        return 'Admin';
      case 'agent':
        return 'Agent';
      case 'user':
        return 'Customer';
      default:
        return 'User';
    }
  };

  const handleDashboardChange = (url) => {
    router.push(url);
  };

  const handleSignOut = () => {
    signOut({ callbackUrl: '/auth/sign-in' });
  };

  return <Dropdown className="topbar-item" drop="down">
      <DropdownToggle as={'a'} type="button" className="topbar-button content-none" id="page-header-user-dropdown " data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        <span className="d-flex align-items-center">
          <Image className="rounded-circle" width={32} src={avatar1} alt="avatar-3" />
        </span>
      </DropdownToggle>
      <DropdownMenu className="dropdown-menu-end">
        <DropdownHeader as={'h6'} className="dropdown-header">
          Welcome {session?.user?.firstName || 'User'}!
        </DropdownHeader>
        <DropdownHeader as={'small'} className="dropdown-header text-muted">
          Role: {getRoleDisplayName(userRole)}
        </DropdownHeader>
        
        {/* Dashboard Selection */}
        <DropdownHeader as={'h6'} className="dropdown-header">
          Available Dashboards
        </DropdownHeader>
        {getAvailableDashboards().map((dashboard, index) => (
          <DropdownItem
            key={index}
            onClick={() => handleDashboardChange(dashboard.url)}
          >
            <IconifyIcon icon="solar:dashboard-broken" className="align-middle me-2 fs-18" />
            <span className="align-middle">{dashboard.label}</span>
          </DropdownItem>
        ))}
        
        <div className="dropdown-divider my-1" />
        <DropdownItem as={Link} href="/profile">
          <IconifyIcon icon="solar:calendar-broken" className="align-middle me-2 fs-18" />
          <span className="align-middle">My Schedules</span>
        </DropdownItem>
        <DropdownItem as={Link} href="/pages/pricing">
          <IconifyIcon icon="solar:wallet-broken" className="align-middle me-2 fs-18" />
          <span className="align-middle">Pricing</span>
        </DropdownItem>
        <DropdownItem as={Link} href="/support/faqs">
          <IconifyIcon icon="solar:help-broken" className="align-middle me-2 fs-18" />
          <span className="align-middle">Help</span>
        </DropdownItem>
        <DropdownItem as={Link} href="/auth/lock-screen">
          <IconifyIcon icon="solar:lock-keyhole-broken" className="align-middle me-2 fs-18" />
          <span className="align-middle">Lock screen</span>
        </DropdownItem>
        <div className="dropdown-divider my-1" />
        <DropdownItem onClick={handleSignOut} className=" text-danger">
          <IconifyIcon icon="solar:logout-3-broken" className="align-middle me-2 fs-18" />
          <span className="align-middle">Logout</span>
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>;
};

export default ProfileDropdown;