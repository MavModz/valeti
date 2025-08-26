export const CUSTOMER_MENU_ITEMS = [{
  key: 'menu',
  label: 'MENU',
  isTitle: true
}, {
  key: 'dashboards',
  label: 'Dashboard',
  icon: 'ri:dashboard-2-line',
  children: [{
    key: 'customer',
    label: 'Customer Dashboard',
    url: '/dashboards/customer',
    parentKey: 'dashboards'
  }]
}, {
  key: 'property',
  label: 'Property',
  icon: 'ri:community-line',
  children: [{
    key: 'property-grid',
    label: 'Browse Properties',
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
  }]
}, {
  key: 'orders',
  label: 'My Orders',
  icon: 'ri:home-office-line',
  url: '/orders'
}, {
  key: 'transactions',
  label: 'My Transactions',
  icon: 'ri:arrow-left-right-line',
  url: '/transactions'
}, {
  key: 'reviews',
  label: 'My Reviews',
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
    key: 'faqs',
    label: 'FAQs',
    url: '/pages/faqs',
    parentKey: 'pages'
  }]
}, {
  key: 'auth',
  label: 'Account',
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
  }]
}];
