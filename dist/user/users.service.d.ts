import { Role, UserStatus } from "@prisma/client";
import { changeUserRoleDto, GetUsersParamsDto, updatePasswordDto, updateUserDto, updateUserStatusDto } from "./user.dto";
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
    changeRole(id: string, body: changeUserRoleDto): Promise<Omit<import(".prisma/client").User, "password">>;
    update(id: string, req: any, body: updateUserDto): Promise<Omit<import(".prisma/client").User, "password">>;
    delete(id: string): Promise<string>;
    getRole(id: string): Promise<Role>;
    getStatus(id: string): Promise<UserStatus>;
    updateStatus(id: string, body: updateUserStatusDto): Promise<Omit<import(".prisma/client").User, "password">>;
    updatePassword(id: string, body: updatePasswordDto): Promise<Omit<import(".prisma/client").User, "password">>;
}
