import { LoginDto, RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    login(body: LoginDto): Promise<{
        id: any;
        email: any;
        access_token: string;
    }>;
    register(body: RegisterDto): Promise<{
        id: any;
        email: any;
        access_token: string;
    }>;
    getProfile(req: any): any;
}
