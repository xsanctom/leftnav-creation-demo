/**
 * Utility functions for formatting data
 */

/**
 * Format price with currency symbol
 * @param {number} price - Price value
 * @param {string} currency - Currency symbol (default: ¥)
 * @returns {string} Formatted price
 */
export function formatPrice(price, currency = '¥') {
  if (typeof price !== 'number') {
    price = parseFloat(price) || 0;
  }
  return `${currency}${price.toFixed(2)}`;
}

/**
 * Format date to readable string
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
export function formatDate(date) {
  const d = new Date(date);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
}

/**
 * Format time to readable string
 * @param {Date|string} time - Time to format
 * @returns {string} Formatted time
 */
export function formatTime(time) {
  const t = new Date(time);
  const options = { hour: '2-digit', minute: '2-digit' };
  return t.toLocaleTimeString('en-US', options);
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} length - Max length
 * @returns {string} Truncated text
 */
export function truncateText(text, length = 50) {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
}

/**
 * Generate unique ID
 * @returns {string} Unique ID
 */
export function generateId() {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid
 */
export function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

/**
 * Sort array of objects by key
 * @param {Array} array - Array to sort
 * @param {string} key - Key to sort by
 * @param {string} order - Sort order ('asc' or 'desc')
 * @returns {Array} Sorted array
 */
export function sortBy(array, key, order = 'asc') {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (typeof aVal === 'string') {
      return order === 'asc' 
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    
    return order === 'asc' 
      ? aVal - bVal
      : bVal - aVal;
  });
}

/**
 * Filter array of objects by search query
 * @param {Array} array - Array to filter
 * @param {string} query - Search query
 * @param {Array} keys - Keys to search in
 * @returns {Array} Filtered array
 */
export function filterBySearch(array, query, keys = []) {
  if (!query) return array;
  
  const lowerQuery = query.toLowerCase();
  
  return array.filter(item => {
    if (keys.length === 0) {
      // Search all string values
      return Object.values(item).some(value => 
        typeof value === 'string' && value.toLowerCase().includes(lowerQuery)
      );
    }
    
    // Search specified keys
    return keys.some(key => {
      const value = item[key];
      return typeof value === 'string' && value.toLowerCase().includes(lowerQuery);
    });
  });
}

