import { Role } from "@prisma/client";
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber?: string;
    street?: string;
    streetNumber?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    region?: string;
    role?: Role;
}
export declare class ForgotPasswordDto {
    email: string;
}
