/// <reference types="multer" />
import { CdnService } from "src/cdn/cdn.service";
import { LoginDto, RegisterDto } from "./auth.dto";
import { AuthService } from "./auth.service";
export declare class AuthController {
    private authService;
    private cdnService;
    constructor(authService: AuthService, cdnService: CdnService);
    login(body: LoginDto): Promise<{
        id: any;
        email: any;
        access_token: string;
    }>;
    register(body: RegisterDto, req: any, files: Array<Express.Multer.File>): Promise<{
        id: number;
        email: string;
        access_token: string;
    }>;
    getProfile(req: any): any;
}
