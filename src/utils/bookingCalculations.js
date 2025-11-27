// Booking calculation utilities for preview functionality

export function calculateEarliestBooking(closestConfig) {
  const now = new Date();
  let earliestDate = new Date(now);
  
  if (closestConfig.mode === 'same-day') {
    // Add the time increment in minutes
    earliestDate.setTime(now.getTime() + (closestConfig.timeIncrement * 60 * 1000));
  } else if (closestConfig.mode === 'advance') {
    // Add the minimum days
    earliestDate.setDate(now.getDate() + closestConfig.days);
  }
  
  return earliestDate;
}

export function calculateLatestBooking(furthestConfig) {
  const now = new Date();
  let latestDate = new Date(now);
  
  if (furthestConfig.mode === 'daily') {
    // Rolling window - advances by 1 day each day
    if (furthestConfig.unit === 'months') {
      latestDate.setMonth(now.getMonth() + furthestConfig.number);
    } else if (furthestConfig.unit === 'days') {
      latestDate.setDate(now.getDate() + furthestConfig.number);
    }
  } else if (furthestConfig.mode === 'monthly') {
    // Batch release - full months unlock on the 1st
    const monthsAhead = furthestConfig.number;
    const targetMonth = new Date(now.getFullYear(), now.getMonth() + monthsAhead, 1);
    
    // Last day of the target month
    const lastDayOfMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0);
    latestDate = lastDayOfMonth;
  }
  
  return latestDate;
}

export function roundToNext15Minutes(date) {
  const rounded = new Date(date);
  const minutes = rounded.getMinutes();
  const remainder = minutes % 15;
  
  if (remainder !== 0) {
    rounded.setMinutes(minutes + (15 - remainder));
    rounded.setSeconds(0);
    rounded.setMilliseconds(0);
  }
  
  return rounded;
}

export function getFurthestPreviewText(latestDate, config) {
  const now = new Date();
  let previewText = '';
  let additionalText = '';
  
  if (config.mode === 'daily') {
    const latestDateFormatted = latestDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    previewText = `Furthest booking right now would be <strong>${latestDateFormatted}</strong>.`;
    additionalText = `<br>The booking window advances by 1 day each day at midnight.`;
  } else if (config.mode === 'monthly') {
    const latestDateFormatted = latestDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    previewText = `Furthest booking right now would be <strong>${latestDateFormatted}</strong>.`;
    
    // Calculate next month that will unlock
    const nextMonth = new Date(latestDate);
    nextMonth.setMonth(latestDate.getMonth() + 1);
    const firstOfFurthestMonth = new Date(latestDate.getFullYear(), latestDate.getMonth(), 1);
    
    const nextMonthName = nextMonth.toLocaleDateString('en-US', { month: 'long' });
    const unlockDate = firstOfFurthestMonth.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
    additionalText = `<br><strong>${nextMonthName}</strong> will become available on <strong>${unlockDate}</strong> at midnight.`;
  }
  
  return previewText + additionalText;
}

export function getClosestPreviewText(earliestDate, config) {
  const now = new Date();
  const roundedDate = roundToNext15Minutes(earliestDate);
  
  let previewText = '';
  
  if (config.mode === 'same-day') {
    // Check if it's still same day or crosses to next day
    const isSameDay = roundedDate.getDate() === now.getDate() && 
                     roundedDate.getMonth() === now.getMonth() && 
                     roundedDate.getFullYear() === now.getFullYear();
    
    if (isSameDay) {
      // Show just the time
      const timeFormatted = roundedDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      previewText = `Earliest booking right now would be at <strong>${timeFormatted}</strong>.`;
    } else {
      // Show date and time
      const dateTimeFormatted = roundedDate.toLocaleString('en-US', { 
        weekday: 'long', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
      previewText = `Earliest booking right now would be <strong>${dateTimeFormatted}</strong>.`;
    }
  } else if (config.mode === 'advance') {
    // Show the date
    const dateFormatted = roundedDate.toLocaleDateString('en-US', { 
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    });
    previewText = `Earliest booking right now would be <strong>${dateFormatted}</strong>.`;
  }
  
  return previewText;
}

