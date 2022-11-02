import { UsersService } from "./users.service";
export declare class UsersController {
    private userService;
    constructor(userService: UsersService);
    getById(id: string, res: any): void;
}
