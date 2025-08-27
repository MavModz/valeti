const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');
const { upload, uploadFileToS3 } = require('../utils/s3Upload');

const router = express.Router();

// Validation middleware
const validateUserUpdate = [
  body('firstName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('phoneNumber')
    .optional()
    .trim()
    .isMobilePhone()
    .withMessage('Please provide a valid phone number'),
  body('role')
    .optional()
    .isIn(['user', 'admin', 'agent'])
    .withMessage('Invalid role specified'),
  body('isActive')
    .optional()
    .isBoolean()
    .withMessage('isActive must be a boolean value')
];

// Validation middleware for creating agents
const validateCreateAgent = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('propertiesNumber')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Properties number must be a non-negative integer'),
  body('address.zipCode')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),
  body('address.city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address.country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  body('socialMedia.facebook')
    .optional()
    .isURL()
    .withMessage('Please provide a valid Facebook URL'),
  body('socialMedia.instagram')
    .optional()
    .isURL()
    .withMessage('Please provide a valid Instagram URL'),
  body('socialMedia.twitter')
    .optional()
    .isURL()
    .withMessage('Please provide a valid Twitter URL'),
  body('profilePicture')
    .optional()
    .isURL()
    .withMessage('Please provide a valid profile picture URL')
];

// @route   GET /api/users
// @desc    Get all users with filtering and pagination
// @access  Private (Admin only)
router.get('/', auth, authorize('admin'), [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('role').optional().isIn(['user', 'admin', 'agent']).withMessage('Invalid role filter'),
  query('isActive').optional().isBoolean().withMessage('isActive must be a boolean'),
  query('search').optional().trim().notEmpty().withMessage('Search term cannot be empty')
], asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const {
    page = 1,
    limit = 10,
    role,
    isActive,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = {};
  
  if (role) filter.role = role;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  
  if (search) {
    filter.$or = [
      { firstName: new RegExp(search, 'i') },
      { lastName: new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') }
    ];
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Execute query with pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [users, total] = await Promise.all([
    User.find(filter)
      .select('-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    User.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / parseInt(limit));

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }
  });
}));

// @route   GET /api/users/agents
// @desc    Get all agents
// @access  Private (Admin, Agent)
router.get('/agents', auth, authorize('admin', 'agent'), asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const agents = await User.find({ 
    role: 'agent', 
    isActive: true 
  })
    .select('firstName lastName email profilePicture phoneNumber createdAt')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .lean();

  res.json({
    success: true,
    data: { agents }
  });
}));

// @route   GET /api/users/customers
// @desc    Get all customers
// @access  Private (Admin, Agent)
router.get('/customers', auth, authorize('admin', 'agent'), asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const customers = await User.find({ 
    role: 'user', 
    isActive: true 
  })
    .select('firstName lastName email profilePicture phoneNumber createdAt')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .lean();

  res.json({
    success: true,
    data: { customers }
  });
}));

// @route   POST /api/users/agents
// @desc    Create a new agent
// @access  Private (Admin only)
router.post('/agents', auth, authorize('admin'), validateCreateAgent, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    description,
    propertiesNumber,
    address,
    socialMedia,
    specialization,
    experience,
    licenseNumber,
    commission,
    profilePicture
  } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered'
    });
  }

  // Create new agent
  const agent = new User({
    firstName,
    lastName,
    email,
    password,
    role: 'agent',
    phoneNumber,
    description,
    propertiesNumber: propertiesNumber || 0,
    address,
    socialMedia,
    specialization: specialization || [],
    experience: experience || 0,
    licenseNumber,
    commission: commission || 0,
    profilePicture: profilePicture || null,
    isEmailVerified: true, // Auto-verify agents created by admin
    isActive: true
  });

  await agent.save();

  // Send welcome email (optional)
  try {
    const { sendEmail } = require('../utils/emailService');
    await sendEmail({
      to: email,
      subject: 'Welcome to Our Platform - Agent Account Created',
      template: 'welcomeEmail',
      data: {
        firstName,
        loginUrl: `${process.env.FRONTEND_URL}/auth/sign-in`
      }
    });
  } catch (error) {
    console.error('Welcome email sending failed:', error);
    // Don't fail the agent creation if email fails
  }

  const agentData = agent.toJSON();

  res.status(201).json({
    success: true,
    message: 'Agent created successfully',
    data: { agent: agentData }
  });
}));

