/// <reference types="multer" />
import { CdnService } from "src/cdn/cdn.service";
import { updateUserDto } from "./user.dto";
import { UsersService } from "./users.service";
export declare class UsersController {
    private userService;
    private cdnService;
    constructor(userService: UsersService, cdnService: CdnService);
    getById(id: string, res: any): void;
    updateUser(id: string, req: any, body: updateUserDto, res: any, files: Array<Express.Multer.File>): Promise<void>;
}
