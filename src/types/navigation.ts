export type RootStackParamList = {
    AuthLanding: undefined;
    Login: undefined;
    Register: undefined;
    RegisterUserInfo: undefined;
    RegisterGoals: undefined;
    RegisterLifestyle: undefined;
    RegisterMealPlan: undefined;
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
};
