# Role-Based Dashboard System

This project now implements a role-based dashboard system with three distinct user roles and their corresponding dashboards.

## User Roles

### 1. Admin (Full Access)
- **Email**: `admin@demo.com`
- **Password**: `123456`
- **Dashboard**: Analytics Dashboard (`/dashboards/analytics`)
- **Access**: All features and dashboards
- **Menu Items**: Complete access to all components, charts, forms, tables, etc.

### 2. SubAdmin (Agent Access)
- **Email**: `subadmin@demo.com`
- **Password**: `123456`
- **Dashboard**: Agent Dashboard (`/dashboards/agent`)
- **Access**: Agent-focused features
- **Menu Items**: Limited access to property management, customer management, and basic UI components

### 3. Customer (Limited Access)
- **Email**: `customer@demo.com`
- **Password**: `123456`
- **Dashboard**: Customer Dashboard (`/dashboards/customer`)
- **Access**: Customer-specific features
- **Menu Items**: Very limited access - property browsing, orders, transactions, and basic components

## Features

### Role-Based Menu Items
- Each role has a unique sidebar menu with appropriate access levels
- Admin sees all available features
- SubAdmin sees agent-relevant features
- Customer sees only customer-relevant features

### Role-Based Routing
- Middleware automatically redirects users to their appropriate dashboard
- Users cannot access dashboards they don't have permission for
- Automatic redirection based on user role

### Role Indicator
- Current user role is displayed in the top navigation bar
- Color-coded badges for easy identification:
  - Admin: Blue (primary)
  - SubAdmin: Yellow (warning)
  - Customer: Green (success)

### Dashboard Switching
- Admin can switch between all three dashboards
- SubAdmin can only access the Agent dashboard
- Customer can only access the Customer dashboard
- Dashboard switching available in the user profile dropdown

## File Structure

```
src/
├── assets/data/
│   ├── admin-menu-items.js      # Admin menu items (full access)
│   ├── subadmin-menu-items.js   # SubAdmin menu items (agent access)
│   ├── customer-menu-items.js   # Customer menu items (limited access)
│   └── menu-items.js            # Original menu items (fallback)
├── helpers/
│   └── Manu.js                  # Updated to return role-based menus
├── components/layout/
│   ├── TopNavigationBar/
│   │   ├── components/
│   │   │   ├── ProfileDropdown.jsx  # Updated with role-based dashboard switching
│   │   │   └── RoleIndicator.jsx    # New role display component
│   │   └── page.jsx                 # Updated to include role indicator
│   └── VerticalNavigationBar/
│       └── page.jsx                 # Updated to use role-based menus
└── app/api/auth/[...nextauth]/
    └── options.js                   # Updated with multiple user roles
```

## How It Works

1. **Authentication**: Users log in with their respective credentials
2. **Role Detection**: NextAuth provides user role information
3. **Menu Generation**: `getMenuItems()` function returns appropriate menu based on role
4. **Access Control**: Middleware enforces role-based access to routes
5. **Dashboard Display**: Users see only the dashboard and features they have access to

## Testing

To test different roles:

1. **Admin Access**: Login with `admin@demo.com` / `123456`
   - Access to all dashboards and features
   - Full sidebar menu

2. **SubAdmin Access**: Login with `subadmin@demo.com` / `123456`
   - Access only to Agent dashboard
   - Limited sidebar menu

3. **Customer Access**: Login with `customer@demo.com` / `123456`
   - Access only to Customer dashboard
   - Minimal sidebar menu

## Security Features

- Role-based access control at the middleware level
- Automatic redirection to appropriate dashboards
- Menu items filtered by user role
- Session-based authentication with NextAuth
- Protected routes for all dashboard and feature pages

## Customization

To add new roles or modify existing ones:

1. Add new user in `options.js`
2. Create new menu items file in `assets/data/`
3. Update `getMenuItems()` function in `Manu.js`
4. Add role-specific logic in middleware if needed
5. Update dashboard switching logic in ProfileDropdown

## Notes

- The system automatically handles role-based access
- Users are redirected to their appropriate dashboard on login
- Menu items are dynamically generated based on user role
- All existing dashboard designs are preserved and used appropriately
- The system is backward compatible with the existing codebase
