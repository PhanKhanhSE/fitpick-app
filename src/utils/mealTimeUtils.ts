// Utility để phân loại bữa ăn dựa vào tag/category
export const getMealTimeFromTag = (tag: string, categoryName?: string): string => {
  if (!tag && !categoryName) {
    return 'breakfast'; // Default
  }

  const tagLower = tag?.toLowerCase() || '';
  const categoryLower = categoryName?.toLowerCase() || '';

  // Kiểm tra tag trước
  if (tagLower.includes('breakfast') || tagLower.includes('sáng') || tagLower.includes('morning')) {
    return 'breakfast';
  }
  
  if (tagLower.includes('lunch') || tagLower.includes('trưa') || tagLower.includes('noon')) {
    return 'lunch';
  }
  
  if (tagLower.includes('dinner') || tagLower.includes('tối') || tagLower.includes('evening')) {
    return 'dinner';
  }

  // Kiểm tra category name
  if (categoryLower.includes('breakfast') || categoryLower.includes('sáng') || categoryLower.includes('morning')) {
    return 'breakfast';
  }
  
  if (categoryLower.includes('lunch') || categoryLower.includes('trưa') || categoryLower.includes('noon')) {
    return 'lunch';
  }
  
  if (categoryLower.includes('dinner') || categoryLower.includes('tối') || categoryLower.includes('evening')) {
    return 'dinner';
  }

  // Kiểm tra các từ khóa khác
  if (tagLower.includes('snack') || tagLower.includes('ăn vặt') || tagLower.includes('dessert')) {
    return 'breakfast'; // Default cho snack
  }

  // Default fallback
  return 'breakfast';
};

// Mapping từ mealTime sang tiếng Việt
export const getMealTimeDisplayName = (mealTime: string): string => {
  switch (mealTime.toLowerCase()) {
    case 'breakfast':
      return 'Bữa sáng';
    case 'lunch':
      return 'Bữa trưa';
    case 'dinner':
      return 'Bữa tối';
    default:
      return 'Bữa sáng';
  }
};

// Kiểm tra xem món ăn có phù hợp với bữa ăn không
export const isMealSuitableForTime = (mealTime: string, mealTags: string[], categoryName?: string): boolean => {
  const detectedTime = getMealTimeFromTag(mealTags.join(' '), categoryName);
  return detectedTime === mealTime.toLowerCase();
};
