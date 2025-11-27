import React from 'react';

const StarRatingSelector = ({ 
  value = [], 
  onChange, 
  maxStars = 5,
  multiple = true,
  disabled = false
}) => {
  const handleStarClick = (starValue) => {
    if (disabled) return;

    if (multiple) {
      const newValue = value.includes(starValue)
        ? value.filter(v => v !== starValue)
        : [...value, starValue].sort();
      onChange(newValue);
    } else {
      onChange([starValue]);
    }
  };

  const renderStars = () => {
    return Array.from({ length: maxStars }, (_, index) => {
      const starValue = index + 1;
      const isSelected = value.includes(starValue);
      
      return (
        <button
          key={starValue}
          className={`star-rating-star ${isSelected ? 'selected' : ''}`}
          onClick={() => handleStarClick(starValue)}
          disabled={disabled}
          type="button"
          title={`${starValue} star${starValue > 1 ? 's' : ''}`}
        >
          <svg 
            width="20" 
            height="20" 
            viewBox="0 0 24 24" 
            fill={isSelected ? 'currentColor' : 'none'} 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"></polygon>
          </svg>
        </button>
      );
    });
  };

  const getDescription = () => {
    if (value.length === 0) return 'Select table tiers';
    if (value.length === 1) return `${value[0]} star${value[0] > 1 ? 's' : ''}`;
    if (value.length === maxStars) return 'All tiers';
    return `${value.length} tiers selected`;
  };

  return (
    <div className="star-rating-selector">
      <div className="star-rating-stars">
        {renderStars()}
      </div>
      <div className="star-rating-description">
        {getDescription()}
      </div>
    </div>
  );
};

export default StarRatingSelector;
