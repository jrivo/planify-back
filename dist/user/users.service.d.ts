import { Role } from "@prisma/client";
import { GetUsersParamsDto, updateUserDto } from "./user.dto";
export declare class UsersService {
    getAll(queries: GetUsersParamsDto): Promise<{
        users: Omit<import(".prisma/client").User & {
            profilePicture: {
                id: number;
                url: string;
            };
        }, "password">[];
        totalPages: number;
    }>;
    findById(id: string, params?: object): Promise<any | undefined>;
    findByEmail(email: string, params?: object): Promise<any | undefined>;
    changeRole(id: string, role: string): Promise<Omit<import(".prisma/client").User, "password">>;
    update(id: string, req: any, body: updateUserDto): Promise<Omit<import(".prisma/client").User, "password">>;
    delete(id: string): Promise<Omit<import(".prisma/client").User, "password">>;
    getRole(id: string): Promise<Role>;
}
