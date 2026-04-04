const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('../models/User');
const Property = require('../models/Property');
const Dashboard = require('../models/Dashboard');

// Sample data from frontend
const sampleUsers = [
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@demo.com',
    password: 'Admin123',
    role: 'admin',
    isEmailVerified: true,
    isActive: true,
    phoneNumber: '+1234567890',
    address: {
      street: '123 Admin Street',
      city: 'Admin City',
      state: 'Admin State',
      zipCode: '12345',
      country: 'United States'
    }
  },
  {
    firstName: 'SubAdmin',
    lastName: 'User',
    email: 'subadmin@demo.com',
    password: 'SubAdmin123',
    role: 'agent',
    isEmailVerified: true,
    isActive: true,
    phoneNumber: '+1234567891',
    address: {
      street: '456 Agent Street',
      city: 'Agent City',
      state: 'Agent State',
      zipCode: '67890',
      country: 'United States'
    }
  },
  {
    firstName: 'Customer',
    lastName: 'User',
    email: 'customer@demo.com',
    password: 'Customer123',
    role: 'user',
    isEmailVerified: true,
    isActive: true,
    phoneNumber: '+1234567892',
    address: {
      street: '789 Customer Street',
      city: 'Customer City',
      state: 'Customer State',
      zipCode: '11111',
      country: 'United States'
    }
  }
];

const sampleProperties = [
  {
    title: 'Modern Downtown Single Storey',
    description: 'Beautiful modern single storey property in the heart of downtown with stunning city views. Features include hardwood floors, stainless steel appliances, and a private balcony.',
    type: 'sale',
    category: 'Single Storey',
    propertyFor: '12 meter',
    price: 450000,
    currency: 'USD',
    location: {
      address: '123 Main Street',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States',
      coordinates: {
        latitude: 40.7128,
        longitude: -74.0060
      }
    },
    features: {
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      areaUnit: 'sqft',
      parking: 1,
      floors: 1,
      garages: 1,
      theater: 0,
      yearBuilt: 2020,
      furnished: false
    },
    amenities: ['Gym', 'Pool', 'Parking', 'Balcony', 'Air Conditioning'],
    images: [
      {
        url: '/images/properties/property-1.jpg',
        caption: 'Living Room',
        isPrimary: true
      },
      {
        url: '/images/properties/property-1-2.jpg',
        caption: 'Kitchen'
      }
    ],
    status: 'available',
    tags: ['modern', 'downtown', 'single-storey'],
    isFeatured: true,
    contactInfo: {
      phone: '+1234567890',
      email: 'agent@example.com'
    }
  },
  {
    title: 'Luxury Double Storey with Pool',
    description: 'Stunning luxury double storey property featuring a private pool, gourmet kitchen, and spacious living areas. Perfect for families looking for comfort and elegance.',
    type: 'sale',
    category: 'Double Storey',
    propertyFor: '20 meter',
    price: 1200000,
    currency: 'USD',
    location: {
      address: '456 Luxury Lane',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      country: 'United States',
      coordinates: {
        latitude: 34.0522,
        longitude: -118.2437
      }
    },
    features: {
      bedrooms: 4,
      bathrooms: 3,
      area: 3500,
      areaUnit: 'sqft',
      parking: 3,
      floors: 2,
      garages: 2,
      theater: 1,
      yearBuilt: 2018,
      furnished: true
    },
    amenities: ['Pool', 'Garden', 'Gym', 'Home Theater', 'Wine Cellar'],
    images: [
      {
        url: '/images/properties/property-2.jpg',
        caption: 'Exterior View',
        isPrimary: true
      },
      {
        url: '/images/properties/property-2-2.jpg',
        caption: 'Pool Area'
      }
    ],
    status: 'available',
    tags: ['luxury', 'double-storey', 'pool'],
    isFeatured: true,
    contactInfo: {
      phone: '+1234567891',
      email: 'agent2@example.com'
    }
  },
  {
    title: 'Cozy Family Single Storey',
    description: 'Perfect family single storey home in a quiet neighborhood with excellent schools nearby. Features a large backyard and modern amenities.',
    type: 'rent',
    category: 'Single Storey',
    propertyFor: '14 meter',
    price: 2500,
    currency: 'USD',
    location: {
      address: '789 Family Road',
      city: 'Chicago',
      state: 'IL',
      zipCode: '60601',
      country: 'United States',
      coordinates: {
        latitude: 41.8781,
        longitude: -87.6298
      }
    },
    features: {
      bedrooms: 3,
      bathrooms: 2,
      area: 2000,
      areaUnit: 'sqft',
      parking: 2,
      floors: 2,
      garages: 1,
      theater: 0,
      yearBuilt: 2015,
      furnished: false
    },
    amenities: ['Backyard', 'Garage', 'Fireplace', 'Central Air'],
    images: [
      {
        url: '/images/properties/property-3.jpg',
        caption: 'Front View',
        isPrimary: true
      },
      {
        url: '/images/properties/property-3-2.jpg',
        caption: 'Backyard'
      }
    ],
    status: 'available',
    tags: ['family', 'single-storey', 'rental'],
    isFeatured: false,
    contactInfo: {
      phone: '+1234567892',
      email: 'agent3@example.com'
    }
  }
];

