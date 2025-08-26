export const SUBADMIN_MENU_ITEMS = [{
  key: 'menu',
  label: 'MENU',
  isTitle: true
}, {
  key: 'dashboards',
  label: 'Dashboards',
  icon: 'ri:dashboard-2-line',
  children: [{
    key: 'agent',
    label: 'Agent Dashboard',
    url: '/dashboards/agent',
    parentKey: 'dashboards'
  }]
}, {
  key: 'property',
  label: 'Property',
  icon: 'ri:community-line',
  children: [{
    key: 'property-grid',
    label: 'Property Grid',
    url: '/property/grid',
    parentKey: 'property'
  }, {
    key: 'property-list',
    label: 'Property List',
    url: '/property/list',
    parentKey: 'property'
  }, {
    key: 'property-details',
    label: 'Property Details',
    url: '/property/details',
    parentKey: 'property'
  }, {
    key: 'add-property',
    label: 'Add Property',
    url: '/property/add',
    parentKey: 'property'
  }]
}, {
  key: 'customers',
  label: 'Customers',
  icon: 'ri:contacts-book-3-line',
  children: [{
    key: 'list-view',
    label: 'List View',
    url: '/customers/list-view',
    parentKey: 'customers'
  }, {
    key: 'grid-view',
    label: 'Grid View',
    url: '/customers/grid-view',
    parentKey: 'customers'
  }, {
    key: 'customer-details',
    label: 'Customer Details',
    url: '/customers/details',
    parentKey: 'customers'
  }, {
    key: 'add-customer',
    label: 'Add Customer',
    url: '/customers/add',
    parentKey: 'customers'
  }]
}, {
  key: 'orders',
  label: 'Orders',
  icon: 'ri:home-office-line',
  url: '/orders'
}, {
  key: 'transactions',
  label: 'Transactions',
  icon: 'ri:arrow-left-right-line',
  url: '/transactions'
}, {
  key: 'reviews',
  label: 'Reviews',
  icon: 'ri:chat-quote-line',
  url: '/reviews'
}, {
  key: 'messages',
  label: 'Messages',
  icon: 'ri:discuss-line',
  url: '/messages'
}, {
  key: 'inbox',
  label: 'Inbox',
  icon: 'ri:inbox-line',
  url: '/inbox'
}, {
  key: 'post',
  label: 'Post',
  icon: 'ri:news-line',
  children: [{
    key: 'post',
    label: 'Post',
    url: '/post',
    parentKey: 'post'
  }, {
    key: 'post-details',
    label: 'Post Details',
    url: '/post/details',
    parentKey: 'post'
  }, {
    key: 'create-post',
    label: 'Create Post',
    url: '/post/create',
    parentKey: 'post'
  }]
}, {
  key: 'custom',
  label: 'CUSTOM',
  isTitle: true
}, {
  key: 'pages',
  label: 'Pages',
  icon: 'ri:pages-line',
  children: [{
    key: 'calendar',
    label: 'Calendar',
    url: '/pages/calendar',
    parentKey: 'pages'
  }, {
    key: 'invoice',
    label: 'Invoice',
    url: '/pages/invoice',
    parentKey: 'pages'
  }, {
    key: 'faqs',
    label: 'FAQs',
    url: '/pages/faqs',
    parentKey: 'pages'
  }, {
    key: 'timeline',
    label: 'Timeline',
    url: '/pages/timeline',
    parentKey: 'pages'
  }]
}, {
  key: 'auth',
  label: 'Authentication',
  icon: 'ri:lock-password-line',
  children: [{
    key: 'reset-password',
    label: 'Reset Password',
    url: '/auth/reset-password',
    parentKey: 'auth'
  }, {
    key: 'lock-screen',
    label: 'Lock Screen',
    url: '/auth/lock-screen',
    parentKey: 'auth'
  }]
}, {
  key: 'Components',
  label: 'COMPONENTS',
  isTitle: true
}, {
  key: 'base-ui',
  label: 'Base UI',
  icon: 'ri:contrast-drop-line',
  children: [{
    key: 'alerts',
    label: 'Alerts',
    url: '/base-ui/alerts',
    parentKey: 'base-ui'
  }, {
    key: 'avatar',
    label: 'Avatar',
    url: '/base-ui/avatar',
    parentKey: 'base-ui'
  }, {
    key: 'badge',
    label: 'Badge',
    url: '/base-ui/badge',
    parentKey: 'base-ui'
  }, {
    key: 'buttons',
    label: 'Buttons',
    url: '/base-ui/buttons',
    parentKey: 'base-ui'
  }, {
    key: 'cards',
    label: 'Cards',
    url: '/base-ui/cards',
    parentKey: 'base-ui'
  }, {
    key: 'modals',
    label: 'Modals',
    url: '/base-ui/modals',
    parentKey: 'base-ui'
  }, {
    key: 'tabs',
    label: 'Tabs',
    url: '/base-ui/tabs',
    parentKey: 'base-ui'
  }]
}, {
  key: 'forms',
  label: 'Forms',
  icon: 'ri:survey-line',
  children: [{
    key: 'basic',
    label: 'Basic Element',
    url: '/forms/basic',
    parentKey: 'forms'
  }, {
    key: 'validation',
    label: 'Validation',
    url: '/forms/validation',
    parentKey: 'forms'
  }, {
    key: 'file-uploads',
    label: 'File Upload',
    url: '/forms/file-uploads',
    parentKey: 'forms'
  }]
}, {
  key: 'tables',
  label: 'Tables',
  icon: 'ri:table-line',
  children: [{
    key: 'tables-basic',
    label: 'Basic Tables',
    url: '/tables/basic',
    parentKey: 'tables'
  }]
}];
