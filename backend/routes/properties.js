const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Property = require('../models/Property');
const { auth, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');
const { upload, uploadFileToS3 } = require('../utils/s3Upload');

const router = express.Router();

// Validation middleware
const validateProperty = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long'),
  body('type')
    .isIn(['sale', 'rent', 'both'])
    .withMessage('Invalid property type'),
  body('category')
    .isIn(['Single Story', 'Double Story'])
    .withMessage('Invalid property category'),
  body('price')
    .optional()
    .custom((value) => {
      if (value === undefined || value === null || value === '') {
        return true; // Allow empty/undefined values
      }
      const numValue = parseFloat(value);
      if (isNaN(numValue) || numValue < 0) {
        throw new Error('Price must be a positive number');
      }
      return true;
    }),
  body('location.address')
    .optional()
    .custom((value) => {
      if (value === undefined || value === null || value === '') {
        return true; // Allow empty/undefined values
      }
      if (value.trim().length < 10) {
        throw new Error('Address must be at least 10 characters if provided');
      }
      return true;
    }),
  body('location.city')
    .optional()
    .custom((value) => {
      if (value === undefined || value === null || value === '') {
        return true; // Allow empty/undefined values
      }
      if (value.trim().length === 0) {
        throw new Error('City cannot be empty if provided');
      }
      return true;
    }),
  body('location.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),
  body('agent')
    .optional()
    .isMongoId()
    .withMessage('Valid agent ID is required'),
  body('owner')
    .optional()
    .isMongoId()
    .withMessage('Valid owner ID is required')
];

// @route   GET /api/properties
// @desc    Get all properties with filtering and pagination
// @access  Public
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('type').optional().isIn(['sale', 'rent', 'both']).withMessage('Invalid type filter'),
  query('category').optional().isIn(['Single Story', 'Double Story']).withMessage('Invalid category filter'),
  query('minPrice').optional().isFloat({ min: 0 }).withMessage('Min price must be positive'),
  query('maxPrice').optional().isFloat({ min: 0 }).withMessage('Max price must be positive'),
  query('city').optional().trim().notEmpty().withMessage('City cannot be empty'),
  query('status').optional().isIn(['available', 'sold', 'rented', 'pending', 'inactive']).withMessage('Invalid status filter')
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
    type,
    category,
    minPrice,
    maxPrice,
    city,
    status,
    sortBy = 'createdAt',
    sortOrder = 'desc'
  } = req.query;

  // Build filter object
  const filter = { isActive: true };
  
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (city) filter['location.city'] = new RegExp(city, 'i');
  
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseFloat(minPrice);
    if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
  }

  // Build sort object
  const sort = {};
  sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

  // Execute query with pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  
  const [properties, total] = await Promise.all([
    Property.find(filter)
      .populate('agent', 'firstName lastName email profilePicture')
      .populate('owner', 'firstName lastName email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .lean(),
    Property.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / parseInt(limit));

  res.json({
    success: true,
    data: {
      properties,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    }
  });
}));

// @route   GET /api/properties/featured
// @desc    Get featured properties
// @access  Public
router.get('/featured', asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;

  const properties = await Property.find({ 
    isFeatured: true, 
    isActive: true, 
    status: 'available' 
  })
    .populate('agent', 'firstName lastName email profilePicture')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .lean();

  res.json({
    success: true,
    data: { properties }
  });
}));

// @route   GET /api/properties/random
// @desc    Get random properties
// @access  Public
router.get('/random', asyncHandler(async (req, res) => {
  const { limit = 6 } = req.query;

  const properties = await Property.aggregate([
    { $match: { isActive: true, status: 'available' } },
    { $sample: { size: parseInt(limit) } }
  ]);

  // Populate agent information for each property
  const populatedProperties = await Property.populate(properties, [
    { path: 'agent', select: 'firstName lastName email profilePicture' }
  ]);

  res.json({
    success: true,
    data: { properties: populatedProperties }
  });
}));

// @route   GET /api/properties/:id
// @desc    Get property by ID
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const { id } = req.params;

  const property = await Property.findById(id)
    .populate('agent', 'firstName lastName email profilePicture phoneNumber')
    .populate('owner', 'firstName lastName email')
    .populate('favorites', 'firstName lastName');

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }

  // Increment view count
  property.views += 1;
  await property.save();

  res.json({
    success: true,
    data: { property }
  });
}));

// @route   POST /api/properties
// @desc    Create new property
// @access  Private (Agents and Admins)
router.post('/', auth, authorize('agent', 'admin'), validateProperty, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const propertyData = req.body;
  console.log('Received property data:', propertyData);
  
  // Set agent and owner based on user role
  if (req.user.role === 'agent') {
    propertyData.agent = req.user.userId;
    propertyData.owner = req.user.userId; // Agent is also the owner
  } else if (req.user.role === 'admin') {
    // For admin, if agent is not provided, set admin as both agent and owner
    if (!propertyData.agent) {
      propertyData.agent = req.user.userId;
    }
    if (!propertyData.owner) {
      propertyData.owner = req.user.userId;
    }
  }

  try {
    const property = new Property(propertyData);
    await property.save();

    await property.populate('agent', 'firstName lastName email profilePicture');
    await property.populate('owner', 'firstName lastName email');

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: { property }
    });
  } catch (error) {
    console.error('Property creation error:', error);
    res.status(400).json({
      success: false,
      message: error.message,
      errors: error.errors ? Object.keys(error.errors).map(key => ({
        field: key,
        message: error.errors[key].message
      })) : []
    });
  }
}));

