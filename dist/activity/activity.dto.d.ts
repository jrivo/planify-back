export declare class updateActivityDto {
    name?: string;
    description?: string;
    price?: string;
    date?: Date;
    mainImage?: any;
    images?: any;
    documents?: any;
}
export declare class getActivitiesParamsDto {
    page: number;
    limit: number;
    merchant: number;
    category: string;
    search: string;
}
