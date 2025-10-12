export type RootStackParamList = {
    AuthLanding: undefined;
    Login: undefined;
    Register: undefined;
    UserInfo: undefined;
    Goals: undefined;
    Lifestyle: undefined;
    EatStyle: undefined;
    CookingLevel: undefined;
    MainTabs: undefined;
    MealDetail: {
        meal: {
            id: string;
            title: string;
            calories: string;
            price: string;
            image: any;
            cookingTime?: string;
            ingredients?: Array<{
                name: string;
                amount: string;
            }>;
            substitutions?: Array<{
                original: string;
                substitute: string;
            }>;
            instructions?: Array<string>;
        };
    };
    ReviewsScreen: {
        mealId: string;
        mealTitle?: string;
        refresh?: boolean;
        newReview?: {
            id: string;
            user: string;
            date: string;
            rating: number;
            content: string;
            avatar: string;
        };
    };
    AddReviewScreen: {
        mealId: string;
        mealTitle?: string;
    };
    ProfileScreen: undefined;
    NotificationsScreen: undefined;
    PersonalNutritionScreen: undefined;
    SettingScreen: undefined;
    ForgotPasswordScreen: undefined;
    VerifyCodeScreen: { email: string };
    CreateNewPasswordScreen: { email: string; code: string };
    PostDetailScreen: { post: any };
    CommunityScreen: undefined;
    EditPostScreen: { post: any };
    CreatePostScreen: undefined;

};