// @route   POST /api/users/agents/upload-image
// @desc    Upload agent profile image to S3
// @access  Private (Admin, Agent)
router.post('/agents/upload-image', auth, authorize('admin', 'agent'), upload.single('image'), asyncHandler(async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Validate file type
    const allowedImageTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];

    if (!allowedImageTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPEG, JPG, PNG, GIF, WebP, and SVG images are allowed.'
      });
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.'
      });
    }

    // Upload to S3 with agents-images directory
    const uploadResult = await uploadFileToS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      req.user.userId,
      'agents-images'
    );

    res.json({
      success: true,
      message: 'Agent profile image uploaded successfully',
      data: {
        fileUrl: uploadResult.fileUrl,
        originalName: uploadResult.originalName,
        fileSize: uploadResult.size,
        mimeType: uploadResult.contentType,
        key: uploadResult.fileKey
      }
    });

  } catch (error) {
    console.error('Agent image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload agent profile image',
      error: error.message
    });
  }
}));

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Private (Admin, or user themselves)
router.get('/:id', auth, asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Check permissions
  if (req.user.role !== 'admin' && req.user.userId !== id) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to view this user'
    });
  }

  const user = await User.findById(id)
    .select('-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: { user }
  });
}));

// @route   PUT /api/users/:id
// @desc    Update user
// @access  Private (Admin, or user themselves)
router.put('/:id', auth, validateUserUpdate, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { id } = req.params;
  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Check permissions
  const canEdit = req.user.role === 'admin' || req.user.userId === id;

  if (!canEdit) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to edit this user'
    });
  }

  // Only admins can change roles and active status
  if (req.body.role && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only admins can change user roles'
    });
  }

  if (req.body.isActive !== undefined && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Only admins can change user active status'
    });
  }

  Object.assign(user, req.body);
  await user.save();

  const updatedUser = user.toJSON();

  res.json({
    success: true,
    message: 'User updated successfully',
    data: { user: updatedUser }
  });
}));

// @route   DELETE /api/users/:id
// @desc    Delete user (soft delete)
// @access  Private (Admin only)
router.delete('/:id', auth, authorize('admin'), asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Soft delete by setting isActive to false
  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    message: 'User deactivated successfully'
  });
}));

// @route   POST /api/users/:id/activate
// @desc    Activate user
// @access  Private (Admin only)
router.post('/:id/activate', auth, authorize('admin'), asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  user.isActive = true;
  await user.save();

  res.json({
    success: true,
    message: 'User activated successfully'
  });
}));

// @route   GET /api/users/profile/me
// @desc    Get current user profile
// @access  Private
router.get('/profile/me', auth, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId)
    .select('-password -emailVerificationToken -emailVerificationExpires -passwordResetToken -passwordResetExpires');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    data: { user }
  });
}));

// @route   PUT /api/users/profile/me
// @desc    Update current user profile
// @access  Private
router.put('/profile/me', auth, validateUserUpdate, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const user = await User.findById(req.user.userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Remove role and isActive from update data (users can't change these)
  const { role, isActive, ...updateData } = req.body;

  Object.assign(user, updateData);
  await user.save();

  const updatedUser = user.toJSON();

  res.json({
    success: true,
    message: 'Profile updated successfully',
    data: { user: updatedUser }
  });
}));

// ==================== CUSTOMER ENDPOINTS ====================

