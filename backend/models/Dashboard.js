const mongoose = require('mongoose');

const dashboardSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['analytics', 'agent', 'customer', 'property'],
    required: [true, 'Dashboard type is required']
  },
  statistics: {
    totalProperties: {
      type: Number,
      default: 0
    },
    totalAgents: {
      type: Number,
      default: 0
    },
    totalCustomers: {
      type: Number,
      default: 0
    },
    totalRevenue: {
      type: Number,
      default: 0
    },
    propertiesSold: {
      type: Number,
      default: 0
    },
    propertiesRented: {
      type: Number,
      default: 0
    },
    activeListings: {
      type: Number,
      default: 0
    },
    pendingDeals: {
      type: Number,
      default: 0
    }
  },
  charts: {
    propertyData: [{
      month: String,
      count: Number,
      revenue: Number
    }],
    revenueData: [{
      month: String,
      amount: Number,
      type: {
        type: String,
        enum: ['sale', 'rent']
      }
    }],
    countryData: [{
      country: String,
      count: Number,
      percentage: Number
    }],
    categoryData: [{
      category: String,
      count: Number,
      percentage: Number
    }]
  },
  recentActivity: [{
    type: {
      type: String,
      enum: ['property_added', 'property_sold', 'property_rented', 'user_registered', 'agent_added']
    },
    description: String,
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property'
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  topPerformers: {
    agents: [{
      agentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      name: String,
      sales: Number,
      revenue: Number,
      properties: Number
    }],
    properties: [{
      propertyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Property'
      },
      title: String,
      views: Number,
      favorites: Number,
      price: Number
    }]
  },
  notifications: [{
    type: {
      type: String,
      enum: ['info', 'warning', 'success', 'error']
    },
    title: String,
    message: String,
    isRead: {
      type: Boolean,
      default: false
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
dashboardSchema.index({ type: 1 });
dashboardSchema.index({ 'lastUpdated': -1 });

// Pre-save middleware to update lastUpdated
dashboardSchema.pre('save', function(next) {
  this.lastUpdated = new Date();
  next();
});

// Static method to get dashboard data by type
dashboardSchema.statics.getDashboardData = async function(type) {
  let dashboard = await this.findOne({ type });
  
  if (!dashboard) {
    // Create default dashboard data if it doesn't exist
    dashboard = new this({ type });
    await dashboard.save();
  }
  
  return dashboard;
};

// Method to update statistics
dashboardSchema.methods.updateStatistics = async function() {
  const Property = mongoose.model('Property');
  const User = mongoose.model('User');
  
  // Count properties
  this.statistics.totalProperties = await Property.countDocuments({ isActive: true });
  this.statistics.propertiesSold = await Property.countDocuments({ status: 'sold' });
  this.statistics.propertiesRented = await Property.countDocuments({ status: 'rented' });
  this.statistics.activeListings = await Property.countDocuments({ status: 'available' });
  
  // Count users by role
  this.statistics.totalAgents = await User.countDocuments({ role: 'agent', isActive: true });
  this.statistics.totalCustomers = await User.countDocuments({ role: 'user', isActive: true });
  
  // Calculate total revenue (sum of sold properties)
  const soldProperties = await Property.find({ status: 'sold' }).select('price');
  this.statistics.totalRevenue = soldProperties.reduce((sum, prop) => sum + prop.price, 0);
  
  await this.save();
  return this;
};

module.exports = mongoose.model('Dashboard', dashboardSchema);
