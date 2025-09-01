/**
 * Generate SEO-friendly URL for properties
 * @param {string} id - Property ID
 * @param {string} title - Property title
 * @returns {string} SEO-friendly URL
 */
export const generatePropertyUrl = (id, title) => {
  if (!id || !title) return '/search';
  
  // Convert title to URL-friendly format
  const seoTitle = title
    .replace(/[^a-zA-Z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .toLowerCase() // Convert to lowercase
    .trim(); // Remove leading/trailing spaces
  
  return `/property/${id}/${seoTitle}`;
};

/**
 * Generate SEO-friendly title for properties
 * @param {string} title - Property title
 * @returns {string} SEO-friendly title
 */
export const generateSeoTitle = (title) => {
  if (!title) return 'property';
  
  return title
    .replace(/[^a-zA-Z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .toLowerCase()
    .trim();
};
