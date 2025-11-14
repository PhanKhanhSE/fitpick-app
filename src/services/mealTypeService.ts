import { MEAL_TYPE_MAPPING, convertToEnglish, convertToVietnamese } from '../utils/mealTypeMapping';

// Service để xử lý mapping meal types giữa frontend và backend
export class MealTypeService {
  
  // Chuyển đổi meal type từ frontend (tiếng Việt) sang backend (tiếng Anh)
  static convertForBackend(mealType: string): string {
    return convertToEnglish(mealType);
  }

  // Chuyển đổi meal type từ backend (tiếng Anh) sang frontend (tiếng Việt)  
  static convertForFrontend(mealType: string): string {
    return convertToVietnamese(mealType);
  }

  // Xử lý response từ backend - chuyển đổi keys từ tiếng Anh sang tiếng Việt
  static processBackendResponse(response: any): any {
    if (!response || typeof response !== 'object') {
      return response;
    }

    const processedResponse = { ...response };
    
    // Nếu response có structure với meal types
    if (response.meals && typeof response.meals === 'object') {
      const processedMeals: any = {};
      
      Object.keys(response.meals).forEach(key => {
        const vietnameseKey = convertToVietnamese(key);
        processedMeals[vietnameseKey] = response.meals[key];
      });
      
      processedResponse.meals = processedMeals;
    }

    // Nếu response là object với meal type keys trực tiếp
    Object.keys(response).forEach(key => {
      if (MEAL_TYPE_MAPPING[key as keyof typeof MEAL_TYPE_MAPPING]) {
        const vietnameseKey = convertToVietnamese(key);
        processedResponse[vietnameseKey] = response[key];
        delete processedResponse[key];
      }
    });

    return processedResponse;
  }

  // Xử lý request gửi lên backend - chuyển đổi keys từ tiếng Việt sang tiếng Anh
  static processFrontendRequest(request: any): any {
    if (!request || typeof request !== 'object') {
      return request;
    }

    const processedRequest = { ...request };
    
    // Nếu request có structure với meal types
    if (request.meals && typeof request.meals === 'object') {
      const processedMeals: any = {};
      
      Object.keys(request.meals).forEach(key => {
        const englishKey = convertToEnglish(key);
        processedMeals[englishKey] = request.meals[key];
      });
      
      processedRequest.meals = processedMeals;
    }

    // Nếu request là object với meal type keys trực tiếp
    Object.keys(request).forEach(key => {
      if (MEAL_TYPE_MAPPING[key as keyof typeof MEAL_TYPE_MAPPING]) {
        const englishKey = convertToEnglish(key);
        processedRequest[englishKey] = request[key];
        delete processedRequest[key];
      }
    });

    return processedRequest;
  }
}
