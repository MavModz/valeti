'use client';

import React from 'react';
import { Badge } from 'react-bootstrap';
import { useSession } from 'next-auth/react';

const RoleIndicator = () => {
  const { data: session } = useSession();
  const userRole = session?.user?.role || 'admin';

  const getRoleVariant = (role) => {
    switch (role) {
      case 'admin':
        return 'primary';
      case 'agent':
        return 'warning';
      case 'user':
        return 'success';
      default:
        return 'secondary';
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

  return (
    <Badge bg={getRoleVariant(userRole)} className="me-2">
      {getRoleDisplayName(userRole)}
    </Badge>
  );
};

export default RoleIndicator;
