const express = require('express');
const { query } = require('express-validator');
const Dashboard = require('../models/Dashboard');
const Property = require('../models/Property');
const User = require('../models/User');
const { auth, authorize } = require('../middleware/auth');
const { asyncHandler } = require('../utils/asyncHandler');

const router = express.Router();

// @route   GET /api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private (Admin, Agent)
router.get('/stats', auth, authorize('admin', 'agent'), asyncHandler(async (req, res) => {
  const dashboard = await Dashboard.getDashboardData('analytics');
  await dashboard.updateStatistics();

  res.json({
    success: true,
    data: {
      statistics: dashboard.statistics,
      lastUpdated: dashboard.lastUpdated
    }
  });
}));

// @route   GET /api/dashboard/analytics
// @desc    Get analytics data with charts
// @access  Private (Admin, Agent)
router.get('/analytics', auth, authorize('admin', 'agent'), [
  query('period').optional().isIn(['7d', '30d', '90d', '1y']).withMessage('Invalid period'),
  query('type').optional().isIn(['analytics', 'agent', 'customer']).withMessage('Invalid dashboard type')
], asyncHandler(async (req, res) => {
  const { period = '30d', type = 'analytics' } = req.query;

  const dashboard = await Dashboard.getDashboardData(type);
  await dashboard.updateStatistics();

  // Generate chart data based on period
  const chartData = await generateChartData(period, type);

  res.json({
    success: true,
    data: {
      statistics: dashboard.statistics,
      charts: chartData,
      recentActivity: dashboard.recentActivity.slice(0, 10),
      topPerformers: dashboard.topPerformers,
      lastUpdated: dashboard.lastUpdated
    }
  });
}));

// @route   GET /api/dashboard/agent/:agentId
// @desc    Get agent-specific dashboard data
// @access  Private (Admin, Agent)
router.get('/agent/:agentId', auth, authorize('admin', 'agent'), asyncHandler(async (req, res) => {
  const { agentId } = req.params;

  // Check if user can access this agent's data
  if (req.user.role === 'agent' && req.user.userId !== agentId) {
    return res.status(403).json({
      success: false,
      message: 'You can only access your own dashboard'
    });
  }

  const agent = await User.findById(agentId);
  if (!agent || agent.role !== 'agent') {
    return res.status(404).json({
      success: false,
      message: 'Agent not found'
    });
  }

  // Get agent's properties
  const properties = await Property.find({ agent: agentId, isActive: true });
  
  // Calculate agent statistics
  const stats = {
    totalProperties: properties.length,
    propertiesSold: properties.filter(p => p.status === 'sold').length,
    propertiesRented: properties.filter(p => p.status === 'rented').length,
    activeListings: properties.filter(p => p.status === 'available').length,
    totalRevenue: properties
      .filter(p => p.status === 'sold')
      .reduce((sum, p) => sum + p.price, 0),
    totalViews: properties.reduce((sum, p) => sum + p.views, 0),
    totalFavorites: properties.reduce((sum, p) => sum + p.favorites.length, 0)
  };

  // Get recent properties
  const recentProperties = await Property.find({ agent: agentId })
    .sort({ createdAt: -1 })
    .limit(5)
    .populate('owner', 'firstName lastName email')
    .lean();

  res.json({
    success: true,
    data: {
      agent: {
        id: agent._id,
        name: `${agent.firstName} ${agent.lastName}`,
        email: agent.email,
        profilePicture: agent.profilePicture,
        phoneNumber: agent.phoneNumber
      },
      statistics: stats,
      recentProperties,
      lastUpdated: new Date()
    }
  });
}));

// @route   GET /api/dashboard/customer/:customerId
// @desc    Get customer-specific dashboard data
// @access  Private (Admin, Customer)
router.get('/customer/:customerId', auth, authorize('admin', 'user'), asyncHandler(async (req, res) => {
  const { customerId } = req.params;

  // Check if user can access this customer's data
  if (req.user.role === 'user' && req.user.userId !== customerId) {
    return res.status(403).json({
      success: false,
      message: 'You can only access your own dashboard'
    });
  }

  const customer = await User.findById(customerId);
  if (!customer || customer.role !== 'user') {
    return res.status(404).json({
      success: false,
      message: 'Customer not found'
    });
  }

  // Get customer's favorite properties
  const favoriteProperties = await Property.find({
    favorites: customerId,
    isActive: true
  })
    .populate('agent', 'firstName lastName email profilePicture')
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Get properties viewed by customer (this would need a separate model for tracking)
  const viewedProperties = await Property.find({
    isActive: true
  })
    .sort({ views: -1 })
    .limit(5)
    .populate('agent', 'firstName lastName email profilePicture')
    .lean();

  const stats = {
    favoriteProperties: favoriteProperties.length,
    viewedProperties: viewedProperties.length,
    totalProperties: await Property.countDocuments({ isActive: true })
  };

  res.json({
    success: true,
    data: {
      customer: {
        id: customer._id,
        name: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        profilePicture: customer.profilePicture
      },
      statistics: stats,
      favoriteProperties,
      viewedProperties,
      lastUpdated: new Date()
    }
  });
}));

// Helper function to generate chart data
async function generateChartData(period, type) {
  const now = new Date();
  let startDate;

  switch (period) {
    case '7d':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      break;
    case '1y':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  }

  // Generate property data by month
  const propertyData = await Property.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate },
        isActive: true
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' }
        },
        count: { $sum: 1 },
        revenue: { $sum: '$price' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  // Generate revenue data
  const revenueData = await Property.aggregate([
    {
      $match: {
        status: { $in: ['sold', 'rented'] },
        updatedAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: {
          year: { $year: '$updatedAt' },
          month: { $month: '$updatedAt' }
        },
        amount: { $sum: '$price' },
        type: { $first: '$status' }
      }
    },
    {
      $sort: { '_id.year': 1, '_id.month': 1 }
    }
  ]);

  // Generate country data
  const countryData = await Property.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$location.country',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    },
    {
      $limit: 10
    }
  ]);

  // Calculate percentages for country data
  const totalProperties = await Property.countDocuments({ isActive: true });
  countryData.forEach(country => {
    country.percentage = ((country.count / totalProperties) * 100).toFixed(1);
  });

  // Generate category data
  const categoryData = await Property.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  // Calculate percentages for category data
  categoryData.forEach(category => {
    category.percentage = ((category.count / totalProperties) * 100).toFixed(1);
  });

  return {
    propertyData: propertyData.map(item => ({
      month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
      count: item.count,
      revenue: item.revenue
    })),
    revenueData: revenueData.map(item => ({
      month: `${item._id.year}-${item._id.month.toString().padStart(2, '0')}`,
      amount: item.amount,
      type: item.type
    })),
    countryData,
    categoryData
  };
}

module.exports = router;
