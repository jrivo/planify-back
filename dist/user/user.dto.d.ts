export declare class updateUserDto {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    phoneNumber?: string;
}
export declare class GetUsersParamsDto {
    page: number;
    limit: number;
    search: string;
    role: string;
}
export declare class changeUserRoleDto {
    role: string;
}
export declare class updateUserStatusDto {
    status: string;
}
export declare class updatePasswordDto {
    password: string;
}
