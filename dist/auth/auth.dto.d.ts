import { Address } from "@prisma/client";
export declare class LoginDto {
    email: string;
    password: string;
}
export declare class RegisterDto {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    address: Address;
}
