import { Role } from '@prisma/client';
export declare class UsersService {
    findById(id: string, params?: object): Promise<any | undefined>;
    findByEmail(email: string, params?: object): Promise<any | undefined>;
    changeRole(id: string, role: string): Promise<Omit<import(".prisma/client").User, "password">>;
    delete(id: string): Promise<Omit<import(".prisma/client").User, "password">>;
    getRole(id: string): Promise<Role>;
}