// Validation middleware for creating customers
const validateCreateCustomer = [
  body('firstName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  body('lastName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('phoneNumber')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  body('viewProperties')
    .optional()
    .isInt({ min: 0 })
    .withMessage('View properties must be a non-negative integer'),
  body('ownProperties')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Own properties must be a non-negative integer'),
  body('investProperty')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Invest property must be a non-negative number'),
  body('address.zipCode')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Zip code is required'),
  body('address.city')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('City is required'),
  body('address.country')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  body('socialMedia.facebook')
    .optional()
    .isURL()
    .withMessage('Please provide a valid Facebook URL'),
  body('socialMedia.instagram')
    .optional()
    .isURL()
    .withMessage('Please provide a valid Instagram URL'),
  body('socialMedia.twitter')
    .optional()
    .isURL()
    .withMessage('Please provide a valid Twitter URL'),
  body('profilePicture')
    .optional()
    .isURL()
    .withMessage('Please provide a valid profile picture URL'),
  body('status')
    .optional()
    .isIn(['available', 'unavailable'])
    .withMessage('Status must be either available or unavailable')
];

// @route   POST /api/users/customers
// @desc    Create a new customer
// @access  Private (Admin only)
router.post('/customers', auth, authorize('admin'), validateCreateCustomer, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const {
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    description,
    viewProperties,
    ownProperties,
    investProperty,
    address,
    socialMedia,
    profilePicture,
    status
  } = req.body;

  // Check if email already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered'
    });
  }

  // Create new customer
  const customerData = {
    firstName,
    lastName,
    email,
    password,
    role: 'user', // Customers are regular users
    phoneNumber,
    description,
    viewProperties: viewProperties || 0,
    ownProperties: ownProperties || 0,
    investProperty: investProperty || 0,
    address,
    socialMedia,
    profilePicture: profilePicture || null,
    status: status || 'available',
    isEmailVerified: true, // Auto-verify customers created by admin
    isActive: true
  };

  console.log('Creating customer with data:', customerData);

  const customer = new User(customerData);

  await customer.save();

  console.log('Customer saved successfully with profile picture:', customer.profilePicture);

  // Send welcome email (optional)
  try {
    const { sendEmail } = require('../utils/emailService');
    await sendEmail({
      to: email,
      subject: 'Welcome to Our Platform - Customer Account Created',
      template: 'welcomeEmail',
      data: {
        firstName,
        loginUrl: `${process.env.FRONTEND_URL}/auth/sign-in`
      }
    });
  } catch (error) {
    console.error('Welcome email sending failed:', error);
    // Don't fail the customer creation if email fails
  }

  const customerResponse = customer.toJSON();

  res.status(201).json({
    success: true,
    message: 'Customer created successfully',
    data: { customer: customerResponse }
  });
}));

// @route   POST /api/users/customers/upload-image
// @desc    Upload customer profile image to S3
// @access  Private (Admin, Customer)
router.post('/customers/upload-image', auth, authorize('admin', 'user'), upload.single('image'), asyncHandler(async (req, res) => {
  console.log("Inside Customer Image Upload");
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }

    // Validate file type
    const allowedImageTypes = [
      'image/jpeg',
      'image/jpg', 
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];

    if (!allowedImageTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPEG, JPG, PNG, GIF, WebP, and SVG images are allowed.'
      });
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (req.file.size > maxSize) {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size is 10MB.'
      });
    }

    // Upload to S3 with customers-images directory
    const uploadResult = await uploadFileToS3(
      req.file.buffer,
      req.file.originalname,
      req.file.mimetype,
      req.user.userId,
      'customers-images'
    );

    res.json({
      success: true,
      message: 'Customer profile image uploaded successfully',
      data: {
        fileUrl: uploadResult.fileUrl,
        originalName: uploadResult.originalName,
        fileSize: uploadResult.size,
        mimeType: uploadResult.contentType,
        key: uploadResult.fileKey
      }
    });

  } catch (error) {
    console.error('Customer image upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to upload customer profile image',
      error: error.message
    });
  }
}));

module.exports = router;
