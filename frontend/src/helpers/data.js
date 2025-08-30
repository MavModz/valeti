import { agentData, customerData, customerReviewsData, dataTableRecords, pricingData, projectsData, propertyData, timelineData, transactionData, userData } from '@/assets/data/other';
import { sellersData } from '@/assets/data/product';
import { emailsData, socialGroupsData } from '@/assets/data/social';
import { todoData } from '@/assets/data/task';
import { notificationsData } from '@/assets/data/topbar';
import { sleep } from '@/utils/promise';
import * as yup from 'yup';
import { getAllProperties, getAllAgents, getAllCustomers } from '@/app/lib/Services/api';

export const getNotifications = async () => {
  return notificationsData;
};

export const getAllUsers = async () => {
  return userData;
};

export const getAllProperty = async () => {
  try {
    const response = await getAllProperties();
    console.log('🔍 API Response:', response);
    
    if (response.success && response.data.properties) {
      console.log('📋 Properties from API:', response.data.properties);
      
      // Transform API data to match the expected format
      return response.data.properties.map(property => {
        console.log('🏠 Processing property:', property);
        
        // Get the primary image or first image
        const primaryImage = property.images?.find(img => img.isPrimary) || property.images?.[0];
        const imageUrl = primaryImage?.url || '/assets/images/properties/p-1.jpg';
        
        console.log('🖼️ Image URL:', imageUrl);
        console.log('🏗️ Features:', property.features);
        
        // Ensure we have valid numeric values
        const beds = parseInt(property.features?.bedrooms) || 0;
        const bath = parseInt(property.features?.bathrooms) || 0;
        const size = parseInt(property.features?.area) || 0;
        const flor = parseInt(property.features?.floors) || 0;
        const price = parseFloat(property.price) || 0;
        
        const transformedProperty = {
          id: property._id,
          name: property.title || 'Untitled Property',
          location: property.location?.address || 'Location not specified',
          image: imageUrl,
          icon: 'solar:home-bold-duotone',
          beds: beds,
          bath: bath,
          size: size,
          flor: flor,
          price: price,
          propertyType: property.category || 'Residences',
          country: property.location?.city || 'Unknown',
          type: property.type === 'rent' ? 'Rent' : property.type === 'sale' ? 'Sale' : 'Sale',
          variant: property.type === 'rent' ? 'success' : property.type === 'sale' ? 'warning' : 'warning',
          save: false
        };
        
        console.log('✅ Transformed property:', transformedProperty);
        return transformedProperty;
      });
    }
    // Fallback to static data if API fails
    console.log('⚠️ Using fallback static data');
    return propertyData;
  } catch (error) {
    console.error('❌ Error fetching properties:', error);
    // Fallback to static data
    return propertyData;
  }
};

export const getAllTransaction = async () => {
  const data = transactionData.map(item => {
    const user = userData.find(user => user.id === item.userId);
    const property = propertyData.find(property => property.id == item.propertyId);
    return {
      ...item,
      user,
      property
    };
  });
  await sleep();
  return data;
};

export const getAllTimeline = async () => {
  await sleep();
  return timelineData;
};

export const getAllAgent = async () => {
  try {
    const response = await getAllAgents();
    console.log('🔍 Agent API Response:', response);
    
    if (response.success && response.data.agents) {
      console.log('📋 Agents from API:', response.data.agents);
      
      // Transform API data to match the expected format
      return response.data.agents.map(agent => {
        console.log('👤 Processing agent:', agent);
        
        const transformedAgent = {
          id: agent._id,
          userId: agent._id,
          address: `${agent.location?.city || 'Unknown'}, ${agent.location?.country || 'Unknown'}`,
          experience: agent.experience || 0,
          date: new Date(agent.createdAt),
          properties: agent.propertiesNumber || 0,
          user: {
            id: agent._id,
            name: `${agent.firstName} ${agent.lastName}`,
            email: agent.email,
            avatar: agent.profilePicture || '/assets/images/users/user-1.jpg',
            contact: agent.phoneNumber || 'N/A',
            status: agent.isActive ? 'Active' : 'Inactive'
          }
        };
        
        console.log('✅ Transformed agent:', transformedAgent);
        return transformedAgent;
      });
    }
    // Fallback to static data if API fails
    console.log('⚠️ Using fallback static agent data');
    const data = agentData.map(item => {
      const user = userData.find(user => user.id == item.userId);
      return {
        ...item,
        user
      };
    });
    await sleep();
    return data;
  } catch (error) {
    console.error('❌ Error fetching agents:', error);
    // Fallback to static data
    const data = agentData.map(item => {
      const user = userData.find(user => user.id == item.userId);
      return {
        ...item,
        user
      };
    });
    await sleep();
    return data;
  }
};

