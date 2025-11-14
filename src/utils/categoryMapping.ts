// Mapping từ tiếng Anh sang tiếng Việt cho category names
export const CATEGORY_MAPPING = {
  // Tiếng Anh -> Tiếng Việt
  'Appetizer': 'Khai vị',
  'Main Course': 'Món chính',
  'Dessert': 'Tráng miệng',
  'Soup': 'Canh/Súp',
  'Salad': 'Salad',
  'Breakfast': 'Bữa sáng',
  'Lunch': 'Bữa trưa',
  'Dinner': 'Bữa tối',
  'Snack': 'Bữa phụ',
  'Beverage': 'Đồ uống',
  'Side Dish': 'Món phụ',
  'Vegetarian': 'Chay',
  'Vegan': 'Thuần chay',
  'Gluten Free': 'Không gluten',
  'Low Carb': 'Ít tinh bột',
  'High Protein': 'Nhiều protein',
  'Healthy': 'Lành mạnh',
  'Quick': 'Nhanh',
  'Easy': 'Dễ làm',
  'Traditional': 'Truyền thống',
  'Modern': 'Hiện đại',
  'Spicy': 'Cay',
  'Sweet': 'Ngọt',
  'Sour': 'Chua',
  'Savory': 'Đậm đà',
  
  // Fallback
  'Food': 'Món ăn',
  'Meal': 'Món ăn',
  'Dish': 'Món ăn',
} as const;

// Chuyển đổi category name từ tiếng Anh sang tiếng Việt
export const convertCategoryToVietnamese = (categoryName: string): string => {
  if (!categoryName) return 'Món ăn';
  
  // Tìm exact match trước
  const exactMatch = CATEGORY_MAPPING[categoryName as keyof typeof CATEGORY_MAPPING];
  if (exactMatch) return exactMatch;
  
  // Tìm partial match (case insensitive)
  const lowerCategory = categoryName.toLowerCase();
  for (const [english, vietnamese] of Object.entries(CATEGORY_MAPPING)) {
    if (english.toLowerCase().includes(lowerCategory) || lowerCategory.includes(english.toLowerCase())) {
      return vietnamese;
    }
  }
  
  // Nếu không tìm thấy, trả về gốc hoặc fallback
  return categoryName || 'Món ăn';
};

// Kiểm tra xem có phải là category hợp lệ không
export const isValidCategory = (categoryName: string): boolean => {
  return Object.keys(CATEGORY_MAPPING).includes(categoryName);
};