// @route   PUT /api/properties/:id
// @desc    Update property
// @access  Private (Property owner, agent, or admin)
router.put('/:id', auth, validateProperty, asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const { id } = req.params;
  const property = await Property.findById(id);

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }

  // Check permissions
  const canEdit = req.user.role === 'admin' || 
                 property.agent.toString() === req.user.userId ||
                 property.owner.toString() === req.user.userId;

  if (!canEdit) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to edit this property'
    });
  }

  Object.assign(property, req.body);
  await property.save();

  await property.populate('agent', 'firstName lastName email profilePicture');
  await property.populate('owner', 'firstName lastName email');

  res.json({
    success: true,
    message: 'Property updated successfully',
    data: { property }
  });
}));

// @route   DELETE /api/properties/:id
// @desc    Delete property
// @access  Private (Property owner, agent, or admin)
router.delete('/:id', auth, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const property = await Property.findById(id);

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }

  // Check permissions
  const canDelete = req.user.role === 'admin' || 
                   property.agent.toString() === req.user.userId ||
                   property.owner.toString() === req.user.userId;

  if (!canDelete) {
    return res.status(403).json({
      success: false,
      message: 'You do not have permission to delete this property'
    });
  }

  await Property.findByIdAndDelete(id);

  res.json({
    success: true,
    message: 'Property deleted successfully'
  });
}));

// @route   POST /api/properties/:id/favorite
// @desc    Toggle favorite property
// @access  Private
router.post('/:id/favorite', auth, asyncHandler(async (req, res) => {
  const { id } = req.params;
  const property = await Property.findById(id);

  if (!property) {
    return res.status(404).json({
      success: false,
      message: 'Property not found'
    });
  }

  const userId = req.user.userId;
  const isFavorited = property.favorites.includes(userId);

  if (isFavorited) {
    property.favorites = property.favorites.filter(fav => fav.toString() !== userId);
  } else {
    property.favorites.push(userId);
  }

  await property.save();

  res.json({
    success: true,
    message: isFavorited ? 'Property removed from favorites' : 'Property added to favorites',
    data: { isFavorited: !isFavorited }
  });
}));

// @route   POST /api/properties/upload-image
// @desc    Upload property image to S3
// @access  Private (Admin, Agent, or Property Owner)
router.post('/upload-image', 
  auth, 
  authorize('admin', 'agent', 'owner'),
  upload.single('image'),
  asyncHandler(async (req, res) => {
    try {
      // Check if file was uploaded
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message: 'No image file provided'
        });
      }

      // Validate file type
      const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
      if (!allowedImageTypes.includes(req.file.mimetype)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid file type. Only JPEG, JPG, PNG, GIF, WebP, and SVG images are allowed.'
        });
      }

      // Validate file size (max 10MB for images)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (req.file.size > maxSize) {
        return res.status(400).json({
          success: false,
          message: 'File size too large. Maximum size is 10MB.'
        });
      }

      const userId = req.user.userId;
      const userRole = req.user.role;
      
      // Create folder name based on user role and purpose
      const folder = 'property-images';
      
      // Upload file to S3
      const uploadResult = await uploadFileToS3(
        req.file.buffer,
        req.file.originalname,
        req.file.mimetype,
        userId,
        folder
      );

      res.json({
        success: true,
        message: 'Property image uploaded successfully',
        data: {
          fileUrl: uploadResult.fileUrl,
          fileKey: uploadResult.fileKey,
          fileName: uploadResult.fileName,
          originalName: uploadResult.originalName,
          contentType: uploadResult.contentType,
          size: uploadResult.size,
          uploadedAt: uploadResult.uploadedAt
        }
      });
    } catch (error) {
      console.error('Property image upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload property image',
        error: error.message
      });
    }
  })
);

// @route   POST /api/properties/upload-multiple-images
// @desc    Upload multiple property images to S3
// @access  Private (Admin, Agent, or Property Owner)
router.post('/upload-multiple-images',
  auth,
  authorize('admin', 'agent', 'owner'),
  upload.array('images', 10), // Maximum 10 images
  asyncHandler(async (req, res) => {
    try {
      // Check if files were uploaded
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No image files provided'
        });
      }

      const userId = req.user.userId;
      const folder = 'property-images';
      const uploadResults = [];

      // Process each uploaded file
      for (const file of req.files) {
        // Validate file type
        const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
        if (!allowedImageTypes.includes(file.mimetype)) {
          return res.status(400).json({
            success: false,
            message: `Invalid file type for ${file.originalname}. Only JPEG, JPG, PNG, GIF, WebP, and SVG images are allowed.`
          });
        }

        // Validate file size (max 10MB for images)
        const maxSize = 10 * 1024 * 1024; // 10MB
        if (file.size > maxSize) {
          return res.status(400).json({
            success: false,
            message: `File size too large for ${file.originalname}. Maximum size is 10MB.`
          });
        }

        // Upload file to S3
        const uploadResult = await uploadFileToS3(
          file.buffer,
          file.originalname,
          file.mimetype,
          userId,
          folder
        );

        uploadResults.push({
          fileUrl: uploadResult.fileUrl,
          fileKey: uploadResult.fileKey,
          fileName: uploadResult.fileName,
          originalName: uploadResult.originalName,
          contentType: uploadResult.contentType,
          size: uploadResult.size,
          uploadedAt: uploadResult.uploadedAt
        });
      }

      res.json({
        success: true,
        message: `${uploadResults.length} property image(s) uploaded successfully`,
        data: {
          files: uploadResults,
          count: uploadResults.length
        }
      });
    } catch (error) {
      console.error('Multiple property images upload error:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to upload property images',
        error: error.message
      });
    }
  })
);

module.exports = router;