export const getAllPricingPlans = async () => {
  await sleep();
  return pricingData;
};

export const getAllCustomer = async () => {
  try {
    const response = await getAllCustomers();
    console.log('🔍 Customer API Response:', response);
    
    if (response.success && response.data.customers) {
      console.log('📋 Customers from API:', response.data.customers);
      
      // Transform API data to match the expected format
      return response.data.customers.map(customer => {
        console.log('👥 Processing customer:', customer);
        
        const transformedCustomer = {
          id: customer._id,
          userId: customer._id,
          propertyType: customer.preferredPropertyType || 'Any',
          interestedProperties: customer.viewProperties || 0,
          customerStatus: customer.status || 'Active',
          date: new Date(customer.createdAt),
          propertyOwn: customer.ownProperties || 0,
          propertyView: customer.viewProperties || 0,
          invest: customer.investProperty || 0,
          user: {
            id: customer._id,
            name: `${customer.firstName} ${customer.lastName}`,
            email: customer.email,
            avatar: customer.profilePicture || '/assets/images/users/user-1.jpg',
            contact: customer.phoneNumber || 'N/A',
            status: customer.isActive ? 'Active' : 'Inactive'
          }
        };
        
        console.log('✅ Transformed customer:', transformedCustomer);
        return transformedCustomer;
      });
    }
    // Fallback to static data if API fails
    console.log('⚠️ Using fallback static customer data');
    const data = customerData.map(item => {
      const user = userData.find(user => user.id == item.userId);
      return {
        ...item,
        user
      };
    });
    await sleep();
    return data;
  } catch (error) {
    console.error('❌ Error fetching customers:', error);
    // Fallback to static data
    const data = customerData.map(item => {
      const user = userData.find(user => user.id == item.userId);
      return {
        ...item,
        user
      };
    });
    await sleep();
    return data;
  }
};

export const getAllReview = async () => {
  const data = customerReviewsData.map(item => {
    const user = userData.find(user => user.id === item.userId);
    const property = propertyData.find(property => property.id == item.propertyId);
    return {
      ...item,
      user,
      property
    };
  });
  await sleep();
  return data;
};
export const getUserById = async id => {
  const user = userData.find(user => user.id === id);
  if (user) {
    await sleep();
    return user;
  }
};
export const getJoinedGroups = async () => {
  return socialGroupsData;
};
export const getEmailsCategoryCount = async () => {
  const mailsCount = {
    inbox: 0,
    starred: 0,
    draft: 0,
    sent: 0,
    deleted: 0,
    important: 0
  };
  mailsCount.inbox = emailsData.filter(email => email.toId === '101').length;
  mailsCount.starred = emailsData.filter(email => email.starred).length;
  mailsCount.draft = emailsData.filter(email => email.draft).length;
  mailsCount.sent = emailsData.filter(email => email.fromId === '101').length;
  mailsCount.important = emailsData.filter(email => email.important).length;
  await sleep();
  return mailsCount;
};
export const getAllProjects = async () => {
  await sleep();
  return projectsData;
};
export const getAllTasks = async () => {
  const data = todoData.map(task => {
    const employee = sellersData.find(seller => seller.id === task.employeeId);
    return {
      ...task,
      employee
    };
  });
  await sleep();
  return data;
};
export const getAllFriends = async () => {
  const data = userData.filter(user => !user?.hasRequested);
  await sleep();
  return data;
};
export const serverSideFormValidate = async data => {
  const formSchema = yup.object({
    fName: yup.string().min(3, 'First name should have at least 3 characters').max(50, 'First name should not be more than 50 characters').required('First name is required'),
    lName: yup.string().min(3, 'Last name should have at least 3 characters').max(50, 'Last name should not be more than 50 characters').required('Last name is required'),
    username: yup.string().min(3, 'Username should have at least 3 characters').max(20, 'Username should not be more than 20 characters').required('Username is required'),
    city: yup.string().min(3, 'City should have at least 3 characters').max(20, 'City should not be more than 20 characters').required('City is required'),
    state: yup.string().min(3, 'State should have at least 3 characters').max(20, 'State should not be more than 20 characters').required('State is required'),
    zip: yup.number().required('ZIP is required')
  });
  try {
    const validatedObj = await formSchema.validate(data, {
      abortEarly: false
    });
    return validatedObj;
  } catch (error) {
    return error;
  }
};
export const getAllDataTableRecords = async () => {
  await sleep();
  return dataTableRecords;
};