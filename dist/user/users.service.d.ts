import { Role } from "@prisma/client";
import { updateUserDto } from "./user.dto";
export declare class UsersService {
    getAll(): Promise<Omit<import(".prisma/client").User & {
        profilePicture: {
            id: number;
            url: string;
        };
    }, "password">[]>;
    findById(id: string, params?: object): Promise<any | undefined>;
    findByEmail(email: string, params?: object): Promise<any | undefined>;
    changeRole(id: string, role: string): Promise<Omit<import(".prisma/client").User, "password">>;
    update(id: string, req: any, body: updateUserDto): Promise<Omit<import(".prisma/client").User, "password">>;
    delete(id: string): Promise<Omit<import(".prisma/client").User, "password">>;
    getRole(id: string): Promise<Role>;
}
