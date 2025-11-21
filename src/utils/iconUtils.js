// Icon utility functions and icon mapping
// Auto-discover all SVG icons from assets/images using Vite's import.meta.glob

// Dynamically import all SVG files from assets/images
const iconModules = import.meta.glob('../assets/images/*.svg', { 
  eager: true, 
  import: 'default' 
});

// Helper function to convert filename to readable label
// e.g., "calendar-icon.svg" -> "Calendar Icon"
// e.g., "flow--connection.svg" -> "Flow Connection"
const filenameToLabel = (filename) => {
  // Remove .svg extension
  let name = filename.replace(/\.svg$/, '');
  
  // Handle double hyphens (e.g., "flow--connection" -> "flow-connection")
  name = name.replace(/--/g, '-');
  
  // Split on hyphens and underscores
  const words = name.split(/[-_]/);
  
  // Capitalize each word
  const capitalized = words.map(word => {
    if (word.length === 0) return '';
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  
  return capitalized.join(' ');
};

// Helper function to extract filename from path
// e.g., "../assets/images/book.svg" -> "book.svg"
const extractFilename = (path) => {
  return path.split('/').pop();
};

// Generate iconImports map dynamically
const iconImports = {};
Object.keys(iconModules).forEach(path => {
  const filename = extractFilename(path);
  iconImports[filename] = iconModules[path];
});

// Generate AVAILABLE_ICONS array dynamically
export const AVAILABLE_ICONS = Object.keys(iconModules).map(path => {
  const filename = extractFilename(path);
  const name = filename.replace(/\.svg$/, '').replace(/--/g, '-');
  const label = filenameToLabel(filename);
  
  return {
    name,
    file: filename,
    label
  };
}).sort((a, b) => a.label.localeCompare(b.label)); // Sort alphabetically by label

// Get icon URL by file name (returns the imported URL for Vite)
export const getIconUrl = (iconFileName) => {
  if (!iconFileName) return null;
  
  // Extract just the filename if it's a full path
  const fileName = iconFileName.includes('/') 
    ? iconFileName.split('/').pop() 
    : iconFileName;
  
  // Return the imported URL from the map
  return iconImports[fileName] || null;
};

// Get icon file path by name
export const getIconPath = (iconName) => {
  if (!iconName) return null;
  
  // If it's already a file path, return it
  if (iconName.includes('.svg') || iconName.includes('/')) {
    return iconName;
  }
  
  // Find icon by name
  const icon = AVAILABLE_ICONS.find(i => i.name === iconName || i.file === iconName);
  return icon ? icon.file : null;
};

// Get icon by file name
export const getIconByName = (iconName) => {
  return AVAILABLE_ICONS.find(i => i.name === iconName || i.file === iconName);
};

// Convert old SVG string format to icon file name (for migration)
export const migrateIconFormat = (iconString) => {
  // If it's already a file path or name, return it
  if (!iconString || iconString.includes('.svg') || iconString.includes('/')) {
    return iconString;
  }
  
  // Try to match common patterns to icon names
  // This is a best-effort migration
  const lowerString = iconString.toLowerCase();
  
  if (lowerString.includes('home')) return 'home';
  if (lowerString.includes('calendar')) return 'calendar-icon';
  if (lowerString.includes('gift')) return 'gift-icon';
  if (lowerString.includes('globe')) return 'globe-icon';
  if (lowerString.includes('menu')) return 'menu-item-icon';
  if (lowerString.includes('phone')) return 'phone';
  if (lowerString.includes('email') || lowerString.includes('envelope')) return 'email';
  if (lowerString.includes('user')) return 'user';
  if (lowerString.includes('store') || lowerString.includes('building')) return 'building';
  if (lowerString.includes('money') || lowerString.includes('dollar')) return 'money';
  if (lowerString.includes('time') || lowerString.includes('clock')) return 'time';
  if (lowerString.includes('book')) return 'book';
  if (lowerString.includes('paint') || lowerString.includes('brush')) return 'paint-brush';
  
  return null; // Return null if no match, will show as no icon
};
