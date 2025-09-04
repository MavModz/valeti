const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['new', 'featured'],
    default: 'new'
  },
  category: {
    type: String,
    enum: ['Single Story', 'Double Story'],
    required: [true, 'Property category is required']
  },
  propertyFor: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: false,
    min: [0, 'Price cannot be negative']
  },
  currency: {
    type: String,
    default: 'USD'
  },
  location: {
    address: {
      type: String,
      required: false
    },
    city: {
      type: String,
      required: false
    },
    state: {
      type: String,
      required: [true, 'State is required']
    },
    zipCode: String,
    country: {
      type: String,
      default: 'United States'
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  features: {
    bedrooms: {
      type: Number,
      min: [0, 'Bedrooms cannot be negative']
    },
    bathrooms: {
      type: Number,
      min: [0, 'Bathrooms cannot be negative']
    },
    area: {
      type: Number,
      min: [0, 'Area cannot be negative']
    },
    areaUnit: {
      type: String,
      enum: ['sqft', 'sqm', 'acres'],
      default: 'sqft'
    },
    floors: {
      type: Number,
      min: [1, 'Floors must be at least 1']
    },
    garages: {
      type: Number,
      min: [0, 'Garages cannot be negative']
    },
    theater: {
      type: Number,
      min: [0, 'Theater cannot be negative']
    },
    yearBuilt: Number,
    furnished: {
      type: Boolean,
      default: false
    }
  },
  amenities: [{
    type: String,
    trim: true
  }],
  images: [{
    url: {
      type: String,
      required: true
    },
    caption: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  status: {
    type: String,
    enum: ['available', 'sold', 'rented', 'pending', 'inactive'],
    default: 'available'
  },
  agent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Agent is required']
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Owner is required']
  },
  tags: [{
    type: String,
    trim: true
  }],
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isFeatured: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  documents: [{
    name: String,
    url: String,
    type: String
  }],
  virtualTour: {
    url: String,
    type: {
      type: String,
      enum: ['video', '360', 'slideshow']
    }
  },
  contactInfo: {
    phone: String,
    email: String,
    website: String
  },
  additionalInfo: {
    type: mongoose.Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Indexes for better query performance
propertySchema.index({ status: 1, type: 1 });
propertySchema.index({ 'location.city': 1, 'location.state': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ agent: 1 });
propertySchema.index({ isFeatured: 1, isActive: 1 });
propertySchema.index({ category: 1 });
propertySchema.index({ tags: 1 });

// Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function() {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: this.currency
  }).format(this.price);
});

// Virtual for primary image
propertySchema.virtual('primaryImage').get(function() {
  const primary = this.images.find(img => img.isPrimary);
  return primary ? primary.url : (this.images[0] ? this.images[0].url : null);
});

// Virtual for full address
propertySchema.virtual('fullAddress').get(function() {
  const { address, city, state, zipCode, country } = this.location;
  return `${address}, ${city}, ${state} ${zipCode}, ${country}`.trim();
});

// Ensure virtual fields are serialized
propertySchema.set('toJSON', { virtuals: true });
propertySchema.set('toObject', { virtuals: true });

// Pre-save middleware to ensure only one primary image
propertySchema.pre('save', function(next) {
  if (this.images && this.images.length > 0) {
    const primaryImages = this.images.filter(img => img.isPrimary);
    if (primaryImages.length > 1) {
      // Keep only the first primary image
      let foundPrimary = false;
      this.images.forEach(img => {
        if (img.isPrimary && !foundPrimary) {
          foundPrimary = true;
        } else if (img.isPrimary) {
          img.isPrimary = false;
        }
      });
    }
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);
