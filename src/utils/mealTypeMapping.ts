// Mapping từ tiếng Anh sang tiếng Việt cho các loại bữa ăn
export const MEAL_TYPE_MAPPING = {
  // Tiếng Anh -> Tiếng Việt
  breakfast: 'buasang',
  lunch: 'buatrua', 
  dinner: 'buatoi',
  snack: 'buaphu',
  
  // Tiếng Việt -> Tiếng Anh (để mapping ngược)
  buasang: 'breakfast',
  buatrua: 'lunch',
  buatoi: 'dinner', 
  buaphu: 'snack'
} as const;

// Hiển thị tên bữa ăn bằng tiếng Việt
export const MEAL_TYPE_DISPLAY = {
  breakfast: 'Bữa sáng',
  lunch: 'Bữa trưa',
  dinner: 'Bữa tối',
  snack: 'Bữa phụ',
  buasang: 'Bữa sáng',
  buatrua: 'Bữa trưa',
  buatoi: 'Bữa tối',
  buaphu: 'Bữa phụ'
} as const;

// Chuyển đổi từ tiếng Anh sang tiếng Việt
export const convertToVietnamese = (mealType: string): string => {
  return MEAL_TYPE_MAPPING[mealType as keyof typeof MEAL_TYPE_MAPPING] || mealType;
};

// Chuyển đổi từ tiếng Việt sang tiếng Anh
export const convertToEnglish = (mealType: string): string => {
  return MEAL_TYPE_MAPPING[mealType as keyof typeof MEAL_TYPE_MAPPING] || mealType;
};

// Lấy tên hiển thị bằng tiếng Việt
export const getDisplayName = (mealType: string): string => {
  return MEAL_TYPE_DISPLAY[mealType as keyof typeof MEAL_TYPE_DISPLAY] || mealType;
};

// Kiểm tra xem có phải là meal type hợp lệ không
export const isValidMealType = (mealType: string): boolean => {
  return Object.keys(MEAL_TYPE_MAPPING).includes(mealType);
};
