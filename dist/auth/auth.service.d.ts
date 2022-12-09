import { JwtService } from "@nestjs/jwt";
import { RegisterDto } from "./auth.dto";
import { UsersService } from "src/user/users.service";
export declare class AuthService {
    private usersService;
    private jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    validateUser(email: string, pass: string): Promise<any>;
    login(email: string, password: string): Promise<{
        id: any;
        email: any;
        role: any;
        access_token: string;
    }>;
    getUser(id: string): Promise<Omit<any, "password">>;
    register(req: any, body: RegisterDto): Promise<{
        id: number;
        email: string;
        access_token: string;
    }>;
}