const sampleDashboardData = {
  analytics: {
    statistics: {
      totalProperties: 3,
      totalAgents: 1,
      totalCustomers: 1,
      totalRevenue: 1650000,
      propertiesSold: 0,
      propertiesRented: 0,
      activeListings: 3,
      pendingDeals: 0
    },
    charts: {
      propertyData: [
        { month: '2024-01', count: 1, revenue: 450000 },
        { month: '2024-02', count: 1, revenue: 1200000 },
        { month: '2024-03', count: 1, revenue: 0 }
      ],
      revenueData: [
        { month: '2024-01', amount: 450000, type: 'sale' },
        { month: '2024-02', amount: 1200000, type: 'sale' }
      ],
      countryData: [
        { country: 'United States', count: 3, percentage: 100.0 }
      ],
      categoryData: [
        { category: 'Single Storey', count: 2, percentage: 66.7 },
        { category: 'Double Storey', count: 1, percentage: 33.3 }
      ]
    }
  }
};

async function seedUsers() {
  console.log('🌱 Seeding users...');
  
  for (const userData of sampleUsers) {
    const existingUser = await User.findOne({ email: userData.email });
    
    if (!existingUser) {
      const user = new User(userData);
      
      await user.save();
      console.log(`✅ Created user: ${user.email}`);
    } else {
      console.log(`⏭️  User already exists: ${userData.email}`);
    }
  }
}

async function seedProperties() {
  console.log('🏠 Seeding properties...');
  
  // Get the agent user for property assignment
  const agent = await User.findOne({ role: 'agent' });
  const admin = await User.findOne({ role: 'admin' });
  
  if (!agent || !admin) {
    console.log('❌ Agent or Admin user not found. Please seed users first.');
    return;
  }
  
  for (const propertyData of sampleProperties) {
    const existingProperty = await Property.findOne({ 
      title: propertyData.title,
      'location.address': propertyData.location.address 
    });
    
    if (!existingProperty) {
      const property = new Property({
        ...propertyData,
        agent: agent._id,
        owner: admin._id
      });
      
      await property.save();
      console.log(`✅ Created property: ${property.title}`);
    } else {
      console.log(`⏭️  Property already exists: ${propertyData.title}`);
    }
  }
}

async function seedDashboard() {
  console.log('📊 Seeding dashboard data...');
  
  for (const [type, data] of Object.entries(sampleDashboardData)) {
    const existingDashboard = await Dashboard.findOne({ type });
    
    if (!existingDashboard) {
      const dashboard = new Dashboard({
        type,
        ...data
      });
      
      await dashboard.save();
      console.log(`✅ Created dashboard: ${type}`);
    } else {
      console.log(`⏭️  Dashboard already exists: ${type}`);
    }
  }
}

async function seedAll() {
  try {
    console.log('🚀 Starting data seeding...\n');
    
    await seedUsers();
    console.log('');
    
    await seedProperties();
    console.log('');
    
    await seedDashboard();
    console.log('');
    
    console.log('🎉 Data seeding completed successfully!');
    
    // Display summary
    const userCount = await User.countDocuments();
    const propertyCount = await Property.countDocuments();
    const dashboardCount = await Dashboard.countDocuments();
    
    console.log('\n📊 Summary:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Properties: ${propertyCount}`);
    console.log(`   Dashboards: ${dashboardCount}`);
    
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Connect to MongoDB and run seeder
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    seedAll();
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });
