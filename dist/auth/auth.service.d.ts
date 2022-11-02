import { UsersService } from "src/user/users.service";
import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./auth.dto";
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(email: string, password: string): Promise<{
        id: any;
        email: any;
        access_token: string;
    }>;
    register(body: RegisterDto): Promise<{
        id: any;
        email: any;
        access_token: string;
    }>;
}
