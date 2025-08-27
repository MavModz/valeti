# Backend API

A Node.js backend API with Express, MongoDB, and JWT authentication.

## Features

- 🔐 JWT Authentication
- 👤 User Management (Signup, Signin, Password Reset)
- 📧 Email Verification & Password Reset
- 🛡️ Role-based Authorization
- 🔒 Security Middleware (Helmet, CORS)
- 📝 Input Validation
- 🚨 Error Handling
- 📊 Request Logging

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- SMTP service for emails (Gmail, Mailtrap, etc.)

## Installation

1. **Clone the repository and navigate to backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp env.example .env
   ```
   
   Edit `.env` file with your configuration:
   - MongoDB connection string
   - JWT secret key
   - SMTP credentials
   - Frontend URL

4. **Start the development server:**
   ```bash
   npm run dev
   ```

## Environment Variables

Create a `.env` file in the backend directory with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Frontend URL
FRONTEND_URL=http://localhost:3000

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/your-database-name

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com
EMAIL_FROM_NAME=Your Platform Name
```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/api/auth/signup` | Register a new user | Public |
| POST | `/api/auth/signin` | Login user | Public |
| POST | `/api/auth/forgot-password` | Send password reset email | Public |
| POST | `/api/auth/reset-password` | Reset password with token | Public |
| POST | `/api/auth/verify-email` | Verify email with token | Public |
| GET | `/api/auth/me` | Get current user profile | Private |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

## Request Examples

### Signup
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Signin
```bash
curl -X POST http://localhost:5000/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

### Forgot Password
```bash
curl -X POST http://localhost:5000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

### Reset Password
```bash
curl -X POST http://localhost:5000/api/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "reset-token-here",
    "password": "NewPassword123"
  }'
```

### Get Profile (Protected Route)
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Response Format

All API responses follow this format:

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    // Validation errors (if any)
  ]
}
```

## User Roles

- `user`: Regular user
- `admin`: Administrator
- `agent`: Agent/Staff member

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Helmet security headers
- Rate limiting (can be added)
- Request logging

## Email Templates

The API includes email templates for:
- Email verification
- Password reset
- Welcome email

## Development

### Running in Development Mode
```bash
npm run dev
```

### Running in Production Mode
```bash
npm start
```

### Testing Email Configuration
You can test your email configuration by checking the console logs when the server starts.

## Database Schema

### User Model
```javascript
{
  firstName: String (required),
  lastName: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin', 'agent']),
  isEmailVerified: Boolean,
  emailVerificationToken: String,
  emailVerificationExpires: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  lastLogin: Date,
  isActive: Boolean,
  profilePicture: String,
  phoneNumber: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String
  },
  timestamps: true
}
```

## Next Steps

1. Add your MongoDB connection string to `.env`
2. Configure SMTP settings for email functionality
3. Test the API endpoints
4. Integrate with your frontend application
5. Add additional features as needed

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**: Check your MongoDB URI in `.env`
2. **Email Not Sending**: Verify SMTP credentials and settings
3. **CORS Error**: Ensure `FRONTEND_URL` is set correctly
4. **JWT Error**: Check `JWT_SECRET` is set and secure

### Logs

The server provides detailed logging for debugging:
- Request logs (Morgan)
- Error logs with stack traces
- Email sending status
- Database connection status
